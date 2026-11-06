import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import get_db
from models import Machinery, CustomHiringCenter, MachineryCluster

router = APIRouter(prefix="/api/operator", tags=["Machinery Rental Operator & CHC Hub"])

class AddMachineRequest(BaseModel):
    machine_type: str = Field(..., description="'Super Seeder', 'Straw Baler', 'Straw Chopper', or 'Zero-Till Drill'")
    model_name: str
    tractor_hp_req: int = 55
    daily_capacity_acres: float = 18.0
    rental_rate_per_acre: float = 1200.0

class UpdateRateRequest(BaseModel):
    rental_rate_per_acre: float = Field(..., ge=800.0, le=2500.0)

class AcceptClusterRequest(BaseModel):
    cluster_id: int
    assigned_machine_id: Optional[int] = 1

# In-memory dynamic additions fallback if DB record not present
DEMO_OPERATOR_FLEET = [
    {
        "id": 1,
        "machine_type": "Super Seeder",
        "model_name": "Shaktiman 7-Feet Heavy Duty",
        "tractor_hp_req": 55,
        "daily_capacity_acres": 18.0,
        "rental_rate_per_acre": 1200.0,
        "status": "available",
        "total_dispatches": 14,
        "total_acres_serviced": 72.5
    },
    {
        "id": 2,
        "machine_type": "Straw Baler",
        "model_name": "Fieldking Square Baler 450",
        "tractor_hp_req": 60,
        "daily_capacity_acres": 25.0,
        "rental_rate_per_acre": 1350.0,
        "status": "available",
        "total_dispatches": 19,
        "total_acres_serviced": 115.0
    },
    {
        "id": 3,
        "machine_type": "Straw Chopper / Mulcher",
        "model_name": "Dasmesh 9-Row Stubble Shredder",
        "tractor_hp_req": 50,
        "daily_capacity_acres": 22.0,
        "rental_rate_per_acre": 1100.0,
        "status": "maintenance",
        "total_dispatches": 8,
        "total_acres_serviced": 44.0
    },
    {
        "id": 4,
        "machine_type": "Zero-Till Happy Seeder",
        "model_name": "Sonalika Deluxe Combo 60 HP",
        "tractor_hp_req": 60,
        "daily_capacity_acres": 20.0,
        "rental_rate_per_acre": 1250.0,
        "status": "available",
        "total_dispatches": 11,
        "total_acres_serviced": 62.0
    }
]

DEMO_CLUSTER_REQUESTS = [
    {
        "cluster_id": 101,
        "cluster_name": "Sangrur Cluster #4",
        "region": "Sunam - Lehragaga Belt, Sangrur",
        "contiguous_acres": 28.5,
        "farmer_count": 6,
        "target_date": "Tomorrow, 07:00 AM",
        "estimated_payout_inr": 34200.0,
        "diesel_savings_liters": 94.0,
        "status": "pending_acceptance",
        "crop_variety": "PR-126 & Pusa-44 Mix",
        "urgency": "High (Sowing Window Day 4)"
    },
    {
        "cluster_id": 102,
        "cluster_name": "Karnal Central Cluster #12",
        "region": "Nilokheri - Taraori Corridor",
        "contiguous_acres": 34.0,
        "farmer_count": 8,
        "target_date": "Today, 02:00 PM",
        "estimated_payout_inr": 40800.0,
        "diesel_savings_liters": 112.2,
        "status": "dispatched",
        "crop_variety": "PR-126",
        "urgency": "Critical (Window Closing in 48h)"
    },
    {
        "cluster_id": 103,
        "cluster_name": "Panipat Refinery Agro Ring #2",
        "region": "Samalkha - Baholi Border",
        "contiguous_acres": 31.5,
        "farmer_count": 7,
        "target_date": "Nov 08, 08:30 AM",
        "estimated_payout_inr": 37800.0,
        "diesel_savings_liters": 103.9,
        "status": "pending_acceptance",
        "crop_variety": "Pusa-44 (Emergency Mulch)",
        "urgency": "Urgent"
    }
]

@router.get("/fleet")
async def get_operator_fleet():
    """Retrieve all machinery in rental operator's depot"""
    return {
        "operator_name": "Sardar Gurpreet Singh",
        "center_name": "Karnal Kisan Vikas Sahayata CHC",
        "district": "Karnal",
        "active_rate_per_acre": 1200.0,
        "surge_cap_limit": 1500.0,
        "fleet": DEMO_OPERATOR_FLEET
    }

