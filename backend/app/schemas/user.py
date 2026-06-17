from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = "patient"
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    specialization: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    specialization: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
