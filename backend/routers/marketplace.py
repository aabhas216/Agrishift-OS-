import datetime
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel, Field
from models import (
    Farmer, IndustrialBuyer, BiomassListing, OfftakeOrder, BiocharLedger,
    BiomassListingCreate, OfftakeOrderCreate
)

class DirectSellRequest(BaseModel):
    buyer_id: int
    farmer_name: str = "Harjit Singh"
    phone: str = "+91-98765-43210"
    acres: float = Field(..., ge=1.0, le=25.0)
    village: str = "Taraori"
    district: str = "Karnal"
    bale_type: str = "Dry High-Density Rectangular Bales"


router = APIRouter(prefix="/api/marketplace", tags=["Module 3: B2B Industrial Biomass Off-Take Marketplace"])

@router.get("/buyers")
async def list_industrial_buyers(db: Session = Depends(get_db)):
    buyers = db.query(IndustrialBuyer).all()
    return [
        {
            "id": b.id,
            "company_name": b.company_name,
            "plant_name": b.plant_name,
            "industry_type": b.industry_type,
            "location": b.location,
            "offtake_price_per_ton": b.offtake_price_per_ton,
            "daily_intake_tons": b.daily_intake_tons,
            "verified": b.verified,
            "biochar_return_ratio": "1 Ton Biochar per 10 Tons Biomass (10%)"
        } for b in buyers
    ]

@router.get("/listings")
async def list_biomass_listings(status: str = None, db: Session = Depends(get_db)):
    query = db.query(BiomassListing)
    if status:
        query = query.filter(BiomassListing.status == status)
    listings = query.order_by(BiomassListing.created_at.desc()).all()

    out = []
    for l in listings:
        farmer_name = l.farmer.name if l.farmer else "Kisan Cooperative FPO"
        out.append({
            "id": l.id,
            "farmer_id": l.farmer_id,
            "farmer_name": farmer_name,
            "pickup_village": l.pickup_village,
            "bale_type": l.bale_type,
            "quantity_tons": l.quantity_tons,
            "moisture_pct": l.moisture_pct,
            "cellulose_pct": l.cellulose_pct,
            "hemicellulose_pct": l.hemicellulose_pct,
            "asking_price_per_ton": l.asking_price_per_ton,
            "total_estimated_value": round(l.quantity_tons * l.asking_price_per_ton, 2),
            "status": l.status,
            "created_at": l.created_at.strftime("%Y-%m-%d %H:%M") if l.created_at else ""
        })
    return out

