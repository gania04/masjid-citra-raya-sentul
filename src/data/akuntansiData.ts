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

// ─── INITIAL CHART OF ACCOUNTS (CoA) ──────────────────────────
export const INITIAL_CHART_OF_ACCOUNTS: AkunCoA[] = [
  // AKTIVA (1-xxxx)
  { kode: '1-1100', nama: 'Kas Tunai Masjid', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 15750000 },
  { kode: '1-1200', nama: 'Bank BSI - Rekening Operasional', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 42500000 },
  { kode: '1-1300', nama: 'Bank BSI - Rekening Donasi/Wakaf', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 4850000000 },
  { kode: '1-1400', nama: 'Piutang Donasi Portal Jamaah', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 2500000 },
  { kode: '1-2100', nama: 'Tanah Wakaf Masjid', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 5000000000 },
  { kode: '1-2200', nama: 'Bangunan Masjid (Dalam Konstruksi)', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 3200000000 },
  { kode: '1-2300', nama: 'Peralatan & Inventaris Masjid', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 185000000 },

  // KEWAJIBAN (2-xxxx)
  { kode: '2-1100', nama: 'Hutang Usaha / Kontraktor', jenis: 'Kewajiban', kelompok: 'Kewajiban Lancar', saldoNormal: 'Kredit', saldoAwal: 250000000 },
  { kode: '2-1200', nama: 'Titipan Zakat Belum Disalurkan', jenis: 'Kewajiban', kelompok: 'Kewajiban Lancar', saldoNormal: 'Kredit', saldoAwal: 15000000 },

  // EKUITAS / SALDO DANA (3-xxxx)
  { kode: '3-1100', nama: 'Dana Wakaf Pembangunan', jenis: 'Ekuitas', kelompok: 'Dana Terikat', saldoNormal: 'Kredit', saldoAwal: 4850000000 },
  { kode: '3-1200', nama: 'Dana Operasional Masjid', jenis: 'Ekuitas', kelompok: 'Dana Tidak Terikat', saldoNormal: 'Kredit', saldoAwal: 58250000 },
  { kode: '3-1300', nama: 'Dana Sosial & Zakat', jenis: 'Ekuitas', kelompok: 'Dana Terikat', saldoNormal: 'Kredit', saldoAwal: 90000000 },

  // PENDAPATAN (4-xxxx)
  { kode: '4-1100', nama: 'Pendapatan Wakaf Pembangunan', jenis: 'Pendapatan', kelompok: 'Pendapatan Donasi', saldoNormal: 'Kredit', saldoAwal: 4850000000 },
  { kode: '4-1200', nama: 'Pendapatan Infaq Kotak Amal', jenis: 'Pendapatan', kelompok: 'Pendapatan Donasi', saldoNormal: 'Kredit', saldoAwal: 12500000 },
  { kode: '4-1300', nama: 'Pendapatan Donasi Portal Jamaah', jenis: 'Pendapatan', kelompok: 'Pendapatan Donasi', saldoNormal: 'Kredit', saldoAwal: 8750000 },
  { kode: '4-1400', nama: 'Pendapatan Zakat Mal & Fitrah', jenis: 'Pendapatan', kelompok: 'Pendapatan Donasi', saldoNormal: 'Kredit', saldoAwal: 90000000 },
  { kode: '4-1500', nama: 'Pendapatan Infaq Jamaah Umum', jenis: 'Pendapatan', kelompok: 'Pendapatan Donasi', saldoNormal: 'Kredit', saldoAwal: 5200000 },

  // BEBAN (5-xxxx)
  { kode: '5-1100', nama: 'Beban Listrik & Air', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 3600000 },
  { kode: '5-1200', nama: 'Beban Kebersihan & Perawatan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 1800000 },
  { kode: '5-1300', nama: 'Beban Honorarium Marbot/Staf', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 6000000 },
  { kode: '5-1400', nama: 'Beban Pembangunan & Konstruksi', jenis: 'Beban', kelompok: 'Beban Pembangunan', saldoNormal: 'Debit', saldoAwal: 3200000000 },
  { kode: '5-1500', nama: 'Beban Kegiatan & Dakwah', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 4500000 },
  { kode: '5-1600', nama: 'Beban Penyaluran Zakat', jenis: 'Beban', kelompok: 'Beban Sosial', saldoNormal: 'Debit', saldoAwal: 75000000 },
  { kode: '5-1700', nama: 'Beban ATK & Administrasi', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 750000 },
];

// ─── INITIAL JURNAL UMUM (Double Entry Jurnal & Jurnal Lawan) ──────
export const INITIAL_JURNAL_ENTRIES: JurnalEntry[] = [
  {
    id: 'JU-001',
    tanggal: '2026-07-29',
    noBukti: 'BKM-2026-07-001',
    keterangan: 'Penerimaan Infaq Kotak Amal Jumat (Donasi Umum)',
    sumber: 'Kas Masjid',
    baris: [
      { kodeAkun: '1-1100', namaAkun: 'Kas Tunai Masjid (Debit)', debit: 2500000, kredit: 0 },
      { kodeAkun: '4-1200', namaAkun: 'Pendapatan Infaq Kotak Amal (Kredit - Jurnal Lawan)', debit: 0, kredit: 2500000 },
    ],
    status: 'Posted',
    dibuatOleh: 'Staf Keuangan',
    tanggalBuat: '2026-07-29',
  },
  {
    id: 'JU-002',
    tanggal: '2026-07-28',
    noBukti: 'BKK-2026-07-001',
    keterangan: 'Pembayaran Rekening Listrik & Air Masjid Operasional',
    sumber: 'Kas Masjid',
    baris: [
      { kodeAkun: '5-1100', namaAkun: 'Beban Listrik & Air (Debit)', debit: 1200000, kredit: 0 },
      { kodeAkun: '1-1100', namaAkun: 'Kas Tunai Masjid (Kredit - Jurnal Lawan)', debit: 0, kredit: 1200000 },
    ],
    status: 'Posted',
    dibuatOleh: 'H. Ahmad (Bendahara)',
    tanggalBuat: '2026-07-28',
  },
  {
    id: 'JU-003',
    tanggal: '2026-07-28',
    noBukti: 'BWF-2026-07-001',
    keterangan: 'Penerimaan Wakaf Pembangunan via Portal Jamaah - H. Bambang Sugianto',
    sumber: 'Donasi Portal Jamaah',
    baris: [
      { kodeAkun: '1-1300', namaAkun: 'Bank BSI - Rekening Donasi/Wakaf (Debit)', debit: 50000000, kredit: 0 },
      { kodeAkun: '4-1100', namaAkun: 'Pendapatan Wakaf Pembangunan (Kredit - Jurnal Lawan)', debit: 0, kredit: 50000000 },
    ],
    status: 'Posted',
    dibuatOleh: 'Sistem Portal Jamaah',
    tanggalBuat: '2026-07-28',
  },
  {
    id: 'JU-004',
    tanggal: '2026-07-27',
    noBukti: 'BWF-2026-07-002',
    keterangan: 'Penerimaan Donasi Hamba Allah via Transfer BSI (Donasi Umum)',
    sumber: 'Donasi Umum',
    baris: [
      { kodeAkun: '1-1300', namaAkun: 'Bank BSI - Rekening Donasi/Wakaf (Debit)', debit: 500000, kredit: 0 },
      { kodeAkun: '4-1500', namaAkun: 'Pendapatan Infaq Jamaah Umum (Kredit - Jurnal Lawan)', debit: 0, kredit: 500000 },
    ],
    status: 'Posted',
    dibuatOleh: 'Staf Keuangan',
    tanggalBuat: '2026-07-27',
  },
  {
    id: 'JU-005',
    tanggal: '2026-07-25',
    noBukti: 'BKK-2026-07-002',
    keterangan: 'Biaya Kebersihan dan Perawatan Operasional Mingguan',
    sumber: 'Kas Masjid',
    baris: [
      { kodeAkun: '5-1200', namaAkun: 'Beban Kebersihan & Perawatan (Debit)', debit: 300000, kredit: 0 },
      { kodeAkun: '1-1100', namaAkun: 'Kas Tunai Masjid (Kredit - Jurnal Lawan)', debit: 0, kredit: 300000 },
    ],
    status: 'Posted',
    dibuatOleh: 'H. Ahmad (Bendahara)',
    tanggalBuat: '2026-07-25',
  },
  {
    id: 'JU-006',
    tanggal: '2026-07-24',
    noBukti: 'BWF-2026-07-003',
    keterangan: 'Penerimaan Donasi Zakat Mal via Portal Jamaah - Hj. Ratna Dewi',
    sumber: 'Donasi Portal Jamaah',
    baris: [
      { kodeAkun: '1-1300', namaAkun: 'Bank BSI - Rekening Donasi/Wakaf (Debit)', debit: 5000000, kredit: 0 },
      { kodeAkun: '4-1400', namaAkun: 'Pendapatan Zakat Mal & Fitrah (Kredit - Jurnal Lawan)', debit: 0, kredit: 5000000 },
    ],
    status: 'Posted',
    dibuatOleh: 'Sistem Portal Jamaah',
    tanggalBuat: '2026-07-24',
  },
];

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
