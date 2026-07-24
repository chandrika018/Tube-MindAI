from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
# pyrefly: ignore [missing-import]
from app.models.base import BaseModel

class ChatSession(BaseModel):
    __tablename__ = "chat_sessions"
    
    user_id = Column(ForeignKey("users.id"), nullable=True) # allow anonymous sessions temporarily if needed
    video_id = Column(ForeignKey("videos.id"), nullable=True)
    title = Column(String, nullable=True)
    
    user = relationship("User", back_populates="sessions")
    video = relationship("Video", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(BaseModel):
    __tablename__ = "chat_messages"
    
    session_id = Column(ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False) # 'user' or 'ai'
    content = Column(String, nullable=False)
    citations = Column(JSON, nullable=True) # Stores references to transcript chunks or web search sources
    
    session = relationship("ChatSession", back_populates="messages")

class TranscriptMetadata(BaseModel):
    __tablename__ = "transcript_metadata"
    
    video_id = Column(ForeignKey("videos.id"), nullable=False)
    language = Column(String, nullable=True)
    is_translated = Column(String, nullable=True)
    faiss_index_path = Column(String, nullable=True)
    
    video = relationship("Video", back_populates="transcripts")
