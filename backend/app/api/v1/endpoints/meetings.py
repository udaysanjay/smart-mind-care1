from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api import deps
from app.models.user import User
from app.models.meeting import Meeting
from app.schemas.meeting import MeetingResponse, MeetingUpdate

router = APIRouter()

@router.get("/", response_model=List[MeetingResponse])
def get_meetings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Ensure we compare the actual role value (avoid SQLAlchemy ColumnElement in conditionals)
    role = getattr(current_user, "role")
    # Some type checkers may treat role as a SQLAlchemy ColumnElement; coerce to string for comparisons
    role_str = str(role) if role is not None else ""
    if role_str == "patient":
        meetings = db.query(Meeting).filter(Meeting.patient_id == current_user.id).all()
    elif role_str == "psychologist":
        meetings = db.query(Meeting).filter(Meeting.psychologist_id == current_user.id).all()
    else:
        meetings = []
    return meetings

@router.patch("/{id}", response_model=MeetingResponse)
def update_meeting(
    id: int,
    meeting_in: MeetingUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    meeting = db.query(Meeting).filter(Meeting.id == id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Only participants can modify
    if current_user.id not in [meeting.patient_id, meeting.psychologist_id]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if meeting_in.status is not None:
        # Pyright/typers may see Meeting.status as a Column[...] type; silence type checker
        meeting.status = str(meeting_in.status)  # type: ignore
    if meeting_in.scheduled_time is not None:
        # Assign via setattr to satisfy static type checkers that see SQLAlchemy Column descriptors
        setattr(meeting, "scheduled_time", meeting_in.scheduled_time)
    if meeting_in.meeting_link is not None:
        setattr(meeting, "meeting_link", meeting_in.meeting_link)
        
    if hasattr(meeting_in, "notes") and meeting_in.notes is not None:
        setattr(meeting, "notes", meeting_in.notes)

    # If scheduled, notify patient
    if meeting_in.status == "scheduled":
        from app.models.notification import Notification
        notif = Notification(
            user_id=meeting.patient_id,
            title="Meeting Scheduled",
            message=f"A meeting has been scheduled for {meeting_in.scheduled_time}."
        )
        db.add(notif)

    db.commit()
    db.refresh(meeting)
    return meeting
