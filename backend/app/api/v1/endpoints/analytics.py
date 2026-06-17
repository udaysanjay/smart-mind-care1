from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from app.api import deps
from app.models.user import User
from app.models.tracker import WellnessTracker
from app.models.request import ConnectionRequest
from app.models.meeting import Meeting
from app.schemas.analytics import PatientAnalyticsResponse, PsychologistAnalyticsResponse

router = APIRouter()

@router.get("/patient", response_model=PatientAnalyticsResponse)
def get_patient_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if str(current_user.role) != "patient":
        raise HTTPException(status_code=403, detail="Only patients can access patient analytics")

    # Get averages
    stats = db.query(
        func.avg(WellnessTracker.mood_score).label('avg_mood'),
        func.avg(WellnessTracker.stress_level).label('avg_stress'),
        func.avg(WellnessTracker.sleep_hours).label('avg_sleep'),
        func.count(WellnessTracker.id).label('entries_count')
    ).filter(WellnessTracker.patient_id == current_user.id).first()

    # Get latest index and coerce safely to float
    latest = db.query(WellnessTracker).filter(WellnessTracker.patient_id == current_user.id).order_by(WellnessTracker.created_at.desc()).first()
    if latest is not None:
        raw_index = getattr(latest, "wellness_index", None)
        try:
            latest_wellness_index = round(float(raw_index), 1) if raw_index is not None else 0.0
        except (TypeError, ValueError):
            latest_wellness_index = 0.0
    else:
        latest_wellness_index = 0.0

    return PatientAnalyticsResponse(
        avg_mood=round(stats.avg_mood if stats and stats.avg_mood else 0.0, 1),
        avg_stress=round(stats.avg_stress if stats and stats.avg_stress else 0.0, 1),
        avg_sleep=round(stats.avg_sleep if stats and stats.avg_sleep else 0.0, 1),
        latest_wellness_index=latest_wellness_index,
        entries_count=int(stats.entries_count) if stats and stats.entries_count is not None else 0
    )

@router.get("/psychologist", response_model=PsychologistAnalyticsResponse)
def get_psychologist_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if str(current_user.role) != "psychologist":
        raise HTTPException(status_code=403, detail="Only psychologists can access psychologist analytics")

    # Total Patients: distinct patient_ids from accepted requests
    total_patients = db.query(ConnectionRequest.patient_id).filter(
        ConnectionRequest.psychologist_id == current_user.id,
        ConnectionRequest.status == "accepted"
    ).distinct().count()

    # Active Patients: unique patients with meetings in the last 30 days
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    active_patients = db.query(Meeting.patient_id).filter(
        Meeting.psychologist_id == current_user.id,
        Meeting.status.in_(["completed", "scheduled"]),
        Meeting.created_at >= thirty_days_ago
    ).distinct().count()

    # Pending requests
    pending_requests = db.query(ConnectionRequest).filter(
        ConnectionRequest.psychologist_id == current_user.id,
        ConnectionRequest.status == "pending"
    ).count()

    # Upcoming meetings
    upcoming_meetings = db.query(Meeting).filter(
        Meeting.psychologist_id == current_user.id,
        Meeting.status == "scheduled",
        Meeting.scheduled_time > datetime.now(timezone.utc)
    ).count()

    return PsychologistAnalyticsResponse(
        total_patients=total_patients,
        active_patients=active_patients,
        pending_requests=pending_requests,
        upcoming_meetings=upcoming_meetings
    )
