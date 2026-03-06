from fastapi import APIRouter, HTTPException
from app.models.scan_models import ProcessScanRequest, ProcessScanResponse
from app.services.scan_service import process_scan

router = APIRouter(tags=["scan"])


@router.post("/process-scan", response_model=ProcessScanResponse)
async def process_scan_endpoint(request: ProcessScanRequest):
    if not request.left_foot_key and not request.right_foot_key:
        raise HTTPException(status_code=400, detail="At least one foot scan key is required")

    result = process_scan(request.left_foot_key, request.right_foot_key)

    return ProcessScanResponse(
        scan_id=request.scan_id,
        measurements=result["measurements"],
        metadata=result["metadata"],
    )
