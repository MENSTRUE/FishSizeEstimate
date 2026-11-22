# Kartu model — SFISHTRACK V11 YOLO11n-seg

**Tugas:** segmentasi instance ikan. **Bukan:** regresi cm, verifikasi anatomi kepala/ekor, identifikasi spesies, pengukuran fisik otomatis. **Arsitektur:** Ultralytics YOLO11n-seg; satu kelas ikan. **Input:** JPG/PNG/WebP didekode, diproses sesuai `imgsz` 384/512/640/768, conf default 0,15. **Output:** polygon, bounding box, confidence dan jumlah kandidat. **Checkpoint:** `models/fish_segmenter_v11/best_fish_segmenter.pt` lokal; tidak didorong ke Git biasa. **Data:** train 13.178 / val 2.668 / test 3.512.

**Validasi:** mask mAP50–95=0,083791; mask mAP50=0,213764. **Test:** mask mAP50–95=0,171101; mask mAP50=0,425116; box mAP50–95=0,199447; box mAP50=0,453362 dari JSON V11. Performa belum memadai untuk otomatisasi andal, terutama ikan kecil dan foto bak/penggaris yang berbeda domain. Skor confidence tidak sama dengan probabilitas akurasi pengukuran.

**Keterbatasan:** 4.174 frame dikeluarkan, split hanya terbukti terpisah per video, generalisasi ke foto berbeda belum teruji. Muat checkpoint PyTorch hanya dari sumber tepercaya. **MAE/RMSE panjang cm belum dievaluasi.**

---

[Documentation index](README.md) · [Root README](../../README.md)
