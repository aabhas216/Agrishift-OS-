import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from seed_data import seed_database
from routers import sowing, machinery, marketplace, analytics, auth, location, operator

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Populate initial seed data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="AgriShift OS API",
    description="Paddy Residue & Soil Recovery Management System (100% Digital Supply-Chain & Agro-Economics)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(location.router)
app.include_router(operator.router)
app.include_router(sowing.router)
app.include_router(machinery.router)
app.include_router(marketplace.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {
        "system": "AgriShift OS API",
        "version": "1.0.0",
        "status": "Operational",
        "documentation": "/docs",
        "scope": "100% Digital Supply-Chain & Cluster Machinery Routing (No Chemical Sprays)"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "agrishift-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

