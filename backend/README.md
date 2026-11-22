# FastAPI research backend

Read-only experiment reports under `../reports/`, curated gallery under `../assets/`, and an explicitly non-calibrated 2D image candidate endpoint. No `.pt` is loaded and no centimetre measurements are fabricated.

Windows PowerShell:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python -m pytest -q
uvicorn app.main:app --reload --port 8000
```

API documentation: http://127.0.0.1:8000/docs

Optional environment variables: `FISH_REPORT_DIR`, `FISH_ASSET_DIR`, `FISH_CORS_ORIGINS`. Default reads the existing parent repository folders.
