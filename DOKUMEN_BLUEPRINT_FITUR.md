# BLUEPRINT SYSTEM & SPESIFIKASI FITUR LENGKAP
## Ekosistem Digital Masjid Citra Sentul Raya

---

## 📋 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

**Masjid Citra Sentul Raya Digital Ecosystem** adalah platform sistem informasi manajemen dan pelayanan umat terpadu yang dirancang khusus untuk DKM (Dewan Kemakmuran Masjid) Masjid Citra Sentul Raya, Bogor. Platform ini mengintegrasikan fungsi **Pelayanan Jamaah**, **Penggalangan Dana ZISWAF (Zakat, Infaq, Shadaqah, Wakaf)**, **Sistem Akuntansi & Keuangan Standar Syariah**, **Al-Qur'an Digital**, serta **Portal Manajemen Administrasi DKM**.

### Tujuan Utama Sistem:
1. **Transparansi & Akuntabilitas Publik**: Menyajikan laporan keuangan real-time dan daftar donatur yang dapat diaudit oleh publik.
2. **Kemudahan Berbagi (ZISWAF)**: Memfasilitasi pembayaran instant via QRIS Standar Nasional (GPN) & Transfer Bank BSI dengan kalkulator wakaf otomatis dan penerbitan E-Sertifikat digital.
3. **Manajemen Operasional DKM Modern**: Mengintegrasikan pencatatan akuntansi double-entry (Jurnal, CoA, Buku Besar, Laporan Keuangan, Anggaran), inventaris, pengurus, serta audit log otomatis.
4. **Pemberdayaan & Dakwah Jamaah**: Menyediakan Al-Qur'an digital, jadwal shalat real-time, kalender kegiatan dakwah, dan AI Asisten Jamaah.

---

## 🏗️ 2. ARSITEKTUR TEKNOLOGI & SYSTEM STACK

### Stack Teknologi Utama:
- **Frontend Framework**: React 18 / Vite / TypeScript
- **Styling & UI Design**: Custom CSS Design Tokens + Tailwind CSS + Glassmorphism Aesthetics
- **Icons & Visual Assets**: Lucide React Icon Pack + Custom Media Assets
- **Utilitas**: Canvas Confetti, HTML2Canvas, JSPDF (Print/Export E-Sertifikat)
- **Database / Integration**: Supabase Client Ready + Offline First Architecture

---

## 🧩 3. MATRIKS FITUR & MODUL APLIKASI

---

### 🟢 A. PORTAL PUBLIK & JAMAAH (FRONTEND SERVICES)

#### 1. Header & Navigasi Utama (`Header.tsx`)
- **Fungsi**: Bar navigasi melayang (*sticky blur glassmorphism*) responsif untuk semua perangkat.
- **Fitur Utama**:
  - Menu navigasi cepat: Beranda, Tentang, Jadwal Shalat, ZISWAF, Kegiatan, Keuangan, Quran Digital, Lokasi.
  - Button Switcher **Portal Mode**: Mengganti tampilan antara Mode Publik, Portal Jamaah, dan Portal Admin DKM.
  - Mobile Menu Drawer interaktif.

#### 2. Hero Section Interactive (`Hero.tsx`)
- **Fungsi**: Visual banner selamat datang utama dengan slider otomatis (*Auto-play Carousel*).
- **Fitur Utama**:
  - 3 Slide High-Resolution (Masjid Malam Hari, Sunset, dan Interior Utama).
  - Call to Action (CTA) dinamis menuju Form Wakaf & Kalender Kegiatan.
  - Banner lokasi cepat & kontak darurat DKM (+62 812-1920-0400).
  - Tagline ZISWAF Syariah.

#### 3. Jadwal Shalat Real-Time & Countdown (`JadwalShalatCard.tsx`)
- **Fungsi**: Menampilkan waktu shalat 5 waktu + Syuruq secara akurat untuk wilayah Sentul / Kab. Bogor.
- **Fitur Utama**:
  - Penghitung mundur (*Countdown Timer*) otomatis menuju waktu shalat berikutnya.
  - Highlight visual pada waktu shalat yang sedang aktif.
  - Tanggal Masehi dan tanggal Hijriah terkini.

