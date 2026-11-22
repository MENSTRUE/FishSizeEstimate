# FishSizeEstimate SFISHTRACK V11 — trained segmentation artifacts

This artifact contains a trained fish instance-segmentation model and recorded held-out evaluation.
It does not estimate length in centimetres. Stereo metric reconstruction and independently verified fish measurements remain separate work.

## Model deployment
Install a compatible `ultralytics` version. Use `YOLO("models/best_fish_segmenter.pt")` and `model.predict(image, conf=0.25)`.
Inspect `models/model_manifest.json` and `heldout_test_report.json` for exact measured results.
