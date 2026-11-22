# Experiment lineage and interpretation

| Phase | Data and objective | Observed output | Research status |
|---|---|---|---|
| V8 | 11 ROS bags; self-supervised visual pretraining | 10,405 decoded images, 331 optimization steps; contrastive encoder weights | No trained cm prediction |
| V11 | SFISHTRACK supervised YOLO11n-seg | Best weight selected only on validation mask mAP50–95; test segmentation mask mAP50–95=0.17110 | Weak but genuine segmentation baseline |
| V12 | Sampled inference diagnostic; no training | Validation conf=0.15 TP30/FP18/FN59; sampled test TP28/FP16/FN36 | Exploration, not official COCO mAP |
| Workspace | User manual measurement with ruler | Single example 45.80 cm based on 917.2px / 200.3px × 10cm | Working calculation, no error validation |

**Model selection:** validation mask mAP50–95 chose the V11 checkpoint, not the test set. V12 reused known test video samples for diagnostics, so it is not an independent blind test. Do not confuse report `full_available_dataset_processed=true` from V8 with the total possible external data corpus.

---

[Documentation index](README.md) · [Root README](../../README.md)
