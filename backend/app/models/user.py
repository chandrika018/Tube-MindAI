from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    profile = relationship("Profile", back_populates="user", uselist=False)
    sessions = relationship("ChatSession", back_populates="user")
    recommendations = relationship("Recommendation", back_populates="user")

class Profile(BaseModel):
    __tablename__ = "profiles"
    
    user_id = Column(ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    user = relationship("User", back_populates="profile")
