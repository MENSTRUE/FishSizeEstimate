# FishSizeEstimate — Model Card / Research Status

## Trained component
Contrastive visual encoder on all decodable image messages from 11/11 recovered ROS recordings.

- Image messages used: 10405
- Optimizer steps: 331
- Decode errors: 0
- Image input resolution: 112x112
- Objective: self-supervised InfoNCE visual embeddings

## Experimental diagnostics
Stereo receive-time pairing, calibration candidates, actual stereo previews, raw disparity, automated *unverified* ROI and endpoint proposals. See CSV/PNG reports.

## What this does NOT establish
This artifact does not provide a validated fish total-length-in-cm estimator, nor a held-out fish-identity MAE or RMSE. Dataset A recovered recordings cover Fish 0 only; Dataset B is multi-fish and its source archive was incomplete.

## Required before claiming length accuracy
Confirm dataset licensing and annotation provenance, calibration units, rectification, subject identity mapping, stereo nose/tail correspondence and an independent fish-identity evaluation protocol.
