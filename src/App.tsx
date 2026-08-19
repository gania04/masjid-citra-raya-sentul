import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DaftarProgram } from './components/DaftarProgram';
import { AlQuranDigital } from './components/AlQuranDigital';
import { JadwalShalatCard } from './components/JadwalShalatCard';
import { KalenderKegiatan } from './components/KalenderKegiatan';
import { MediaSosial } from './components/MediaSosial';
import { ProfilMasjid } from './components/ProfilMasjid';
import { LokasiKontak } from './components/LokasiKontak';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { JamaahDashboard } from './components/JamaahDashboard';
import { LoginModal } from './components/LoginModal';
import { AiAsistenModal } from './components/AiAsistenModal';
import { INITIAL_STATS } from './data/mockData';
import { supabase } from './lib/supabase';
import { Sun, Moon, BookOpen, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJamaahLoggedIn, setIsJamaahLoggedIn] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [namaJamaah, setNamaJamaah] = useState('Hamba Allah');
  const [kontakJamaah, setKontakJamaah] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper for Audit Logging
  const logAudit = (name: string, role: string, kontak: string, action: string, desc: string, colorClass: string) => {
    const w = new Date().toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog = { w, n: name, r: role, a: kontak, ac: action, d: desc, c: colorClass };
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    localStorage.setItem('audit_logs', JSON.stringify([newLog, ...existingLogs]));
  };

  // Jamaah Registration State
  const [registeredJamaahList, setRegisteredJamaahList] = useState<any[]>(() => {
    const saved = localStorage.getItem('registered_jamaah');
    if (saved) return JSON.parse(saved);
    return [
      { n: 'Yudi Haryono', c: '0878-1234-1234', s: 'Aktif', p: '123456' },
      { n: 'Rizky Maulana', c: '0812-9988-7766', s: 'Aktif', p: '123456' },
      { n: 'Budi Santoso', c: 'budisan@yahoo.com', s: 'Aktif', p: '123456' },
      { n: 'Annisa Fitri', c: 'annisa.f@outlook.com', s: 'Aktif', p: '123456' },
      { n: 'Keluarga Bpk. Herman', c: 'herman.fam@gmail.com', s: 'Aktif', p: '123456' },
    ];
  });

  const handleRegisterJamaah = (jamaah: any) => {
    setRegisteredJamaahList(prev => {
      const newList = [...prev, jamaah];
      localStorage.setItem('registered_jamaah', JSON.stringify(newList));
      return newList;
    });
  };

  // Day & Night Dark Mode State Logic
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Auto Day & Night Detection: 18:00 - 06:00 is Night Mode (Dark)
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  });

  const [isAutoNight, setIsAutoNight] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return false;
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  });

  // Sync dark class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    setIsAutoNight(false);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };
  
  const defaultPrograms = [
    {
      id: 1,
      kategori: 'infaq',
      judul: 'Pembangunan Masjid Citra Sentul Raya',
      deskripsi: 'Wakaf pembangunan masjid. Amal Jariyah Tak Terputus.',
      terkumpulPersen: 0,
      terkumpulRp: 0,
      targetRp: 1500000000,
      donatur: 0,
      gambar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      kategori: 'sedekah',
      judul: 'Santunan Yatim Piatu',
      deskripsi: 'Berbagi Kasih Bersama Anak Yatim.',
      terkumpulPersen: 0,
      terkumpulRp: 0,
      targetRp: 250000000,
      donatur: 0,
      gambar: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      kategori: 'zakat',
      judul: 'Santunan Dhuafa (& Fakir Miskin)',
      deskripsi: 'Meringankan Beban Saudara Kita.',
      terkumpulPersen: 0,
      terkumpulRp: 0,
      targetRp: 750000000,
      donatur: 0,
      gambar: 'https://images.unsplash.com/photo-1593113589914-075990190da5?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // State for ZISWAF Programs
  const [programs, setPrograms] = useState(defaultPrograms);
  
  // State for Donasi History (Pending and Verified)
  const [donasiHistory, setDonasiHistory] = useState<any[]>([
    {
      id: 'INV-' + Math.floor(Math.random() * 10000),
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      programId: 2,
      programName: 'Santunan Yatim Piatu',
      nominal: 150000,
      metode: 'Bank Transfer (BSI)',
      status: 'Berhasil',
      bukti: null,
      namaDonatur: 'Hamba Allah',
      kontakDonatur: '0812xxxx'
    }
  ]);

  const handleDonateSubmit = (programId: number, nominal: number, metode: string, bukti: string | null, namaDonatur: string, kontakDonatur: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) return;
    
    const newDonasi = {
      id: 'INV-' + Math.floor(Math.random() * 10000),
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      programId,
      programName: program.judul,
      nominal,
      metode,
      status: 'Menunggu Verifikasi',
      bukti,
      namaDonatur: namaDonatur || 'Hamba Allah',
      kontakDonatur: kontakDonatur || '-'
    };
    
    setDonasiHistory(prev => [newDonasi, ...prev]);
    logAudit(namaDonatur || 'Hamba Allah', isJamaahLoggedIn ? 'JAMAAH' : 'GUEST', kontakDonatur || '-', 'DONASI', `Input donasi sejumlah Rp ${nominal} via ${metode}`, 'bg-blue-900/50 text-blue-600');
  };

  const handleVerifyDonasi = (id: string, status: 'Berhasil' | 'Ditolak') => {
    setDonasiHistory(prev => prev.map(d => {
      if (d.id === id) {
        if (status === 'Berhasil' && d.status !== 'Berhasil') {
          // If verifying as success, add to program
          handleAddDonation(d.programId, d.nominal);
          logAudit('Pengurus DKM', 'ADMIN', 'admin@masjid.id', 'VERIFY_DONASI', `Memverifikasi penerimaan donasi ID: ${id} senilai Rp ${d.nominal}`, 'bg-lime-900/50 text-lime-600');
        } else if (status === 'Ditolak' && d.status !== 'Ditolak') {
          logAudit('Pengurus DKM', 'ADMIN', 'admin@masjid.id', 'TOLAK_DONASI', `Menolak/membatalkan donasi ID: ${id}`, 'bg-red-900/50 text-red-600');
        }
        return { ...d, status };
      }
      return d;
    }));
  };
  
  // Home Visibility State managed by Admin
  const [homeVisibility, setHomeVisibility] = useState({
    showJadwal: true,
    showKalender: true,
    showZiswaf: true,
    showQuran: true,
    showTentang: true,
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase.from('programs').select('*').order('id');
        if (error) throw error;
        if (data && data.length > 0) {
          setPrograms(data);
        }
      } catch (err) {
        console.error('Error fetching programs from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);

  const handleAddDonation = async (programId: number, nominal: number) => {
    const updatedPrograms = programs.map(p => {
      if (p.id === programId) {
        const newTerkumpul = p.terkumpulRp + nominal;
        return {
          ...p,
          terkumpulRp: newTerkumpul,
          terkumpulPersen: p.targetRp > 0 ? Math.min(100, Math.round((newTerkumpul / p.targetRp) * 100)) : 0,
          donatur: p.donatur + 1
        };
      }
      return p;
    });

    setPrograms(updatedPrograms);

    // Update to Supabase
    const programToUpdate = updatedPrograms.find(p => p.id === programId);
    if (programToUpdate) {
      const { error } = await supabase
        .from('programs')
        .update({
          terkumpulRp: programToUpdate.terkumpulRp,
          terkumpulPersen: programToUpdate.terkumpulPersen,
          donatur: programToUpdate.donatur
        })
        .eq('id', programId);
        
      if (error) {
        console.error('Error updating program to Supabase:', error);
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative flex flex-col ${
      isDarkMode 
        ? 'dark bg-slate-950 text-slate-100 selection:bg-green-400 selection:text-white' 
        : 'bg-[#F7FBF4] text-[#1A1A1A] selection:bg-green-400 selection:text-white'
    }`}>
      {/* Navigation Header Always Visible */}
      <Header 
        onLoginClick={() => {
          if (isAdmin || isJamaahLoggedIn) {
            setShowPortal(true);
          } else {
            setIsLoginModalOpen(true);
          }
        }} 
        onAiClick={() => setIsAiModalOpen(true)} 
        onQuranClick={() => setIsQuranModalOpen(true)}
        onNavClick={() => {
          // Hide portal to show Beranda, without logging out
          setShowPortal(false);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAutoNight={isAutoNight}
        isLoggedIn={isAdmin || isJamaahLoggedIn}
        loggedInText={isAdmin ? 'Portal Admin' : 'Portal Jamaah'}
      />
      
      <main className="flex-1 flex flex-col">
        {(isAdmin && showPortal) ? (
          <div className="flex-1">
            <AdminDashboard 
              onBack={() => {
                logAudit('Pengurus DKM', 'ADMIN', 'admin@masjid.id', 'LOGOUT', 'User berhasil keluar (logout) dari sistem Admin', 'bg-red-900/50 text-red-600');
                setIsAdmin(false);
                setShowPortal(false);
              }} 
              programs={programs} 
              onAddDonation={handleAddDonation} 
              homeVisibility={homeVisibility}
              setHomeVisibility={setHomeVisibility}
              registeredJamaahList={registeredJamaahList}
              donasiHistory={donasiHistory}
              onVerifyDonasi={handleVerifyDonasi}
            />
          </div>
        ) : (isJamaahLoggedIn && showPortal) ? (
          <div className="flex-1">
            <JamaahDashboard 
              nama={namaJamaah} 
              kontak={kontakJamaah} 
              onBack={() => {
                logAudit(namaJamaah, 'JAMAAH', kontakJamaah, 'LOGOUT', 'User berhasil keluar (logout) dari Portal Jamaah', 'bg-red-900/50 text-red-600');
                setIsJamaahLoggedIn(false);
                setShowPortal(false);
                setNamaJamaah('Hamba Allah');
                setKontakJamaah('');
              }} 
              donasiHistory={donasiHistory}
            />
          </div>
        ) : (
          <>
            {/* Home / Beranda Sections */}
        <Hero />
        {homeVisibility.showJadwal && <JadwalShalatCard />}
        
        {/* Banner Button Al-Qur'an Digital di Beranda */}
        {homeVisibility.showQuran && (
          <section id="quran-beranda" className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-emerald-800 via-lime-700 to-green-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-lime-500/30">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="z-10 max-w-2xl space-y-4 text-center md:text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-lime-200 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
                  📖 Kitab Suci Al-Qur'an Digital 30 Juz
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                  Membaca & Memahami Al-Qur'an Kapan Saja
                </h2>
                <p className="text-lime-100 text-sm md:text-base leading-relaxed">
                  Akses 114 Surah Al-Qur'an lengkap dengan Audio Qari Murottal, terjemahan Indonesia, Tafsir Kemenag, petunjuk Tajwid berwarna, serta fitur penanda bacaan (*Bookmark*).
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <button
                    onClick={() => setIsQuranModalOpen(true)}
                    className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 text-amber-950" /> Buka Al-Qur'an Digital (114 Surah)
                  </button>
                </div>
              </div>

              <div className="z-10 flex flex-col items-center justify-center bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shrink-0 text-center w-full md:w-auto">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                  <BookOpen className="w-8 h-8 text-amber-300" />
                </div>
                <p className="text-xs font-bold text-lime-100 uppercase tracking-widest">Akses Gratis 100%</p>
                <p className="text-xl font-bold text-white mt-1">114 Surah & Audio MP3</p>
                <button
                  onClick={() => setIsQuranModalOpen(true)}
                  className="mt-4 w-full py-2.5 px-5 bg-white text-emerald-800 hover:bg-lime-50 font-extrabold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Baca Surah & Ayat ➔
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Kalender Kegiatan */}
        {homeVisibility.showKalender && <KalenderKegiatan />}

        {/* ZISWAF Programs */}
        {homeVisibility.showZiswaf && <DaftarProgram programs={programs} onDonate={handleDonateSubmit} />}

        {/* Al-Quran Digital - Modal Reader */}
        <AlQuranDigital 
          isOpenModal={isQuranModalOpen} 
          onCloseModal={() => setIsQuranModalOpen(false)} 
        />

        {/* Tentang Kami */}
        {homeVisibility.showTentang && (
          <div id="tentang">
            <ProfilMasjid />
          </div>
        )}

        {/* Kontak Kami & Media Sosial */}
        <div id="kontak">
          <LokasiKontak />
        </div>
        <MediaSosial />
          </>
        )}
      </main>

      {/* Floating Button to Return to Portal */}
      {(!showPortal && (isAdmin || isJamaahLoggedIn)) && (
        <div className="fixed bottom-6 right-6 z-[60] animate-bounce">
          <button
            onClick={() => setShowPortal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-lime-600 hover:bg-lime-700 text-white rounded-full shadow-[0_10px_40px_-10px_rgba(101,163,13,1)] font-bold border-4 border-white dark:border-slate-800 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-6 h-6" /> 
            Buka Portal Anda
          </button>
        </div>
      )}

      {/* Footer */}
      {!isAdmin && !isJamaahLoggedIn && <Footer onNavigate={() => {}} onOpenWakafModal={() => {}} />}

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onAdminLogin={() => {
          setIsAdmin(true);
          setShowPortal(true);
          logAudit('Pengurus DKM', 'ADMIN', 'admin@masjid.id', 'LOGIN', 'Admin berhasil login ke sistem', 'bg-lime-900/50 text-lime-600');
        }}
        onJamaahLogin={(nama, kontak) => {
          setIsJamaahLoggedIn(true);
          setShowPortal(true);
          setNamaJamaah(nama);
          setKontakJamaah(kontak);
          logAudit(nama, 'JAMAAH', kontak, 'LOGIN', 'Jamaah berhasil login ke portal', 'bg-blue-900/50 text-blue-600');
        }}
        registeredJamaahList={registeredJamaahList}
        onRegisterJamaah={(jamaah) => {
          handleRegisterJamaah(jamaah);
          logAudit(jamaah.n, 'JAMAAH_BARU', jamaah.c || jamaah.e, 'REGISTER', 'Registrasi jamaah baru berhasil dilakukan', 'bg-blue-900/50 text-blue-600');
        }}
      />
      <AiAsistenModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onOpenWakaf={() => {
          setIsAiModalOpen(false);
          document.getElementById('ziswaf')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
