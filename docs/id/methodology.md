# Metodologi model dan pengukuran

**Pengukuran:** pengguna memilih titik `snout`, `tail_tip`, `reference_start`, `reference_end`, memasukkan `reference_length_cm`, lalu mengonfirmasi geometri. Backend memakai jarak Euclidean 2-D: `panjang_cm = jarak(kepala,ekor)_px / jarak(referensi)_px × panjang_referensi_cm`. Validasi menolak konfirmasi belum diberikan, titik di luar gambar/tidak valid, ruas terlalu pendek, dan hasil tak wajar. Perlu bidang ukur sama, kamera mendekati tegak lurus, titik anatomis tepat. Perspektif, distorsi lensa, lengkungan ikan, refraksi air dan beda kedalaman menghasilkan bias. Definisi saat ini adalah *straight-line total length*, bukan panjang lengkung atau panjang standar.

**Segmentasi:** YOLO11n-seg V11 dilatih pada SFISHTRACK; inferensi Ultralytics di CPU dengan `imgsz` 384/512/640/768, `conf` 0,01–0,95, lazy loading checkpoint lokal tepercaya. Keluaran polygon, bounding box, confidence. Model tidak menghasilkan cm. Titik pengukuran yang dikoreksi manusia adalah masukan utama modul fisik.

**Riset sebelumnya:** V8 encoder visual contrastive dari bag ROS, bukan model regresi panjang. Pemeriksaan stereo belum memberikan panjang 3-D tervalidasi yang siap dipakai.

---

[Documentation index](README.md) · [Root README](../../README.md)
