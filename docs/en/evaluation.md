# Evaluation protocol and existing evidence

**Segmentation:** retain V11 official validation and held-out test metrics separately; validation mask mAP50–95 0.083791 vs held-out mask mAP50–95 0.171101. V12 sampled 16 val + 16 test frames (2/video); chosen confidence 0.15 by validation sampled matched F1. At 0.15, validation precision 0.625 / recall 0.33708 / F1 0.43796; sampled test precision 0.63636 / recall 0.43750 / F1 0.51852. Do not report those sample metrics as official COCO mAP. Verify tiny-object recall before deployment.

**Physical measurement:** local screenshot contains 917.2 px fish, 200.3 px reference, reference 10 cm; computed approximately 45.80 cm. This is internal arithmetic verification only. Ground-truth independent measured fish lengths do not yet support an MAE or RMSE. Collect fish-level samples with known lengths, ensure independent fish IDs across train/test, define total length consistently, document ruler coplanarity/camera angle, calculate `MAE = mean(abs(pred-true))`, `RMSE = sqrt(mean((pred-true)^2))`, bias, percentage errors, CI and per-condition failures. Freeze threshold and procedure before final held-out evaluation. Never infer accuracy from a plausible-looking example.

---

[Documentation index](README.md) · [Root README](../../README.md)
