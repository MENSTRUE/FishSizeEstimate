# Limits, claim boundaries and risks

1. A single monocular photograph without a physical scale cannot determine absolute centimetres.
2. User-attested coplanarity is not machine-verified; tilt, depth difference, perspective, curvature, refraction and ruler placement create error.
3. User-selected endpoints may not match anatomical definitions; this is straight-line total length, not standard length or curved path length.
4. SFISHTRACK segmenter V11 has weak held-out mAP and significant domain shift; YOLO may return zero or multiple false candidates.
5. V8 visual encoder is not a length predictor; V12 sampling is not an independent final measurement test.
6. Physical fish-level MAE/RMSE and confidence intervals are **not yet evaluated**.
7. Public deployment needs authentication/rate limits, untrusted upload security review, supply-chain and model file provenance, real data rights and code license approval.

**Allowed claim:** reference-scale manual measurement workflow implemented and unit-tested; optional experimental segmentation. **Forbidden claim:** automatically accurate AI length estimation or deployment-ready certified measuring device.

---

[Documentation index](README.md) · [Root README](../../README.md)
