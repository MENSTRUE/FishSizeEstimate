# Reproduksibilitas dan provenance

Simpan notebook Kaggle V8–V12, path dataset, laporan asli JSON/CSV, checksum checkpoint, versi library, serta sumber gambar. Laporan V12 mencatat SHA256 `151cb7b5c241d7bdc3783487c95c5c444af8d5fc9c53d480d98c59863c99bf65` untuk checkpoint Kaggle; bandingkan sendiri dengan file lokal sebelum menyatakan identik. Lingkungan Kaggle mungkin berbeda dengan Windows Python 3.11 dan Ultralytics 8.4.

Perintah lokal: `backend/.venv/Scripts/python.exe -m pytest -q`; `cd frontend; npm ci; npm run build`; FastAPI di 8001, Vite di 5173 dengan `VITE_BACKEND_TARGET=http://127.0.0.1:8001`. Cek API `/api/v1/ml/health`, lalu POST gambar ikan sungguhan dan periksa polygon secara visual. Health dan import library **bukan** bukti inferensi berhasil. Catat commit hash, package-lock, pip freeze, Kaggle run ID, hash model, laporan serta screenshot nyata untuk reproduksi.

---

[Documentation index](README.md) · [Root README](../../README.md)
