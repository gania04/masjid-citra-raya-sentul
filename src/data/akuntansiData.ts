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
  status?: 'Aktif' | 'Non-Aktif';
  kategoriDana?: 'Zakat' | 'Infaq' | 'Wakaf' | 'Sodaqoh' | 'Operasional';
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
  { kode: '1000', nama: 'ASET', jenis: 'Aktiva', kelompok: 'Header Aset', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1101', nama: 'Kas Tunai Operasional', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1102', nama: 'Kas Kecil', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1103', nama: 'Kas Bank BSI Operasional', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1104', nama: 'Kas Bank Zakat (BSI Zakat)', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Zakat' },
  { kode: '1105', nama: 'Kas Bank Wakaf (BSI Wakaf)', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '1106', nama: 'Kas Bank Infak & Sodaqoh', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '1107', nama: 'Piutang', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1108', nama: 'Persediaan Konsumsi', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1109', nama: 'Perlengkapan Masjid', jenis: 'Aktiva', kelompok: 'Aset Lancar', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1201', nama: 'Tanah Wakaf', jenis: 'Aktiva', kelompok: 'Aset Tetap Wakaf', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '1202', nama: 'Bangunan Masjid Wakaf', jenis: 'Aktiva', kelompok: 'Aset Tetap Wakaf', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '1203', nama: 'Peralatan Sound System', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1204', nama: 'Inventaris Masjid', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1205', nama: 'Kendaraan Operasional', jenis: 'Aktiva', kelompok: 'Aset Tetap', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1291', nama: 'Akumulasi Penyusutan Bangunan', jenis: 'Aktiva', kelompok: 'Kontra Aset', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '1292', nama: 'Akumulasi Penyusutan Peralatan', jenis: 'Aktiva', kelompok: 'Kontra Aset', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '1293', nama: 'Akumulasi Penyusutan Inventaris', jenis: 'Aktiva', kelompok: 'Kontra Aset', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },

  // LIABILITAS (2000 - 2201)
  { kode: '2000', nama: 'LIABILITAS', jenis: 'Kewajiban', kelompok: 'Header Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '2101', nama: 'Utang Operasional', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '2102', nama: 'Utang Listrik & Air', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '2103', nama: 'Kewajiban Penyaluran Zakat (Mustahik)', jenis: 'Kewajiban', kelompok: 'Liabilitas Zakat', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Zakat' },
  { kode: '2201', nama: 'Utang Jangka Panjang', jenis: 'Kewajiban', kelompok: 'Liabilitas', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },

  // SALDO DANA & ASET NETO (3000 - 3105)
  { kode: '3000', nama: 'SALDO DANA & ASET NETO', jenis: 'Ekuitas', kelompok: 'Header Ekuitas', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '3101', nama: 'Saldo Dana Infak', jenis: 'Ekuitas', kelompok: 'Saldo Dana Infak', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '3102', nama: 'Saldo Dana Wakaf (Aset Terikat)', jenis: 'Ekuitas', kelompok: 'Saldo Dana Wakaf', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '3103', nama: 'Saldo Dana Zakat', jenis: 'Ekuitas', kelompok: 'Saldo Dana Zakat', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Zakat' },
  { kode: '3104', nama: 'Saldo Dana Sodaqoh', jenis: 'Ekuitas', kelompok: 'Saldo Dana Sodaqoh', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Sodaqoh' },
  { kode: '3105', nama: 'Saldo Dana Amil / Operasional', jenis: 'Ekuitas', kelompok: 'Saldo Dana Operasional', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },

  // PENERIMAAN / PENDAPATAN (4000 - 4199)
  { kode: '4000', nama: 'PENERIMAAN DANA ZISWAF & OPERASIONAL', jenis: 'Pendapatan', kelompok: 'Header Pendapatan', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '4101', nama: 'Infak Jumat', jenis: 'Pendapatan', kelompok: 'Penerimaan Infak', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '4102', nama: 'Infak Harian', jenis: 'Pendapatan', kelompok: 'Penerimaan Infak', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '4103', nama: 'Sedekah Jamaah', jenis: 'Pendapatan', kelompok: 'Penerimaan Sodaqoh', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Sodaqoh' },
  { kode: '4104', nama: 'Donasi Pembangunan Wakaf', jenis: 'Pendapatan', kelompok: 'Penerimaan Wakaf', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '4105', nama: 'Wakaf Uang', jenis: 'Pendapatan', kelompok: 'Penerimaan Wakaf', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '4106', nama: 'Penerimaan Zakat Maal & Fitrah', jenis: 'Pendapatan', kelompok: 'Penerimaan Zakat', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Zakat' },
  { kode: '4107', nama: 'Hibah Operasional', jenis: 'Pendapatan', kelompok: 'Penerimaan Operasional', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '4108', nama: 'Pendapatan Sewa Fasilitas', jenis: 'Pendapatan', kelompok: 'Penerimaan Operasional', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '4109', nama: 'Pendapatan BUMM/Koperasi Masjid', jenis: 'Pendapatan', kelompok: 'Penerimaan Operasional', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '4199', nama: 'Pendapatan Lain-lain', jenis: 'Pendapatan', kelompok: 'Penerimaan Operasional', saldoNormal: 'Kredit', saldoAwal: 0, kategoriDana: 'Operasional' },

  // BEBAN OPERASIONAL (5000 - 5114)
  { kode: '5000', nama: 'BEBAN OPERASIONAL', jenis: 'Beban', kelompok: 'Header Beban', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5101', nama: 'Honor Imam', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5102', nama: 'Honor Muadzin', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5103', nama: 'Honor Marbot', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5104', nama: 'Listrik', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5105', nama: 'Air', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5106', nama: 'Internet', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5107', nama: 'ATK', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5108', nama: 'Kebersihan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5109', nama: 'Keamanan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5110', nama: 'Konsumsi', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5111', nama: 'Perawatan Bangunan Wakaf', jenis: 'Beban', kelompok: 'Beban Pemeliharaan Wakaf', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '5112', nama: 'Perawatan Sound System', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5113', nama: 'Penyusutan Bangunan', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Wakaf' },
  { kode: '5114', nama: 'Penyusutan Inventaris', jenis: 'Beban', kelompok: 'Beban Operasional', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },

  // BEBAN PROGRAM (5200 - 5207)
  { kode: '5200', nama: 'BEBAN PROGRAM DAKWAH & SOSIAL', jenis: 'Beban', kelompok: 'Header Beban Program', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5201', nama: 'Kegiatan Ramadhan', jenis: 'Beban', kelompok: 'Beban Program Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5202', nama: 'PHBI', jenis: 'Beban', kelompok: 'Beban Program Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5203', nama: 'Santunan Yatim', jenis: 'Beban', kelompok: 'Beban Program Sodaqoh', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Sodaqoh' },
  { kode: '5204', nama: 'Tebar Sembako', jenis: 'Beban', kelompok: 'Beban Program Sodaqoh', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Sodaqoh' },
  { kode: '5205', nama: 'Pendidikan/TPA', jenis: 'Beban', kelompok: 'Beban Program Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5206', nama: 'Kajian Rutin', jenis: 'Beban', kelompok: 'Beban Program Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5207', nama: 'Pelatihan DKM', jenis: 'Beban', kelompok: 'Beban Program Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },

  // BEBAN PENYALURAN ZISWAF (5300 - 5304)
  { kode: '5300', nama: 'BEBAN PENYALURAN ZISWAF', jenis: 'Beban', kelompok: 'Header Beban Sosial', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Zakat' },
  { kode: '5301', nama: 'Penyaluran Zakat Maal & Fitrah', jenis: 'Beban', kelompok: 'Penyaluran Zakat', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Zakat' },
  { kode: '5302', nama: 'Penyaluran Infak Sosial', jenis: 'Beban', kelompok: 'Penyaluran Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5303', nama: 'Bantuan Bencana Alam', jenis: 'Beban', kelompok: 'Penyaluran Infak', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Infaq' },
  { kode: '5304', nama: 'Bantuan Fakir Miskin (Sodaqoh)', jenis: 'Beban', kelompok: 'Penyaluran Sodaqoh', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Sodaqoh' },

  // BEBAN LAIN-LAIN (5900 - 5903)
  { kode: '5900', nama: 'BEBAN LAIN-LAIN', jenis: 'Beban', kelompok: 'Header Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5901', nama: 'Beban Administrasi Bank', jenis: 'Beban', kelompok: 'Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5902', nama: 'Beban Pajak', jenis: 'Beban', kelompok: 'Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
  { kode: '5903', nama: 'Beban Lain-lain', jenis: 'Beban', kelompok: 'Beban Lain-lain', saldoNormal: 'Debit', saldoAwal: 0, kategoriDana: 'Operasional' },
];

// ─── INITIAL JURNAL UMUM (Double Entry Jurnal & Jurnal Lawan) ──────
export const INITIAL_JURNAL_ENTRIES: JurnalEntry[] = [
  {
    id: 'JRN-2026-001',
    tanggal: '2026-07-05',
    noBukti: 'BKM-ZKT-001',
    keterangan: 'Penerimaan Zakat Maal & Fitrah Jamaah via Rekening BSI Zakat',
    sumber: 'Donasi Portal Jamaah',
    status: 'Posted',
    dibuatOleh: 'Staf Amil Zakat',
    tanggalBuat: '2026-07-05',
    baris: [
      { kodeAkun: '1104', namaAkun: 'Kas Bank Zakat (BSI Zakat)', debit: 45000000, kredit: 0 },
      { kodeAkun: '4106', namaAkun: 'Penerimaan Zakat Maal & Fitrah', debit: 0, kredit: 45000000 },
    ],
  },
  {
    id: 'JRN-2026-002',
    tanggal: '2026-07-10',
    noBukti: 'BKK-ZKT-001',
    keterangan: 'Penyaluran Zakat Tahap 1 kepada 80 Mustahik & Fakir Miskin Sentul',
    sumber: 'Kas Masjid',
    status: 'Posted',
    dibuatOleh: 'Bendahara Zakat',
    tanggalBuat: '2026-07-10',
    baris: [
      { kodeAkun: '5301', namaAkun: 'Penyaluran Zakat Maal & Fitrah', debit: 15000000, kredit: 0 },
      { kodeAkun: '1104', namaAkun: 'Kas Bank Zakat (BSI Zakat)', debit: 0, kredit: 15000000 },
    ],
  },
  {
    id: 'JRN-2026-003',
    tanggal: '2026-07-12',
    noBukti: 'BKM-INF-001',
    keterangan: 'Penerimaan Kotak Infak Jumat & Infak Harian Masjid',
    sumber: 'Donasi Umum',
    status: 'Posted',
    dibuatOleh: 'Staf Keuangan',
    tanggalBuat: '2026-07-12',
    baris: [
      { kodeAkun: '1106', namaAkun: 'Kas Bank Infak & Sodaqoh', debit: 38500000, kredit: 0 },
      { kodeAkun: '4101', namaAkun: 'Infak Jumat', debit: 0, kredit: 38500000 },
    ],
  },
  {
    id: 'JRN-2026-004',
    tanggal: '2026-07-15',
    noBukti: 'BKK-INF-001',
    keterangan: 'Penyaluran Infak Sosial Bantuan Operasional Kesehatan Warga',
    sumber: 'Kas Masjid',
    status: 'Posted',
    dibuatOleh: 'Staf Sosial',
    tanggalBuat: '2026-07-15',
    baris: [
      { kodeAkun: '5302', namaAkun: 'Penyaluran Infak Sosial', debit: 12000000, kredit: 0 },
      { kodeAkun: '1106', namaAkun: 'Kas Bank Infak & Sodaqoh', debit: 0, kredit: 12000000 },
    ],
  },
  {
    id: 'JRN-2026-005',
    tanggal: '2026-07-18',
    noBukti: 'BKM-WKF-001',
    keterangan: 'Penerimaan Wakaf Uang Pembangunan Menara & Perluasan Ruang Utama',
    sumber: 'Donasi Portal Jamaah',
    status: 'Posted',
    dibuatOleh: 'Panitia Pembangunan',
    tanggalBuat: '2026-07-18',
    baris: [
      { kodeAkun: '1105', namaAkun: 'Kas Bank Wakaf (BSI Wakaf)', debit: 150000000, kredit: 0 },
      { kodeAkun: '4105', namaAkun: 'Wakaf Uang', debit: 0, kredit: 150000000 },
    ],
  },
  {
    id: 'JRN-2026-006',
    tanggal: '2026-07-20',
    noBukti: 'BKM-SDQ-001',
    keterangan: 'Penerimaan Sedekah Jamaah untuk Program Yatim & Sembako',
    sumber: 'Donasi Portal Jamaah',
    status: 'Posted',
    dibuatOleh: 'Tim Social Care',
    tanggalBuat: '2026-07-20',
    baris: [
      { kodeAkun: '1106', namaAkun: 'Kas Bank Infak & Sodaqoh', debit: 22000000, kredit: 0 },
      { kodeAkun: '4103', namaAkun: 'Sedekah Jamaah', debit: 0, kredit: 22000000 },
    ],
  },
  {
    id: 'JRN-2026-007',
    tanggal: '2026-07-25',
    noBukti: 'BKK-SDQ-001',
    keterangan: 'Penyaluran Santunan Yatim Piatu & Pembagian Paket Sembako Bulanan',
    sumber: 'Kas Masjid',
    status: 'Posted',
    dibuatOleh: 'Tim Social Care',
    tanggalBuat: '2026-07-25',
    baris: [
      { kodeAkun: '5203', namaAkun: 'Santunan Yatim', debit: 9500000, kredit: 0 },
      { kodeAkun: '1106', namaAkun: 'Kas Bank Infak & Sodaqoh', debit: 0, kredit: 9500000 },
    ],
  },
  {
    id: 'JRN-2026-008',
    tanggal: '2026-07-28',
    noBukti: 'BKK-OPS-001',
    keterangan: 'Pembayaran Beban Listrik, Air & Internet Masjid',
    sumber: 'Kas Masjid',
    status: 'Posted',
    dibuatOleh: 'Staf Operasional',
    tanggalBuat: '2026-07-28',
    baris: [
      { kodeAkun: '5104', namaAkun: 'Listrik', debit: 4500000, kredit: 0 },
      { kodeAkun: '1101', namaAkun: 'Kas Tunai Operasional', debit: 0, kredit: 4500000 },
    ],
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
