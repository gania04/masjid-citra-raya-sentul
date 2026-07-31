import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calculator, Clock, Calendar, ChevronRight, LogOut, Download, Activity, Image as ImageIcon, LayoutDashboard, Settings, Bell, Camera, Wallet, BookOpen, Volume2, VolumeX, BookMarked, Sparkles, Play, Award, Heart, RefreshCw } from 'lucide-react';
import { AlQuranDigital, BookmarkData } from './AlQuranDigital';

interface JamaahDashboardProps {
  onBack: () => void;
  nama: string;
}

export const JamaahDashboard: React.FC<JamaahDashboardProps> = ({ onBack, nama }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'donasi' | 'laporan' | 'histori' | 'profil' | 'jadwal' | 'quran'>('ringkasan');
  const [isQuranModalOpen, setIsQuranModalOpen] = useState(false);
  const [selectedSurahNomor, setSelectedSurahNomor] = useState<number | null>(null);
  const [initialQuranTab, setInitialQuranTab] = useState<'surah' | 'dzikir'>('surah');
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);
  const [khatamCount, setKhatamCount] = useState(() => {
    return parseInt(localStorage.getItem('masjid_quran_khatam') || '0');
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('masjid_quran_bookmark');
    if (saved) {
      try { setBookmark(JSON.parse(saved)); } catch (e) {}
    }
  }, [activeTab, isQuranModalOpen]);

  // Zakat Calculator State
  const [showKalkulator, setShowKalkulator] = useState(false);
  const [penghasilan, setPenghasilan] = useState('');
  const [bonus, setBonus] = useState('');
  
  const totalPendapatan = (parseInt(penghasilan.replace(/\D/g, '') || '0')) + (parseInt(bonus.replace(/\D/g, '') || '0'));
  const nisab = 6859394;
  const wajibZakat = totalPendapatan >= nisab;
  const jumlahZakat = wajibZakat ? totalPendapatan * 0.025 : 0;

  // Profil state - gunakan nama dari login
  const [profilName, setProfilName] = useState(nama);
  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');

  // Pengingat & E-Wallet state
  const [tipeDonasi, setTipeDonasi] = useState<'otomatis' | 'pengingat'>('pengingat');
  const [tanggalPengingat, setTanggalPengingat] = useState('25');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [selectedWalletToConnect, setSelectedWalletToConnect] = useState('GoPay');
  const [connectionStep, setConnectionStep] = useState<'select' | 'phone' | 'otp' | 'connected'>('select');
  const [walletPhone, setWalletPhone] = useState('');
  const [walletOtp, setWalletOtp] = useState('');

  // Jadwal Shalat State
  const [adzanAlarms, setAdzanAlarms] = useState({ 
    tahajjud: false, 
    subuh: true, 
    dhuha: false, 
    dzuhur: false, 
    ashar: true, 
    maghrib: true, 
    isya: false 
  });

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
        activeTab === id 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  const MobileNavButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center p-2 min-w-[4rem] ${activeTab === id ? 'text-emerald-600' : 'text-slate-400'}`}>
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-[9px] font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20 md:pb-12">
      {/* Banner Profile (Dark Blue) */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-[#064e3b] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-lg relative overflow-hidden">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-2 border-amber-400 bg-amber-500/10 flex items-center justify-center text-4xl font-bold text-amber-400 shrink-0 shadow-inner z-10">
            {profilName.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left z-10 w-full">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
              <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Anggota Terverifikasi</span>
              <span className="bg-amber-900/50 border border-amber-500/30 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider"><Award className="w-3 h-3" /> Bronze Muhsinin</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">{profilName}</h2>
            <p className="text-emerald-100 text-sm mb-4">081517045406 •</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 text-center">
                <p className="text-[9px] text-emerald-100 font-bold uppercase tracking-wider mb-0.5">Total Kebaikan</p>
                <p className="text-lg font-bold text-amber-400">Rp 1.450.000</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 text-center">
                <p className="text-[9px] text-emerald-100 font-bold uppercase tracking-wider mb-0.5">Bergabung Sejak</p>
                <p className="text-lg font-bold text-white">Jul 2026</p>
              </div>
              <button 
                onClick={() => {
                  if (isRefreshing) return;
                  setIsRefreshing(true);
                  // Simulate data fetching/refreshing
                  setTimeout(() => {
                    setIsRefreshing(false);
                  }, 1500);
                }} 
                className={`bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 border border-white/10 flex flex-col items-center justify-center text-emerald-100 transition-colors cursor-pointer ${isRefreshing ? 'opacity-70' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 mb-0.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-[9px] font-bold uppercase">{isRefreshing ? 'Loading' : 'Refresh'}</span>
              </button>
              <button onClick={onBack} className="bg-red-500/20 hover:bg-red-500/30 rounded-xl px-4 py-2 border border-red-500/30 flex flex-col items-center justify-center text-red-200 transition-colors cursor-pointer ml-auto md:ml-4">
                <LogOut className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-bold uppercase">Keluar</span>
              </button>
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        </div>
      </div>

      {/* Horizontal Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6 hidden md:block">
        <div className="bg-white rounded-full p-2 shadow-sm border border-slate-200 flex overflow-x-auto no-scrollbar justify-between">
          <TabButton id="ringkasan" icon={Activity} label="Ringkasan ZISWAF" />
          <TabButton id="donasi" icon={Wallet} label="Keuangan Pribadi" />
          <TabButton id="laporan" icon={LayoutDashboard} label="Progress" />
          <TabButton id="quran" icon={BookOpen} label="Al-Quran Digital" />
          <TabButton id="jadwal" icon={Clock} label="Jadwal & Adzan" />
          <TabButton id="histori" icon={Calendar} label="Histori Transaksi" />
          <TabButton id="profil" icon={Settings} label="Pengaturan Profil" />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between px-2 py-1 z-50 overflow-x-auto no-scrollbar gap-2">
        <MobileNavButton id="ringkasan" icon={LayoutDashboard} label="Ringkasan" />
        <MobileNavButton id="donasi" icon={Wallet} label="Keuangan" />
        <MobileNavButton id="quran" icon={BookOpen} label="Quran" />
        <MobileNavButton id="jadwal" icon={Clock} label="Jadwal" />
        <MobileNavButton id="histori" icon={Calendar} label="Histori" />
        <MobileNavButton id="profil" icon={Settings} label="Profil" />
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pb-12">
          
          {/* TAB 1: RINGKASAN ZISWAF */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Jadwal Shalat Widget - Matching Screenshot */}
              <div className="bg-[#064e3b] rounded-3xl p-6 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-emerald-50 font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-300" /> Jadwal Shalat Hari Ini</h3>
                  <div className="bg-white/10 border border-white/20 text-emerald-100 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
                    <span>📍 Bogor, ID</span>
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-[#10b981] rounded-2xl p-4 text-center text-white shadow-inner flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Subuh</p>
                    <p className="text-xl md:text-2xl font-bold">04:35</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center text-emerald-50 flex flex-col justify-center hover:bg-white/20 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Dzuhur</p>
                    <p className="text-xl md:text-2xl font-bold">11:58</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center text-emerald-50 flex flex-col justify-center hover:bg-white/20 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Ashar</p>
                    <p className="text-xl md:text-2xl font-bold">15:15</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center text-emerald-50 flex flex-col justify-center hover:bg-white/20 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Maghrib</p>
                    <p className="text-xl md:text-2xl font-bold">17:55</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center text-emerald-50 flex flex-col justify-center hover:bg-white/20 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Isya</p>
                    <p className="text-xl md:text-2xl font-bold">19:08</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Kalkulator Zakat</h2>
                  <p className="text-sm text-slate-500">Hitung kewajiban zakat Anda dengan mudah dan cepat.</p>
                </div>
                <button onClick={() => setShowKalkulator(!showKalkulator)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-lime-50 text-lime-700 hover:bg-lime-100 px-4 py-2.5 rounded-xl font-bold border border-lime-200 transition-colors">
                  <Calculator className="w-5 h-5" /> Cek Zakat Anda
                </button>
              </div>

              {/* Zakat Calculator Dropdown */}
              {showKalkulator && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-200 animate-in slide-in-from-top-2">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-amber-500" /> Kalkulator Zakat Cepat</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Gaji Bulanan</label>
                      <input type="text" value={penghasilan} onChange={(e) => setPenghasilan(e.target.value.replace(/\D/g, ''))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Rp" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Bonus Tambahan</label>
                      <input type="text" value={bonus} onChange={(e) => setBonus(e.target.value.replace(/\D/g, ''))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Rp" />
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl border ${wajibZakat ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'} flex justify-between items-center`}>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Kewajiban Zakat (2.5%)</p>
                      {wajibZakat ? <p className="text-xl font-bold text-amber-600">{formatRp(jumlahZakat)}</p> : <p className="text-sm font-bold text-slate-400">Belum Wajib Zakat</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#064e3b] to-emerald-900 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
                  <Wallet className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Total Donasi Anda</p>
                  <p className="text-2xl font-bold mt-1">Rp 1.450.000</p>
                </div>
                <div 
                  onClick={() => setActiveTab('laporan')}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
                >
                  <Activity className="w-8 h-8 mb-3 text-emerald-600" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Program Didukung</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1 flex items-center gap-2">3 Program <ChevronRight className="w-4 h-4 text-slate-400" /></p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <Calendar className="w-8 h-8 mb-3 text-emerald-600" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Donasi Rutin Aktif</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">Pengingat Harian</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: JADWAL SHALAT & ADZAN */}
          {activeTab === 'jadwal' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in pb-4">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Clock className="w-6 h-6 text-lime-600" /> Jadwal Shalat & Alarm Adzan</h2>
                <p className="text-sm text-slate-500 mt-1">Sistem akan memutar rekaman Adzan otomatis di HP Anda sesuai waktu masuk shalat.</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: 'Tahajjud (Sunnah)', time: '03:00 WIB', key: 'tahajjud', isSunnah: true },
                  { name: 'Subuh', time: '04:45 WIB', key: 'subuh', isSunnah: false },
                  { name: 'Dhuha (Sunnah)', time: '07:30 WIB', key: 'dhuha', isSunnah: true },
                  { name: 'Dzuhur', time: '12:02 WIB', key: 'dzuhur', isSunnah: false },
                  { name: 'Ashar', time: '15:23 WIB', key: 'ashar', isSunnah: false },
                  { name: 'Maghrib', time: '17:58 WIB', key: 'maghrib', isSunnah: false },
                  { name: 'Isya', time: '19:12 WIB', key: 'isya', isSunnah: false },
                ].map((s) => (
                  <div key={s.key} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl ${s.isSunnah ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
                    <div className="flex flex-col">
                      <span className={`font-bold text-lg ${s.isSunnah ? 'text-amber-800' : 'text-slate-800'}`}>{s.name}</span>
                      <span className={`text-sm font-semibold ${s.isSunnah ? 'text-amber-600' : 'text-slate-500'}`}>{s.time}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setAdzanAlarms(prev => ({ ...prev, [s.key]: !prev[s.key as keyof typeof adzanAlarms] }));
                        if (!adzanAlarms[s.key as keyof typeof adzanAlarms]) {
                          const audio = new Audio('https://masjid-citra-sentul-raya.vercel.app/adzan.mp3'); // Mock audio url
                          audio.play().catch(() => alert('Memutar simulasi Audio Adzan.'));
                        }
                      }}
                      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border cursor-pointer ${adzanAlarms[s.key as keyof typeof adzanAlarms] ? 'bg-lime-600 border-lime-700 text-white' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {adzanAlarms[s.key as keyof typeof adzanAlarms] ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      {adzanAlarms[s.key as keyof typeof adzanAlarms] ? (s.isSunnah ? 'Alarm Aktif' : 'Adzan Aktif') : 'Mati'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AL-QURAN DIGITAL */}
          {activeTab === 'quran' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-r from-emerald-700 via-lime-700 to-green-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Al-Quran Digital & Tracker</h2>
                  <p className="text-lime-100 text-sm">Mari rutinkan membaca Al-Quran, sedikit demi sedikit namun konsisten.</p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button 
                      onClick={() => { setSelectedSurahNomor(null); setInitialQuranTab('surah'); setIsQuranModalOpen(true); }}
                      className="inline-flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-lime-50 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                    >
                      Buka Al-Qur'an (114 Surah) <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setSelectedSurahNomor(null); setInitialQuranTab('dzikir'); setIsQuranModalOpen(true); }}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-800 border border-emerald-500/30 hover:bg-emerald-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer text-white"
                    >
                      Buka Dzikir & Doa <ChevronRight className="w-4 h-4 text-emerald-300" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="bg-white/20 p-4.5 rounded-xl backdrop-blur-xs border border-white/30 shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-lime-100 mb-1.5 flex items-center gap-1"><BookMarked className="w-4 h-4 text-amber-300" /> Terakhir Dibaca</h3>
                    <p className="text-xl font-bold">{bookmark ? bookmark.surahNama : 'Surah Al-Fatihah'}</p>
                    <p className="text-sm font-semibold text-lime-100">{bookmark ? `Ayat ${bookmark.ayatNomor}` : 'Ayat 1'}</p>
                    <button 
                      onClick={() => {
                      if (bookmark) {
                        setSelectedSurahNomor(bookmark.surahNomor);
                      } else {
                        setSelectedSurahNomor(1);
                      }
                      setInitialQuranTab('surah');
                      setIsQuranModalOpen(true);
                    }}
                    className="mt-3 w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold py-2 rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Lanjutkan Membaca
                  </button>
                  </div>
                  
                  <div className="bg-white/20 p-4.5 rounded-xl backdrop-blur-xs border border-white/30 shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-lime-100 mb-1.5 flex items-center gap-1"><Award className="w-4 h-4 text-amber-300" /> Total Khatam</h3>
                    <p className="text-2xl font-bold">{khatamCount} Kali</p>
                    <button 
                      onClick={() => {
                        const newCount = khatamCount + 1;
                        setKhatamCount(newCount);
                        localStorage.setItem('masjid_quran_khatam', newCount.toString());
                        alert(`Alhamdulillah! Anda telah mengkhatamkan Al-Quran sebanyak ${newCount} kali.`);
                      }}
                      className="mt-8 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      + Catat Khatam
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Settings className="w-5 h-5 text-amber-500" /> Target Bacaan Harian
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <select className="flex-1 p-3 border border-slate-300 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-amber-500 text-sm">
                    <option>1 Hari 1 Ayat (One Day One Ayat)</option>
                    <option>1 Hari 1 Halaman</option>
                    <option>1 Hari 1 Juz (One Day One Juz)</option>
                    <option>Tanpa Target Khusus</option>
                  </select>
                  <button onClick={() => alert('Target berhasil disimpan (Simulasi)')} className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap text-sm shadow-sm cursor-pointer">
                    Simpan Target
                  </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-base">Pilih Surah Populer</h3>
                  <button 
                    onClick={() => { setSelectedSurahNomor(null); setIsQuranModalOpen(true); }}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    Lihat Semua (114 Surah) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { no: 1, name: 'Al-Fatihah', meaning: 'Pembukaan', ayahs: 7 },
                    { no: 2, name: 'Al-Baqarah', meaning: 'Sapi Betina', ayahs: 286 },
                    { no: 18, name: 'Al-Kahf', meaning: 'Gua', ayahs: 110 },
                    { no: 36, name: 'Ya Sin', meaning: 'Ya Sin', ayahs: 83 },
                    { no: 55, name: 'Ar-Rahman', meaning: 'Yang Maha Pemurah', ayahs: 78 },
                    { no: 67, name: 'Al-Mulk', meaning: 'Kerajaan', ayahs: 30 },
                    { no: 112, name: 'Al-Ikhlas', meaning: 'Ikhlas', ayahs: 4 },
                    { no: 114, name: 'An-Nas', meaning: 'Manusia', ayahs: 6 }
                  ].map(surah => (
                    <div 
                      key={surah.no} 
                      onClick={() => {
                        setSelectedSurahNomor(surah.no);
                        setIsQuranModalOpen(true);
                      }}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {surah.no}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{surah.name}</p>
                          <p className="text-xs text-slate-500">{surah.meaning} • {surah.ayahs} Ayat</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DONASI RUTIN & PENGINGAT */}
          {activeTab === 'donasi' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                  <Bell className="w-6 h-6 text-lime-600" /> Pengaturan Donasi Rutin
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${tipeDonasi === 'otomatis' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:border-amber-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={tipeDonasi === 'otomatis'} onChange={() => setTipeDonasi('otomatis')} className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-800">Potong Saldo Otomatis</h3>
                      </div>
                      <Wallet className={`w-6 h-6 ${tipeDonasi === 'otomatis' ? 'text-amber-500' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-600 ml-8 leading-relaxed">Sistem akan memotong e-wallet Anda secara otomatis.</p>
                  </label>

                  <label className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${tipeDonasi === 'pengingat' ? 'border-lime-500 bg-lime-50/50' : 'border-slate-200 hover:border-lime-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={tipeDonasi === 'pengingat'} onChange={() => setTipeDonasi('pengingat')} className="w-5 h-5 text-lime-600" />
                        <h3 className="font-bold text-slate-800">Kirim Pengingat (Notifikasi)</h3>
                      </div>
                      <Bell className={`w-6 h-6 ${tipeDonasi === 'pengingat' ? 'text-lime-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-600 ml-8 leading-relaxed">Kami akan mengirimkan notifikasi via WhatsApp/Aplikasi pada tanggal yang Anda tentukan.</p>
                  </label>
                </div>

                <div className="mt-8 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  {tipeDonasi === 'pengingat' ? (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm">Jadwal Pengingat Bulanan</h4>
                      <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full sm:flex-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Pilih Tanggal Pengingat (1-31)</label>
                          <select value={tanggalPengingat} onChange={(e) => setTanggalPengingat(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                            {[...Array(31)].map((_, i) => (
                              <option key={i+1} value={i+1}>Tanggal {i+1} Setiap Bulannya</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full sm:flex-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Target Nominal (Rp)</label>
                          <input type="text" placeholder="Contoh: 100000" className="w-full p-3 border border-slate-300 rounded-lg bg-white" />
                        </div>
                      </div>
                      <p className="text-xs text-lime-700 bg-lime-100 p-3 rounded-lg font-semibold flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Anda akan menerima pesan pengingat donasi setiap tanggal {tanggalPengingat}.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm">Pilih Sumber Dana (E-Wallet / Rekening)</h4>
                        {connectionStep === 'connected' && connectedWallet ? (
                          <div className="flex items-center justify-between p-4 bg-lime-50 border border-lime-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-lime-700 shadow-sm border border-lime-100">
                                {connectedWallet.substring(0, 3).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{connectedWallet} Terhubung</p>
                                <p className="text-xs text-slate-500">Saldo akan ditarik otomatis.</p>
                              </div>
                            </div>
                            <button onClick={() => { setConnectedWallet(null); setConnectionStep('select'); }} className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">
                              Putuskan
                            </button>
                          </div>
                        ) : connectionStep === 'phone' ? (
                          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-right-4">
                            <div><h5 className="font-bold text-slate-800">Tautkan {selectedWalletToConnect}</h5><p className="text-xs text-slate-500">Masukkan nomor HP yang terdaftar di {selectedWalletToConnect}.</p></div>
                            <input type="text" placeholder="0812xxxxxx" value={walletPhone} onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, ''))} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:border-amber-500" />
                            <div className="flex gap-2">
                              <button onClick={() => setConnectionStep('select')} className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">Batal</button>
                              <button disabled={walletPhone.length < 9} onClick={() => setConnectionStep('otp')} className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors">Kirim Kode OTP</button>
                            </div>
                          </div>
                        ) : connectionStep === 'otp' ? (
                          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-right-4">
                            <div><h5 className="font-bold text-slate-800">Verifikasi OTP {selectedWalletToConnect}</h5><p className="text-xs text-slate-500">Masukkan 6 digit kode yang dikirim ke {walletPhone}</p></div>
                            <input type="text" maxLength={6} placeholder="Ketik 6 digit OTP..." value={walletOtp} onChange={(e) => setWalletOtp(e.target.value.replace(/\D/g, ''))} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-center tracking-[1em] font-mono text-lg font-bold focus:outline-none focus:border-amber-500" />
                            <div className="flex gap-2">
                              <button onClick={() => setConnectionStep('phone')} className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">Kembali</button>
                              <button disabled={walletOtp.length !== 6} onClick={() => { setConnectedWallet(selectedWalletToConnect); setConnectionStep('connected'); setWalletPhone(''); setWalletOtp(''); }} className="w-2/3 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors">Verifikasi</button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4 animate-in fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'BSI', 'BCA'].map((wallet) => (
                                <button key={wallet} onClick={() => setSelectedWalletToConnect(wallet)} className={`p-2 rounded-lg text-xs font-bold border-2 transition-all ${selectedWalletToConnect === wallet ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}>{wallet}</button>
                              ))}
                            </div>
                            <button onClick={() => setConnectionStep('phone')} className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-lg transition-colors shadow-md">Hubungkan {selectedWalletToConnect}</button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm">Frekuensi Pemotongan Otomatis</h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <select className="flex-1 p-3 border border-slate-300 rounded-lg bg-white"><option>Harian (Waktu Subuh)</option><option>Jumat Berkah</option><option>Bulanan (Awal Bulan)</option></select>
                          <input type="text" placeholder="Nominal (Rp)" className="flex-1 p-3 border border-slate-300 rounded-lg bg-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <button onClick={() => alert('Pengaturan Donasi Rutin Berhasil Disimpan!')} className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-md cursor-pointer">Simpan Pengaturan</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFIL */}
          {activeTab === 'profil' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-6"><Settings className="w-6 h-6 text-lime-600" /> Pengaturan Profil Jamaah</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <img src={profilePic} alt="Profil" className="w-32 h-32 rounded-full border-4 border-slate-100 object-cover" />
                    <button className="absolute bottom-0 right-0 p-3 rounded-full bg-lime-600 hover:bg-lime-700 text-white shadow-lg transition-transform hover:scale-105 group-hover:bg-lime-500"><Camera className="w-5 h-5" /></button>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Format: JPG/PNG, Maks. 2MB</p>
                </div>
                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label><input type="text" value={profilName} onChange={e => setProfilName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:bg-white transition-all text-sm font-semibold text-slate-800" /></div>
                    <div><label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label><input type="text" defaultValue="0812-1920-0400" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:bg-white transition-all text-sm text-slate-800" /></div>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Email Aktif</label><input type="email" defaultValue="hamba.allah@email.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:bg-white transition-all text-sm text-slate-800" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Alamat Domisili (Opsional)</label><textarea rows={3} defaultValue="Sirkuit Sentul, Bogor" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:bg-white transition-all text-sm text-slate-800"></textarea></div>
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={() => alert('Perubahan dibatalkan')} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm cursor-pointer">Batal</button>
                    <button onClick={() => alert('Profil berhasil diperbarui')} className="px-6 py-2.5 bg-lime-600 text-white font-bold rounded-lg hover:bg-lime-700 transition-colors shadow-sm text-sm cursor-pointer">Simpan Perubahan</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAPORAN PROGRESS */}
          {activeTab === 'laporan' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in pb-4">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Activity className="w-6 h-6 text-lime-600" /> Progress Program ZISWAF</h2><p className="text-sm text-slate-500 mt-1">Pantau perkembangan terkini dari program yang Anda dukung secara transparan.</p></div>
              </div>
              <div className="p-6 space-y-8">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80" alt="Pembangunan" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Anda Berdonasi Di Sini</div>
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-900">Pembangunan Masjid Citra Sentul Raya</h3>
                        <span className="text-xs font-semibold text-lime-700 bg-lime-100 px-2 py-1 rounded-full">Tahap 2: Konstruksi</span>
                      </div>
                      <div className="space-y-4 mt-2">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-lime-700">Terkumpul 42%</span><span className="text-slate-500">Rp 630 Jt / Rp 1.5 M</span></div>
                          <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-lime-500 h-2 rounded-full" style={{ width: '42%' }}></div></div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-700 mb-2">Update Terakhir (28 Juli 2026):</p>
                          <p className="text-xs text-slate-600 leading-relaxed">Alhamdulillah, pengecoran tiang utama lantai 1 selesai. Saat ini pekerja sedang merakit kerangka atap baja ringan.</p>
                          <button onClick={() => alert('Membuka Galeri Foto (Fitur dalam pengembangan)')} className="mt-3 text-xs font-bold text-lime-600 flex items-center gap-1 hover:text-lime-700 transition-colors cursor-pointer"><ImageIcon className="w-3 h-3" /> Lihat 4 Foto Terbaru</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HISTORI */}
          {activeTab === 'histori' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Clock className="w-6 h-6 text-lime-600" /> Histori Transaksi</h2>
                <p className="text-sm text-slate-500 mt-1">Riwayat donasi yang tersinkronisasi otomatis.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                    <tr><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Program</th><th className="px-6 py-4">Nominal</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Kuitansi</th></tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-slate-100">
                      <td className="px-6 py-4 whitespace-nowrap">28 Jul 2026</td><td className="px-6 py-4 font-semibold text-slate-800">Santunan Yatim</td><td className="px-6 py-4 text-lime-600 font-bold">Rp 150.000</td>
                      <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Berhasil</span></td>
                      <td className="px-6 py-4"><button onClick={() => alert('Mengunduh Kuitansi PDF (Simulasi)')} className="text-lime-600 hover:text-lime-800 flex items-center gap-1 cursor-pointer"><Download className="w-4 h-4" /> PDF</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      {/* Al-Quran Digital Reader Modal */}
      <AlQuranDigital 
        isOpenModal={isQuranModalOpen} 
        initialSurahNomor={selectedSurahNomor}
        initialTab={initialQuranTab}
        onCloseModal={() => { setIsQuranModalOpen(false); setSelectedSurahNomor(null); setInitialQuranTab('surah'); }} 
      />
    </div>
  );
};
