# Backend — FastAPI measurement and research services

**Implemented entrypoint:** `app/main.py`; model router `fish_ml_router.py`; reference geometry `app/measurement.py`. Python 3.11 and Windows PowerShell used in observed local tests. Dependencies from `requirements.txt`; Ultralytics is additionally needed for segmentation and may not be in base requirements.

## Contracts

- `POST /api/v1/measure`: Pydantic input image width/height, 4 points, known reference cm, `coplanar_confirmed`, `length_definition`. Returns geometric length, cm/px and warnings. Rejects impossible inputs with 422.
- `GET /api/v1/ml/health`: checkpoint existence, **not** prediction success.
- `POST /api/v1/ml/segment?conf=0.15&imgsz=512`: image multipart, CPU Ultralytics inference; outputs masks, boxes and uncalibrated proposals. Requires trusted local `best_fish_segmenter.pt`. Accepts image/jpeg/png/webp; max upload 12 MB; max 25M pixels.
- `GET /api/v1/overview`, `/training`, `/recordings`, `/gallery`: read research artifacts; missing reports may show unavailable status.
- `POST /api/v1/analyze`: historical heuristic contour proposal, not physical measurement.

## Run/test

```powershell
cd backend
& '.\.venv\Scripts\python.exe' -m pip install -r requirements.txt
& '.\.venv\Scripts\python.exe' -m pip install 'ultralytics>=8.3,<9' pytest
& '.\.venv\Scripts\python.exe' -m pytest -q
& '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

For local staging the source of `app/main.py` must include the measurement router and ML router; confirm `/openapi.json`. Security: enforce upload limits, trusted PyTorch weights, CORS origin restriction for deployment, authentication/rate limits before public access. A green `GET /health` does not prove model or cm accuracy. [API contract details](../docs/en/architecture.md) · [ID](../docs/id/architecture.md).
