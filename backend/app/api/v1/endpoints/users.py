import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

# Directory for saving avatars
UPLOAD_DIR = "static/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.put("/me", response_model=UserResponse)
def update_user_me(user_in: UserUpdate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)):
    if user_in.bio is not None:
        current_user.bio = user_in.bio  # type: ignore[assignment]
    if user_in.phone_number is not None:
        current_user.phone_number = user_in.phone_number  # type: ignore[assignment]
    if user_in.specialization is not None:
        current_user.specialization = user_in.specialization  # type: ignore[assignment]

    from app.models.notification import Notification
    notif = Notification(
        user_id=current_user.id,
        title="Profile Updated",
        message="Your profile has been successfully updated."
    )
    db.add(notif)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/avatar", response_model=UserResponse)
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)):
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_ext = (file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else file.content_type.split("/")[-1])
    filename = f"user_{current_user.id}_avatar.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update user model with URL
    avatar_url = f"/static/avatars/{filename}"
    current_user.avatar_url = avatar_url  # type: ignore[assignment]
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
