import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Calendar, Calculator, Clock, UserCheck, ArrowRight, Activity, BookOpen, Bell } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin: () => void;
  onJamaahLogin: (nama: string, kontak: string) => void;
  registeredJamaahList?: any[];
  onRegisterJamaah?: (jamaah: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onAdminLogin, onJamaahLogin, registeredJamaahList = [], onRegisterJamaah }) => {
  const [role, setRole] = useState<'jamaah' | 'petugas'>('jamaah');
  const [jamaahMode, setJamaahMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [namaJamaah, setNamaJamaah] = useState('');
  const [jamaahContact, setJamaahContact] = useState('');
  const [jamaahPassword, setJamaahPassword] = useState('');
  const [jamaahError, setJamaahError] = useState('');

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
          <p className="text-sm font-semibold text-slate-800 mb-3">Pilih Akses Peran (Role):</p>
          
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
                {/* Toggle Login/Register */}
                <div className="flex bg-lime-100/50 p-1 rounded-xl">
                  <button 
                    onClick={() => { setJamaahMode('login'); setJamaahError(''); }} 
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${jamaahMode === 'login' ? 'bg-white text-lime-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Masuk
                  </button>
                  <button 
                    onClick={() => { setJamaahMode('register'); setJamaahError(''); }} 
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${jamaahMode === 'register' ? 'bg-white text-lime-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Daftar Baru
                  </button>
                </div>

                <div className="bg-lime-50/50 border border-lime-200 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">
                    {jamaahMode === 'login' ? 'Masuk ke Portal Jamaah:' : 'Pendaftaran Akun Baru:'}
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                    {jamaahMode === 'login' ? (
                      <>
                        <li>Gunakan <span className="font-bold text-slate-900">Email atau No. Handphone</span> yang sudah terdaftar.</li>
                        <li>Pastikan kata sandi Anda benar.</li>
                      </>
                    ) : (
                      <>
                        <li>Gunakan <span className="font-bold text-slate-900">Email atau No. Handphone</span> yang aktif. Setiap kontak hanya bisa digunakan untuk 1 akun.</li>
                        <li>Password minimal <span className="font-bold text-slate-900">6 karakter</span>. Simpan baik-baik untuk login berikutnya.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  {jamaahMode === 'register' && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input type="text" value={namaJamaah} onChange={(e) => { setNamaJamaah(e.target.value); setJamaahError(''); }} placeholder="Masukkan nama lengkap Anda" className="w-full px-4 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-slate-900 bg-white" required />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Email atau No. Handphone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-lime-500 absolute left-3 top-3" />
                      <input type="text" value={jamaahContact} onChange={(e) => { setJamaahContact(e.target.value); setJamaahError(''); }} placeholder="Contoh: 08123456789 atau user@email.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm text-slate-900 bg-white" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Kata Sandi (Password) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-lime-500 absolute left-3 top-3" />
                      <input type={showPassword ? "text" : "password"} value={jamaahPassword} onChange={(e) => { setJamaahPassword(e.target.value); setJamaahError(''); }} placeholder="Minimal 6 karakter" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm text-slate-900 bg-white" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-lime-500 hover:text-lime-700 cursor-pointer">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {jamaahError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-200">
                      {jamaahError}
                    </div>
                  )}

                  {jamaahMode === 'login' && (
                    <div className="text-right">
                      <a href="#" onClick={(e) => { 
                        e.preventDefault(); 
                        const email = prompt('Masukkan alamat email yang terdaftar untuk menerima link reset password:');
                        if (email) {
                          if (email.includes('@') || email.length >= 10) {
                            alert(`Sistem mendeteksi permintaan reset. Link reset password telah dikirim ke ${email}.`);
                            const newPass = prompt(`[SIMULASI RESET]: Link diklik! Masukkan password baru Anda untuk akun ${email}:`);
                            if(newPass) {
                              alert('Password berhasil diubah! Silakan login menggunakan password baru Anda.');
                            }
                          } else {
                            alert('Format kontak tidak valid. Pastikan Anda memasukkan alamat email atau nomor handphone yang benar.');
                          }
                        }
                      }} className="text-xs text-lime-600 font-semibold hover:underline">Lupa Password?</a>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      const contact = jamaahContact.trim();
                      const pass = jamaahPassword.trim();
                      
                      if (jamaahMode === 'register') {
                        const nama = namaJamaah.trim();
                        if (!nama) { setJamaahError('Nama lengkap wajib diisi!'); return; }
                        if (!contact) { setJamaahError('Email atau No. Handphone wajib diisi!'); return; }
                        if (!pass || pass.length < 6) { setJamaahError('Password wajib diisi (minimal 6 karakter)!'); return; }
                        
                        // Check if already registered
                        const exists = registeredJamaahList.find(u => u.c === contact || u.e === contact);
                        if (exists) {
                          setJamaahError('Kontak sudah terdaftar! Silakan pilih menu Masuk.');
                          return;
                        }
                        
                        setJamaahError('');
                        
                        let e = '';
                        let phone = '';
                        if (contact.includes('@')) {
                          e = contact;
                        } else {
                          phone = contact;
                        }

                        if (onRegisterJamaah) {
                          onRegisterJamaah({ n: nama, c: phone, e: e, s: 'Aktif', p: pass });
                        }
                        onJamaahLogin(nama, contact);
                        onClose();
                      } else {
                        // Login Mode
                        if (!contact) { setJamaahError('Email atau No. Handphone wajib diisi!'); return; }
                        if (!pass) { setJamaahError('Password wajib diisi!'); return; }
                        
                        const matchedUser = registeredJamaahList.find(u => (u.c === contact || u.e === contact) && u.p === pass);
                        if (!matchedUser) {
                          setJamaahError('Akun tidak ditemukan atau password salah!');
                          return;
                        }
                        
                        setJamaahError('');
                        onJamaahLogin(matchedUser.n, matchedUser.c || matchedUser.e);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md cursor-pointer"
                  >
                    {jamaahMode === 'login' ? 'Masuk' : 'Daftar Akun'} <ArrowRight className="w-5 h-5" />
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
                  <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} placeholder="Masukkan ID Petugas" required className="w-full px-4 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-slate-900" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-lime-900 mb-1">Kata Sandi (Password):</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-lime-300 absolute left-3 top-3" />
                    <input type={showPassword ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-lime-200 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm text-slate-900" />
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
