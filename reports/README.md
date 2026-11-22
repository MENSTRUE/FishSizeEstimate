# Reports / Laporan percobaan

This folder holds historical machine-generated evidence; do not overwrite original JSON/CSV to improve presentation. V8 `training_report.json` records 11 ROS bags, 10,405 decoded images and 331 optimizer steps (self-supervised). V11 `heldout_test_report.json` holds official segmentation metrics and converted split counts. V12 `diagnostic_report.json` holds small sampled matched-score diagnostics, **not** official mAP. `patch_backups/` is a local source-recovery area and should not be blindly published.

The real 45.80 cm result was displayed in the user's local measurement screenshot (22 Nov 2026), not an independent length-label accuracy report. Publish only permitted screenshots to `assets/screenshots/` with traceable metadata. [Evaluation EN](../docs/en/evaluation.md) · [Evaluasi ID](../docs/id/evaluation.md).
