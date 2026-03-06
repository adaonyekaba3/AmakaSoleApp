from pydantic import BaseModel
from typing import Optional


class GenerateOrthoticRequest(BaseModel):
    scan_id: str
    measurements: Optional[dict] = None
    gait_data: Optional[dict] = None
    shoe_type: str
    use_case: str
    material: str
    arch_height_pref: str


class ArchProfile(BaseModel):
    height_mm: float
    length_mm: float
    curvature: str


class HeelCup(BaseModel):
    depth_mm: float
    width_mm: float


class MetatarsalPad(BaseModel):
    position_mm: float
    height_mm: float
    width_mm: float


class OrthoticSpec(BaseModel):
    arch_profile: ArchProfile
    heel_cup: HeelCup
    metatarsal_pad: MetatarsalPad
    thickness_mm: float
    density: str
    shore_hardness: int
    total_length_mm: float
    total_width_mm: float


class GenerateOrthoticResponse(BaseModel):
    scan_id: str
    cad_spec: OrthoticSpec
    cad_spec_url: Optional[str] = None
    preview_image_url: Optional[str] = None
