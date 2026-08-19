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

// ─── INITIAL CHART OF ACCOUNTS (CoA - PSAK 109 Syariah Masjid) ───
export const INITIAL_CHART_OF_ACCOUNTS: AkunCoA[] = [
  // 1. AKTIVA / ASET (1-xxxx)
  { kode: '1-1100', nama: 'Kas Tunai Masjid', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-1200', nama: 'Bank BSI - Rekening Operasional (No. 7001234567)', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-1300', nama: 'Bank BSI - Rekening Donasi & Wakaf (No. 7009876543)', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-1400', nama: 'Piutang Donasi & Infaq Portal Jamaah', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-1500', nama: 'Uang Muka / Uang Muka Operasional Panitia', jenis: 'Aktiva', kelompok: 'Aktiva Lancar', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-2100', nama: 'Tanah Wakaf Masjid & Fasum', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-2200', nama: 'Bangunan Utama Masjid & Gedung Serbaguna', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-2300', nama: 'Peralatan, Sound System & Inventaris Masjid', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-2400', nama: 'Kendaraan Operasional / Ambulance Masjid', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '1-2500', nama: 'Akumulasi Penyusutan Aktiva Tetap', jenis: 'Aktiva', kelompok: 'Aktiva Tetap', saldoNormal: 'Kredit', saldoAwal: 0 },

  // 2. KEWAJIBAN / LIABILITAS (2-xxxx)
  { kode: '2-1100', nama: 'Hutang Usaha / Vendor Kontraktor Pembangunan', jenis: 'Kewajiban', kelompok: 'Kewajiban Lancar', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2-1200', nama: 'Titipan Zakat Fitrah Belum Disalurkan', jenis: 'Kewajiban', kelompok: 'Kewajiban ZIS', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2-1300', nama: 'Titipan Zakat Mal Belum Disalurkan', jenis: 'Kewajiban', kelompok: 'Kewajiban ZIS', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '2-1400', nama: 'Titipan Qurban Belum Tersalurkan', jenis: 'Kewajiban', kelompok: 'Kewajiban Program', saldoNormal: 'Kredit', saldoAwal: 0 },

  // 3. EKUITAS / SALDO DANA (3-xxxx)
  { kode: '3-1100', nama: 'Dana Terikat - Wakaf Pembangunan & Renovasi', jenis: 'Ekuitas', kelompok: 'Dana Terikat', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '3-1200', nama: 'Dana Tidak Terikat - Operasional Masjid', jenis: 'Ekuitas', kelompok: 'Dana Tidak Terikat', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '3-1300', nama: 'Dana Terikat - Zakat, Infak, Sedekah & Sosial', jenis: 'Ekuitas', kelompok: 'Dana Terikat', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '3-1400', nama: 'Dana Amil Zakat', jenis: 'Ekuitas', kelompok: 'Dana Amil', saldoNormal: 'Kredit', saldoAwal: 0 },

  // 4. PENDAPATAN (4-xxxx)
  { kode: '4-1100', nama: 'Pendapatan Wakaf Pembangunan & Infrastruktur', jenis: 'Pendapatan', kelompok: 'Pendapatan Wakaf', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1200', nama: 'Pendapatan Infaq Kotak Amal Jumat & Harian', jenis: 'Pendapatan', kelompok: 'Pendapatan Infaq', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1300', nama: 'Pendapatan Donasi Portal Jamaah Online (QRIS/Transfer)', jenis: 'Pendapatan', kelompok: 'Pendapatan Digital', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1400', nama: 'Pendapatan Zakat Mal (Harta & Penghasilan)', jenis: 'Pendapatan', kelompok: 'Pendapatan Zakat', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1500', nama: 'Pendapatan Zakat Fitrah', jenis: 'Pendapatan', kelompok: 'Pendapatan Zakat', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1600', nama: 'Pendapatan Sedekah Subuh & Khusus', jenis: 'Pendapatan', kelompok: 'Pendapatan Sedekah', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1700', nama: 'Pendapatan Infaq Perparkiran & Kantin Masjid', jenis: 'Pendapatan', kelompok: 'Pendapatan Usaha Masjid', saldoNormal: 'Kredit', saldoAwal: 0 },
  { kode: '4-1800', nama: 'Pendapatan Bagi Hasil Bank Syariah', jenis: 'Pendapatan', kelompok: 'Pendapatan Lain-lain', saldoNormal: 'Kredit', saldoAwal: 0 },

  // 5. BEBAN / PENGELUARAN (5-xxxx)
  { kode: '5-1100', nama: 'Beban Listrik, Air PLN & PDAM', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1200', nama: 'Beban Kebersihan, Sanitisasi & Alat Kebersihan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1300', nama: 'Beban Honorarium Imam, Muadzin & Marbot', jenis: 'Beban', kelompok: 'Beban SDM', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1400', nama: 'Beban Konstruksi, Pembangunan & Material', jenis: 'Beban', kelompok: 'Beban Pembangunan', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1500', nama: 'Beban Kajian, Dakwah, penceramah & Hari Besar Islam', jenis: 'Beban', kelompok: 'Beban Dakwah', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1600', nama: 'Beban Penyaluran Zakat & Santunan Mustahik', jenis: 'Beban', kelompok: 'Beban Sosial ZIS', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1700', nama: 'Beban Pengadaan ATK, Cetak & Administrasi DKM', jenis: 'Beban', kelompok: 'Beban Administrasi', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1800', nama: 'Beban Maintenance Sound System, AC & Genset', jenis: 'Beban', kelompok: 'Beban Pemeliharaan', saldoNormal: 'Debit', saldoAwal: 0 },
  { kode: '5-1900', nama: 'Beban Langganan Internet & Server Portal Digital', jenis: 'Beban', kelompok: 'Beban Teknologi', saldoNormal: 'Debit', saldoAwal: 0 },
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
