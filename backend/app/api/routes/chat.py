from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid
from app.services.database import db
from app.services.ai import ai_service
from app.services.youtube import yt_service

router = APIRouter()

class ChatCreateRequest(BaseModel):
    title: str
    model: str = "gemini"

class ChatMessageRequest(BaseModel):
    session_id: str
    video_id: str
    message: str

@router.get("/sessions")
async def get_sessions():
    return db.get_chats()

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    chat = db.get_chat(session_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.post("/create")
async def create_session(req: ChatCreateRequest):
    session_id = str(uuid.uuid4())
    chat = db.create_chat(session_id, req.title, req.model)
    return chat

@router.post("/message")
async def send_message(req: ChatMessageRequest):
    chat = db.get_chat(req.session_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
        
    # Append user message
    db.append_chat_message(req.session_id, "user", req.message)
    
    # Get video details for context
    cached = db.get_analyzed_video(req.video_id)
    title = cached["video_details"]["title"] if cached else "Unknown Video"
    
    # Get transcript or context
    transcript = yt_service.get_transcript(req.video_id)
    context = transcript if transcript else "No transcript available."
    
    # Generate AI reply
    reply_text = ai_service.chat(
        session_id=req.session_id,
        video_title=title,
        query=req.message,
        history=chat.get("messages", []),
        context=context,
        provider=chat.get("model", "gemini")
    )
    
    # Append assistant message
    updated_chat = db.append_chat_message(req.session_id, "assistant", reply_text, source_type="transcript")
    
    # Get the latest message for reply
    reply_msg = updated_chat["messages"][-1] if updated_chat["messages"] else None
    
    return {
        "reply": reply_msg,
        "chat": updated_chat
    }

@router.delete("/{session_id}")
async def delete_session(session_id: str):
    success = db.delete_chat(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"success": True}

@router.get("/{session_id}/export")
async def export_session(session_id: str):
    chat = db.get_chat(session_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    title = chat.get("title", "Exported Notes")
    messages = chat.get("messages", [])
    
    markdown = f"# TubeMind AI Notes: {title}\n\n"
    
    if not messages:
        markdown += "*No messages in this session.*\n"
    else:
        for msg in messages:
            role = "You" if msg.get("role") == "user" else "TubeMind AI"
            content = msg.get("content", "")
            markdown += f"**{role}**: {content}\n\n---\n\n"
            
    headers = {
        "Content-Disposition": f'attachment; filename="tubemind_{session_id}.md"'
    }
    
    return Response(content=markdown, media_type="text/markdown", headers=headers)
