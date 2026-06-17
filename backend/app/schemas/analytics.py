from pydantic import BaseModel

class PatientAnalyticsResponse(BaseModel):
    avg_mood: float
    avg_stress: float
    avg_sleep: float
    latest_wellness_index: float
    entries_count: int

class PsychologistAnalyticsResponse(BaseModel):
    total_patients: int
    active_patients: int
    pending_requests: int
    upcoming_meetings: int
