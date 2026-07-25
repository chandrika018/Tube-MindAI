from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from app.services.youtube import yt_service
from app.services.ai import ai_service
from app.services.database import db

router = APIRouter()

@router.get("")
@router.get("/")
async def recommend_videos(
    q: str = Query(..., description="The search query"),
    mode: str = Query("ai", description="The search mode (ai, semantic, normal, trending, etc.)")
):
    """
    Get video recommendations based on query and mode.
    """
    # 1. Search videos on YouTube
    videos = yt_service.search_videos(q, search_mode=mode, max_results=12)
    
    # 2. Calculate AI recommendation scores
    for video in videos:
        scores = ai_service.calculate_recommendation_scores(video, q)
        video["scores"] = scores

    # 3. Sort by AI overall score if mode is ai or semantic
    if mode in ["ai", "semantic"]:
        videos.sort(key=lambda x: x.get("scores", {}).get("overall_score", 0), reverse=True)
        
    return videos
