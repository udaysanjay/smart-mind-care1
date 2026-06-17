from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, psychologists, requests, meetings, chatbot, tracker, notifications, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(psychologists.router, prefix="/psychologists", tags=["psychologists"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
api_router.include_router(tracker.router, prefix="/tracker", tags=["tracker"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
