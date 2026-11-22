# System architecture and API contract

```mermaid
flowchart LR
  UI[React + Vite Image Workspace] -->|/api via dev proxy| API[FastAPI]
  API --> MEAS[POST /api/v1/measure]
  API --> YOLO[POST /api/v1/ml/segment]
  API --> RPT[GET overview, training, recordings, gallery]
  YOLO --> PT[Local trusted V11 .pt]
  RPT --> JSON[Local V8/V11/V12 report files]
```

**Measurement request JSON:** `{ "image_width":1000,"image_height":1000,"snout":{"x":500,"y":800},"tail_tip":{"x":500,"y":200},"reference_start":{"x":200,"y":400},"reference_end":{"x":200,"y":600},"reference_length_cm":10,"coplanar_confirmed":true,"length_definition":"total_length_straight_line" }`.

**Response fields:** `status`, `method`, `length_definition`, `fish_length_px`, `reference_length_px`, `reference_length_cm`, `cm_per_pixel`, `length_cm`, `calibration_validity`, `ground_truth_accuracy_validated=false`, `warning`. **Segment request:** multipart field `image`, query `conf=0.15`, `imgsz=512`; response `frame`, `fish_count`, `objects` polygons/bboxes, `physical_length_cm=null`. Backend `/health` of ML reports checkpoint presence not successfully loaded prediction. Historical `/api/v1/analyze` uses contours and is not the primary physical measurement endpoint.

---

[Documentation index](README.md) · [Root README](../../README.md)
