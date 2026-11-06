import math
import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import (
    Farmer, CustomHiringCenter, Machinery, MachineryCluster,
    CHCCreate, MachineryCreate, ClusterMatchRequest, ClusterResponse
)

router = APIRouter(prefix="/api/machinery", tags=["Module 2: Cluster Machinery Pooling Router"])

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("/chcs")
async def list_chcs(db: Session = Depends(get_db)):
    chcs = db.query(CustomHiringCenter).filter(CustomHiringCenter.is_active == True).all()
    results = []
    for chc in chcs:
        machines = db.query(Machinery).filter(Machinery.chc_id == chc.id).all()
        results.append({
            "id": chc.id,
            "name": chc.name,
            "contact_person": chc.contact_person,
            "phone": chc.phone,
            "village": chc.village,
            "district": chc.district,
            "latitude": chc.latitude,
            "longitude": chc.longitude,
            "base_rate_per_acre": chc.base_rate_per_acre,
            "pooled_rate_per_acre": chc.pooled_rate_per_acre,
            "machines_count": len(machines),
            "available_super_seeders": len([m for m in machines if m.machine_type == "Super Seeder" and m.status == "available"])
        })
    return results

@router.post("/chcs/register")
async def register_chc(payload: CHCCreate, db: Session = Depends(get_db)):
    chc = CustomHiringCenter(
        name=payload.name,
        contact_person=payload.contact_person,
        phone=payload.phone,
        village=payload.village,
        district=payload.district,
        latitude=payload.latitude,
        longitude=payload.longitude,
        base_rate_per_acre=payload.base_rate_per_acre,
        pooled_rate_per_acre=payload.pooled_rate_per_acre,
        is_active=True
    )
    db.add(chc)
    db.commit()
    db.refresh(chc)
    return {"message": "Custom Hiring Center registered successfully", "chc_id": chc.id, "name": chc.name}

@router.post("/machinery/register")
async def register_machinery(payload: MachineryCreate, db: Session = Depends(get_db)):
    chc = db.query(CustomHiringCenter).filter(CustomHiringCenter.id == payload.chc_id).first()
    if not chc:
        raise HTTPException(status_code=404, detail="Custom Hiring Center not found")

    machine = Machinery(
        chc_id=payload.chc_id,
        machine_type=payload.machine_type,
        model_name=payload.model_name,
        tractor_hp_req=payload.tractor_hp_req,
        daily_capacity_acres=payload.daily_capacity_acres,
        status="available",
        current_lat=payload.current_lat,
        current_lon=payload.current_lon
    )
    db.add(machine)
    db.commit()
    db.refresh(machine)
    return {"message": "Machinery registered and ready for pooling", "machine_id": machine.id, "model": machine.model_name}

@router.get("/machinery/available")
async def list_available_machinery(db: Session = Depends(get_db)):
    machines = db.query(Machinery).all()
    out = []
    for m in machines:
        out.append({
            "id": m.id,
            "chc_name": m.chc.name if m.chc else "Independent CHC",
            "machine_type": m.machine_type,
            "model_name": m.model_name,
            "tractor_hp_req": m.tractor_hp_req,
            "daily_capacity_acres": m.daily_capacity_acres,
            "status": m.status,
            "current_lat": m.current_lat,
            "current_lon": m.current_lon
        })
    return out

@router.get("/clusters")
async def list_clusters(db: Session = Depends(get_db)):
    clusters = db.query(MachineryCluster).all()
    res = []
    for c in clusters:
        farmers_in_cluster = db.query(Farmer).filter(Farmer.cluster_id == c.id).all()
        res.append({
            "id": c.id,
            "cluster_code": c.cluster_code,
            "target_date": c.target_date,
            "total_acres": c.total_acres,
            "farmer_count": len(farmers_in_cluster),
            "transit_waste_saved_pct": c.transit_waste_saved_pct,
            "diesel_saved_liters": c.diesel_saved_liters,
            "rental_rate_per_acre": c.rental_rate_per_acre,
            "status": c.status,
            "route_summary": c.route_summary,
            "chc_name": c.chc.name if c.chc else "Assigned Regional CHC",
            "machine_name": f"{c.machine.machine_type} ({c.machine.model_name})" if c.machine else "Super Seeder 55 HP Fleet",
            "farmers": [
                {
                    "id": f.id,
                    "name": f.name,
                    "village": f.village,
                    "acres": f.land_acres,
                    "phone": f.phone
                } for f in farmers_in_cluster
            ]
        })
    return res

