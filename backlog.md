# 📌 Project Backlog: Web Portal & Sistem Akuntansi Masjid Citra Sentul Raya

Dokumen ini berisi rincian seluruh tugas (backlog items) yang disusun berdasarkan fungsionalitas dan fase eksekusi (*Sprint/Phase*) agar pembaruan dapat dilakukan secara terurut dan terstruktur.

---

## 🚀 Priority Phase 1: Core Infrastructure & Data Layer
> **Fokus**: Menyiapkan tipe data, koneksi database, data master akuntansi, dan state global.

| Task ID | Nama Tugas | Komponen / File | Prioritas | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TSK-101** | Definisi TypeScript Interfaces (Muwakif, Milestone, Berita, Video, Chat) | `src/types.ts` | High | `[x] Completed` |
| **TSK-102** | Master Data Akuntansi Initial (CoA, Jurnal, Budget Requests) | `src/data/akuntansiData.ts` | High | `[x] Completed` |
| **TSK-103** | Inisialisasi Mock Data & Initial Stats Portal | `src/data/mockData.ts` | High | `[x] Completed` |
| **TSK-104** | Integrasi Supabase Client Engine | `src/lib/supabase.ts` | High | `[x] Completed` |
| **TSK-105** | Root Layout & Theme Switcher Logic (Day & Auto Night Mode) | `src/App.tsx` | High | `[x] Completed` |

---

## 📊 Priority Phase 2: Core Accounting Engine (ISAK 35)
> **Fokus**: Menjamin sistem pencatatan keuangan double-entry, ledger, laporan posisi keuangan, dan sistem approval anggaran.

| Task ID | Nama Tugas | Komponen / File | Prioritas | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TSK-201** | Modul Chart of Accounts (CoA) (Aset, Liabilitas, Net Assets, Pendapatan, Beban) | `src/components/ModulCoA.tsx` | High | `[x] Completed` |
| **TSK-202** | Modul Jurnal Umum Double-Entry & Status Posting | `src/components/ModulJurnal.tsx` | High | `[x] Completed` |
| **TSK-203** | Modul Buku Besar (General Ledger) & Running Balance | `src/components/ModulBukuBesar.tsx` | High | `[x] Completed` |
| **TSK-204** | Modul Laporan Keuangan ISAK 35 (Terintegrasi Neraca, Laba Rugi, Jurnal Umum, Buku Besar, CoA, & Anggaran) | `src/components/ModulLaporanKeuangan.tsx`, `AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-205** | Modul Anggaran & Flow Approval Multi-Level (Bendahara → Ketua → Direktur) | `src/components/ModulAnggaranApproval.tsx` | High | `[x] Completed` |
| **TSK-206** | Modul Laporan Keuangan Standalone Viewer | `src/components/LaporanKeuangan.tsx` | Medium | `[x] Completed` |

---

## 🛠️ Priority Phase 3: Portal Admin & Dashboard DKM
> **Fokus**: Fasilitas pengelolaan operasional masjid, ZISWAF, inventaris, pengumuman, dan setting sistem.

| Task ID | Nama Tugas | Komponen / File | Prioritas | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TSK-301** | Riwayat Transaksi (Dahulu Buku Kas Sederhana, Auto Double-Entry Post ke Jurnal & CoA) | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-302** | Input Donasi ZISWAF Manual & Integration Auto Double-Entry Journal | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-303** | Program Campaign & Status Pencapaian Target Donasi | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-304** | Manajemen Pengumuman, Berita, & Warta Masjid | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-305** | Jadwal Petugas Shalat, Khatib, & Tema Khutbah Jumat | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-306** | Broadcast WhatsApp Massal Jamaah | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-307** | Verifikasi Donasi ZISWAF & Penerbitan Sertifikat | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-308** | Galeri Media Foto & Link Video YouTube Kajian | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-309** | Kalender & Form Tambah Agenda Masjid | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-310** | Inventaris & Pendataan Foto Aset Masjid | `src/components/AdminDashboard.tsx` | Low | `[x] Completed` |
| **TSK-311** | Manajemen Profil Dewan Pembina & Pengurus DKM | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-312** | Pengaturan Admin (Kata Sandi, Visibilitas, Running Text, Nisab, Bank/QRIS) | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-313** | Tanda Tangan Digital Laporan Keuangan | `src/components/AdminDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-314** | Management Akun & Hak Access Role (RBAC) | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |
| **TSK-315** | System Audit Log History | `src/components/AdminDashboard.tsx` | Low | `[x] Completed` |
| **TSK-316** | Mode Fullscreen Display TV Signage Masjid (Jam Digital & Jadwal Shalat) | `src/components/AdminDashboard.tsx` | High | `[x] Completed` |

