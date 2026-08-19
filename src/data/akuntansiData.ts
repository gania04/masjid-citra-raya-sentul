// ============================================================
// DATA MASTER & STATE AKUNTANSI MASJID CITRA SENTUL RAYA
// ============================================================

export interface AkunCoA {
  kode: string;
  nama: string;
  jenis: 'Aktiva' | 'Kewajiban' | 'Ekuitas' | 'Pendapatan' | 'Beban';
  kelompok: string;
  saldoNormal: 'Debit' | 'Kredit';
  saldoAwal: number;
}

export interface JurnalBaris {
  kodeAkun: string;
  namaAkun: string;
  debit: number;
  kredit: number;
}

export interface JurnalEntry {
  id: string;
  tanggal: string;
  noBukti: string;
  keterangan: string;
  sumber: 'Donasi Umum' | 'Donasi Portal Jamaah' | 'Kas Masjid' | 'Anggaran';
  baris: JurnalBaris[];
  status: 'Draft' | 'Posted';
  dibuatOleh: string;
  tanggalBuat: string;
}

export interface AnggaranItem {
  id: string;
  tahun: number;
  bulan: number;
  kategori: string;
  namaKegiatan: string;
  kodeAkun: string;
  jumlahDianggarkan: number;
  jumlahRealisasi: number;
  status: 'Draft' | 'Menunggu Persetujuan Bendahara' | 'Menunggu Persetujuan Ketua' | 'Menunggu Persetujuan Direktur' | 'Disetujui' | 'Ditolak';
  dibuatOleh: string;
  catatanApproval?: string;
  riwayatApproval: {
    role: 'Bendahara' | 'Ketua DKM' | 'Direktur';
    nama: string;
    aksi: 'Disetujui' | 'Ditolak' | 'Menunggu';
    catatan?: string;
    tanggal?: string;
  }[];
}

export interface ApprovalStep {
  level: number;
  role: 'Bendahara' | 'Ketua DKM' | 'Direktur';
  nama: string;
  aksi: 'Disetujui' | 'Ditolak' | 'Menunggu';
  catatan?: string;
  tanggal?: string;
}

export interface PengajuanPengeluaran {
  id: string;
  tanggal: string;
  noPengajuan: string;
  judul: string;
  keterangan: string;
  kodeAkun: string;
  namaAkun: string;
  jumlah: number;
  dibuatOleh: string;
  rolePermohon: string;
  status: 'Menunggu Bendahara' | 'Menunggu Ketua' | 'Menunggu Direktur' | 'Disetujui' | 'Ditolak';
  stepAktif: number; // 1: Bendahara, 2: Ketua DKM, 3: Direktur, 4: Selesai
  riwayatApproval: ApprovalStep[];
}

// ─── INITIAL CHART OF ACCOUNTS (CoA - Syariah Masjid) ───
export const INITIAL_CHART_OF_ACCOUNTS: AkunCoA[] = [];

// ─── INITIAL JURNAL UMUM (Double Entry Jurnal & Jurnal Lawan) ──────
export const INITIAL_JURNAL_ENTRIES: JurnalEntry[] = [];

