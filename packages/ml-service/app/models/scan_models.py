from pydantic import BaseModel
from typing import Optional


class ProcessScanRequest(BaseModel):
    scan_id: str
    left_foot_key: Optional[str] = None
    right_foot_key: Optional[str] = None


class FootMeasurements(BaseModel):
    length_mm: float
    width_mm: float
    arch_height_mm: float
    heel_width_mm: float
    ball_width_mm: float


class ScanMeasurements(BaseModel):
    left: Optional[FootMeasurements] = None
    right: Optional[FootMeasurements] = None


class ProcessScanResponse(BaseModel):
    scan_id: str
    measurements: ScanMeasurements
    point_cloud_url: Optional[str] = None
    mesh_url: Optional[str] = None
    metadata: dict = {}
