# Research notebooks / Notebook riset

Preserve historical Kaggle notebooks V8–V12 without pretending every file is a finalized training pipeline. V8 processes ROS recordings for self-supervised contrastive visual features; V11 trains YOLO11n-seg on SFISHTRACK; V12 runs sampled segmentation diagnostics **without retraining**. Other old notebook versions are exploration and should be interpreted alongside actual output manifests.

**Reproduction:** verify Kaggle input mounts and source ZIP provenance before running; keep video-disjoint train/val/test; select best weights by validation only; use held-out tests for evaluation, not repeated hyperparameter tuning. V11 input: `/kaggle/input/datasets/wafabila/sfishtrack-dataset`; V12 reads prior V11 output dataset. Report outputs must be compared to JSON in `reports/`, not made up from notebook names. No notebook was shown to validate fish length cm independently. [EN](../docs/en/experiments.md) · [ID](../docs/id/experiments.md).