@router.post("/match-cluster")
@router.post("/book-cluster")
async def match_cluster(req: ClusterMatchRequest, db: Session = Depends(get_db)):
    """
    Cluster Machinery Pooling Router ("Uber for Super Seeders"):
    Aggregates neighboring smallholders (2-5 acres) into contiguous 30+ acre route clusters.
    Cuts machine transit waste by 40% and reduces rental fee from ₹2,000/acre to ₹1,200/acre.
    """
    # 1. Register or update farmer
    farmer = None
    if req.farmer_id:
        farmer = db.query(Farmer).filter(Farmer.id == req.farmer_id).first()

    if not farmer:
        farmer = Farmer(
            name=req.farmer_name,
            phone=req.phone,
            village=req.village,
            district=req.district,
            latitude=req.latitude,
            longitude=req.longitude,
            land_acres=req.acres,
            harvest_date=req.target_date,
            status="pending"
        )
        db.add(farmer)
        db.commit()
        db.refresh(farmer)

    # 2. Look for open forming clusters within 10 km radius or same district
    open_clusters = db.query(MachineryCluster).filter(
        MachineryCluster.status.in_(["forming", "matched"]),
        MachineryCluster.total_acres < 50.0 # Upper bound for optimal 2-day contiguous run
    ).all()

    target_cluster = None
    for c in open_clusters:
        # Check if any farmer in cluster is within 10 km
        cluster_farmers = db.query(Farmer).filter(Farmer.cluster_id == c.id).all()
        for cf in cluster_farmers:
            dist = haversine_distance_km(req.latitude, req.longitude, cf.latitude, cf.longitude)
            if dist <= 12.0:
                target_cluster = c
                break
        if target_cluster:
            break

    # If no cluster found, find nearest CHC with Super Seeder and create new cluster
    if not target_cluster:
        chcs = db.query(CustomHiringCenter).filter(CustomHiringCenter.is_active == True).all()
        nearest_chc = None
        min_dist = float("inf")
        for chc in chcs:
            d = haversine_distance_km(req.latitude, req.longitude, chc.latitude, chc.longitude)
            if d < min_dist:
                min_dist = d
                nearest_chc = chc

        # Find available machine at that CHC or regional pool
        machine = None
        if nearest_chc:
            machine = db.query(Machinery).filter(
                Machinery.chc_id == nearest_chc.id,
                Machinery.machine_type == "Super Seeder",
                Machinery.status == "available"
            ).first()

        if not machine:
            machine = db.query(Machinery).filter(
                Machinery.machine_type == "Super Seeder"
            ).first()

        random_suffix = uuid.uuid4().hex[:4].upper()
        target_cluster = MachineryCluster(
            cluster_code=f"CL-{req.district[:3].upper()}-{random_suffix}",
            chc_id=nearest_chc.id if nearest_chc else 1,
            machine_id=machine.id if machine else 1,
            target_date=req.target_date,
            total_acres=0.0,
            farmer_count=0,
            transit_waste_saved_pct=40.0,
            diesel_saved_liters=0.0,
            rental_rate_per_acre=1200.0,
            status="forming",
            route_summary=f"Origin: {req.village} Cluster Node. Expanding to contiguous 30+ acres.",
            created_at=datetime.datetime.utcnow()
        )
        db.add(target_cluster)
        db.commit()
        db.refresh(target_cluster)

    # Link farmer to cluster
    farmer.cluster_id = target_cluster.id
    farmer.status = "clustered"
    target_cluster.total_acres += req.acres
    target_cluster.farmer_count += 1
    
    # Calculate savings:
    # Standard transit: 8.5 liters diesel / acre (due to criss-cross un-pooled deadhead)
    # Contiguous cluster: 5.2 liters diesel / acre
    # Saved: 3.3 L/acre diesel (approx 38.8% ~ 40% transit waste cut)
    target_cluster.diesel_saved_liters = round(target_cluster.total_acres * 3.3, 1)

    if target_cluster.total_acres >= 30.0:
        target_cluster.status = "matched"
        target_cluster.route_summary = f"Contiguous 30+ Acre Optimization Achieved ({target_cluster.total_acres} acres). Super Seeder dispatched for non-stop sequential pass."

    db.commit()
    db.refresh(target_cluster)

    cost_saved = round(req.acres * (2000.0 - 1200.0), 2)

    return {
        "success": True,
        "message": f"Plot successfully aggregated into Route Cluster {target_cluster.cluster_code}!",
        "cluster": {
            "id": target_cluster.id,
            "cluster_code": target_cluster.cluster_code,
            "status": target_cluster.status,
            "total_acres": target_cluster.total_acres,
            "target_threshold_acres": 30.0,
            "farmer_count": target_cluster.farmer_count,
            "rental_rate_per_acre": target_cluster.rental_rate_per_acre,
            "standard_rate_per_acre": 2000.0,
            "cost_saved_for_farmer_inr": cost_saved,
            "transit_waste_saved_pct": target_cluster.transit_waste_saved_pct,
            "diesel_saved_liters": target_cluster.diesel_saved_liters,
            "route_summary": target_cluster.route_summary
        }
    }


@router.post("/book-cluster/{cluster_id}")
async def book_cluster_by_id(cluster_id: int, db: Session = Depends(get_db)):
    cluster = db.query(MachineryCluster).filter(MachineryCluster.id == cluster_id).first()
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")
    cluster.status = "dispatched"
    db.commit()
    return {
        "success": True,
        "message": f"Super Seeder & Baler dispatch confirmed for Route Cluster {cluster.cluster_code}!",
        "cluster_id": cluster.id,
        "cluster_code": cluster.cluster_code,
        "status": cluster.status,
        "rental_rate_per_acre": cluster.rental_rate_per_acre,
        "total_acres": cluster.total_acres,
        "diesel_saved_liters": cluster.diesel_saved_liters,
        "route_summary": cluster.route_summary
    }

