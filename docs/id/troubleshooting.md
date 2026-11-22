# Pemecahan masalah Windows PowerShell

| Gejala | Penyebab mungkin | Tindakan |
|---|---|---|
| `[Errno 10048]` | Port API telah digunakan | Periksa `Get-NetTCPConnection -LocalPort 8001 -State Listen`; jangan matikan proses tak dikenal |
| Health ML 404 di 8000 | Salah server lama | Gunakan server ML benar di 8001 dan cek OpenAPI |
| Frontend gagal API | Proxy menuju port lain | Set `VITE_BACKEND_TARGET=http://127.0.0.1:8001` sebelum start Vite; restart |
| Health ada tapi inferensi 500 | Checkpoint ada, tapi model/load gagal | Lihat log backend; cek trusted `.pt`, ultralytics, torch |
| YOLO 0 atau 3 kandidat | Segmentasi lemah / beda domain | Periksa polygon, koreksi titik manual, jangan hitung kandidat sebagai ikan nyata |
| Tombol cm nonaktif | Titik/referensi/konfirmasi belum lengkap | Periksa empat titik; jangan centang kondisi bidang palsu |
| Hasil cm tidak masuk akal | Titik skala atau geometri salah | Pilih garis tick 10 cm yang benar, periksa bidang dan ujung ikan |
| Overview kosong | Report JSON tak ditemukan | Pastikan laporan ada di `reports/` dan konfigurasi `FISH_REPORT_DIR` benar |
| Installer PowerShell parser error | Encoding Windows PowerShell | UTF-8 BOM + periksa Parser sebelum jalankan |

---

[Documentation index](README.md) · [Root README](../../README.md)
