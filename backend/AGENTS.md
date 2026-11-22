# Backend agent rules

Read root `../AGENTS.md`. Preserve `/api/v1/measure` Pydantic schema and refuse centimeters without valid known-length reference/geometry attestation. ML inference returns masks not calibrated cm; validate upload type/bytes/dimensions; lock/lazy-load only trusted weights; do not log sensitive photos or paths. Run backend pytest and inspect OpenAPI after each code change. Do not conflate model load, mask prediction or accuracy.
