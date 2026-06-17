from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class WellnessTracker(Base):
    __tablename__ = "wellness_tracker"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    mood_score = Column(Integer, nullable=False) # 1-10
    stress_level = Column(Integer, nullable=False) # 1-10
    sleep_hours = Column(Float, nullable=False)
    wellness_index = Column(Float, nullable=False) # Computed 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
