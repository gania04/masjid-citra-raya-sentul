import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin: () => void;
  onJamaahLogin: (nama: string, kontak: string) => void;
  registeredJamaahList?: any[];
  onRegisterJamaah?: (jamaah: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLogin,
  onJamaahLogin,
  registeredJamaahList = [],
  onRegisterJamaah
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [namaJamaah, setNamaJamaah] = useState('');

  if (!isOpen) return null;

  const handleResetState = () => {
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResetState();

    const identifier = loginIdentifier.trim();
    const pass = password.trim();

    if (mode === 'register') {
      const nama = namaJamaah.trim();
      if (!nama) {
        setErrorMsg('Nama lengkap wajib diisi!');
        return;
      }
      if (!identifier) {
        setErrorMsg('Email atau No. Handphone wajib diisi!');
        return;
      }
      if (!pass || pass.length < 6) {
        setErrorMsg('Password wajib diisi (minimal 6 karakter)!');
        return;
      }

      // Check if user already exists
      const exists = registeredJamaahList.find(u => u.c === identifier || u.e === identifier);
      if (exists) {
        setErrorMsg('Kontak sudah terdaftar! Silakan pilih Masuk.');
        return;
      }

      let e = '';
      let phone = '';
      if (identifier.includes('@')) {
        e = identifier;
      } else {
        phone = identifier;
      }

      const joinedAt = new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      const userKey = phone || e || identifier;
      
      localStorage.setItem(`masjid_created_at_${userKey}`, joinedAt);
      localStorage.setItem(`masjid_history_${userKey}`, JSON.stringify([]));

      if (onRegisterJamaah) {
        onRegisterJamaah({ n: nama, c: phone, e: e, s: 'Aktif', p: pass, joinedAt });
      }
      onJamaahLogin(nama, identifier);
      onClose();
    } else {
      // Unified Login Mode
      if (!identifier) {
        setErrorMsg('Username/Email/No. Handphone wajib diisi!');
        return;
      }
      if (!pass) {
        setErrorMsg('Password wajib diisi!');
        return;
      }

      // 1. Check Admin
      if (identifier === 'admin' && pass === 'admin123') {
        onAdminLogin();
        onClose();
        return;
      }

      // 2. Check Jamaah
      const matchedUser = registeredJamaahList.find(u => (u.c === identifier || u.e === identifier) && u.p === pass);
      if (matchedUser) {
        onJamaahLogin(matchedUser.n, matchedUser.c || matchedUser.e);
        onClose();
        return;
      }

      setErrorMsg('Akun tidak ditemukan atau password salah!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 border border-lime-200/50 dark:border-slate-800">
        
        {/* Header - Single Unified Portal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-lime-700 to-emerald-900 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
          <div className="flex gap-3 items-center z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <UserCheck className="w-5 h-5 text-lime-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif leading-tight flex items-center gap-1.5">
                Portal Login Terpadu
                <Sparkles className="w-3.5 h-3.5 text-lime-300 inline" />
              </h2>
              <p className="text-[10px] tracking-wider text-lime-100 uppercase font-semibold">Masjid Citra Sentul Raya</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors z-10 cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Single Portal Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Mode Register Banner Header */}
            {mode === 'register' && (
              <div className="bg-lime-50 dark:bg-lime-950/40 border border-lime-200 dark:border-lime-800 p-3 rounded-2xl mb-2 text-center">
                <h3 className="text-sm font-bold text-lime-800 dark:text-lime-300">Pendaftaran Akun Jamaah Baru</h3>
                <p className="text-[11px] text-lime-700 dark:text-lime-400 mt-0.5">Isi data diri di bawah ini untuk membuat akun jamaah</p>
              </div>
            )}

            {/* Nama Lengkap (Only in Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaJamaah}
                  onChange={(e) => { setNamaJamaah(e.target.value); handleResetState(); }}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
            )}

            {/* Field Username / Contact */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {mode === 'login' ? 'Username / Email / No. Handphone' : 'Email atau No. Handphone'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-lime-600 dark:text-lime-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => { setLoginIdentifier(e.target.value); handleResetState(); }}
                  placeholder={mode === 'login' ? 'Masukkan ID Anda' : 'Contoh: 08123456789 atau user@email.com'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
            </div>

            {/* Field Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi (Password) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleResetState();
                  }}
                  placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Masukkan password'}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-lime-500 focus:outline-none text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Lupa Password Link for Login Mode */}
            {mode === 'login' && (
              <div className="text-right">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const email = prompt('Masukkan email terdaftar untuk reset password:');
                    if (email) {
                      if (email.includes('@') || email.length >= 10) {
                        alert(`Link reset password telah dikirim ke ${email}.`);
                        const newPass = prompt(`[SIMULASI RESET]: Masukkan password baru Anda untuk akun ${email}:`);
                        if (newPass) alert('Password berhasil diubah! Silakan login kembali.');
                      } else {
                        alert('Format email/kontak tidak valid.');
                      }
                    }
                  }}
                  className="text-xs text-lime-600 dark:text-lime-400 font-semibold hover:underline"
                >
                  Lupa Password?
                </a>
              </div>
            )}

            {/* Error Message Display */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold border border-red-200 dark:border-red-900/50">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer mt-2 bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-700 hover:to-emerald-700"
            >
              {mode === 'login' ? 'Masuk Portal' : 'Daftar Akun Baru'}
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Bottom Footer - Small Link for "Daftar / Masuk" */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
            {mode === 'login' ? (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Belum punya akun jamaah?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    handleResetState();
                  }}
                  className="font-medium text-[11px] text-lime-600 dark:text-lime-400 hover:text-lime-700 hover:underline cursor-pointer ml-0.5"
                >
                  Daftar sekarang
                </button>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    handleResetState();
                  }}
                  className="font-medium text-[11px] text-lime-600 dark:text-lime-400 hover:text-lime-700 hover:underline cursor-pointer ml-0.5"
                >
                  Masuk sekarang
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

