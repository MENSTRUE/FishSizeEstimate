# AGENTS.md — FishSizeEstimate engineering contract

## Mission and source-of-truth

Deliver *reference-scale fish-length estimation*; never represent a fish mask as a physical measurement. Priority: actual source and tested API schemas > real experiment JSON/CSV > reproduced test logs > documentation > plans. Treat all unverified metrics as unavailable.

## Immutable repo structure

Keep `README.md`, `AGENTS.md`, `LICENSE`, `.gitignore`, `.env.example`, `notebooks/`, `models/`, `reports/`, `assets/`, `backend/`, `frontend/`, `docs/`, `scripts/`. Do not create `datasets/` in git, move files without a dependency audit, or commit private data, `.env`, `node_modules`, `.venv`, large `.pt`, bag files, or raw datasets.

## Mandatory workflow

1. Read real code and report manifests. Check `git status` and remote before modifying.
2. State contract: fish image + physical reference + 4 points + confirmed geometry → cm scale and straight-line estimate.
3. Audit source images, geometry, label meaning, licensing, split and leakage before changing training.
4. Do not use V8 self-supervised encoder as a size regressor. V11 is segmentation; V12 is sampled diagnostics.
5. Never invent IoU, MAE/RMSE, benchmark or production status. Separate validation from held-out test and exploratory reused tests.
6. Use FastAPI/Pydantic validation, bounded uploads, no traceback leakage, trusted model weights, and regression tests.
7. Keep one React Image Workspace, preserve correction controls and measurement refusal conditions. Do not create unrelated UI pages.
8. Maintain EN/ID docs with equivalent depth; audit every relative link and show only genuine owned/licensed images.
9. Run `python -m pytest -q`, `npm run build` and smoke tests before release. Do not assert success unless observed.
10. Review git diff and `git status`; check gitignore and file sizes before push. No force push without explicit permission.

## Before / Now / Next

Before: ROS V8 exploratory representation learning, V11 SFISHTRACK segmentation, V12 sampled diagnostics. Now: manual reference-scale measurement with optional YOLO mask, local tests. Next: independent ground-truth fish length evaluation, robust calibration, documented license.

## Completion criteria

A working *measurement workflow* is distinct from a *validated accurate measurement model*. Never mark MAE/RMSE as complete without independent annotated fish-level ground truth. A successful model import or health check is not successful inference.

## Prohibited actions

Fabricated fish photos or datasets passed off as evidence; claiming cm from unscaled images; uploading copyrighted datasets/checkpoints indiscriminately; treating marker confidence as anatomical validation; overwriting real reports; deleting source changes; committing GitHub credentials; automatic licensing without user approval.
