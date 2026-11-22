# Dataset provenance and task alignment

**Actually used:** V8 ROS stereo recordings, 11 traversed bags and 10,405 decoded images (see original `training_report.json`). V11 [SFISHTRACK](https://www.nature.com/articles/s41597-024-03776-3) converted from COCO RLE-like fish instances into YOLO segmentation polygons. Train 13,178 images from 38 videos; validation 2,668 images from 8 videos; held-out test 3,512 images from 8 videos. 4,174 source frames failed conversion and were excluded. Category ID was normalized for segmentation; masks do not encode physical fish lengths.

**Known deficiencies:** source image file naming needed reconciliation (`frame_*.jpg` vs JSON `*.png`); polygons approximate masks; conversions dropped frames; split was disjoint by video, but fish IDs across videos were not formally proven disjoint; label distribution and target-domain shifts affect accuracy. Check originals before rerunning training.

**Candidate only (not used in training/measurement evaluation):** [AutoFish](https://vap.aau.dk/autofish/) (manual fish-length annotations documented), [FishSizing Stereo](https://zenodo.org/records/19408363) (stereo research), [Ichthyometer](https://github.com/AtalaIA-DT/Ichthyometer) (AprilTag reference-scale method). Candidate licenses, download status, identity alignment, data sizes and sample labels require additional verification. Self-collected ruler photos with actual measured fish lengths are not yet a validated dataset. Dataset source license and author attribution must be verified at reuse; code LICENSE is currently undecided.

**Critical alignment:** masks are targets for segmentation; fish physical length is the target for centimetre error; a metadata CSV alone cannot replace the pixel images, ruler, camera geometry and independent ground truth.

---

[Documentation index](README.md) · [Root README](../../README.md)
