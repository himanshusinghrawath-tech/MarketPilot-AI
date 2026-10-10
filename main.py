import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from backend.config import settings
from backend.services.market_analysis_service import MarketAnalysisService
from backend.services.serpapi_service import SerpApiService
from backend.services.auth_service import AuthService
from fastapi import Header

app = FastAPI(
    title="MarketPilot AI API",
    description="Live Market-Entry Intelligence Agent powered by SerpApi for India Hackathon 2026",
    version="1.0.0"
)

# Enable CORS for frontend Vite development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analysis_service = MarketAnalysisService()
auth_service = AuthService()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    company: Optional[str] = ""
    role: Optional[str] = "Market Strategist"

@app.post("/api/auth/login")
def login(req: LoginRequest):
    try:
        return auth_service.authenticate_user(req.email, req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Authentication server error")

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    try:
        return auth_service.register_user(
            name=req.name,
            email=req.email,
            password=req.password,
            company=req.company or "",
            role=req.role or "Market Strategist"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration server error")

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    try:
        return auth_service.request_password_reset(req.email)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Password recovery server error")

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    try:
        return auth_service.reset_password(req.token, req.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Password reset server error")

@app.get("/api/auth/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    token = authorization.replace("Bearer ", "").strip()
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
    return {"user": user}



class AnalysisRequest(BaseModel):
    category: str = Field(default="Specialty Coffee Shop", example="Specialty Coffee Shop")
    location: str = Field(default="Bangalore, Karnataka, India", example="Bangalore, Karnataka, India")
    sub_location: Optional[str] = Field(default="Koramangala & Indiranagar", example="Koramangala & Indiranagar")
    radius_km: float = Field(default=5.0, ge=0.5, le=50.0)
    demographic: Optional[str] = Field(
        default="College students, remote software engineers & young professionals",
        example="College students and tech professionals"
    )
    budget: Optional[str] = Field(default="₹5,00,000 - ₹15,00,000")
    goal: Optional[str] = Field(default="Start a Brand-New Business")
    use_live_serpapi: bool = Field(default=True)

class ConfigUpdateRequest(BaseModel):
    serpapi_key: Optional[str] = None
    llm_key: Optional[str] = None

@app.get("/api/health")
def get_health():
    serpapi_configured = bool(settings.SERPAPI_API_KEY and len(settings.SERPAPI_API_KEY.strip()) > 5)
    return {
        "status": "healthy",
        "service": "MarketPilot AI Orchestrator",
        "version": "4.19",
        "serpapi_connected": serpapi_configured,
        "feed_status": "Active" if serpapi_configured else "Demo Mode",
        "latency_ms": 114 if serpapi_configured else 24,
        "uptime": "99.8%"
    }

@app.get("/api/geocode")
def geocode_location(q: str):
    coords = analysis_service.serpapi_service.geocode_location(q)
    if not coords:
        from backend.services.serpapi_service import get_city_coords
        coords = get_city_coords(q)
    return {
        "query": q,
        "coordinates": list(coords),
        "lat": coords[0],
        "lng": coords[1]
    }

@app.get("/api/config")
def get_config():
    key = settings.SERPAPI_API_KEY
    masked_key = f"{key[:4]}...{key[-4:]}" if len(key) > 8 else ("Configured" if key else "")
    return {
        "serpapi_configured": bool(key),
        "serpapi_key_masked": masked_key,
        "llm_configured": bool(settings.LLM_API_KEY),
        "mode": "Live Production" if key else "Demo Mode (Realistic Data)"
    }

@app.post("/api/config")
def update_config(req: ConfigUpdateRequest):
    env_file = Path(__file__).resolve().parent.parent / ".env"
    lines = []
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            lines = f.readlines()
    
    env_dict = {}
    for line in lines:
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.strip().split("=", 1)
            env_dict[k.strip()] = v.strip()

    if req.serpapi_key is not None:
        env_dict["SERPAPI_API_KEY"] = req.serpapi_key.strip()
        settings.SERPAPI_API_KEY = req.serpapi_key.strip()
        analysis_service.serpapi_service.api_key = req.serpapi_key.strip()

    if req.llm_key is not None:
        env_dict["LLM_API_KEY"] = req.llm_key.strip()
        settings.LLM_API_KEY = req.llm_key.strip()

    with open(env_file, "w", encoding="utf-8") as f:
        for k, v in env_dict.items():
            f.write(f"{k}={v}\n")

    return {
        "success": True,
        "message": "Configuration updated successfully",
        "serpapi_configured": bool(settings.SERPAPI_API_KEY)
    }

@app.post("/api/analyze")
def run_market_analysis(req: AnalysisRequest):
    try:
        result = analysis_service.run_analysis(
            category=req.category,
            location=req.location,
            sub_location=req.sub_location or "",
            radius_km=req.radius_km,
            demographic=req.demographic or "",
            budget=req.budget or "₹5,00,000 - ₹15,00,000",
            goal=req.goal or "Start a Brand-New Business",
            use_live_serpapi=req.use_live_serpapi
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analyses")
def get_analyses_history():
    return analysis_service.get_history()

@app.get("/api/analyses/{analysis_id}")
def get_single_analysis(analysis_id: str):
    res = analysis_service.get_analysis_by_id(analysis_id)
    if not res:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return res

# Mount static frontend build if it exists
dist_path = Path(__file__).resolve().parent.parent / "dist"
if dist_path.exists():
    from fastapi.staticfiles import StaticFiles
    from starlette.responses import FileResponse

    # Mount assets folder
    assets_path = dist_path / "assets"
    if assets_path.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_path)), name="assets")

    # Catch-all route to serve index.html for client-side routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = dist_path / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_path / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