---

## 👤 Priority Phase 4: Portal Interaktif Jamaah
> **Fokus**: Memberikan layanan mandiri, kalkulator zakat, pengingat donasi, audio adzan, dan tracker ibadah jamaah.

| Task ID | Nama Tugas | Komponen / File | Prioritas | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TSK-401** | Dashboard Ringkasan ZISWAF Jamaah & Kalkulator Zakat Cepat | `src/components/JamaahDashboard.tsx` | High | `[x] Completed` |
| **TSK-402** | Form Donasi Rutin (E-Wallet Tautkan / Pengingat WA Bulanan) | `src/components/JamaahDashboard.tsx` | High | `[x] Completed` |
| **TSK-403** | Monitoring Live Progress Program ZISWAF | `src/components/JamaahDashboard.tsx` | Medium | `[x] Completed` |
| **TSK-404** | Al-Qur'an Integration & Bookmark Tracker | `src/components/JamaahDashboard.tsx` | High | `[x] Completed` |
| **TSK-405** | Penjadwalan Shalat & Alarm Audio Adzan Otomatis | `src/components/JamaahDashboard.tsx` | High | `[x] Completed` |
| **TSK-406** | Histori Transaksi Donasi & Unduh Kuitansi PDF | `src/components/JamaahDashboard.tsx` | High | `[x] Completed` |
| **TSK-407** | Management Profil Jamaah (Foto, Kontak, Alamat) | `src/components/JamaahDashboard.tsx` | Medium | `[x] Completed` |

---

## 🌐 Priority Phase 5: Halaman Utama (Landing Page Publik)
> **Fokus**: Menyediakan tampilan publik yang estetis, informatif, dan responsif.

| Task ID | Nama Tugas | Komponen / File | Prioritas | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TSK-501** | Navigation Header Bar & Dark Mode Switcher | `src/components/Header.tsx` | High | `[x] Completed` |
| **TSK-502** | Hero Section Visual Showcase Masjid | `src/components/Hero.tsx` | High | `[x] Completed` |
| **TSK-503** | Widget Waktu Shalat Realtime | `src/components/JadwalShalatCard.tsx` | High | `[x] Completed` |
| **TSK-504** | Kalender & Agenda Kegiatan Rutin | `src/components/KalenderKegiatan.tsx` | Medium | `[x] Completed` |
| **TSK-505** | Katalog Program ZISWAF & Modal Payment Wakaf | `src/components/DaftarProgram.tsx`, `WakafForm.tsx` | High | `[x] Completed` |
| **TSK-506** | Progress Milestone Pembangunan Fisik | `src/components/ProgressPembangunan.tsx` | Medium | `[x] Completed` |
| **TSK-507** | Warta & Berita Informasi Masjid | `src/components/BeritaInformasi.tsx` | Medium | `[x] Completed` |
| **TSK-508** | Section Video Dakwah YouTube | `src/components/MediaAshabulYamin.tsx` | Low | `[x] Completed` |
| **TSK-509** | Profil Masjid & Struktur Organisasi DKM | `src/components/ProfilMasjid.tsx` | Medium | `[x] Completed` |
| **TSK-510** | Lokasi Google Maps & Form Contacts | `src/components/LokasiKontak.tsx`, `MediaSosial.tsx` | Medium | `[x] Completed` |
| **TSK-511** | Footer Information | `src/components/Footer.tsx` | Low | `[x] Completed` |

---

## 🧩 Priority Phase 6: Pop-Up Modals & AI Syariah
> **Fokus**: Menyediakan modal pembaca Al-Qur'an lengkap, asisten kecerdasan buatan syariah, dan gateway login.

| Task ID | Nama Tugas | Komponen / File | Prioritas | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TSK-601** | Al-Qur'an Reader Modal Complete (114 Surah, Audio, Tajwid, Tafsir) | `src/components/AlQuranDigital.tsx` | High | `[x] Completed` |
| **TSK-602** | AI Syariah Assistant Interactive Modal Chatbot | `src/components/AiAsistenModal.tsx` | High | `[x] Completed` |
| **TSK-603** | Gateway Login Multi-Role Modal | `src/components/LoginModal.tsx` | High | `[x] Completed` |
| **TSK-604** | E-Sertifikat Wakaf Modal | `src/components/ECertificateModal.tsx` | Medium | `[x] Completed` |