#### 4. Profil, Visi-Misi & Fasilitas Masjid (`ProfilMasjid.tsx`)
- **Fungsi**: Informasi kelembagaan DKM Masjid Citra Sentul Raya.
- **Fitur Utama**:
  - Visi dan Misi Dakwah & Pemberdayaan Umat.
  - Galeri fasilitas masjid (Ruang Utama AC, Area Parkir Luas, Tempat Wudhu Pria/Wanita, Perpustakaan, Sound System).
  - Struktur Organisasi DKM.

#### 5. Kalkulator & Form Wakaf Online (`WakafForm.tsx`)
- **Fungsi**: Pusat penyaluran wakaf pembangunan masjid secara cepat dan terverifikasi.
- **Fitur Utama**:
  - **Kalkulator Paket Wakaf**:
    - Paket Batu Bata & Semen (Rp 50.000)
    - Paket Keramik & Granit (Rp 250.000)
    - Paket Wakaf 1 m² (Rp 1.500.000 - Populer)
    - Paket Utama & Nominal Bebas (Kustom).
  - **Form Identitas Wakif**:
    - Opsi nama terbuka atau anonim (*Hamba Allah*).
    - No. WhatsApp untuk penerimaan E-Sertifikat Digital.
    - Form Niat Wakaf & Pesan Doa Keberkahan.
  - **Metode Pembayaran**:
    - **Transfer Bank BSI**: No Rekening `7257159102` a.n Masjid Citra Sentul Raya dengan tombol salin cepat & kode unik verifikasi otomatis.
    - **QRIS Instant Standar Nasional (GPN)**:
      - NMID Resmi: `ID1023304558381`.
      - **Modal Zoom Interaktif**: Gambar QRIS dapat diklik untuk diperbesar (*1.25x scale zoom*) dengan kontrol peningkat visibilitas.
      - **Fitur Unduh QRIS**: Tombol *Direct File Download* untuk menyimpan file `QRIS-Masjid-Citra-Sentul-Raya.jpg` ke galeri HP/Desktop.
  - **Fitur Pasca-Transaksi**:
    - Selebrasi Confetti otomatis.
    - Integrasi WhatsApp otomatis ke Pengurus DKM.
    - Tombol langsung untuk melihat & mencetak E-Sertifikat Wakaf.

#### 6. Program Unggulan ZISWAF (`DaftarProgram.tsx`)
- **Fungsi**: Katalog program penggalangan dana zakat, infaq, sedekah, dan wakaf khusus.
- **Fitur Utama**:
  - Kartu program dengan progres statistik dana terkumpul, target, dan jumlah donatur.
  - Modal Donasi Cepat dengan opsi nominal preset (50k, 100k, 500k) & kustom.
  - Dukungan QRIS Instant (Zoomable & Downloadable) dan Bank Transfer.
  - Fitur unggah Bukti Transfer (*Upload Screenshot*) oleh donatur.

#### 7. Generator E-Sertifikat Wakaf (`ECertificateModal.tsx`)
- **Fungsi**: Penerbitan sertifikat penghargaan digital otomatis untuk donatur wakaf.
- **Fitur Utama**:
  - Desain elegan bermotif Islami dengan nomor id sertifikat unik.
  - Menampilkan nama wakif, nominal wakaf, paket, serta tanggal transaksi.
  - Dilengkapi Stempel & TTD Digital Resmi Ketua DKM Masjid Citra Sentul Raya.
  - Fitur Cetak Langsung (*Print Ready*) & Unduh Sertifikat.

#### 8. Transparansi & Laporan Keuangan Publik (`LaporanKeuangan.tsx`)
- **Fungsi**: Papan transparansi akuntabilitas publik atas dana umat yang masuk.
- **Fitur Utama**:
  - KPI Ringkasan: Total Wakaf Terkumpul, Target Pembangunan, dan Total Donatur Terdaftar.
  - Fitur Pencarian Cepat (*Live Search*) berdasarkan nama muwakif atau isi doa.
  - Filter Metode Pembayaran (BSI, QRIS, Hamba Allah).
  - Tabel rincian muwakif terverifikasi dengan timestamp transaksi.

