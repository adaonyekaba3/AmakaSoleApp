from fastapi import APIRouter, HTTPException
from app.models.gait_models import AnalyzeGaitRequest, AnalyzeGaitResponse
from app.services.gait_service import analyze_gait

router = APIRouter(tags=["gait"])


@router.post("/analyze-gait", response_model=AnalyzeGaitResponse)
async def analyze_gait_endpoint(request: AnalyzeGaitRequest):
    if not request.video_key:
        raise HTTPException(status_code=400, detail="Video key is required")

    result = analyze_gait(request.video_key)

    return AnalyzeGaitResponse(
        scan_id=request.scan_id,
        pronation_type=result["pronation_type"],
        confidence_score=result["confidence_score"],
        analysis_data=result["analysis_data"],
    )
