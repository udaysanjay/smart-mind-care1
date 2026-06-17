from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.router import api_router
from app.database import engine, Base
from app.models.user import User
from app.models.request import ConnectionRequest
from app.models.meeting import Meeting
from app.models.chat import ChatHistory
from app.models.tracker import WellnessTracker
from app.models.notification import Notification
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MindCare API",
    description="Backend API for the MindCare Full-Stack Application",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://smart-mind-care1.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Ensure static directory exists and mount it
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to MindCare API"}
