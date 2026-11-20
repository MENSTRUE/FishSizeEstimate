# FishSizeEstimate — integrated research outputs

This experiment uses **all available recovered ROS recordings** for self-supervised visual pretraining and creates **real** stereo QA / disparity diagnostic artifacts. It **does not claim a calibrated centimetre estimator**. See `integrated_research_report.json` for coverage and open scientific gates.

Important files:
- `visual_encoder_weights.pt`, `latest_checkpoint.pt`: learned encoder & training state
- `train_steps.csv`, `self_supervised_training_loss.png`: optimization evidence
- `all_bag_coverage.csv`: full available recording coverage
- `real_stereo_pair_inventory.csv`, `stereo_pair_XX.jpg`: actual stereo preview pairs
- `stereo_timestamp_qa.csv`, `calibration_stereo_pair_candidates.csv`: camera QA
- `stereo_raw_disparity_diagnostic.png`: unrectified **non-metric** disparity preview (when possible)
- `fish_endpoint_annotations_TEMPLATE.csv`: required manual stereo keypoints, empty on purpose
- `integrated_research_report.json`: honest completion/readiness report

Scientific limitations: nine source length values but recovered A videos all feature one fish; Dataset B incompletely recovered; identity/geometry validation and independent held-out cm performance remain open. Do not redistribute third-party data or checkpoints without checking rights.
