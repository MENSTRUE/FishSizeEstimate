# Model registry / Registri model

- `fish_segmenter_v11/best_fish_segmenter.pt`: local trained YOLO11n-seg on SFISHTRACK; intended only for instance segmentation and untrusted outside its domain. It is intentionally excluded from normal git using `*.pt`.
- `results v8/.../visual_encoder_weights.pt` and `latest_checkpoint.pt`: V8 self-supervised feature encoder; **not** fish length regression.
- Source reports: `reports/experiments/sfishtrack/v11/heldout_test_report.json` and `.../v12/diagnostic_report.json`; evaluate corresponding metric definitions separately.

**V11 test segmentation:** mask mAP50–95 0.171101, mask mAP50 0.425116. **Physical cm accuracy:** not tested. Use `FISH_SEGMENTER_PATH` for explicit local checkpoint; never load untrusted `.pt` from arbitrary users. If sharing model weights, audit source data and licenses and prefer a separate tagged release rather than normal git. [EN card](../docs/en/model_card.md) · [Kartu model ID](../docs/id/model_card.md).
