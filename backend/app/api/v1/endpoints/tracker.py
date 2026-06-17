from typing import List, cast
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.tracker import WellnessTracker
from app.schemas.tracker import TrackerCreate, TrackerResponse

router = APIRouter()

def calculate_wellness_index(mood: int, stress: int, sleep: float) -> float:
    # Formula: (Mood * 5) + ((10 - Stress) * 5) + (min(Sleep, 8) / 8 * 25)
    # Wait, max mood is 10 * 5 = 50. Max stress component is (10-1)*5 = 45. Sleep is 25. Total = 120?
    # Let's adjust to 100 max:
    # Mood: 10 * 4 = 40
    # Stress: (10 - stress) * 4 = max 36
    # Sleep: min(sleep, 8) / 8 * 24 = max 24
    # Total max: 40 + 36 + 24 = 100
    mood_score = mood * 4
    stress_score = (10 - stress) * 4
    sleep_score = min(sleep, 8.0) / 8.0 * 24
    return round(mood_score + stress_score + sleep_score, 1)

@router.post("/", response_model=TrackerResponse)
def create_tracker_entry(
    entry: TrackerCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if cast(str, current_user.role) != "patient":
        raise HTTPException(status_code=403, detail="Only patients can submit tracker entries")

    wellness_index = calculate_wellness_index(entry.mood_score, entry.stress_level, entry.sleep_hours)

    new_entry = WellnessTracker(
        patient_id=current_user.id,
        mood_score=entry.mood_score,
        stress_level=entry.stress_level,
        sleep_hours=entry.sleep_hours,
        wellness_index=wellness_index
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.get("/", response_model=List[TrackerResponse])
def get_tracker_entries(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if cast(str, current_user.role) != "patient":
        raise HTTPException(status_code=403, detail="Only patients have tracker entries")
        
    entries = db.query(WellnessTracker).filter(WellnessTracker.patient_id == current_user.id).order_by(WellnessTracker.created_at.desc()).all()
    return entries
