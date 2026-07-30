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
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJamaahLoggedIn, setIsJamaahLoggedIn] = useState(false);
  const [namaJamaah, setNamaJamaah] = useState('Hamba Allah');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      terkumpulPersen: INITIAL_STATS.progresKeseluruhan,
      terkumpulRp: INITIAL_STATS.terkumpul,
      targetRp: INITIAL_STATS.targetDana,
      donatur: INITIAL_STATS.totalMuwakif,
      gambar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      kategori: 'sedekah',
      judul: 'Santunan Yatim Piatu',
      deskripsi: 'Berbagi Kasih Bersama Anak Yatim.',
      terkumpulPersen: 45,
      terkumpulRp: 112500000,
      targetRp: 250000000,
      donatur: 42,
      gambar: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      kategori: 'zakat',
      judul: 'Santunan Dhuafa (& Fakir Miskin)',
      deskripsi: 'Meringankan Beban Saudara Kita.',
      terkumpulPersen: 12,
      terkumpulRp: 90000000,
      targetRp: 750000000,
      donatur: 15,
      gambar: 'https://images.unsplash.com/photo-1593113589914-075990190da5?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // State for ZISWAF Programs
  const [programs, setPrograms] = useState(defaultPrograms);
  
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
          terkumpulPersen: Math.min(100, Math.round((newTerkumpul / p.targetRp) * 100)),
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

  if (isAdmin) {
    return <AdminDashboard 
      onBack={() => setIsAdmin(false)} 
      programs={programs} 
      onAddDonation={handleAddDonation} 
      homeVisibility={homeVisibility}
      setHomeVisibility={setHomeVisibility}
    />;
  }

  if (isJamaahLoggedIn) {
    return <JamaahDashboard nama={namaJamaah} onBack={() => { setIsJamaahLoggedIn(false); setNamaJamaah('Hamba Allah'); }} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative ${
      isDarkMode 
        ? 'dark bg-slate-950 text-slate-100 selection:bg-green-400 selection:text-white' 
        : 'bg-[#F7FBF4] text-[#1A1A1A] selection:bg-green-400 selection:text-white'
    }`}>
      {/* Navigation Header */}
      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onAiClick={() => setIsAiModalOpen(true)} 
        onQuranClick={() => setIsQuranModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAutoNight={isAutoNight}
      />

      <main>
        {/* Home / Beranda Sections */}
        <Hero />
        {homeVisibility.showJadwal && <JadwalShalatCard />}
        
        {/* Kalender Kegiatan */}
        {homeVisibility.showKalender && <KalenderKegiatan />}

        {/* ZISWAF Programs */}
        {homeVisibility.showZiswaf && <DaftarProgram programs={programs} />}

        {/* Al-Quran Digital - Modal Only (accessible via header nav click) */}
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
      </main>

      {/* Footer */}
      <Footer onNavigate={() => {}} onOpenWakafModal={() => {}} />

      {/* Floating Crescent Moon Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-2xl border-2 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer ${
          isDarkMode 
            ? 'bg-slate-900 border-amber-400/50 text-amber-300 hover:bg-slate-800' 
            : 'bg-white border-green-300 text-green-700 hover:bg-green-50'
        }`}
        title={isDarkMode ? 'Beralih ke Mode Siang ☀️' : 'Beralih ke Mode Malam 🌙'}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-green-700" />
        )}
      </button>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onAdminLogin={() => setIsAdmin(true)} 
        onJamaahLogin={(nama) => { setNamaJamaah(nama); setIsJamaahLoggedIn(true); }}
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