#### 9. Al-Qur'an Digital Terpadu (`AlQuranDigital.tsx`)
- **Fungsi**: Fasilitas pembacaan Al-Qur'an 30 Juz secara digital untuk jamaah.
- **Fitur Utama**:
  - 114 Surah lengkap dengan teks Arab, Transliterasi Latin, dan Terjemahan Bahasa Indonesia.
  - Pemutar Audio Murottal per ayat.
  - Pencarian Surah cepat & penanda bacaan (*Bookmark*).

#### 10. Kalender & Agenda Kegiatan (`KalenderKegiatan.tsx`)
- **Fungsi**: Informasi jadwal pengajian, kajian rutinan, dan kegiatan sosial masjid.
- **Fitur Utama**:
  - Filter kategori kegiatan (Kajian Subuh, Tabligh Akbar, Jum'at Berkah, Remaja Masjid).
  - Tampilan tanggal, waktu, penceramah/ustadz, dan lokasi ruang.

#### 11. AI Asisten Jamaah (`AiAsistenModal.tsx`)
- **Fungsi**: Chatbot kecerdasan buatan interaktif 24/7 untuk menjawab pertanyaan jamaah.
- **Fitur Utama**:
  - Jawaban otomatis seputar jadwal shalat, tata cara ZISWAF, lokasi masjid, dan kontak DKM.
  - UI chat modal modern dengan respons cepat.

#### 12. Berita, Media & Kontak (`BeritaInformasi.tsx`, `MediaAshabulYamin.tsx`, `LokasiKontak.tsx`, `Footer.tsx`)
- **Fungsi**: Informasi publikasi dakwah, tayangan kajian YouTube, peta lokasi Google Maps, dan footer navigasi.

---

### 🟡 B. PORTAL KEUANGAN & AKUNTANSI SYARIAH (BACKEND/ADMIN)

Sistem Akuntansi yang terintegrasi penuh mengikuti standar **PSAK 109 (Akuntansi Zakat dan Infaq/Sedekah)** & Akuntansi Pesantren/Masjid.

#### 1. Bagan Akun / Chart of Accounts - CoA (`ModulCoA.tsx`)
- **Fungsi**: Pengelolaan struktur kode akun keuangan 5 kategori utama:
  - **1000 - Aset / Aktiva**: Kas Utama BSI, Kas QRIS, Bank Mandiri, Piutang, Aset Tetap Bangunan Masjid.
  - **2000 - Kewajiban / Liabilitas**: Utang Operasional, Utang Kontraktor Pembangunan.
  - **3000 - Ekuitas / Aset Netto**: Aset Netto Terikat (Wakaf/Zakat), Aset Netto Tidak Terikat (Infaq Operasional).
  - **4000 - Pendapatan / Penerimaan ZISWAF**: Penerimaan Wakaf, Zakat Maal, Zakat Fitrah, Infaq Juma'at, Sedekah Subuh.
  - **5000 - Beban / Pengeluaran**: Beban Pembangunan, Operational Listrik/Air, Honor Marbot & Imam, Program Dakwah.
- **Fitur Utama**: Tambah/Edit Kode Akun, Filter Kategori, Status Aktif/Non-aktif.

#### 2. Jurnal Umum Double-Entry (`ModulJurnal.tsx`)
- **Fungsi**: Pencatatan transaksi keuangan berpasangan (*Debit & Kredit*).
- **Fitur Utama**:
  - Validasi Keseimbangan (*Balance Check*) otomatis antara Total Debit dan Total Kredit.
  - Penomoran Bukti Jurnal Otomatis (`JV-YYYYMMDD-XXX`).
  - Penandaan Status Verifikasi Bendahara / DKM.
  - Pencetakan Voucher Jurnal.

#### 3. Buku Besar / General Ledger (`ModulBukuBesar.tsx`)
- **Fungsi**: Rekapitulasi mutasi dan saldo akhir untuk setiap akun CoA.
- **Fitur Utama**:
  - Selector Akun CoA & Filter Rentang Tanggal Transaksi.
  - Penghitungan Saldo Awal, Mutasi Debit, Mutasi Kredit, dan Saldo Akhir secara otomatis.

#### 4. Laporan Keuangan Standar Syariah (`ModulLaporanKeuangan.tsx`)
- **Fungsi**: Penyajikan laporan keuangan komprehensif untuk pengurus DKM dan audit.
- **Jenis Laporan**:
  1. **Laporan Posisi Keuangan (Neraca)**: Menampilkan Aset = Kewajiban + Aset Netto.
  2. **Laporan Perubahan Aset Netto (Laba Rugi ZISWAF)**: Rincian Total Penerimaan vs Total Beban.
  3. **Laporan Arus Kas**: Arus kas dari aktivitas operasional, investasi pembangunan, dan pendanaan.
- **Fitur Utama**: Export ke PDF/Excel & Cetak Laporan Keuangan Resmi.

#### 5. Persetujuan Anggaran Operasional (`ModulAnggaranApproval.tsx`)
- **Fungsi**: Alur pengajuan dan verifikasi pencairan dana pembangunan / operasional.
- **Fitur Utama**: Multi-level approval (Pengaju -> Bendahara -> Ketua DKM).

---

### 🔵 C. PORTAL ADMINISTRASI & PENGATURAN SYSTEM (`AdminDashboard.tsx`)

#### 1. Dashboard Utama Admin & KPI Tracking
- Visualisasi statistik total penerimaan ZISWAF, grafik tren donasi harian/bulanan, dan status verifikasi transaksi.

#### 2. Consolidate Navigation 5 Kategori (Navigasi Admin Modern)
- **Utama**: Dashboard KPI, Progres Pembangunan, Ringkasan Aktivitas.
- **Keuangan**: Chart of Accounts, Jurnal Umum, Buku Besar, Laporan Keuangan, Persetujuan Anggaran.
- **Operasional**: Manajemen Program ZISWAF, Berita & Artikel, Kalender Kegiatan.
- **Administrasi**: Manajemen Sertifikat Wakaf, Inventaris Masjid, Profil Pengurus DKM, Tanda Tangan Resmi (TTD).
- **Pengaturan**: Pengaturan Sistem, Keamanan Passcode, Log Audit Aktivitas.

#### 3. System Audit Log Engine
- **Fungsi**: Tracking keamanan dan rekam jejak aktivitas admin (siapa yang mengubah data, kapan, dan jenis perubahan yang dilakukan) untuk mencegah penyalahgunaan wewenang.

---

### 🟣 D. PORTAL SELF-SERVICE JAMAAH (`JamaahDashboard.tsx`)

- **Fitur Utama**:
  - **Histori Donasi Personal**: Melihat riwayat pengeluaran wakaf/infaq yang pernah disalurkan jamaah.
  - **Pusat Sertifikat Digital**: Mengunduh kembali E-Sertifikat Wakaf kapan saja.
  - **Pendaftaran Kegiatan**: Pendaftaran otomatis peserta pengajian/kegiatan masjid.
  - **Pengaturan Akun**: Perubahan profil dan kata sandi jamaah.

---

## 🔒 4. SPESIFIKASI KEAMANAN & INTEGRITAS DATA

1. **Role-Based Access Control (RBAC)**: Pemisahan hak akses antara Jamaah Publik, Bendahara Keuangan, dan Super Admin DKM.
2. **Double-Entry Safeguard**: Mencegah entri jurnal yang unbalance (*Debit != Kredit*).
3. **Data Backup & Synchronizations**: Siap dihubungkan dengan database PostgreSQL Supabase serta mendukung *local storage fallback*.
4. **QRIS Standard Compliance**: Penggunaan kode QRIS resmi terdaftar ASPI / GPN dengan verifikasi NMID yang valid.

---

## 📅 5. PANDUAN PEMELIHARAAN & PENGEMBANGAN TEKNIS

- **Direktori Asset QRIS**: `public/images/qris-masjid.jpg`
- **Pembaruan Kode Rekening**: Dapat disesuaikan melalui file `src/data/mockData.ts` dan `src/components/WakafForm.tsx`.
- **Perubahan Struktur CoA**: Dapat ditambah via modul admin CoA tanpa mengganggu riwayat jurnal terdahulu.

---
*Dokumen Blueprint ini disusun sebagai berkas dokumentasi arsitektur dan panduan spesifikasi teknis lengkap Sistem Informasi Ekosistem Digital Masjid Citra Sentul Raya.*
