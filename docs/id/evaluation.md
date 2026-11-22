# Protokol evaluasi dan bukti

**Segmentasi:** bedakan mAP val resmi dan held-out test V11; mask mAP50–95 val 0,083791 dan test 0,171101. V12 menyampel 16 val + 16 test (2 frame/video). Confidence 0,15 dipilih dari F1 diagnostik validasi; precision/recall/F1 val 0,625 / 0,33708 / 0,43796 dan sampled test 0,63636 / 0,43750 / 0,51852. Angka V12 bukan mAP COCO dan bukan blind test baru.

**Panjang fisik:** screenshot lokal menunjukkan panjang piksel ikan 917,2; referensi 200,3; jarak 10 cm; hasil 45,80 cm. Ini membuktikan rumus dijalankan, **bukan** error terhadap panjang sebenarnya. Untuk MAE/RMSE, kumpulkan data ikan berbeda dengan pengukuran panjang riil, catat kondisi kamera, penggaris, ikan, dan beda kedalaman, tetapkan protokol sebelum test. Hitung MAE, RMSE, bias, persentase error, confidence interval serta kegagalan. Identitas ikan pada train/test tidak boleh tumpang tindih.

---

[Documentation index](README.md) · [Root README](../../README.md)
