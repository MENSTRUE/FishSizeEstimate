# Asal dataset dan kesesuaian label

**Yang benar-benar digunakan:** V8 rekaman ROS stereo (11 bag selesai diproses, 10.405 gambar terdekode). V11 [SFISHTRACK](https://www.nature.com/articles/s41597-024-03776-3) dari anotasi instance COCO RLE yang dikonversi ke polygon YOLO. Train 13.178 gambar dari 38 video; validasi 2.668 gambar dari 8 video; test 3.512 gambar dari 8 video. Ada 4.174 frame sumber yang gagal dikonversi dan tidak dipakai. Kategori dinormalisasi menjadi ikan; **tidak ada label panjang ikan dalam cm** pada mask.

**Keterbatasan:** ketidakcocokan nama berkas `frame_*.jpg` dan referensi `*.png` dalam anotasi sumber perlu penyesuaian. Polygon mendekati mask asli; sebagian frame dikeluarkan. Split terpisah berdasarkan video, tetapi ikan sama antarvideo belum terbukti tidak bocor. Ada risiko pergeseran domain dan ikan berukuran kecil.

**Baru kandidat, belum dipakai untuk melatih atau mengevaluasi panjang:** [AutoFish](https://vap.aau.dk/autofish/) (dokumentasi menyebut anotasi panjang manual), [FishSizing Stereo](https://zenodo.org/records/19408363) (riset stereo), [Ichthyometer](https://github.com/AtalaIA-DT/Ichthyometer) (metode papan referensi/AprilTag). Ukuran, lisensi, kualitas label dan hasil download kandidat harus diperiksa lagi. Foto ikan dengan penggaris serta panjang fisik terukur sendiri **belum menjadi dataset evaluasi valid**.

**Aturan:** mask adalah label segmentasi; panjang fisik aktual adalah label evaluasi cm; CSV metadata tidak boleh menggantikan gambar dan referensi skala. Hak lisensi dataset berbeda dari lisensi kode.

---

[Documentation index](README.md) · [Root README](../../README.md)
