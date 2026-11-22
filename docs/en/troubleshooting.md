# Troubleshooting (Windows PowerShell)

| Symptom | Diagnosis | Action |
|---|---|---|
| `[Errno 10048]` | Port 8000/8001 already bound | Inspect `Get-NetTCPConnection -LocalPort 8001 -State Listen`; do not kill unknown processes; run only one API |
| `/api/v1/ml/health` 404 on 8000 | Wrong/old server | Use actual ML backend (previous verified port 8001); check OpenAPI routes |
| Frontend GET /api fails | Vite proxy points to wrong backend | Set `VITE_BACKEND_TARGET=http://127.0.0.1:8001` before starting Vite; restart Vite |
| `checkpoint_found` but inference 500 | Health only checks file presence | Check backend logs, trusted `.pt`, Ultralytics installation and incompatible torch |
| YOLO returns zero or multiple fish | Weak/domain-shifted segmenter | Review masks manually, do not use number of candidates as actual fish count |
| cm disabled | 4 points/reference length/confirmation incomplete | Check all input; never attest false coplanarity |
| Invalid cm | Incorrect ruler tick distance/plane or endpoints | Mark exact ticks 10 cm apart, verify plane and straight-line definition |
| No experiment stats | Reports not found | Ensure real report JSON under `reports/`; validate `FISH_REPORT_DIR` |
| PowerShell installer parse error | WinPS encoding mismatch | Use UTF-8 with BOM and PowerShell syntax parser before running |

---

[Documentation index](README.md) · [Root README](../../README.md)
