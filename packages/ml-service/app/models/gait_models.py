from pydantic import BaseModel
from typing import Optional, List


class AnalyzeGaitRequest(BaseModel):
    scan_id: str
    video_key: str


class StrideMeasurement(BaseModel):
    stride_length_cm: float
    cadence_spm: float
    ground_contact_time_ms: float
    flight_time_ms: float


class PressureDistribution(BaseModel):
    heel: float
    midfoot: float
    forefoot: float
    toes: float


class GaitAnalysisData(BaseModel):
    stride: StrideMeasurement
    pressure_distribution: PressureDistribution
    angles: dict = {}
    symmetry_index: float = 0.0
    step_count: int = 0


class AnalyzeGaitResponse(BaseModel):
    scan_id: str
    pronation_type: str  # NEUTRAL, OVERPRONATION, SUPINATION, UNKNOWN
    confidence_score: int  # 0-100
    heatmap_url: Optional[str] = None
    analysis_data: GaitAnalysisData
