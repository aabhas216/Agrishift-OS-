import datetime
from fastapi import APIRouter, HTTPException
from models import SowingCalculationRequest, SowingScheduleResponse, DailyScheduleStep

router = APIRouter(prefix="/api/sowing", tags=["Module 1: 10-Day Sowing Window Engine"])

@router.post("/calculate", response_model=SowingScheduleResponse)
@router.post("/schedule", response_model=SowingScheduleResponse)
async def calculate_sowing_schedule(req: SowingCalculationRequest):
    try:
        harvest_dt = datetime.datetime.strptime(req.harvest_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid harvest_date format. Must be YYYY-MM-DD.")

    today = datetime.date.today()

    # Variety characteristics
    is_pusa = "44" in req.paddy_variety or "pusa" in req.paddy_variety.lower()
    
    # In Indo-Gangetic plains, optimal wheat sowing window ends Nov 15.
    # Strict 10-day digital in-situ window:
    # 10 days from harvest date is the operational deadline.
    deadline_dt = harvest_dt + datetime.timedelta(days=10)
    days_remaining = (deadline_dt - today).days

    if days_remaining > 5:
        window_status = "Optimal"
    elif days_remaining >= 0:
        window_status = "Critical Alert"
    else:
        window_status = "Window Closed - Delayed Sowing Mode"

    # 5-Stage Daily step-by-step field schedule
    # Days 1–2: Harvest logging & cluster matching
    # Days 3–4: Route aggregation
    # Days 5–6: Baling & machinery pooling
    # Days 7–8: Zero-till Super Seeder sowing
    # Day 10: Sowing complete & soil carbon baseline lock
    steps = [
        DailyScheduleStep(
            day_number=1,
            day_range="Days 1–2",
            stage_title="Harvest Logging & Cluster Matching",
            action_description=f"Log combine harvester exit. Measure straw moisture (Target: 12-16%). Compute residue load ({round(req.land_acres * 2.2, 1)} Tons across {req.land_acres} acres). Register GPS field coordinate into regional cluster pool.",
            target_date=(harvest_dt + datetime.timedelta(days=1)).isoformat(),
            status="Completed" if (today - harvest_dt).days >= 2 else ("In Progress" if (today - harvest_dt).days in [0, 1] else "Pending"),
            alert_level="low"
        ),
        DailyScheduleStep(
            day_number=2,
            day_range="Days 3–4",
            stage_title="Route Aggregation & CHC Booking",
            action_description=f"AgriShift OS proximity router pools your {req.land_acres} acres with neighboring plots into a 30+ acre contiguous cluster, reducing rental fee from ₹2,000 to ₹1,200/acre.",
            target_date=(harvest_dt + datetime.timedelta(days=3)).isoformat(),
            status="Completed" if (today - harvest_dt).days >= 4 else ("In Progress" if (today - harvest_dt).days in [2, 3] else "Pending"),
            alert_level="medium"
        ),
        DailyScheduleStep(
            day_number=3,
            day_range="Days 5–6",
            stage_title="Baling & Machinery Fleet Pooling",
            action_description="High-density round/square baler dispatched for ex-situ biomass collection (or preparatory residue shredding for in-situ), locking 40% transit fuel savings.",
            target_date=(harvest_dt + datetime.timedelta(days=5)).isoformat(),
            status="Completed" if (today - harvest_dt).days >= 6 else ("In Progress" if (today - harvest_dt).days in [4, 5] else "Pending"),
            alert_level="medium"
        ),
        DailyScheduleStep(
            day_number=4,
            day_range="Days 7–8",
            stage_title="Zero-Till Super Seeder Wheat Sowing",
            action_description="55+ HP tractor-driven Super Seeder conducts simultaneous straw chopping, soil incorporation, and precision seed drilling in one continuous pass.",
            target_date=(harvest_dt + datetime.timedelta(days=7)).isoformat(),
            status="Completed" if (today - harvest_dt).days >= 8 else ("In Progress" if (today - harvest_dt).days in [6, 7] else "Pending"),
            alert_level="high"
        ),
        DailyScheduleStep(
            day_number=5,
            day_range="Day 10",
            stage_title="Sowing Complete & Carbon Baseline Lock",
            action_description="Terminal deadline met with zero burning. Thermal mulch blanket protects emerging seedlings from early frost. Soil carbon baseline (+0.15% SOC) verified on ledger.",
            target_date=(harvest_dt + datetime.timedelta(days=9)).isoformat(),
            status="Completed" if (today - harvest_dt).days >= 10 else ("In Progress" if (today - harvest_dt).days in [8, 9] else "Pending"),
            alert_level="critical" if days_remaining <= 2 else "low"
        )
    ]

    # Scientific rationale comparing varieties
    if is_pusa:
        rationale = (
            "Pusa-44 is a long-duration cultivar (145–150 days) that leaves a razor-thin 10-day sowing window "
            "before the Nov 15 wheat deadline. Every day of sowing delay beyond this window costs 35-40 kg/acre "
            "(~1.2% to 1.5%) in terminal wheat grain yield due to late-season heat stress during grain filling."
        )
        yield_loss_risk = 1.45
    else:
        rationale = (
            "PR-126 is a short-duration variety (120–123 days) that matures ~25 days earlier, allowing comfortable "
            "residue management. AgriShift OS executes the 10-day digital schedule to capture early-sowing yield premiums "
            "and preserve soil moisture without open burning."
        )
        yield_loss_risk = 1.05

    return SowingScheduleResponse(
        land_acres=req.land_acres,
        harvest_date=req.harvest_date,
        paddy_variety="Pusa-44 (Long Duration)" if is_pusa else "PR-126 (Short Duration)",
        wheat_sowing_deadline=deadline_dt.isoformat(),
        days_remaining=days_remaining,
        window_status=window_status,
        daily_schedule=steps,
        scientific_rationale=rationale,
        yield_loss_risk_per_day_pct=yield_loss_risk
    )


@router.get("/varieties")
async def get_varieties():
    return [
        {
            "code": "PR-126",
            "name": "PR-126 (PAU Ludhiana)",
            "duration_days": 123,
            "harvest_window": "Early October (Comfortable 25-30 days to wheat)",
            "water_saving_pct": 20,
            "straw_load_tons_acre": 2.1,
            "recommendation": "Highly recommended for sustainable residue management and stress-free sowing."
        },
        {
            "code": "Pusa-44",
            "name": "Pusa-44 (IARI New Delhi)",
            "duration_days": 150,
            "harvest_window": "Late October / Early November (Extreme 10-day emergency window)",
            "water_saving_pct": 0,
            "straw_load_tons_acre": 2.5,
            "recommendation": "Requires urgent AgriShift digital cluster scheduling to prevent illegal burning under severe time panic."
        }
    ]