// ─── INITIAL RENCANA ANGGARAN (RAPB) ──────────────────────────
export const INITIAL_ANGGARAN_LIST: AnggaranItem[] = [
  {
    id: 'ANG-001',
    tahun: 2026,
    bulan: 7,
    kategori: 'Operasional',
    namaKegiatan: 'Biaya Listrik & Air Masjid',
    kodeAkun: '5-1100',
    jumlahDianggarkan: 2000000,
    jumlahRealisasi: 1200000,
    status: 'Disetujui',
    dibuatOleh: 'Staf Keuangan',
    riwayatApproval: [
      { role: 'Bendahara', nama: 'H. Ahmad (Bendahara)', aksi: 'Disetujui', tanggal: '2026-07-01', catatan: 'Sesuai RAPB Bulanan' },
      { role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin (Ketua)', aksi: 'Disetujui', tanggal: '2026-07-01', catatan: 'ACC' },
      { role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio (Direktur)', aksi: 'Disetujui', tanggal: '2026-07-02', catatan: 'Bismillah disetujui' },
    ],
  },
  {
    id: 'ANG-002',
    tahun: 2026,
    bulan: 7,
    kategori: 'Operasional',
    namaKegiatan: 'Honorarium Marbot & Tim Kebersihan',
    kodeAkun: '5-1300',
    jumlahDianggarkan: 6000000,
    jumlahRealisasi: 6000000,
    status: 'Disetujui',
    dibuatOleh: 'Staf Keuangan',
    riwayatApproval: [
      { role: 'Bendahara', nama: 'H. Ahmad (Bendahara)', aksi: 'Disetujui', tanggal: '2026-07-01' },
      { role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin (Ketua)', aksi: 'Disetujui', tanggal: '2026-07-01' },
      { role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio (Direktur)', aksi: 'Disetujui', tanggal: '2026-07-02' },
    ],
  },
  {
    id: 'ANG-003',
    tahun: 2026,
    bulan: 7,
    kategori: 'Pembangunan',
    namaKegiatan: 'Pengecoran Pilar Utama Batch 3',
    kodeAkun: '5-1400',
    jumlahDianggarkan: 150000000,
    jumlahRealisasi: 75000000,
    status: 'Menunggu Persetujuan Direktur',
    dibuatOleh: 'Panitia Pembangunan',
    riwayatApproval: [
      { role: 'Bendahara', nama: 'H. Ahmad (Bendahara)', aksi: 'Disetujui', tanggal: '2026-07-20', catatan: 'Dana di Rekening Wakaf mencukupi' },
      { role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin (Ketua)', aksi: 'Disetujui', tanggal: '2026-07-22', catatan: 'Sesuai progres konstruksi' },
      { role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio (Direktur)', aksi: 'Menunggu' },
    ],
  },
  {
    id: 'ANG-004',
    tahun: 2026,
    bulan: 8,
    kategori: 'Program Dakwah',
    namaKegiatan: 'Kajian Akbar Kemerdekaan & Dzikir Nasional',
    kodeAkun: '5-1500',
    jumlahDianggarkan: 25000000,
    jumlahRealisasi: 0,
    status: 'Menunggu Persetujuan Bendahara',
    dibuatOleh: 'Tim Dakwah',
    riwayatApproval: [
      { role: 'Bendahara', nama: 'H. Ahmad (Bendahara)', aksi: 'Menunggu' },
      { role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin (Ketua)', aksi: 'Menunggu' },
      { role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio (Direktur)', aksi: 'Menunggu' },
    ],
  },
];

// ─── INITIAL PENGAJUAN PENGELUARAN (APPROVAL WORKFLOW S/D DIREKTUR) ──
export const INITIAL_PENGAJUAN_LIST: PengajuanPengeluaran[] = [
  {
    id: 'PG-001',
    tanggal: '2026-07-30',
    noPengajuan: 'PGJ-2026-07-001',
    judul: 'Pembelian Karpet Shalat Musholla Sementara',
    keterangan: 'Pengadaan karpet shalat tebal 5 roll untuk area musholla selama proses renovasi masjid',
    kodeAkun: '5-1200',
    namaAkun: 'Beban Kebersihan & Perawatan',
    jumlah: 3500000,
    dibuatOleh: 'Marbot Masjid',
    rolePermohon: 'Staf Operasional',
    status: 'Menunggu Bendahara',
    stepAktif: 1,
    riwayatApproval: [
      { level: 1, role: 'Bendahara', nama: 'H. Ahmad', aksi: 'Menunggu' },
      { level: 2, role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin', aksi: 'Menunggu' },
      { level: 3, role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio', aksi: 'Menunggu' },
    ],
  },
  {
    id: 'PG-002',
    tanggal: '2026-07-28',
    noPengajuan: 'PGJ-2026-07-002',
    judul: 'Pengadaan Sound System Portable & Mikrofon Wireless',
    keterangan: 'Mikrofon wireless dan speaker portable untuk kegiatan pengajian rutin & majelis taklim ibu-ibu',
    kodeAkun: '5-1500',
    namaAkun: 'Beban Kegiatan & Dakwah',
    jumlah: 12000000,
    dibuatOleh: 'Tim Dakwah',
    rolePermohon: 'Koordinator Dakwah',
    status: 'Menunggu Ketua',
    stepAktif: 2,
    riwayatApproval: [
      { level: 1, role: 'Bendahara', nama: 'H. Ahmad', aksi: 'Disetujui', catatan: 'Dana operasional dakwah memadai', tanggal: '2026-07-29' },
      { level: 2, role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin', aksi: 'Menunggu' },
      { level: 3, role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio', aksi: 'Menunggu' },
    ],
  },
  {
    id: 'PG-003',
    tanggal: '2026-07-25',
    noPengajuan: 'PGJ-2026-07-003',
    judul: 'Pembayaran Termin-3 Kontraktor Pembangunan Pilar Utama',
    keterangan: 'Pembayaran tahap 3 untuk pengerjaan pilar utama masjid sesuai kontrak kerja sama',
    kodeAkun: '5-1400',
    namaAkun: 'Beban Pembangunan & Konstruksi',
    jumlah: 75000000,
    dibuatOleh: 'Panitia Pembangunan',
    rolePermohon: 'Ketua Panitia Pembangunan',
    status: 'Disetujui',
    stepAktif: 4,
    riwayatApproval: [
      { level: 1, role: 'Bendahara', nama: 'H. Ahmad', aksi: 'Disetujui', catatan: 'Sesuai RAB pembangunan', tanggal: '2026-07-26' },
      { level: 2, role: 'Ketua DKM', nama: 'Ustadz H. M. Zainuddin', aksi: 'Disetujui', catatan: 'Kualitas pengecoran memuaskan', tanggal: '2026-07-26' },
      { level: 3, role: 'Direktur', nama: 'Prof. Dr. M. Syafii Antonio', aksi: 'Disetujui', catatan: 'Bismillah, lanjutkan pencairan', tanggal: '2026-07-27' },
    ],
  },
];
