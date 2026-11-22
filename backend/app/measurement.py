"""Reference-scale length estimator. Does not infer physical scale from uncalibrated images."""
from math import hypot, isfinite
from typing import Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix='/api/v1', tags=['Physical measurement'])

class Point(BaseModel):
    x: float
    y: float

class MeasurementRequest(BaseModel):
    image_width: int = Field(gt=0, le=10000)
    image_height: int = Field(gt=0, le=10000)
    snout: Point
    tail_tip: Point
    reference_start: Point
    reference_end: Point
    reference_length_cm: float = Field(gt=0, le=1000)
    coplanar_confirmed: bool = False
    length_definition: Literal['total_length_straight_line'] = 'total_length_straight_line'


def calculate_measurement(req: MeasurementRequest):
    if not req.coplanar_confirmed:
        raise HTTPException(422, 'Confirm fish and reference are on the same measurement plane and approximately parallel to the image sensor.')
    points = [req.snout, req.tail_tip, req.reference_start, req.reference_end]
    for p in points:
        if not (isfinite(p.x) and isfinite(p.y) and 0 <= p.x <= req.image_width and 0 <= p.y <= req.image_height):
            raise HTTPException(422, 'All points must be finite and inside the image.')
    fish_px = hypot(req.tail_tip.x-req.snout.x, req.tail_tip.y-req.snout.y)
    ref_px = hypot(req.reference_end.x-req.reference_start.x, req.reference_end.y-req.reference_start.y)
    if fish_px < 2 or ref_px < 2:
        raise HTTPException(422, 'Both fish and reference segments must be at least 2 pixels long.')
    cm_per_px = req.reference_length_cm/ref_px
    length_cm = fish_px*cm_per_px
    if not (isfinite(length_cm) and length_cm <= 1000):
        raise HTTPException(422, 'Computed length is outside permitted measurement range.')
    return {
        'status':'MEASURED_WITH_USER_CALIBRATION',
        'method':'manual_landmarks_reference_scale',
        'length_definition':req.length_definition,
        'fish_length_px':round(fish_px,3),
        'reference_length_px':round(ref_px,3),
        'reference_length_cm':round(req.reference_length_cm,4),
        'cm_per_pixel':round(cm_per_px,8),
        'length_cm':round(length_cm,2),
        'calibration_validity':'USER_ATTESTED_NOT_INDEPENDENTLY_VERIFIED',
        'ground_truth_accuracy_validated':False,
        'warning':'Straight-line total-length estimate. Requires fish and scale on same plane, minimal perspective, visible snout/tail. This result has no independently validated error bound.'
    }

@router.post('/measure')
def measure(request: MeasurementRequest):
    return calculate_measurement(request)
