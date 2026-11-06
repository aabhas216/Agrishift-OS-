import datetime
from sqlalchemy.orm import Session
from models import (
    Farmer, CustomHiringCenter, Machinery, MachineryCluster,
    IndustrialBuyer, BiomassListing, OfftakeOrder, BiocharLedger
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(CustomHiringCenter).first():
        return

    print("🌱 Seeding AgriShift OS database with initial agronomic and machinery data...")

    # 1. Custom Hiring Centers (CHCs)
    chc1 = CustomHiringCenter(
        name="Karnal Kisan Vikas Sahayata CHC",
        contact_person="Sardar Gurpreet Singh",
        phone="+91-98765-43210",
        village="Taraori",
        district="Karnal",
        latitude=29.7981,
        longitude=76.9295,
        base_rate_per_acre=2000.0,
        pooled_rate_per_acre=1200.0,
        is_active=True
    )
    chc2 = CustomHiringCenter(
        name="Panipat Krishi Yantra Cooperative",
        contact_person="Rameshwar Sharma",
        phone="+91-98120-11223",
        village="Samalkha",
        district="Panipat",
        latitude=29.2384,
        longitude=77.0125,
        base_rate_per_acre=2000.0,
        pooled_rate_per_acre=1200.0,
        is_active=True
    )
    chc3 = CustomHiringCenter(
        name="Ludhiana Agro Mech Hub",
        contact_person="Balwinder Sandhu",
        phone="+91-98881-99887",
        village="Samrala",
        district="Ludhiana",
        latitude=30.8335,
        longitude=76.1911,
        base_rate_per_acre=2100.0,
        pooled_rate_per_acre=1200.0,
        is_active=True
    )
    db.add_all([chc1, chc2, chc3])
    db.commit()

    # 2. Machinery Fleet
    m1 = Machinery(
        chc_id=chc1.id,
        machine_type="Super Seeder",
        model_name="Shaktiman 7-Feet Heavy Duty (55 HP)",
        tractor_hp_req=55,
        daily_capacity_acres=18.0,
        status="available",
        current_lat=29.8000,
        current_lon=76.9300
    )
    m2 = Machinery(
        chc_id=chc1.id,
        machine_type="Straw Baler",
        model_name="Fieldking Square Baler 450 (High Density)",
        tractor_hp_req=60,
        daily_capacity_acres=25.0,
        status="available",
        current_lat=29.8020,
        current_lon=76.9280
    )
    m3 = Machinery(
        chc_id=chc2.id,
        machine_type="Super Seeder",
        model_name="Jagatjit Super Seeder Deluxe (60 HP)",
        tractor_hp_req=60,
        daily_capacity_acres=20.0,
        status="assigned",
        current_lat=29.2400,
        current_lon=77.0150
    )
    m4 = Machinery(
        chc_id=chc3.id,
        machine_type="Super Seeder",
        model_name="Sonalika Super Seeder Turbo (55 HP)",
        tractor_hp_req=55,
        daily_capacity_acres=17.5,
        status="available",
        current_lat=30.8350,
        current_lon=76.1900
    )
    db.add_all([m1, m2, m3, m4])
    db.commit()

    # 3. Active Machinery Cluster (Example pre-formed 34-acre cluster)
    cluster1 = MachineryCluster(
        cluster_code="CL-KRN-042",
        chc_id=chc1.id,
        machine_id=m1.id,
        target_date=(datetime.date.today() + datetime.timedelta(days=2)).isoformat(),
        total_acres=34.5,
        farmer_count=8,
        transit_waste_saved_pct=42.5,
        diesel_saved_liters=113.85, # (8.5 - 5.2) L/acre * 34.5 acres
        rental_rate_per_acre=1200.0,
        status="matched",
        route_summary="Taraori Sector A -> B -> Nilokheri Border (Total deadhead: 2.1 km down from 14.8 km)",
        created_at=datetime.datetime.utcnow()
    )
    db.add(cluster1)
    db.commit()

    # 4. Farmers (Smallholders 2-5 acres)
    f1 = Farmer(
        name="Harjit Singh Gill",
        phone="+91-94160-55412",
        village="Taraori",
        district="Karnal",
        latitude=29.7995,
        longitude=76.9312,
        land_acres=4.5,
        paddy_variety="PR-126",
        harvest_date=(datetime.date.today() - datetime.timedelta(days=1)).isoformat(),
        cluster_id=cluster1.id,
        status="clustered"
    )
    f2 = Farmer(
        name="Sukhwinder Pal",
        phone="+91-94670-33124",
        village="Taraori",
        district="Karnal",
        latitude=29.8010,
        longitude=76.9340,
        land_acres=3.5,
        paddy_variety="Pusa-44",
        harvest_date=datetime.date.today().isoformat(),
        cluster_id=cluster1.id,
        status="clustered"
    )
    f3 = Farmer(
        name="Satnam Maan",
        phone="+91-98721-66541",
        village="Nilokheri",
        district="Karnal",
        latitude=29.8250,
        longitude=76.9180,
        land_acres=5.0,
        paddy_variety="PR-126",
        harvest_date=(datetime.date.today() - datetime.timedelta(days=2)).isoformat(),
        cluster_id=cluster1.id,
        status="clustered"
    )
    f4 = Farmer(
        name="Kuldeep Virk",
        phone="+91-98129-44001",
        village="Samalkha",
        district="Panipat",
        latitude=29.2390,
        longitude=77.0140,
        land_acres=4.0,
        paddy_variety="Pusa-44",
        harvest_date=datetime.date.today().isoformat(),
        status="registered"
    )
    f5 = Farmer(
        name="Mohan Lal Verma",
        phone="+91-98960-77889",
        village="Gharaunda",
        district="Karnal",
        latitude=29.5390,
        longitude=76.9720,
        land_acres=3.0,
        paddy_variety="PR-126",
        harvest_date=datetime.date.today().isoformat(),
        status="market_listed"
    )
    db.add_all([f1, f2, f3, f4, f5])
    db.commit()

    # 5. Industrial Buyers
    b1 = IndustrialBuyer(
        company_name="Indian Oil Corporation Ltd (IOCL)",
        plant_name="IOCL 2G Bio-Ethanol Refinery",
        industry_type="2G Bio-Ethanol",
        location="Baholi, Panipat, Haryana",
        offtake_price_per_ton=1950.0,
        daily_intake_tons=750.0,
        verified=True
    )
    b2 = IndustrialBuyer(
        company_name="Trident Group India",
        plant_name="Trident Paper & Cellulose Complex",
        industry_type="Paper & Packaging",
        location="Dhaula, Barnala, Punjab",
        offtake_price_per_ton=2100.0,
        daily_intake_tons=500.0,
        verified=True
    )
    b3 = IndustrialBuyer(
        company_name="EverEnviro Resource Management",
        plant_name="Indore/Sangrur CBG Bio-Energy Facility",
        industry_type="Compressed Biogas (CBG)",
        location="Lehragaga, Sangrur, Punjab",
        offtake_price_per_ton=2000.0,
        daily_intake_tons=350.0,
        verified=True
    )
    db.add_all([b1, b2, b3])
    db.commit()

    # 6. Biomass Listings (Farmer selling dry straw bales)
    l1 = BiomassListing(
        farmer_id=f5.id,
        bale_type="Dry High-Density Rectangular Bales",
        quantity_tons=18.0,
        moisture_pct=11.8, # Safe threshold < 15%
        cellulose_pct=39.8,
        hemicellulose_pct=26.4,
        asking_price_per_ton=1950.0,
        pickup_village="Gharaunda, Karnal",
        pickup_lat=29.5390,
        pickup_lon=76.9720,
        status="contracted",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
    )
    l2 = BiomassListing(
        farmer_id=f4.id,
        bale_type="Heavy Round Straw Bales (250 kg)",
        quantity_tons=12.5,
        moisture_pct=13.2,
        cellulose_pct=38.9,
        hemicellulose_pct=25.2,
        asking_price_per_ton=2000.0,
        pickup_village="Samalkha, Panipat",
        pickup_lat=29.2390,
        pickup_lon=77.0140,
        status="open",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )
    db.add_all([l1, l2])
    db.commit()

    # 7. Offtake Contract (Between IOCL Panipat and Farmer Mohan Lal)
    order1 = OfftakeOrder(
        order_code="ORD-IOCL-2026-9041",
        listing_id=l1.id,
        buyer_id=b1.id,
        quantity_tons=18.0,
        price_per_ton=1950.0,
        total_value=35100.0,
        delivery_deadline=(datetime.date.today() + datetime.timedelta(days=3)).isoformat(),
        status="confirmed",
        biochar_credited_tons=1.8, # 10% byproduct return loop
        biochar_voucher_code="BCHR-IOCL-KRN-180",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )
    db.add(order1)
    db.commit()

    # 8. Biochar Byproduct Return Ledger
    biochar1 = BiocharLedger(
        order_id=order1.id,
        farmer_id=f5.id,
        voucher_code="BCHR-IOCL-KRN-180",
        biochar_tons=1.8,
        carbon_offset_kg=4500.0, # ~2.5 kg CO2e per kg biochar stable carbon
        soil_reinoculation_status="dispatched_to_field",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=12)
    )
    db.add(biochar1)
    db.commit()

    print("✅ Seed data successfully populated into AgriShift OS!")

