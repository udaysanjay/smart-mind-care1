from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConnectionRequestBase(BaseModel):
    psychologist_id: int

class ConnectionRequestCreate(ConnectionRequestBase):
    pass

class ConnectionRequestUpdate(BaseModel):
    status: str # "accepted" or "rejected"

class ConnectionRequestResponse(ConnectionRequestBase):
    id: int
    patient_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
