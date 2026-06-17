from pydantic import BaseModel
from datetime import datetime
from typing import List

class ChatMessageBase(BaseModel):
    message: str

class ChatMessageRequest(ChatMessageBase):
    pass

class ChatMessageResponse(BaseModel):
    response: str

class ChatHistoryItem(BaseModel):
    id: int
    user_id: int
    role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
