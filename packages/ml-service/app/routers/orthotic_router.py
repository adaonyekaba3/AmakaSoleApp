from fastapi import APIRouter
from app.models.orthotic_models import GenerateOrthoticRequest, GenerateOrthoticResponse
from app.services.orthotic_service import generate_orthotic

router = APIRouter(tags=["orthotic"])


@router.post("/generate-orthotic", response_model=GenerateOrthoticResponse)
async def generate_orthotic_endpoint(request: GenerateOrthoticRequest):
    spec = generate_orthotic(
        measurements=request.measurements,
        gait_data=request.gait_data,
        shoe_type=request.shoe_type,
        use_case=request.use_case,
        material=request.material,
        arch_height_pref=request.arch_height_pref,
    )

    return GenerateOrthoticResponse(
        scan_id=request.scan_id,
        cad_spec=spec,
    )