@router.post("/add-machine")
async def add_machine_to_fleet(req: AddMachineRequest):
    """Add a new tractor / Super Seeder implement to operator's pool"""
    new_machine = {
        "id": len(DEMO_OPERATOR_FLEET) + 1,
        "machine_type": req.machine_type,
        "model_name": req.model_name,
        "tractor_hp_req": req.tractor_hp_req,
        "daily_capacity_acres": req.daily_capacity_acres,
        "rental_rate_per_acre": req.rental_rate_per_acre,
        "status": "available",
        "total_dispatches": 0,
        "total_acres_serviced": 0.0
    }
    DEMO_OPERATOR_FLEET.append(new_machine)
    return {
        "success": True,
        "message": f"{req.machine_type} ({req.model_name}) successfully listed in active pooling fleet!",
        "machine": new_machine
    }

@router.post("/update-rate")
async def update_rental_rate(req: UpdateRateRequest):
    """Update custom rental rate with platform surge-cap advisory"""
    rate = req.rental_rate_per_acre
    is_surge = rate > 1500.0
    
    warning = None
    if is_surge:
        warning = f"Notice: ₹{rate}/acre exceeds recommended cluster ceiling of ₹1,500/acre. Smallholder aggregation algorithms favor rates between ₹1,200–₹1,400."

    return {
        "success": True,
        "new_rate_per_acre": rate,
        "surge_alert": is_surge,
        "advisory": warning or "Competitive pooled rate locked! Maximum cluster routing volume priority granted."
    }

@router.get("/requests")
async def get_cluster_requests():
    """Retrieve incoming 30+ contiguous acre cluster matching requests"""
    return {
        "total_pending_clusters": len([c for c in DEMO_CLUSTER_REQUESTS if c["status"] == "pending_acceptance"]),
        "total_acres_in_queue": sum([c["contiguous_acres"] for c in DEMO_CLUSTER_REQUESTS if c["status"] == "pending_acceptance"]),
        "requests": DEMO_CLUSTER_REQUESTS
    }

@router.post("/accept-cluster")
async def accept_cluster_dispatch(req: AcceptClusterRequest):
    """Rental operator accepts cluster route and confirms tractor dispatch"""
    target = None
    for c in DEMO_CLUSTER_REQUESTS:
        if c["cluster_id"] == req.cluster_id:
            c["status"] = "dispatched"
            target = c
            break

    if not target:
        raise HTTPException(status_code=404, detail="Cluster request not found")

    return {
        "success": True,
        "message": f"Cluster Route '{target['cluster_name']}' accepted! Super Seeder tractor driver dispatched.",
        "cluster_name": target["cluster_name"],
        "contiguous_acres": target["contiguous_acres"],
        "payout_inr": target["estimated_payout_inr"],
        "status": "dispatched"
    }

@router.get("/earnings")
async def get_operator_earnings():
    """Summary of daily, weekly, and cumulative cluster dispatch earnings"""
    return {
        "today_earnings_inr": 75000.0,
        "weekly_earnings_inr": 284500.0,
        "total_acres_serviced": 293.5,
        "diesel_waste_saved_liters": 968.5,
        "farmer_partners_served": 48
    }

