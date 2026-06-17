from pydantic import BaseModel, Field
from datetime import datetime

class TrackerBase(BaseModel):
    mood_score: int = Field(..., ge=1, le=10)
    stress_level: int = Field(..., ge=1, le=10)
    sleep_hours: float = Field(..., ge=0, le=24)

class TrackerCreate(TrackerBase):
    pass

class TrackerResponse(TrackerBase):
    id: int
    patient_id: int
    wellness_index: float
    created_at: datetime

    class Config:
        from_attributes = True
