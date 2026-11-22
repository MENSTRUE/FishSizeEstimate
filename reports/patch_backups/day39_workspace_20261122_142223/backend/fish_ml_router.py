"""FishSizeEstimate V11 supervised segmentation API. No centimetre estimates."""
from functools import lru_cache
from pathlib import Path
import os
import threading

import cv2
import numpy as np
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter(prefix='/api/v1/ml', tags=['Fish ML V11'])
ROOT = Path(__file__).resolve().parent.parent
DEFAULT_MODEL = ROOT / 'models' / 'fish_segmenter_v11' / 'best_fish_segmenter.pt'
_LOCK = threading.Lock()
MAX_BYTES = 12 * 1024 * 1024
MAX_PIXELS = 25_000_000


def get_model_path():
    candidate = os.environ.get('FISH_SEGMENTER_PATH', '').strip()
    return Path(candidate).expanduser() if candidate else DEFAULT_MODEL


@lru_cache(maxsize=1)
def get_model():
    from ultralytics import YOLO
    p = get_model_path()
    if not p.is_file():
        raise FileNotFoundError(f'V11 checkpoint not found: {p}')
    model = YOLO(str(p))  # only use a trusted model checkpoint you trained
    if model.task != 'segment':
        raise ValueError(f'Expected segment checkpoint, got task={model.task}')
    return model


@router.get('/health')
def health():
    p = get_model_path()
    return {
        'status': 'checkpoint_found' if p.is_file() else 'model_missing',
        'model': 'SFISHTRACK V11 YOLO11n-seg',
        'checkpoint_exists': p.is_file(),
        'model_path': str(p),
        'training': False,
        'physical_length_cm_supported': False,
        'note': 'Checkpoint existence does not verify model loading or accuracy.'
    }


@router.post('/segment')
async def segment(image: UploadFile = File(...), conf: float = 0.15, imgsz: int = 512):
    if not (0.01 <= conf <= 0.95):
        raise HTTPException(422, 'conf must be between 0.01 and 0.95')
    if imgsz not in (384, 512, 640, 768):
        raise HTTPException(422, 'imgsz must be 384, 512, 640 or 768')
    if image.content_type not in ('image/jpeg', 'image/png', 'image/webp'):
        raise HTTPException(415, 'JPEG, PNG and WebP only')
    content = await image.read(MAX_BYTES + 1)
    if len(content) > MAX_BYTES:
        raise HTTPException(413, 'Image larger than 12 MB')
    frame = cv2.imdecode(np.frombuffer(content, np.uint8), cv2.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(400, 'Image could not be decoded')
    height, width = frame.shape[:2]
    if width * height > MAX_PIXELS:
        raise HTTPException(413, 'Image dimensions too large')
    try:
        with _LOCK:
            model = get_model()
            # All inference runs on CPU for compatibility with Windows environments.
            result = model.predict(
                source=frame, conf=conf, imgsz=imgsz, device='cpu',
                retina_masks=True, verbose=False, max_det=120,
            )[0]
    except FileNotFoundError as e:
        raise HTTPException(503, str(e))
    except Exception as e:
        # Avoid leaking local paths or internal exception details to client.
        raise HTTPException(500, f'Model inference failed ({type(e).__name__}); check backend terminal logs') from e

    objects = []
    if result.boxes is not None:
        polylines = result.masks.xy if result.masks is not None else []
        for i, box in enumerate(result.boxes):
            polygon = []
            if i < len(polylines):
                points = np.asarray(polylines[i]).reshape(-1, 2)
                polygon = [[round(float(x), 1), round(float(y), 1)] for x, y in points[::max(1, len(points)//600)]]
            objects.append({
                'id': i + 1,
                'class': 'fish',
                'confidence': round(float(box.conf[0]), 4),
                'bbox_xyxy': [round(float(x), 1) for x in box.xyxy[0].tolist()],
                'polygon_xy': polygon,
            })
    return {
        'model': 'SFISHTRACK V11 YOLO11n-seg',
        'method': 'supervised_yolo_instance_segmentation',
        'frame': {'width': width, 'height': height},
        'fish_count': len(objects),
        'objects': objects,
        'physical_length_cm': None,
        'calibrated': False,
        'limitations': 'SFISHTRACK segmentation baseline: weak small-fish recall; not validated for generic fish photos. No cm measurement.'
    }
