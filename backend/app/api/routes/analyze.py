from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.youtube import yt_service
from app.services.ai import ai_service
from app.services.database import db

router = APIRouter()

class AnalyzeRequest(BaseModel):
    video_url: str

@router.post("")
@router.post("/")
async def analyze_video(req: AnalyzeRequest):
    video_id = yt_service.extract_video_id(req.video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # Check cache first
    cached = db.get_analyzed_video(video_id)
    if cached:
        return {
            "video_id": video_id,
            "status": "success",
            "details": cached["video_details"],
            "analysis": cached["analysis_result"]
        }

    # Get details
    details = yt_service.get_video_details(video_id)
    if not details:
        raise HTTPException(status_code=404, detail="Video details not found")

    title = details.get("title", "")
    
    # Get transcript
    transcript = yt_service.get_transcript(video_id)
    source_type = "transcript"
    context = transcript if transcript else f"Title: {title}\nDescription: {details.get('description', '')}"

    if not context:
        raise HTTPException(status_code=404, detail="Could not extract context for analysis")

    # Generate analysis
    try:
        summaries = {
            "short": ai_service.generate_summary(title, context, "short"),
            "medium": ai_service.generate_summary(title, context, "medium"),
            "detailed": ai_service.generate_summary(title, context, "detailed"),
            "bullet": ai_service.generate_summary(title, context, "bullet"),
            "executive": ai_service.generate_summary(title, context, "executive"),
        }

        insights = ai_service.generate_insights(title, context)
        scores = ai_service.calculate_recommendation_scores(details, title)

        analysis = {
            "source_type": source_type,
            "summaries": summaries,
            "insights": insights,
            "scores": scores
        }

        # Save to DB
        db.save_analyzed_video(video_id, details, analysis)

        return {
            "video_id": video_id,
            "status": "success",
            "details": details,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
