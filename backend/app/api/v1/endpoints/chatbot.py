from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.chat import ChatHistory
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse, ChatHistoryItem
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/message", response_model=ChatMessageResponse)
def send_message(
    request: ChatMessageRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Retrieve recent chat history to provide context to Gemini
    # Limit to last 20 messages to prevent excessive token usage
    history_records = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).order_by(ChatHistory.created_at.asc()).limit(20).all()

    # Save user message to database
    user_chat = ChatHistory(
        user_id=current_user.id,
        role="user",
        message=request.message
    )
    db.add(user_chat)
    db.commit()

    # Generate response from Gemini
    ai_response_text = gemini_service.generate_response(
        user_message=request.message,
        user_role=str(current_user.role),
        chat_history=history_records
    )

    # Save AI response to database
    ai_chat = ChatHistory(
        user_id=current_user.id,
        role="assistant",
        message=ai_response_text
    )
    db.add(ai_chat)
    db.commit()

    return ChatMessageResponse(response=ai_response_text)

@router.get("/history/{user_id}", response_model=List[ChatHistoryItem])
def get_chat_history(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this chat history")
        
    history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.created_at.asc()).all()
    return history

@router.delete("/history/{user_id}")
def delete_chat_history(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this chat history")
        
    db.query(ChatHistory).filter(ChatHistory.user_id == user_id).delete()
    db.commit()
    return {"status": "success", "detail": "Chat history cleared"}
