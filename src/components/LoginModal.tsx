import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Calendar, Calculator, Clock, UserCheck, ArrowRight, Activity, BookOpen, Bell } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin: () => void;
  onJamaahLogin: (nama: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onAdminLogin, onJamaahLogin }) => {
  const [role, setRole] = useState<'jamaah' | 'petugas'>('jamaah');
  const [showPassword, setShowPassword] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [namaJamaah, setNamaJamaah] = useState('');

  if (!isOpen) return null;

  const handlePetugasLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setErrorMsg('');
      onAdminLogin();
      onClose();
    } else {
      setErrorMsg('Akses Ditolak: ID Petugas atau Kata Sandi Salah!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[90vh]">
        
        {/* Header (Blue like screenshot) */}
        <div className="bg-lime-700 text-white p-5 flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 shrink-0">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">Masjid Citra Sentul Raya - Portal Keanggotaan</h2>
              <p className="text-[10px] tracking-[0.2em] text-lime-200 mt-1 font-semibold uppercase">Selamat Datang di Portal Transaksi ZISWAF</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <p className="text-sm font-semibold text-lime-800 mb-3">Pilih Akses Peran (Role):</p>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setRole('jamaah')}
              className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all ${
                role === 'jamaah' 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-white border-2 border-lime-100 text-lime-600 hover:border-lime-300'
              }`}
            >
              Jamaah Umum
            </button>
            <button
              onClick={() => setRole('petugas')}
              className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all ${
                role === 'petugas' 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-white border-2 border-lime-100 text-lime-600 hover:border-lime-300'
              }`}
            >
              Petugas Masjid
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Form */}
            {role === 'jamaah' ? (
              <div className="space-y-5">
                <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-amber-800 mb-2">Panduan Login Khusus Jamaah:</h3>
                  <ul className="text-xs text-amber-700/80 space-y-1.5 list-disc pl-4">
                    <li><span className="font-bold text-amber-800">Pendaftaran Otomatis:</span> Anda tidak perlu mendaftar terpisah. Cukup isi formulir di bawah, akun akan terdaftar dan langsung masuk secara otomatis!</li>
                    <li>Gunakan <span className="font-bold text-amber-800">Email atau No. Handphone (WhatsApp)</span> yang aktif.</li>
                    <li>Sistem akan menyinkronkan riwayat donasi dan layanan Anda secara otomatis.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-lime-900 mb-1">Nama Lengkap:</label>
                    <input type="text" value={namaJamaah} onChange={(e) => setNamaJamaah(e.target.value)} placeholder="Masukkan nama lengkap Anda" className="w-full px-4 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-lime-900 mb-1">Email atau No. Handphone (Jamaah):</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-lime-300 absolute left-3 top-3" />
                      <input type="text" placeholder="Contoh: 08123456789 atau user@email.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-lime-900 mb-1">Kata Sandi (Password):</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-lime-300 absolute left-3 top-3" />
                      <input type={showPassword ? "text" : "password"} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-lime-400 hover:text-lime-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-xs text-lime-600 font-semibold hover:underline">Lupa Password? Hubungi Admin</a>
                  </div>

                  <button 
                    onClick={() => {
                      const nama = namaJamaah.trim() || 'Hamba Allah';
                      onJamaahLogin(nama);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                  >
                    Masuk / Daftar Otomatis <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePetugasLogin} className="space-y-5">
                <div className="bg-lime-50 border border-lime-200 p-4 rounded-xl mb-4">
                  <h3 className="text-sm font-bold text-lime-800 mb-2">Akses Khusus Pengelola</h3>
                  <p className="text-xs text-lime-700">Gunakan akun admin yang telah diberikan oleh pengurus DKM untuk masuk ke panel pengelola ZISWAF.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-lime-900 mb-1">ID Petugas / Username:</label>
                  <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} placeholder="Masukkan ID Petugas" required className="w-full px-4 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-lime-900 mb-1">Kata Sandi (Password):</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-lime-300 absolute left-3 top-3" />
                    <input type={showPassword ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-lime-400 hover:text-lime-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-lime-700 hover:bg-lime-900 text-white font-bold py-3 rounded-xl transition-colors shadow-md mt-4">
                  Masuk sebagai Petugas <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Right Panel - dinamis sesuai tab */}
            {role === 'jamaah' ? (
              <div className="bg-lime-50/50 border border-lime-100 p-6 rounded-2xl h-fit">
                <h3 className="text-sm font-bold text-lime-900 mb-4 pb-3 border-b border-lime-200">
                  ✅ Fitur yang Tersedia di Portal Jamaah:
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-100">
                    <Calendar className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Ringkasan ZISWAF</p>
                      <p className="text-xs text-lime-600">Total donasi & kalkulator zakat penghasilan</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-100">
                    <Bell className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Donasi & Pengingat Rutin</p>
                      <p className="text-xs text-lime-600">Atur auto-debet e-wallet (GoPay, OVO, DANA, BSI)</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-100">
                    <Activity className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Laporan Progress ZISWAF</p>
                      <p className="text-xs text-lime-600">Pantau pembangunan masjid secara transparan</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-100">
                    <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Al-Quran Digital & Tracker</p>
                      <p className="text-xs text-lime-600">Target bacaan harian & daftar surah populer</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-100">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Jadwal Shalat & Alarm Adzan</p>
                      <p className="text-xs text-lime-600">Aktifkan alarm adzan untuk 7 waktu shalat</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-100">
                    <Calculator className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Histori Transaksi & Kuitansi</p>
                      <p className="text-xs text-lime-600">Unduh kuitansi PDF resmi dari DKM</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-lime-900/5 border border-lime-300 p-6 rounded-2xl h-fit">
                <h3 className="text-sm font-bold text-lime-900 mb-4 pb-3 border-b border-lime-300">
                  🛡️ Akses Fitur Panel Admin DKM:
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-200">
                    <Calculator className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Manajemen Buku Kas</p>
                      <p className="text-xs text-lime-700">Input pemasukan & pengeluaran, export PDF/Excel</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-200">
                    <Activity className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Laporan Keuangan ZISWAF</p>
                      <p className="text-xs text-lime-700">Ringkasan saldo, pemasukan & pengeluaran bulanan</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-200">
                    <Calendar className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Jadwal Petugas Jumat</p>
                      <p className="text-xs text-lime-700">Atur Imam, Khatib & Muadzin setiap minggunya</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-200">
                    <Bell className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Broadcast WhatsApp</p>
                      <p className="text-xs text-lime-700">Kirim pesan siaran ke seluruh jamaah sekaligus</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-200">
                    <BookOpen className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Display TV Masjid</p>
                      <p className="text-xs text-lime-700">Tampilkan jadwal & info masjid di layar besar</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-lime-200">
                    <Clock className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-lime-900">Manajemen Akun & Audit Log</p>
                      <p className="text-xs text-lime-700">Kelola hak akses petugas & histori aktivitas admin</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
