# Reproducibility and provenance

Preserve original Kaggle notebooks V8–V12, recorded dataset paths, report JSON/CSV, model weight SHA when present and package versions. The V12 report records `weights_sha256=151cb7b5c241d7bdc3783487c95c5c444af8d5fc9c53d480d98c59863c99bf65` for its Kaggle model; independently compare against any local model before claiming identical weights. Notebook environment may differ from local Windows Python 3.11 and Ultralytics 8.4.

Local commands: `backend/.venv/Scripts/python.exe -m pytest -q`; `cd frontend; npm ci; npm run build`; start FastAPI on 8001; start Vite on 5173 with `VITE_BACKEND_TARGET=http://127.0.0.1:8001`; `GET /api/v1/ml/health`. Test multipart inference with a real fish image and manually check polygons. A health route and an import check are not image-inference verification. Capture `git rev-parse HEAD`, package-lock, Python freeze, notebook run IDs, artifact SHA, report names and test screenshots for a real reproducibility record.

---

[Documentation index](README.md) · [Root README](../../README.md)
