from sqlalchemy import Column, String, Integer, JSON, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Video(BaseModel):
    __tablename__ = "videos"
    
    youtube_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    channel = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    views = Column(Integer, nullable=True)
    
    metadata_ = relationship("VideoMetadata", back_populates="video", uselist=False)
    transcripts = relationship("TranscriptMetadata", back_populates="video")
    chat_sessions = relationship("ChatSession", back_populates="video")

class VideoMetadata(BaseModel):
    __tablename__ = "video_metadata"
    
    video_id = Column(ForeignKey("videos.id"), unique=True, nullable=False)
    description = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    published_at = Column(String, nullable=True)
    
    video = relationship("Video", back_populates="metadata_")

class Recommendation(BaseModel):
    __tablename__ = "recommendations"
    
    user_id = Column(ForeignKey("users.id"), nullable=False)
    video_id = Column(ForeignKey("videos.id"), nullable=False)
    ai_score = Column(Float, nullable=True)
    reason = Column(String, nullable=True)
    
    user = relationship("User", back_populates="recommendations")
    video = relationship("Video")