@router.get("/cluster-topologies")
async def get_cluster_topologies():
    """
    Topological route mapping data for the Farm Route Aggregation & Contiguous Pooling Visualizer.
    Provides parcel layouts, contiguous boundaries, and efficiency metrics.
    """
    return {
        "clusters": [
            {
                "id": "karnal-taraori",
                "name": "Karnal Taraori Node #042",
                "state": "Haryana",
                "district": "Karnal",
                "total_acres": 27.5,
                "smallholders_count": 7,
                "chc_origin": "Karnal Kisan Vikas Sahayata CHC",
                "machine_assigned": "Super Seeder #PB-11-TURBO (55 HP)",
                "payout_inr": 33000.0,
                "diesel_saved_liters": 90.75,
                "parcels": [
                    {"plot_id": "P1", "farmer": "Harjit Singh", "acres": 4.0, "crop": "PR-126", "status": "Mulched & Sown", "seq": 1},
                    {"plot_id": "P2", "farmer": "Gurdev Singh", "acres": 3.5, "crop": "PR-126", "status": "In Progress", "seq": 2},
                    {"plot_id": "P3", "farmer": "Amarjit Kaur", "acres": 5.0, "crop": "PR-126", "status": "Queued", "seq": 3},
                    {"plot_id": "P4", "farmer": "Sukhwinder S.", "acres": 3.0, "crop": "Pusa-44", "status": "Queued", "seq": 4},
                    {"plot_id": "P5", "farmer": "Baldev Singh", "acres": 4.5, "crop": "PR-126", "status": "Queued", "seq": 5},
                    {"plot_id": "P6", "farmer": "Manpreet Singh", "acres": 4.0, "crop": "PR-126", "status": "Queued", "seq": 6},
                    {"plot_id": "P7", "farmer": "Jaswant Singh", "acres": 3.5, "crop": "PR-126", "status": "Queued", "seq": 7}
                ]
            },
            {
                "id": "sangrur-west",
                "name": "Sangrur West Ring #101",
                "state": "Punjab",
                "district": "Sangrur",
                "total_acres": 32.0,
                "smallholders_count": 8,
                "chc_origin": "Sunam Kisan Seva Center",
                "machine_assigned": "Super Seeder #PB-14 (60 HP)",
                "payout_inr": 38400.0,
                "diesel_saved_liters": 105.6,
                "parcels": [
                    {"plot_id": "P1", "farmer": "Sardar Jagjit S.", "acres": 4.5, "crop": "PR-126", "status": "In Progress", "seq": 1},
                    {"plot_id": "P2", "farmer": "Kuldeep Dhillon", "acres": 3.5, "crop": "PR-126", "status": "Queued", "seq": 2},
                    {"plot_id": "P3", "farmer": "Davinder Singh", "acres": 4.0, "crop": "PR-126", "status": "Queued", "seq": 3},
                    {"plot_id": "P4", "farmer": "Pritam Singh", "acres": 3.5, "crop": "PR-126", "status": "Queued", "seq": 4},
                    {"plot_id": "P5", "farmer": "Rupinder Kaur", "acres": 4.5, "crop": "PR-126", "status": "Queued", "seq": 5},
                    {"plot_id": "P6", "farmer": "Paramjit Singh", "acres": 4.0, "crop": "PR-126", "status": "Queued", "seq": 6},
                    {"plot_id": "P7", "farmer": "Hardev Singh", "acres": 4.0, "crop": "Pusa-44", "status": "Queued", "seq": 7},
                    {"plot_id": "P8", "farmer": "Bikramjeet S.", "acres": 4.0, "crop": "PR-126", "status": "Queued", "seq": 8}
                ]
            },
            {
                "id": "panipat-corridor",
                "name": "Panipat Refinery Corridor #103",
                "state": "Haryana",
                "district": "Panipat",
                "total_acres": 29.0,
                "smallholders_count": 6,
                "chc_origin": "Panipat Krishi Cooperative Depot",
                "machine_assigned": "Baler + Super Seeder Combo #HR-06",
                "payout_inr": 34800.0,
                "diesel_saved_liters": 95.7,
                "parcels": [
                    {"plot_id": "P1", "farmer": "Naresh Kumar", "acres": 5.0, "crop": "PR-126", "status": "In Progress", "seq": 1},
                    {"plot_id": "P2", "farmer": "Dharamvir S.", "acres": 4.5, "crop": "PR-126", "status": "Queued", "seq": 2},
                    {"plot_id": "P3", "farmer": "Virender Tyagi", "acres": 5.0, "crop": "PR-126", "status": "Queued", "seq": 3},
                    {"plot_id": "P4", "farmer": "Satish Chand", "acres": 4.5, "crop": "PR-126", "status": "Queued", "seq": 4},
                    {"plot_id": "P5", "farmer": "Joginder Malik", "acres": 5.0, "crop": "PR-126", "status": "Queued", "seq": 5},
                    {"plot_id": "P6", "farmer": "Rameshwar Dayal", "acres": 5.0, "crop": "PR-126", "status": "Queued", "seq": 6}
                ]
            }
        ],
        "efficiency_benchmarks": {
            "unpooled_diesel_liters_per_acre": 8.5,
            "pooled_diesel_liters_per_acre": 5.2,
            "diesel_waste_reduction_pct": 38.8,
            "unpooled_daily_coverage_acres": 13.0,
            "pooled_daily_coverage_acres": 28.0,
            "coverage_surge_pct": 115.4,
            "turnaround_dead_time_minutes": 0,
            "unpooled_turnaround_dead_time_minutes": 50
        }
    }


