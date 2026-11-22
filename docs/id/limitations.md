# Keterbatasan dan batas klaim

1. Foto monokular tanpa referensi ukuran tidak dapat memberi sentimeter absolut yang sah.
2. Konfirmasi pengguna tentang bidang ukur tidak memverifikasi secara otomatis; perspektif, posisi kedalaman, kemiringan, kelengkungan, refraksi menghasilkan bias.
3. Titik ujung ikan bisa salah secara anatomis; yang dihitung garis lurus total length, bukan standard length ataupun garis melengkung.
4. YOLO V11 memiliki mAP rendah dan pergeseran domain; bisa mengembalikan 0 atau beberapa deteksi salah.
5. Encoder V8 bukan regressor panjang. Diagnostik V12 sampelnya kecil dan bukan evaluasi fisik.
6. MAE/RMSE cm independen dan interval kepercayaan **belum tersedia**.
7. Deployment publik memerlukan autentikasi, pembatasan permintaan, keamanan upload, hak penggunaan gambar, sumber model, dan persetujuan lisensi.

**Boleh diklaim:** alur pengukuran manual berbasis referensi sudah diimplementasikan dan diuji unit. **Tidak boleh:** AI akurat mengukur otomatis / instrumen bersertifikasi.

---

[Documentation index](README.md) · [Root README](../../README.md)
