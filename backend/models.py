import datetime
from typing import List, Optional
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, ConfigDict
from database import Base

# ==========================================
# SQLAlchemy ORM Models
# ==========================================

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    village = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Punjab")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    land_acres = Column(Float, nullable=False)
    paddy_variety = Column(String(50), default="PR-126") # "PR-126" or "Pusa-44"
    harvest_date = Column(String(20), nullable=False) # YYYY-MM-DD
    cluster_id = Column(Integer, ForeignKey("machinery_clusters.id"), nullable=True)
    status = Column(String(50), default="registered") # registered, clustered, sown, market_listed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    cluster = relationship("MachineryCluster", back_populates="farmers")
    listings = relationship("BiomassListing", back_populates="farmer")


class CustomHiringCenter(Base):
    __tablename__ = "chcs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    village = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    base_rate_per_acre = Column(Float, default=2000.0) # standard un-pooled rate
    pooled_rate_per_acre = Column(Float, default=1200.0) # cluster pooled rate
    is_active = Column(Boolean, default=True)

    machinery = relationship("Machinery", back_populates="chc")
    clusters = relationship("MachineryCluster", back_populates="chc")


class Machinery(Base):
    __tablename__ = "machinery"

    id = Column(Integer, primary_key=True, index=True)
    chc_id = Column(Integer, ForeignKey("chcs.id"), nullable=False)
    machine_type = Column(String(50), nullable=False) # "Super Seeder", "Straw Baler", "Happy Seeder", "Mulcher"
    model_name = Column(String(100), nullable=False)
    tractor_hp_req = Column(Integer, default=55)
    daily_capacity_acres = Column(Float, default=18.0)
    status = Column(String(30), default="available") # available, assigned, maintenance
    current_lat = Column(Float, nullable=False)
    current_lon = Column(Float, nullable=False)

    chc = relationship("CustomHiringCenter", back_populates="machinery")
    clusters = relationship("MachineryCluster", back_populates="machine")


class MachineryCluster(Base):
    __tablename__ = "machinery_clusters"

    id = Column(Integer, primary_key=True, index=True)
    cluster_code = Column(String(50), unique=True, index=True)
    chc_id = Column(Integer, ForeignKey("chcs.id"), nullable=True)
    machine_id = Column(Integer, ForeignKey("machinery.id"), nullable=True)
    target_date = Column(String(20), nullable=False)
    total_acres = Column(Float, default=0.0)
    farmer_count = Column(Integer, default=0)
    transit_waste_saved_pct = Column(Float, default=40.0)
    diesel_saved_liters = Column(Float, default=0.0)
    rental_rate_per_acre = Column(Float, default=1200.0)
    status = Column(String(30), default="forming") # forming, matched, dispatched, completed
    route_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    chc = relationship("CustomHiringCenter", back_populates="clusters")
    machine = relationship("Machinery", back_populates="clusters")
    farmers = relationship("Farmer", back_populates="cluster")


class IndustrialBuyer(Base):
    __tablename__ = "industrial_buyers"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False)
    plant_name = Column(String(150), nullable=False)
    industry_type = Column(String(100), nullable=False) # 2G Bio-Ethanol, Paper & Packaging, Compressed Biogas (CBG)
    location = Column(String(150), nullable=False)
    offtake_price_per_ton = Column(Float, nullable=False)
    daily_intake_tons = Column(Float, default=250.0)
    verified = Column(Boolean, default=True)

    orders = relationship("OfftakeOrder", back_populates="buyer")


class BiomassListing(Base):
    __tablename__ = "biomass_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    bale_type = Column(String(100), default="Dry High-Density Rectangular Bales")
    quantity_tons = Column(Float, nullable=False)
    moisture_pct = Column(Float, default=12.5) # optimal < 15%
    cellulose_pct = Column(Float, default=39.2)
    hemicellulose_pct = Column(Float, default=25.8)
    asking_price_per_ton = Column(Float, default=1950.0)
    pickup_village = Column(String(100), nullable=False)
    pickup_lat = Column(Float, nullable=False)
    pickup_lon = Column(Float, nullable=False)
    status = Column(String(30), default="open") # open, contracted, fulfilled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="listings")
    orders = relationship("OfftakeOrder", back_populates="listing")


