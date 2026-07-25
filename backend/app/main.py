from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, recommendations, analyze, chat

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(recommendations.router, prefix="/api/recommend", tags=["recommendations"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}

@app.get("/api/settings")
async def get_settings():
    return {
        "active_model": "llama3-8b-8192",
        "vector_db": "faiss",
        "api_keys": {}
    }

@app.get("/api/analytics")
async def get_analytics():
    return {
        "videos_analyzed_count": 0,
        "recommendations_generated_count": 0,
        "average_ai_score": 0,
        "searched_topics": {}
    }

@app.get("/api/bookmarks")
async def get_bookmarks():
    return []

