from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy import Column, String


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    psychologist_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    status = Column(String, default="pending") # pending, scheduled, completed, cancelled
    scheduled_time = Column(DateTime(timezone=True), nullable=True)
    meeting_link = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    notes = Column(String, nullable=True)