class OfftakeOrder(Base):
    __tablename__ = "offtake_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_code = Column(String(50), unique=True, index=True)
    listing_id = Column(Integer, ForeignKey("biomass_listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("industrial_buyers.id"), nullable=False)
    quantity_tons = Column(Float, nullable=False)
    price_per_ton = Column(Float, nullable=False)
    total_value = Column(Float, nullable=False)
    delivery_deadline = Column(String(20), nullable=False)
    status = Column(String(30), default="confirmed") # confirmed, in_transit, delivered
    biochar_credited_tons = Column(Float, default=0.0) # 1 ton per 10 tons biomass
    biochar_voucher_code = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listing = relationship("BiomassListing", back_populates="orders")
    buyer = relationship("IndustrialBuyer", back_populates="orders")
    biochar_ledgers = relationship("BiocharLedger", back_populates="order")


class BiocharLedger(Base):
    __tablename__ = "biochar_ledgers"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("offtake_orders.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    voucher_code = Column(String(50), unique=True, index=True)
    biochar_tons = Column(Float, nullable=False)
    carbon_offset_kg = Column(Float, nullable=False)
    soil_reinoculation_status = Column(String(50), default="voucher_issued") # voucher_issued, dispatched_to_field, incorporated_into_soil
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    order = relationship("OfftakeOrder", back_populates="biochar_ledgers")


# ==========================================
# Pydantic Schemas (Pydantic v2)
# ==========================================

# Module 1: Sowing Schedule
class SowingCalculationRequest(BaseModel):
    land_acres: float = Field(..., ge=1.0, le=25.0, description="Farm land area in acres (1 to 25)")
    harvest_date: str = Field(..., description="Paddy harvest date in YYYY-MM-DD format")
    paddy_variety: str = Field(default="PR-126", description="'PR-126' or 'Pusa-44'")

class DailyScheduleStep(BaseModel):
    day_number: int
    day_range: str
    stage_title: str
    action_description: str
    target_date: str
    status: str
    alert_level: str

class SowingScheduleResponse(BaseModel):
    land_acres: float
    harvest_date: str
    paddy_variety: str
    wheat_sowing_deadline: str
    days_remaining: int
    window_status: str # "Optimal", "Critical Alert", "Window Closed"
    daily_schedule: List[DailyScheduleStep]
    scientific_rationale: str
    yield_loss_risk_per_day_pct: float

# Module 2: Machinery Pooling
class CHCCreate(BaseModel):
    name: str
    contact_person: str
    phone: str
    village: str
    district: str
    latitude: float
    longitude: float
    base_rate_per_acre: float = 2000.0
    pooled_rate_per_acre: float = 1200.0

class MachineryCreate(BaseModel):
    chc_id: int
    machine_type: str = "Super Seeder"
    model_name: str
    tractor_hp_req: int = 55
    daily_capacity_acres: float = 18.0
    current_lat: float
    current_lon: float

class ClusterMatchRequest(BaseModel):
    farmer_id: Optional[int] = None
    farmer_name: str
    phone: str
    state: Optional[str] = "Haryana"
    village: str
    district: str
    latitude: float
    longitude: float
    acres: float = Field(..., ge=1.0, le=25.0)
    target_date: str

class ClusterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    cluster_code: str
    target_date: str
    total_acres: float
    farmer_count: int
    transit_waste_saved_pct: float
    diesel_saved_liters: float
    rental_rate_per_acre: float
    status: str
    route_summary: Optional[str] = None
    chc_name: Optional[str] = None
    machine_name: Optional[str] = None

# Module 3: Marketplace
class BiomassListingCreate(BaseModel):
    farmer_id: int
    bale_type: str = "Dry High-Density Rectangular Bales"
    quantity_tons: float
    moisture_pct: float = 12.5
    asking_price_per_ton: float = 1950.0
    pickup_village: str
    pickup_lat: float
    pickup_lon: float

class BiomassListingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    farmer_name: str
    village: str
    bale_type: str
    quantity_tons: float
    moisture_pct: float
    cellulose_pct: float
    hemicellulose_pct: float
    asking_price_per_ton: float
    total_value: float
    status: str
    created_at: str

class IndustrialBuyerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    company_name: str
    plant_name: str
    industry_type: str
    location: str
    offtake_price_per_ton: float
    daily_intake_tons: float
    verified: bool

class OfftakeOrderCreate(BaseModel):
    listing_id: int
    buyer_id: int
    delivery_deadline: str

class OfftakeOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_code: str
    buyer_name: str
    farmer_name: str
    quantity_tons: float
    price_per_ton: float
    total_value: float
    delivery_deadline: str
    status: str
    biochar_credited_tons: float
    biochar_voucher_code: Optional[str] = None
    created_at: str

class BiocharLedgerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    voucher_code: str
    order_code: str
    farmer_name: str
    buyer_name: str
    biochar_tons: float
    carbon_offset_kg: float
    soil_reinoculation_status: str
    created_at: str

# Module 4: Agro-Economic & Soil Impact
class EconomicCalculationRequest(BaseModel):
    land_acres: float = Field(..., ge=1.0, le=25.0)
    straw_yield_tons_per_acre: float = 2.2
    straw_price_per_ton: float = 1950.0
    is_cluster_pooled: bool = True

class EconomicCalculationResponse(BaseModel):
    land_acres: float
    straw_yield_tons_per_acre: float
    total_straw_tons: float
    straw_cash_revenue: float
    fertilizer_expense_saved: float
    machinery_pooling_savings: float
    net_farmer_gain: float
    burn_scenario_penalty_risk: float
    burn_scenario_net_loss: float
    organic_carbon_retained_kg: float
    soc_increase_pct: float
    co2_emissions_abated_tons: float
    breakdown_items: List[dict]

