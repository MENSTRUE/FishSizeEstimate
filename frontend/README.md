# Frontend — existing measurement Image Workspace

React 19, TypeScript 5.7, Vite 6 and lucide-react. Main UI is `src/App.tsx`, typed fetch clients in `src/api.ts`; `src/styles.css` contains workspace styles. Vite `vite.config.ts` proxies `/api` to `VITE_BACKEND_TARGET` (default localhost 8001 in latest patch). No separate ML dashboard is needed for core measurement.

## User journey

Upload photo with a physical ruler -> inspect optional YOLO mask proposals -> select/correct `snout`, `tail_tip`, `reference_start`, `reference_end` points -> enter measured cm between ruler ticks -> confirm same measurement plane and camera geometry when true -> calculate length on FastAPI -> read result and warning -> save JSON. If scale is absent, DO NOT report centimetres.

```powershell
cd frontend
npm ci
$env:VITE_BACKEND_TARGET='http://127.0.0.1:8001'
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
npm run build
```

Review annotation interactions and ensure photo is not cropped; YOLO mask remains advisory. Local Vite build was reported passing on 22 Nov 2026; this does not prove measurement accuracy. [English architecture](../docs/en/architecture.md) · [Panduan ID](../docs/id/architecture.md).
