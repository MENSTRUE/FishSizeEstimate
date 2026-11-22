# Deployment guidance (not yet production-ready)

**Development:** FastAPI at 127.0.0.1:8001, Vite at 127.0.0.1:5173; Vite proxy `/api` targets `VITE_BACKEND_TARGET` (defaults to port 8001 in the latest patch). Check server route list at `/openapi.json`. Use trusted checkpoint through `FISH_SEGMENTER_PATH` or local default. Reports via `FISH_REPORT_DIR` and assets via `FISH_ASSET_DIR` if configured by backend.

**Before deployment:** select source code license; review dataset image rights; restrict CORS to actual origin; authentication and rate limiting; request size limits and image decompression verification; monitor CPU-heavy model inference; separate long-running model service if necessary; avoid exposing filesystem paths; package the correct frontend backend origin (Vite dev proxy is not production); configure HTTPS, logging and backups; run independent length evaluation. A successful local npm build does not prove deployability.

---

[Documentation index](README.md) · [Root README](../../README.md)
