from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.request import ConnectionRequest
from app.models.user import User
from app.schemas.request import ConnectionRequestCreate, ConnectionRequestResponse

router = APIRouter()

@router.post("/create", response_model=ConnectionRequestResponse)
def create_request(
    request_in: ConnectionRequestCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if getattr(current_user, "role", None) != "patient":
        raise HTTPException(status_code=403, detail="Only patients can create requests")
        
    # Check if psychologist exists
    psychologist = db.query(User).filter(User.id == request_in.psychologist_id, User.role == "psychologist").first()
    if not psychologist:
        raise HTTPException(status_code=404, detail="Psychologist not found")
        
    # Check if a pending or accepted request already exists
    existing = db.query(ConnectionRequest).filter(
        ConnectionRequest.patient_id == current_user.id,
        ConnectionRequest.psychologist_id == request_in.psychologist_id,
        ConnectionRequest.status.in_(["pending", "accepted"])
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Request already exists")

    new_request = ConnectionRequest(
        patient_id=current_user.id,
        psychologist_id=request_in.psychologist_id
    )
    db.add(new_request)

    # Trigger notification
    from app.models.notification import Notification
    notif = Notification(
        user_id=request_in.psychologist_id,
        title="New Connection Request",
        message=f"You have a new connection request from Patient ID {current_user.id}."
    )
    db.add(notif)

    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/user/{id}", response_model=List[ConnectionRequestResponse])
def get_user_requests(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Ensure users can only see their own requests
    if getattr(current_user, "id", None) != id:
        raise HTTPException(status_code=403, detail="Not authorized to view these requests")
        
    requests = db.query(ConnectionRequest).filter(ConnectionRequest.patient_id == id).all()
    return requests

@router.get("/psychologist/{id}", response_model=List[ConnectionRequestResponse])
def get_psychologist_requests(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Ensure psychologist can only see their own requests
    if getattr(current_user, "id", None) != id or getattr(current_user, "role", None) != "psychologist":
        raise HTTPException(status_code=403, detail="Not authorized to view these requests")
        
    requests = db.query(ConnectionRequest).filter(ConnectionRequest.psychologist_id == id).all()
    return requests

from app.models.meeting import Meeting

@router.patch("/{id}/accept", response_model=ConnectionRequestResponse)
def accept_request(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    req = db.query(ConnectionRequest).filter(ConnectionRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if req.psychologist_id != getattr(current_user, "id", None):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    req.status = "accepted"  # type: ignore[assignment]
    
    # Auto-create meeting
    new_meeting = Meeting(
        patient_id=req.patient_id,
        psychologist_id=req.psychologist_id,
        status="pending"
    )
    db.add(new_meeting)
    
    # Trigger notification
    from app.models.notification import Notification
    notif = Notification(
        user_id=req.patient_id,
        title="Request Accepted",
        message=f"Psychologist ID {current_user.id} has accepted your connection request."
    )
    db.add(notif)
    
    db.commit()
    db.refresh(req)
    return req

@router.patch("/{id}/reject", response_model=ConnectionRequestResponse)
def reject_request(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    req = db.query(ConnectionRequest).filter(ConnectionRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if req.psychologist_id != getattr(current_user, "id", None):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    req.status = "rejected"  # type: ignore[assignment]
    db.commit()
    db.refresh(req)
    return req
