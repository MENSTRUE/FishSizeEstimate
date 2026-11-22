# Petunjuk deployment (belum siap produksi)

**Development:** FastAPI 127.0.0.1:8001, Vite 127.0.0.1:5173. Proxy Vite `/api` mengarah ke `VITE_BACKEND_TARGET` (default 8001 pada patch terbaru). Periksa `/openapi.json`. Gunakan model lokal tepercaya lewat `FISH_SEGMENTER_PATH` jika perlu. Path laporan dapat memakai `FISH_REPORT_DIR`, aset `FISH_ASSET_DIR`.

**Sebelum deploy:** tetapkan lisensi sumber; audit hak gambar/dataset; batasi CORS ke domain yang valid; tambahkan autentikasi dan rate-limit; cek ukuran/keamanan upload; evaluasi beban CPU dan isolasi inferensi; cegah kebocoran path; sediakan HTTPS, logging dan backup; jangan mengandalkan Vite dev proxy di produksi; evaluasi error cm pada ikan nyata. Build npm sukses **bukan** bukti siap deployment.

---

[Documentation index](README.md) · [Root README](../../README.md)
