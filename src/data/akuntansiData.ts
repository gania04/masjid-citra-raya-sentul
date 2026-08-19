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

// ─── INITIAL CHART OF ACCOUNTS (CoA - Spreadsheet Masjid) ───
export const INITIAL_CHART_OF_ACCOUNTS: AkunCoA[] = [
  // ASET (1000 - 1293)
  { kode: '1000', nama: 'ASET', jenis: 'Aktiva', kelompok: 'Header Aset', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1101', nama: 'Kas Tunai', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1102', nama: 'Kas Kecil', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1103', nama: 'Kas Bank', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1104', nama: 'Piutang', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1105', nama: 'Persediaan Konsumsi', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1106', nama: 'Perlengkapan Masjid', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1201', nama: 'Tanah', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1202', nama: 'Bangunan Masjid', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1203', nama: 'Peralatan Sound System', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1204', nama: 'Inventaris Masjid', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1205', nama: 'Kendaraan Operasional', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1291', nama: 'Akumulasi Penyusutan Bangunan', jenis: 'Aktiva', kelompok: 'Kontra Aset', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '1292', nama: 'Akumulasi Penyusutan Peralatan', jenis: 'Aktiva', kelompok: 'Kontra Aset', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '1293', nama: 'Akumulasi Penyusutan Inventaris', jenis: 'Aktiva', kelompok: 'Kontra Aset', saldoNormal: 'Kredit', saldoAwal: 0 },

  // LIABILITAS (2000 - 2201)
  { kode: '2000', nama: 'LIABILITAS', jenis: 'Kewajiban', kelompok: 'Header Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2101', nama: 'Utang Operasional', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2102', nama: 'Utang Listrik & Air', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2103', nama: 'Utang Honor', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2201', nama: 'Utang Jangka Panjang', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0 },

  // ASET NETO / EKUITAS (3000 - 3102)
  { kode: '3000', nama: 'ASET NETO', jenis: 'Ekuitas', kelompok: 'Header Ekuitas', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '3101', nama: 'Aset Neto Tanpa Pembatasan', jenis: 'Ekuitas', kelompok: 'Ekuitas', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '3102', nama: 'Aset Neto Dengan Pembatasan', jenis: 'Ekuitas', kelompok: 'Ekuitas', saldoNormal: 'Kredit', saldoAwal: 0 },

  // PENERIMAAN / PENDAPATAN (4000 - 4199)
  { kode: '4000', nama: 'PENERIMAAN', jenis: 'Pendapatan', kelompok: 'Header Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4101', nama: 'Infak Jumat', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4102', nama: 'Infak Harian', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4103', nama: 'Sedekah Jamaah', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4104', nama: 'Donasi Pembangunan', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4105', nama: 'Wakaf Uang', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4106', nama: 'Hibah', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4107', nama: 'Pendapatan Sewa Fasilitas', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4108', nama: 'Pendapatan BUMM/Koperasi Masjid', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4199', nama: 'Pendapatan Lain-lain', jenis: 'Pendapatan', kelompok: 'Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0 },

  // BEBAN OPERASIONAL (5000 - 5114)
  { kode: '5000', nama: 'BEBAN OPERASIONAL', jenis: 'Beban', kelompok: 'Header Beban', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5101', nama: 'Honor Imam', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5102', nama: 'Honor Muadzin', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5103', nama: 'Honor Marbot', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5104', nama: 'Listrik', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5105', nama: 'Air', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5106', nama: 'Internet', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5107', nama: 'ATK', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5108', nama: 'Kebersihan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5109', nama: 'Keamanan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5110', nama: 'Konsumsi', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5111', nama: 'Perawatan Bangunan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5112', nama: 'Perawatan Sound System', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5113', nama: 'Penyusutan Bangunan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5114', nama: 'Penyusutan Inventaris', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },

  // BEBAN PROGRAM (5200 - 5207)
  { kode: '5200', nama: 'BEBAN PROGRAM', jenis: 'Beban', kelompok: 'Header Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5201', nama: 'Kegiatan Ramadhan', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5202', nama: 'PHBI', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5203', nama: 'Santunan Yatim', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5204', nama: 'Tebar Sembako', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5205', nama: 'Pendidikan/TPA', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5206', nama: 'Kajian Rutin', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5207', nama: 'Pelatihan DKM', jenis: 'Beban', kelompok: 'Beban Program', saldoNormal: 'Debit', saldoAwal: 0 },

  // BEBAN SOSIAL (5300 - 5304)
  { kode: '5300', nama: 'BEBAN SOSIAL', jenis: 'Beban', kelompok: 'Header Beban Sosial', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5301', nama: 'Penyaluran Zakat', jenis: 'Beban', kelompok: 'Beban Sosial', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5302', nama: 'Penyaluran Infak Sosial', jenis: 'Beban', kelompok: 'Beban Sosial', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5303', nama: 'Bantuan Bencana', jenis: 'Beban', kelompok: 'Beban Sosial', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5304', nama: 'Bantuan Fakir Miskin', jenis: 'Beban', kelompok: 'Beban Sosial', saldoNormal: 'Debit', saldoAwal: 0 },

  // BEBAN LAIN-LAIN (5900 - 5903)
  { kode: '5900', nama: 'BEBAN LAIN-LAIN', jenis: 'Beban', kelompok: 'Header Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5901', nama: 'Beban Administrasi Bank', jenis: 'Beban', kelompok: 'Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5902', nama: 'Beban Pajak', jenis: 'Beban', kelompok: 'Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5903', nama: 'Beban Lain-lain', jenis: 'Beban', kelompok: 'Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0 },
];

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
