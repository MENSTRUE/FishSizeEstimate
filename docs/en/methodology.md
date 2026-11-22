# Measurement and model methodology

**Measurement:** four user-selected pixel coordinates (`snout`, `tail_tip`, `reference_start`, `reference_end`) and positive `reference_length_cm`. The backend uses Euclidean 2-D distances. `length_cm = hypot(tail-snout) / hypot(ref_end-ref_start) * reference_length_cm`. Input validation rejects missing coplanarity confirmation, invalid/out-of-bounds coordinates, too-short segments and nonfinite/implausible results. Assumes correct anatomical endpoint interpretation, same physical plane and near fronto-parallel camera geometry. Perspective, lens distortion, fish curvature, water refraction and foreshortening may bias estimates. This is straight-line total length, not arc length.

**Segmentation:** V11 Ultralytics YOLO11n-seg trained on normalized SFISHTRACK fish masks; image tensor preprocessed by Ultralytics to selected `imgsz` (384/512/640/768) and `conf` threshold in 0.01–0.95. CPU inference, serialized by lock, lazily loads trusted `best_fish_segmenter.pt`. Returns boxes, confidence and polygons. No direct conversion to cm. Manual endpoints remain authoritative for the measurement step.

**Earlier R&D:** V8 contrastive visual encoder trained on ROS streams (not a fish-size estimator). Stereo candidate investigation did not produce calibrated and identity-matched 3-D lengths ready for deployment.

---

[Documentation index](README.md) · [Root README](../../README.md)
