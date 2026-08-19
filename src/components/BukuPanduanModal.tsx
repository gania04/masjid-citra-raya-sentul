import React, { useState } from 'react';
import { BookOpen, X, Search, User, ShieldCheck, CheckCircle2, DollarSign, Calendar, FileText, QrCode, Bell, Smartphone, HelpCircle, Layers, ArrowRight, Settings } from 'lucide-react';

interface BukuPanduanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'jamaah' | 'admin';
}

export const BukuPanduanModal: React.FC<BukuPanduanModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'jamaah',
}) => {
  const [activeTab, setActiveTab] = useState<'jamaah' | 'admin'>(defaultRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('j-1');

  if (!isOpen) return null;

  const panduanJamaah = [
    {
      id: 'j-1',
      icon: User,
      title: '1. Pendaftaran Akun & Login Jamaah',
      summary: 'Cara mendaftar akun jamaah baru, masuk ke portal, dan mengamankan akun.',
      steps: [
        'Klik tombol **Masuk / Login** pada pojok kanan atas website.',
        'Jika belum memiliki akun, klik teks **Daftar Sekarang** di bagian bawah modal login.',
        'Isi Nama Lengkap, Nomor HP/WhatsApp, dan Kata Sandi baru Anda.',
        'Setelah mendaftar, saldo awal & riwayat transaksi Anda akan bernilai Rp 0 (bersih tanpa transaksi otomatis).',
        'Lupa kata sandi? Gunakan fitur **Lupa Password** untuk melakukan reset kata sandi dan kembali ke menu login awal.',
      ],
      tip: 'Pastikan nomor WhatsApp Anda aktif untuk menerima konfirmasi sertifikat dan notifikasi kegiatan masjid.',
    },
    {
      id: 'j-2',
      icon: DollarSign,
      title: '2. Berdonasi, Infak & Wakaf Digital',
      summary: 'Langkah berdonasi secara aman via QRIS, Transfer Bank, maupun dompet digital.',
      steps: [
        'Pilih program donasi / wakaf yang ingin dibantu pada beranda atau portal jamaah.',
        'Tentukan nominal infak atau masukkan jumlah kustom sesuai keikhlasan Anda.',
        'Pilih metode pembayaran: **QRIS Instan** (Scan dengan GoPay/OVO/DANA/ShopeePay/Mobile Banking) atau **Transfer Bank BSI**.',
        'Klik gambar QRIS untuk memperbesar (*Zoom*) atau mengunduh kode QRIS.',
        'Setelah transfer berhasil, upload foto bukti pembayaran untuk dikonfirmasi oleh Bendahara DKM.',
        'Unduh **E-Sertifikat Wakaf** resmi atas nama Anda dari portal jamaah.',
      ],
      tip: 'Pengorbanan infak Anda akan langsung tercatat secara transparan di Laporan Keuangan Real-Time Masjid.',
    },
    {
      id: 'j-3',
      icon: Bell,
      title: '3. Fitur Pengingat Donasi Bulanan Otomatis',
      summary: 'Atur notifikasi pengingat istiqomah sedekah subuh atau bulanan.',
      steps: [
        'Masuk ke **Dashboard Jamaah -> Tab Pengingat Donasi**.',
        'Pilih tanggal pengingat setiap bulannya (misal: Tanggal 1 setiap bulan gajian).',
        'Tentukan nominal komitmen infak bulanan Anda.',
        'Aktifkan toggle **Pengingat Aktif**.',
        'Sistem akan mengirimkan pesan notifikasi pengingat langsung ke nomor WhatsApp/Portal Anda saat tanggal tiba.',
      ],
      tip: 'Fitur ini membantu menjaga konsistensi (*istiqomah*) sedekah rutinan Anda.',
    },
    {
      id: 'j-4',
      icon: BookOpen,
      title: '4. Fitur Al-Qur\'an Digital & Ibadah',
      summary: 'Membaca Al-Qur\'an 30 Juz lengkap dengan terjemahan dan audio tilawah.',
      steps: [
        'Klik menu **Al-Qur\'an Digital** di navigasi utama.',
        'Cari surah berdasarkan nama (Contoh: Al-Kahfi, Yasin, Al-Mulk) atau nomor surah.',
        'Gunakan pemutar audio untuk mendengarkan lantunan ayat dari Qari pilihan.',
        'Gunakan fitur Bookmark untuk menyimpan ayat terakhir yang dibaca.',
        'Cek Jadwal Shalat Real-time berdasarkan lokasi Citra Sentul Raya di bagian atas halaman.',
      ],
      tip: 'Dapat diakses 24/7 langsung dari HP smartphone Anda tanpa perlu install aplikasi tambahan.',
    },
  ];

  const panduanAdmin = [
    {
      id: 'a-1',
      icon: Settings,
      title: '1. Pengelolaan Master Chart of Accounts (COA)',
      summary: 'Mengatur struktur akun keuangan syariah, status Aktif/Non-Aktif, dan batch import.',
      steps: [
        'Masuk ke **Portal DKM -> Keuangan -> Chart of Accounts (COA)**.',
        '**Tambah Akun**: Klik *Tambah Akun Baru*, isi Kode Akun (contoh: 1101, 5104), Nama Akun, Jenis, Kelompok, dan Status (Aktif / Non-Aktif).',
        '**Enable / Disable (Status)**: Klik status badge pada baris akun untuk mengaktifkan (Aktif) atau menonaktifkan (Non-Aktif) akun tertentu.',
        '**Batch Import Google Spreadsheet**: Klik *Import Google Spreadsheet / CSV*, centang *Hapus/Timpa COA Lama*, paste teks tabel dari Excel/Google Sheets, lalu klik Impor.',
        '**Reset 65 COA**: Klik tombol *Muat COA Spreadsheet* untuk mengembalikan daftar 65 akun standar PSAK 109.',
      ],
      tip: 'Akun berstatus Non-Aktif tidak akan mengacaukan riwayat jurnal lama tetapi tercegah dari posting baru.',
    },
    {
      id: 'a-2',
      icon: FileText,
      title: '2. Pencatatan Jurnal Umum (Double Entry)',
      summary: 'Prosedur pencatatan transaksi keuangan masjid berpasangan Debit dan Kredit.',
      steps: [
        'Buka modul **Jurnal Umum** di bagian Keuangan Admin.',
        'Klik **+ Buat Jurnal Baru**, isi Tanggal Transaksi, Nomor Bukti, dan Keterangan Transaksi.',
        'Pilih Kode Akun Debit (misal: 1101 Kas Tunai) dan masukkan nominalnya.',
        'Pilih Kode Akun Kredit (misal: 4101 Infak Jumat) dengan nominal seimbang (Balance).',
        'Simpan sebagai *Draft* untuk ditinjau atau langsung klik *Post Jurnal* untuk memperbarui Saldo Buku Besar secara real-time.',
      ],
      tip: 'Pastikan Total Debit dan Total Kredit bernilai SAMA (Balance) sebelum posting.',
    },
    {
      id: 'a-3',
      icon: ShieldCheck,
      title: '3. Workflow Persetujuan Anggaran (RAPB Approval)',
      summary: 'Prosedur pengajuan dana operasional bertingkat 3-Step Approval.',
      steps: [
        'Pengurus mengajukan dana di modul **Persetujuan Anggaran**.',
        '**Step 1 (Bendahara)**: Bendahara memeriksa kesesuaian anggaran dan ketersediaan kas.',
        '**Step 2 (Ketua DKM)**: Ketua DKM menyetujui pengajuan operasional/kegiatan.',
        '**Step 3 (Direktur / Pembina)**: Verifikasi akhir untuk persetujuan pencairan dana.',
        'Setelah disetujui penuh, sistem akan otomatis men-generate draf Jurnal Pengeluaran Kas.',
      ],
      tip: 'Setiap tahapan approval mencatat nama penanggung jawab dan stempel waktu (*timestamp*) audit.',
    },
    {
      id: 'a-4',
      icon: Calendar,
      title: '4. Update Kalender Kegiatan & Media Ashabul Yamin',
      summary: 'Mengelola jadwal kajian, banner informasi, dan dokumentasi video.',
      steps: [
        'Akses modul **Operasional -> Kalender Kegiatan**.',
        'Tambah jadwal kajian rutin, narasumber/penceramah, jam pelaksanaan, dan lokasi.',
        'Update link Video YouTube pada modul **Media Ashabul Yamin** untuk menampilkan tayangan kajian secara live di landing page.',
        'Update progres fisik pembangunan di modul **Pembangunan & Infrastruktur**.',
      ],
      tip: 'Informasi kegiatan yang di-update admin langsung tampil otomatis di Portal Jamaah.',
    },
  ];

  const currentGuideList = activeTab === 'jamaah' ? panduanJamaah : panduanAdmin;

  const filteredGuides = currentGuideList.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-lime-800 via-lime-700 to-emerald-900 p-5 sm:p-6 text-white shrink-0 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <BookOpen className="w-6 h-6 text-lime-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Buku Panduan Penggunaan Fitur</h2>
              <p className="text-lime-200 text-xs sm:text-sm">Panduan resmi operasional Portal Masjid Citra Sentul Raya</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('jamaah')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'jamaah'
                  ? 'bg-white text-lime-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-lime-600" /> Panduan Jamaah
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-lime-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-lime-300" /> Panduan Pengurus DKM
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari fitur / instruksi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600"
            />
          </div>
        </div>

        {/* Content Body (Accordion Style) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {filteredGuides.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">Tidak ada instruksi yang cocok dengan "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci lain seperti "COA", "Login", "QRIS", "Jurnal".</p>
            </div>
          ) : (
            filteredGuides.map(item => {
              const IconComp = item.icon;
              const isExpanded = activeAccordion === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setActiveAccordion(isExpanded ? null : item.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-xl shrink-0 ${activeTab === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-lime-100 text-lime-800'}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.summary}</p>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${isExpanded ? 'rotate-90 bg-lime-100 text-lime-800' : 'bg-slate-100 text-slate-400'}`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-in fade-in">
                      <div className="space-y-2.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Langkah-langkah Penggunaan:</p>
                        {item.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>') }} />
                          </div>
                        ))}
                      </div>

                      {item.tip && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
                          <span className="font-bold text-amber-700 shrink-0">💡 TIPS PENTING:</span>
                          <span>{item.tip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-lime-600" /> Butuh bantuan tambahan? Hubungi DKM Masjid Citra Sentul Raya
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
