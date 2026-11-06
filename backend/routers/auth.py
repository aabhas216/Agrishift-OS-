import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/auth", tags=["Authentication & Role Gateway"])

class LoginRequest(BaseModel):
    phone: str = Field(..., description="10-digit mobile number")
    role: str = Field(..., description="'farmer' or 'operator'")
    name: Optional[str] = "Registered User"
    otp: Optional[str] = "123456"

class LoginResponse(BaseModel):
    success: bool
    token: str
    user: dict

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    role = req.role.lower().strip()
    if role not in ["farmer", "operator"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'farmer' or 'operator'.")

    # Clean phone
    phone_clean = req.phone.strip()

    token = f"agri_tok_{role[:3]}_{uuid.uuid4().hex[:12]}"
    
    if role == "farmer":
        user_data = {
            "name": req.name if req.name and req.name != "Registered User" else "Harjit Singh",
            "phone": phone_clean,
            "role": "farmer",
            "village": "Taraori",
            "district": "Karnal",
            "pincode": "132116",
            "land_acres": 5.0,
            "crop_variety": "PR-126"
        }
    else:
        user_data = {
            "name": req.name if req.name and req.name != "Registered User" else "Sardar Gurpreet Singh",
            "phone": phone_clean,
            "role": "operator",
            "center_name": "Karnal Kisan Vikas Sahayata CHC",
            "village": "Taraori",
            "district": "Karnal",
            "pincode": "132116",
            "fleet_size": 4,
            "base_rate_per_acre": 1200.0
        }

    return LoginResponse(
        success=True,
        token=token,
        user=user_data
    )