@router.post("/listings")
async def create_biomass_listing(req: BiomassListingCreate, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == req.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    listing = BiomassListing(
        farmer_id=req.farmer_id,
        bale_type=req.bale_type,
        quantity_tons=req.quantity_tons,
        moisture_pct=req.moisture_pct,
        cellulose_pct=39.5,
        hemicellulose_pct=26.0,
        asking_price_per_ton=req.asking_price_per_ton,
        pickup_village=req.pickup_village,
        pickup_lat=req.pickup_lat,
        pickup_lon=req.pickup_lon,
        status="open",
        created_at=datetime.datetime.utcnow()
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    return {
        "success": True,
        "message": f"Biomass straw lot ({req.quantity_tons} Tons) listed successfully on B2B Marketplace!",
        "listing_id": listing.id
    }

@router.post("/sell")
async def sell_straw_direct(req: DirectSellRequest, db: Session = Depends(get_db)):
    """Direct instant sale of straw bales from farmer plot to industrial off-taker"""
    buyer = db.query(IndustrialBuyer).filter(IndustrialBuyer.id == req.buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Industrial buyer not found")

    quantity_tons = round(req.acres * 2.2, 1)
    total_val = round(quantity_tons * buyer.offtake_price_per_ton, 2)
    order_code = f"ORD-{buyer.company_name[:4].upper().replace(' ', '')}-{uuid.uuid4().hex[:4].upper()}"
    biochar_tons = round(quantity_tons * 0.10, 2)
    voucher_code = f"BCHR-{uuid.uuid4().hex[:6].upper()}"
    carbon_offset = round(biochar_tons * 2500.0, 1)

    return {
        "success": True,
        "message": f"Biomass contract {order_code} confirmed with {buyer.plant_name}!",
        "order": {
            "order_code": order_code,
            "buyer": buyer.plant_name,
            "farmer_name": req.farmer_name,
            "village": req.village,
            "acres": req.acres,
            "quantity_tons": quantity_tons,
            "price_per_ton": buyer.offtake_price_per_ton,
            "total_payout_inr": total_val,
            "biochar_voucher_code": voucher_code,
            "biochar_tons_earned": biochar_tons,
            "carbon_offset_kg": carbon_offset
        }
    }

@router.post("/orders")
async def create_offtake_order(req: OfftakeOrderCreate, db: Session = Depends(get_db)):
    """
    Connects farmer biomass listing with industrial buyer (e.g. IOCL Panipat / Trident / Verbio).
    Locks price, logistics deadline, and triggers the closed-loop Biochar byproduct credit voucher.
    """
    listing = db.query(BiomassListing).filter(BiomassListing.id == req.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Biomass listing not found")
    if listing.status != "open":
        raise HTTPException(status_code=400, detail="Listing is already contracted or completed")

    buyer = db.query(IndustrialBuyer).filter(IndustrialBuyer.id == req.buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Industrial buyer not found")

    order_code = f"ORD-{buyer.company_name[:4].upper().replace(' ', '')}-{uuid.uuid4().hex[:4].upper()}"
    total_val = round(listing.quantity_tons * buyer.offtake_price_per_ton, 2)

    # 10:1 Ratio for Biochar/FOM byproduct return voucher:
    # 10 tons dry biomass = 1 ton high-grade soil biochar
    biochar_tons = round(listing.quantity_tons * 0.10, 2)
    voucher_code = f"BCHR-{uuid.uuid4().hex[:6].upper()}"

    order = OfftakeOrder(
        order_code=order_code,
        listing_id=listing.id,
        buyer_id=buyer.id,
        quantity_tons=listing.quantity_tons,
        price_per_ton=buyer.offtake_price_per_ton,
        total_value=total_val,
        delivery_deadline=req.delivery_deadline,
        status="confirmed",
        biochar_credited_tons=biochar_tons,
        biochar_voucher_code=voucher_code,
        created_at=datetime.datetime.utcnow()
    )
    db.add(order)

    # Update listing status
    listing.status = "contracted"
    db.commit()
    db.refresh(order)

    # Create Biochar Byproduct Return Ledger entry
    carbon_offset = round(biochar_tons * 2500.0, 1) # ~2.5 kg CO2e sequestered per kg stable carbon in biochar
    biochar_entry = BiocharLedger(
        order_id=order.id,
        farmer_id=listing.farmer_id,
        voucher_code=voucher_code,
        biochar_tons=biochar_tons,
        carbon_offset_kg=carbon_offset,
        soil_reinoculation_status="voucher_issued",
        created_at=datetime.datetime.utcnow()
    )
    db.add(biochar_entry)
    db.commit()

    return {
        "success": True,
        "message": f"Off-take contract {order_code} executed with {buyer.plant_name}!",
        "order": {
            "order_code": order.order_code,
            "buyer": buyer.plant_name,
            "quantity_tons": order.quantity_tons,
            "price_per_ton": order.price_per_ton,
            "total_payout_inr": order.total_value,
            "delivery_deadline": order.delivery_deadline,
            "biochar_voucher_code": voucher_code,
            "biochar_tons_earned": biochar_tons,
            "carbon_offset_kg": carbon_offset
        }
    }

@router.get("/orders")
async def list_orders(db: Session = Depends(get_db)):
    orders = db.query(OfftakeOrder).order_by(OfftakeOrder.created_at.desc()).all()
    res = []
    for o in orders:
        res.append({
            "id": o.id,
            "order_code": o.order_code,
            "buyer_name": o.buyer.plant_name if o.buyer else "Industrial Buyer",
            "industry_type": o.buyer.industry_type if o.buyer else "Bio-Energy",
            "quantity_tons": o.quantity_tons,
            "price_per_ton": o.price_per_ton,
            "total_value": o.total_value,
            "delivery_deadline": o.delivery_deadline,
            "status": o.status,
            "biochar_credited_tons": o.biochar_credited_tons,
            "biochar_voucher_code": o.biochar_voucher_code,
            "created_at": o.created_at.strftime("%Y-%m-%d %H:%M") if o.created_at else ""
        })
    return res

@router.get("/biochar-ledger")
async def list_biochar_ledgers(db: Session = Depends(get_db)):
    ledgers = db.query(BiocharLedger).order_by(BiocharLedger.created_at.desc()).all()
    out = []
    for l in ledgers:
        farmer = db.query(Farmer).filter(Farmer.id == l.farmer_id).first()
        out.append({
            "id": l.id,
            "voucher_code": l.voucher_code,
            "order_code": l.order.order_code if l.order else "N/A",
            "farmer_name": farmer.name if farmer else "Farmer",
            "village": farmer.village if farmer else "Karnal",
            "buyer_name": l.order.buyer.plant_name if (l.order and l.order.buyer) else "IOCL 2G Refinery",
            "biochar_tons": l.biochar_tons,
            "carbon_offset_kg": l.carbon_offset_kg,
            "soil_reinoculation_status": l.soil_reinoculation_status,
            "created_at": l.created_at.strftime("%Y-%m-%d %H:%M") if l.created_at else ""
        })
    return out

@router.post("/biochar/reinoculate")
async def mark_biochar_reinoculated(voucher_code: str, db: Session = Depends(get_db)):
    entry = db.query(BiocharLedger).filter(BiocharLedger.voucher_code == voucher_code).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Biochar voucher not found")

    entry.soil_reinoculation_status = "incorporated_into_soil"
    db.commit()
    return {
        "success": True,
        "message": f"Biochar voucher {voucher_code} marked as incorporated into soil! Soil organic carbon baseline permanently accredited.",
        "carbon_offset_kg": entry.carbon_offset_kg
    }

