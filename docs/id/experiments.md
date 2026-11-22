# Riwayat eksperimen dan interpretasi

| Tahap | Data dan tujuan | Bukti keluaran | Status |
|---|---|---|---|
| V8 | 11 bag ROS, pretraining visual tanpa label | 10.405 gambar; 331 langkah optimizer; bobot encoder | Bukan model panjang cm |
| V11 | Segmentasi terawasi SFISHTRACK YOLO11n-seg | Bobot terbaik dipilih via validation mask mAP50–95; test mAP mask50–95=0,17110 | Baseline segmentasi masih lemah |
| V12 | Diagnostik sampel kecil, tanpa training | Validasi conf 0,15 TP30/FP18/FN59; sampel test TP28/FP16/FN36 | Eksplorasi, bukan official mAP |
| Workspace | Pengguna menandai empat titik dan penggaris | Satu contoh 45,80 cm dari 917,2/200,3 piksel ×10 cm | Kalkulasi bekerja; akurasi belum ada |

**Pemilihan model:** bobot V11 dipilih dari mAP mask validasi, bukan test. V12 menggunakan sampel test yang pernah dievaluasi sebagai diagnostik, tidak boleh dianggap blind test baru. Klaim `full_available_dataset_processed=true` V8 tidak berarti seluruh data eksternal di internet terproses.

---

[Documentation index](README.md) · [Root README](../../README.md)
