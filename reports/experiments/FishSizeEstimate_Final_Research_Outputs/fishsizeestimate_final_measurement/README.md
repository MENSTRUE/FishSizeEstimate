# FishSizeEstimate — Final stereo measurement investigation

This output follows a successful V8 encoder pretraining. It does not retrain the encoder.

The notebook audits tracking annotations, exports real stereo pairs and object/endpoint review proposals, inspects calibration and performs guarded 3-D length reconstruction **only when independent verified annotations exist**.

The ROI/axis endpoints are **not automatically verified fish head/tail points**. Any projected baseline is not automatically in metres.

Review `FINAL_STATUS.json` and `metric_summary.json` before any portfolio performance claims.
