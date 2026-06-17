from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from typing import Optional


class MeetingBase(BaseModel):
    pass

class MeetingCreate(MeetingBase):
    patient_id: int
    psychologist_id: int
    status: str = "pending"

class MeetingUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: int
    patient_id: int
    psychologist_id: int
    status: str
    scheduled_time: Optional[datetime]
    meeting_link: Optional[str]
    created_at: datetime
    updated_at: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True
