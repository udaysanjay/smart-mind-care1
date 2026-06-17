from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api import deps
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_psychologists(
    search: Optional[str] = None,
    specialization: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = db.query(User).filter(User.role == "psychologist")
    
    if search:
        query = query.filter(
            or_(
                User.first_name.ilike(f"%{search}%"),
                User.last_name.ilike(f"%{search}%"),
                User.bio.ilike(f"%{search}%")
            )
        )
    
    if specialization:
        query = query.filter(User.specialization.ilike(f"%{specialization}%"))
        
    return query.all()

@router.get("/{id}", response_model=UserResponse)
def get_psychologist(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    psychologist = db.query(User).filter(User.id == id, User.role == "psychologist").first()
    if not psychologist:
        raise HTTPException(status_code=404, detail="Psychologist not found")
    return psychologist
