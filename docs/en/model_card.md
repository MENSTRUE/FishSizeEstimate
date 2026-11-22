# Model card — SFISHTRACK V11 YOLO11n-seg

**Task:** Fish instance segmentation. **Not:** length regression, landmark anatomical verification, species recognition, or independently calibrated cm estimation. **Architecture:** Ultralytics YOLO11n-seg; single class fish after normalization. **Input:** decoded RGB image (converted to BGR in API), `imgsz` 384/512/640/768; default confidence 0.15. **Output:** polygons, boxes, per-instance confidence, fish count. **Checkpoint:** `models/fish_segmenter_v11/best_fish_segmenter.pt` (local; not committed by default). **Training:** V11 Kaggle data splits train 13,178 / validation 2,668 / test 3,512 images.

**Validation metrics:** mask mAP50–95=0.083791; mask mAP50=0.213764. **Held-out test:** mask mAP50–95=0.171101; mask mAP50=0.425116; box mAP50–95=0.199447; box mAP50=0.453362. Source: actual V11 heldout JSON. **Interpretation:** poor object-level reliability, severe tiny-fish and domain-shift risk; detecting several candidates in a single-fish image can include false positives. API confidence scores are not calibrated probabilities of correct measurements.

**Bias and domain:** training source underwater/wild fish scenes; ruler/tank photos are domain shifted. 4,174 source frames excluded. Video-disjoint split is not guaranteed individual-fish-disjoint. **Security:** do not load untrusted `.pt` checkpoint. **Recommended use:** visual proposal with human review; never use without scale to provide cm. **Physical MAE/RMSE:** not evaluated.

---

[Documentation index](README.md) · [Root README](../../README.md)
