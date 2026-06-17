from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    normalized_email = user_in.email.lower().strip()
    user = db.query(User).filter(User.email == normalized_email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(
        email=normalized_email,
        hashed_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        specialization=user_in.specialization if user_in.role == 'psychologist' else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login_access_token(db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Normalize email from form data for consistent lookup
    normalized_email = form_data.username.lower().strip()
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not security.verify_password(form_data.password, str(user.hashed_password) if user else ""):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif user.is_active is False:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(deps.get_current_user)):
    return current_user
