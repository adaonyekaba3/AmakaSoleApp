from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import scan_router, gait_router, orthotic_router

load_dotenv()

app = FastAPI(
    title="AmakaSole ML Service",
    description="Foot scan processing, gait analysis, and orthotic generation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router.router)
app.include_router(gait_router.router)
app.include_router(orthotic_router.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-service"}
