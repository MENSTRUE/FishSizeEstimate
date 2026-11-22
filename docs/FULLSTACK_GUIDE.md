# FishSizeEstimate full-stack implementation

## Scope

This package adds React/TypeScript frontend and FastAPI backend into the **existing** `frontend/` and `backend/` directories. It does not contain, modify, or delete notebooks, datasets, checkpoints, or Git root metadata.

The system visualizes existing research artifacts from `reports/experiments/` and `assets/plots/`, and provides an experimental single-image contour candidate tool. **It does not perform calibrated fish length prediction in centimetres.** The stored V8 visual encoder was trained for representations and is not plugged into the contour endpoint tool. This distinction is deliberate to avoid false claims.

## Endpoint list

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | API + research mode |
| GET | `/api/v1/overview` | Real report-backed overview; null when unavailable |
| GET | `/api/v1/training` | Training report and loss steps |
| GET | `/api/v1/recordings` | Bag-level coverage evidence |
| GET | `/api/v1/artifacts` | Names of permitted report files |
| GET | `/api/v1/gallery` | Curated visual artifacts |
| GET | `/api/v1/gallery/{id}` | Serve selected report image safely |
| POST | `/api/v1/analyze` | Exploratory foreground ROI and contour endpoints only |

## Security & reliability

Image upload: 8 MB limit, bounded dimensions, PNG/JPEG/WebP, decoded with Pillow. The API does not write uploaded images or load untrusted checkpoint pickles. CORS restricted to local dev origins. Gallery serves only files discovered inside the configured local assets root.

## Tests

Backend: `python -m pytest -q` from `backend/`.
Frontend: `npm run build` from `frontend/`.

## Important scientific limitations

- V8 pretraining optimized contrastive embeddings, not physical length.
- Stereo camera calibration translation units are not independently verified.
- Fish endpoints/identity mapping are not validated for independent fish-level evaluation.
- The UI must show `Not validated` for MAE/RMSE until actual verified measurements exist.
