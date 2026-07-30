import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, X, ChevronRight, Play, Pause, 
  Volume2, BookMarked, FileText, Mic2, ArrowLeft, SkipForward, 
  SkipBack, Bookmark, Copy, Check, Sparkles, Filter, VolumeX, List, Radio,
  Eye, EyeOff, Layers, Sparkle, Tag, HelpCircle, ArrowUpRight, Share2,
  Settings, RefreshCw, Info, ChevronDown
} from 'lucide-react';

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi?: string;
  audioFull?: { [key: string]: string } | string;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  teksInggris?: string;
  audio: { [key: string]: string };
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
  audioFull: { [key: string]: string } | string;
  tafsir?: { nomorAyat: number; teks: string }[];
}

export interface BookmarkData {
  surahNomor: number;
  surahNama: string;
  ayatNomor: number;
  timestamp: string;
}

type View = 'list' | 'detail';
type Tab = 'terjemahan' | 'tafsir' | 'tajwid';
type MainNavTab = 'surah' | 'juz' | 'tematik' | 'tajwid_guide';
type FilterType = 'all' | 'popular' | 'juz30';

const RECITERS = [
  { id: '05', name: 'Mishary Rashid Al-Afasy' },
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
];

const TAJWID_RULES = [
  { name: 'Idgham', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'Memasukkan bunyi nun mati/tanwin ke huruf berikutnya (Ya, Nun, Mim, Wawu, Lam, Ra).' },
  { name: 'Ikhfa', color: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Menyamarkan bunyi nun mati/tanwin dengan dengung 2 harakat saat bertemu 15 huruf ikhfa.' },
  { name: 'Iqlab', color: 'bg-rose-100 text-rose-800 border-rose-300', desc: 'Mengubah bunyi nun mati/tanwin menjadi bunyi Mim bersuara dengung saat bertemu huruf Ba.' },
  { name: 'Izhar', color: 'bg-sky-100 text-sky-800 border-sky-300', desc: 'Membaca nun mati/tanwin secara jelas tanpa dengung saat bertemu huruf Halqi (Hamzah, Ha, Ain, Ghain, Kha).' },
  { name: 'Qalqalah', color: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'Memantulkan huruf qalqalah (ق ط ب ج د) yang berharakat sukun atau wakaf.' },
  { name: 'Mad', color: 'bg-orange-100 text-orange-800 border-orange-300', desc: 'Membaca panjang bunyi alif/wawu/ya sukun dari 2 harakat hingga 6 harakat sesuai kaidah.' },
];

const JUZ_LIST = [
  { id: 1, name: "Juz 1", startSurah: 1, startAyat: 1, endSurah: 2, endAyat: 141, arabic: "اَلْجُزْءُ 1" },
  { id: 2, name: "Juz 2", startSurah: 2, startAyat: 142, endSurah: 2, endAyat: 252, arabic: "اَلْجُزْءُ 2" },
  { id: 3, name: "Juz 3", startSurah: 2, startAyat: 253, endSurah: 3, endAyat: 92, arabic: "اَلْجُزْءُ 3" },
  { id: 4, name: "Juz 4", startSurah: 3, startAyat: 93, endSurah: 4, endAyat: 23, arabic: "اَلْجُزْءُ 4" },
  { id: 5, name: "Juz 5", startSurah: 4, startAyat: 24, endSurah: 4, endAyat: 147, arabic: "اَلْجُزْءُ 5" },
  { id: 6, name: "Juz 6", startSurah: 4, startAyat: 148, endSurah: 5, endAyat: 81, arabic: "اَلْجُزْءُ 6" },
  { id: 7, name: "Juz 7", startSurah: 5, startAyat: 82, endSurah: 6, endAyat: 110, arabic: "اَلْجُزْءُ 7" },
  { id: 8, name: "Juz 8", startSurah: 6, startAyat: 111, endSurah: 7, endAyat: 87, arabic: "اَلْجُزْءُ 8" },
  { id: 9, name: "Juz 9", startSurah: 7, startAyat: 88, endSurah: 8, endAyat: 40, arabic: "اَلْجُزْءُ 9" },
  { id: 10, name: "Juz 10", startSurah: 8, startAyat: 41, endSurah: 9, endAyat: 92, arabic: "اَلْجُزْءُ 10" },
  { id: 11, name: "Juz 11", startSurah: 9, startAyat: 93, endSurah: 11, endAyat: 5, arabic: "اَلْجُزْءُ 11" },
  { id: 12, name: "Juz 12", startSurah: 11, startAyat: 6, endSurah: 12, endAyat: 52, arabic: "اَلْجُزْءُ 12" },
  { id: 13, name: "Juz 13", startSurah: 12, startAyat: 53, endSurah: 14, endAyat: 52, arabic: "اَلْجُزْءُ 13" },
  { id: 14, name: "Juz 14", startSurah: 15, startAyat: 1, endSurah: 16, endAyat: 128, arabic: "اَلْجُزْءُ 14" },
  { id: 15, name: "Juz 15", startSurah: 17, startAyat: 1, endSurah: 18, endAyat: 74, arabic: "اَلْجُزْءُ 15" },
  { id: 16, name: "Juz 16", startSurah: 18, startAyat: 75, endSurah: 20, endAyat: 135, arabic: "اَلْجُزْءُ 16" },
  { id: 17, name: "Juz 17", startSurah: 21, startAyat: 1, endSurah: 22, endAyat: 78, arabic: "اَلْجُزْءُ 17" },
  { id: 18, name: "Juz 18", startSurah: 23, startAyat: 1, endSurah: 25, endAyat: 20, arabic: "اَلْجُزْءُ 18" },
  { id: 19, name: "Juz 19", startSurah: 25, startAyat: 21, endSurah: 27, endAyat: 55, arabic: "اَلْجُزْءُ 19" },
  { id: 20, name: "Juz 20", startSurah: 27, startAyat: 56, endSurah: 29, endAyat: 45, arabic: "اَلْجُزْءُ 20" },
  { id: 21, name: "Juz 21", startSurah: 29, startAyat: 46, endSurah: 33, endAyat: 30, arabic: "اَلْجُزْءُ 21" },
  { id: 22, name: "Juz 22", startSurah: 33, startAyat: 31, endSurah: 36, endAyat: 27, arabic: "اَلْجُزْءُ 22" },
  { id: 23, name: "Juz 23", startSurah: 36, startAyat: 28, endSurah: 39, endAyat: 31, arabic: "اَلْجُزْءُ 23" },
  { id: 24, name: "Juz 24", startSurah: 39, startAyat: 32, endSurah: 41, endAyat: 46, arabic: "اَلْجُزْءُ 24" },
  { id: 25, name: "Juz 25", startSurah: 41, startAyat: 47, endSurah: 45, endAyat: 37, arabic: "اَلْجُزْءُ 25" },
  { id: 26, name: "Juz 26", startSurah: 46, startAyat: 1, endSurah: 51, endAyat: 30, arabic: "اَلْجُزْءُ 26" },
  { id: 27, name: "Juz 27", startSurah: 51, startAyat: 31, endSurah: 57, endAyat: 29, arabic: "اَلْجُزْءُ 27" },
  { id: 28, name: "Juz 28", startSurah: 58, startAyat: 1, endSurah: 66, endAyat: 12, arabic: "اَلْجُزْءُ 28" },
  { id: 29, name: "Juz 29", startSurah: 67, startAyat: 1, endSurah: 77, endAyat: 50, arabic: "اَلْجُزْءُ 29" },
  { id: 30, name: "Juz 30 (Juz 'Amma)", startSurah: 78, startAyat: 1, endSurah: 114, endAyat: 6, arabic: "اَلْجُزْءُ 30" },
];

const THEMATIC_INDEX = [
  { id: 'muamalat', title: 'Muamalat & Ekonomi Islam', icon: '💰', desc: 'Ayat tentang Larangan Riba, Jual Beli, Hutang Piutang, Zakat, dan Infak.', surahTarget: 2, ayatTarget: 275 },
  { id: 'ibadah', title: 'Ibadah & Ritual', icon: '🕌', desc: 'Ayat tentang Shalat, Puasa Ramadhan, Haji, Thaharah, dan Doa Khusyu\'.', surahTarget: 2, ayatTarget: 183 },
  { id: 'akhlaq', title: 'Akhlaq & Adab', icon: '🌱', desc: 'Ayat tentang Berbakti kepada Orang Tua, Sopan Santun, dan Sabar.', surahTarget: 17, ayatTarget: 23 },
  { id: 'sejarah', title: 'Bangsa Terdahulu & Sejarah', icon: '🏛️', desc: 'Kisah Para Nabi, Kaum \'Ad, Tsamud, Fir\'aun, dan Ashabul Kahfi.', surahTarget: 18, ayatTarget: 9 },
  { id: 'makanan', title: 'Makanan & Minuman Halal', icon: '🍎', desc: 'Ayat tentang Makanan Halal-Thayyib, Larangan Khamr dan Bangkai.', surahTarget: 2, ayatTarget: 168 },
  { id: 'peradilan', title: 'Peradilan & Hukum Hakim', icon: '⚖️', desc: 'Tegaknya Keadilan, Kesaksian Jujur, dan Kepemimpinan Amanah.', surahTarget: 4, ayatTarget: 58 },
  { id: 'iman', title: 'Iman & Aqidah Tauhid', icon: '✨', desc: 'Rukun Iman, Tauhid, Malaikat, Kitab-Kitab Allah, Hari Akhir, dan Qadha Qadar.', surahTarget: 2, ayatTarget: 285 },
  { id: 'quran', title: 'Kemuliaan Al-Qur\'an', icon: '📖', desc: 'Keutamaan Membaca, Menghafal, Nuzulul Qur\'an, dan Mukjizat Al-Qur\'an.', surahTarget: 17, ayatTarget: 82 },
  { id: 'pakaian', title: 'Pakaian & Aurat', icon: '👔', desc: 'Menutup Aurat, Perhiasan Dunia, dan Pakaian Takwa.', surahTarget: 7, ayatTarget: 26 },
  { id: 'jinayah', title: 'Hukum Pidana & Jinayah', icon: '📜', desc: 'Qishash, Diyat, Pencurian, dan Larangan Menumpahkan Darah.', surahTarget: 2, ayatTarget: 178 },
  { id: 'ilmu', title: 'Ilmu & Pengetahuan', icon: '💡', desc: 'Keutamaan Orang Berilmu, Tadabbur Alam Semesta, dan Literasi Iqra\'.', surahTarget: 96, ayatTarget: 1 },
  { id: 'privat', title: 'Hukum Privat & Keluarga', icon: '🏡', desc: 'Pernikahan (Nikah), Mawaddah Warahmah, Hak Suami Istri, dan Waris.', surahTarget: 4, ayatTarget: 11 },
  { id: 'jihad', title: 'Jihad & Perjuangan Islam', icon: '🛡️', desc: 'Perjuangan membela Kebenaran, Ketabahan, dan Pengorbanan Jiwa Raga.', surahTarget: 9, ayatTarget: 41 },
];

const POPULAR_SURAHS = [1, 2, 18, 36, 55, 56, 67, 78, 112, 113, 114];

const toArabicDigits = (num: number): string => {
  return String(num).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

interface AlQuranDigitalProps {
  isOpenModal?: boolean;
  initialSurahNomor?: number | null;
  onCloseModal?: () => void;
}

export const AlQuranDigital: React.FC<AlQuranDigitalProps> = ({ 
  isOpenModal = false, 
  initialSurahNomor = null,
  onCloseModal 
}) => {
  const [isOpen, setIsOpen] = useState(isOpenModal);
  const [view, setView] = useState<View>('list');
  const [mainNavTab, setMainNavTab] = useState<MainNavTab>('surah');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [tafsirData, setTafsirData] = useState<{ nomorAyat: number; teks: string }[]>([]);
  const [selectedQari, setSelectedQari] = useState('05');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [copiedAyat, setCopiedAyat] = useState<number | null>(null);
  const [sharedAyat, setSharedAyat] = useState<number | null>(null);

  // Per-Ayat Tazkia Mode Toggles & Modals State
  const [tahfidzHiddenAyats, setTahfidzHiddenAyats] = useState<{ [key: number]: boolean }>({});
  const [activeTafsirAyat, setActiveTafsirAyat] = useState<Ayat | null>(null);
  const [activeTajwidAyat, setActiveTajwidAyat] = useState<Ayat | null>(null);
  const [activeTatbhiqAyat, setActiveTatbhiqAyat] = useState<Ayat | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Bookmark State
  const [bookmark, setBookmark] = useState<BookmarkData | null>(() => {
    const saved = localStorage.getItem('masjid_quran_bookmark');
    return saved ? JSON.parse(saved) : null;
  });

  // Audio state
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch Surah List on Mount
  useEffect(() => {
    let isMounted = true;
    setLoadingList(true);
    fetch('https://equran.id/api/v2/surat')
      .then(r => r.json())
      .then(d => { 
        if (isMounted && d.data) {
          setSurahs(d.data);
        }
      })
      .catch(err => {
        console.error('Error fetching surahs from equran.id:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingList(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Sync external props with internal open state
  useEffect(() => {
    if (isOpenModal !== undefined) {
      setIsOpen(isOpenModal);
    }
  }, [isOpenModal]);

  // Handle Initial Surah Selection from Props
  useEffect(() => {
    if (initialSurahNomor && surahs.length > 0) {
      const targetSurah = surahs.find(s => s.nomor === initialSurahNomor);
      if (targetSurah) {
        openSurah(targetSurah);
        setIsOpen(true);
      }
    }
  }, [initialSurahNomor, surahs]);

  const saveBookmark = (surahNomor: number, surahNama: string, ayatNomor: number) => {
    const data: BookmarkData = {
      surahNomor,
      surahNama,
      ayatNomor,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setBookmark(data);
    localStorage.setItem('masjid_quran_bookmark', JSON.stringify(data));
  };

  const openSurah = async (surah: Surah, targetAyat?: number) => {
    setLoadingDetail(true);
    setView('detail');
    setPlayingAyat(null);
    setIsPlayingFull(false);
    stopAudio();
    try {
      const res = await fetch(`https://equran.id/api/v2/surat/${surah.nomor}`);
      const data = await res.json();
      setSelectedSurah(data.data);

      if (targetAyat) {
        setTimeout(() => {
          const el = document.getElementById(`ayat-${targetAyat}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (e) {
      console.error('Error fetching surah detail:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchTafsir = async (nomorSurah: number) => {
    if (tafsirData.length > 0) return;
    try {
      const res = await fetch(`https://equran.id/api/v2/tafsir/${nomorSurah}`);
      const data = await res.json();
      setTafsirData(data.data?.tafsir || []);
    } catch (e) {
      console.error('Error fetching tafsir:', e);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) { 
      audioRef.current.pause(); 
      audioRef.current.src = ''; 
    }
    if (fullAudioRef.current) { 
      fullAudioRef.current.pause(); 
      fullAudioRef.current.src = ''; 
    }
    setPlayingAyat(null);
    setIsPlayingFull(false);
  };

  const playAyat = (ayat: Ayat) => {
    if (playingAyat === ayat.nomorAyat) {
      stopAudio();
      return;
    }
    stopAudio();

    const url = ayat.audio?.[selectedQari] || Object.values(ayat.audio || {})[0];
    if (!url) return;

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setPlayingAyat(ayat.nomorAyat);

    audio.onended = () => {
      setPlayingAyat(null);
      if (autoPlayNext && selectedSurah) {
        const nextAyatIndex = selectedSurah.ayat.findIndex(a => a.nomorAyat === ayat.nomorAyat) + 1;
        if (nextAyatIndex < selectedSurah.ayat.length) {
          const nextAyat = selectedSurah.ayat[nextAyatIndex];
          playAyat(nextAyat);
          const el = document.getElementById(`ayat-${nextAyat.nomorAyat}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
  };

  const copyAyatToClipboard = (ayat: Ayat) => {
    const textToCopy = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}" (QS. ${selectedSurah?.namaLatin}: ${ayat.nomorAyat})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyat(ayat.nomorAyat);
    setTimeout(() => setCopiedAyat(null), 2000);
  };

  const shareAyat = (ayat: Ayat) => {
    const shareUrl = `${window.location.origin}?surah=${selectedSurah?.nomor}&ayat=${ayat.nomorAyat}`;
    if (navigator.share) {
      navigator.share({
        title: `QS. ${selectedSurah?.namaLatin}: Ayat ${ayat.nomorAyat}`,
        text: `"${ayat.teksIndonesia}"`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setSharedAyat(ayat.nomorAyat);
      setTimeout(() => setSharedAyat(null), 2000);
    }
  };

  const toggleTahfidzAyat = (ayatNomor: number) => {
    setTahfidzHiddenAyats(prev => ({
      ...prev,
      [ayatNomor]: !prev[ayatNomor]
    }));
  };

  const openTafsirModal = (ayat: Ayat) => {
    setActiveTafsirAyat(ayat);
    if (selectedSurah) {
      fetchTafsir(selectedSurah.nomor);
    }
  };

  const goBack = () => {
    stopAudio();
    setView('list');
    setSelectedSurah(null);
    setTafsirData([]);
  };

  const handleClose = () => {
    stopAudio();
    setIsOpen(false);
    if (onCloseModal) onCloseModal();
  };

  const jumpToBookmark = () => {
    if (!bookmark) return;
    const targetSurah = surahs.find(s => s.nomor === bookmark.surahNomor);
    if (targetSurah) {
      openSurah(targetSurah, bookmark.ayatNomor);
      setIsOpen(true);
    }
  };

  const filteredSurahs = surahs.filter(s => {
    const matchesSearch = 
      s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nama.includes(searchQuery) ||
      String(s.nomor) === searchQuery;

    if (!matchesSearch) return false;

    if (activeFilter === 'popular') return POPULAR_SURAHS.includes(s.nomor);
    if (activeFilter === 'juz30') return s.nomor >= 78 && s.nomor <= 114;
    return true;
  });

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-2xl leading-relaxed';
      case 'lg': return 'text-4xl leading-loose';
      case 'xl': return 'text-5xl leading-loose';
      default: return 'text-3xl leading-loose';
    }
  };

  return (
    <>

      {/* FULL SCREEN INTERACTIVE READER MODAL - TAZKIA EXACT INTERFACE */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
          
          {/* Header 1: QURAN TAZKIA Top Navigation Header */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs z-30">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={goBack}>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight font-serif uppercase">
                  QURAN TAZKIA
                </span>
              </div>

              {/* Navigation Bar Links */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <button onClick={() => setMainNavTab('surah')} className="hover:text-blue-600 transition-colors">About</button>
                <button onClick={() => setMainNavTab('surah')} className="hover:text-blue-600 transition-colors">Donasi</button>
                <button onClick={() => setMainNavTab('tajwid_guide')} className="hover:text-blue-600 transition-colors">Panduan Tajwid</button>
                <button onClick={() => setMainNavTab('tematik')} className="hover:text-blue-600 transition-colors">Ayat Hadist Ekonomi</button>
                <button onClick={() => setMainNavTab('tematik')} className="hover:text-blue-600 transition-colors">Hadist</button>
              </nav>
            </div>

            {/* Top Right Search + Controls */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-4 pr-16 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 focus:outline-none w-48 focus:w-60 transition-all"
                />
                <button className="absolute right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-r-lg font-bold transition-colors">
                  Search
                </button>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Sub Header Bar 2: Surah & Ayat Selectors + Setting */}
          {view === 'detail' && selectedSurah && (
            <div className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-12 py-2.5 flex items-center justify-between z-20 text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                {/* Surah Dropdown Selector */}
                <div className="relative">
                  <select
                    value={selectedSurah.nomor}
                    onChange={e => {
                      const s = surahs.find(item => item.nomor === Number(e.target.value));
                      if (s) openSurah(s);
                    }}
                    className="appearance-none font-bold text-slate-800 dark:text-slate-100 bg-transparent pr-6 focus:outline-none cursor-pointer"
                  >
                    {surahs.map(s => (
                      <option key={s.nomor} value={s.nomor}>{s.namaLatin}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                <span className="text-slate-300 dark:text-slate-700">•</span>

                {/* Ayat Dropdown Selector */}
                <div className="relative">
                  <select
                    onChange={e => {
                      const ayatEl = document.getElementById(`ayat-${e.target.value}`);
                      if (ayatEl) ayatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="appearance-none font-bold text-slate-800 dark:text-slate-100 bg-transparent pr-6 focus:outline-none cursor-pointer"
                  >
                    {selectedSurah.ayat?.map(a => (
                      <option key={a.nomorAyat} value={a.nomorAyat}>Ayat {a.nomorAyat}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Setting Button */}
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Setting</span>
              </button>
            </div>
          )}

          {/* Quick Settings Bar Toggle Drawer */}
          {isSettingsOpen && (
            <div className="bg-blue-50 dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-700 dark:text-slate-300">Pilih Qari Murottal:</span>
                <select
                  value={selectedQari}
                  onChange={e => setSelectedQari(e.target.value)}
                  className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  {RECITERS.map(q => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-700 dark:text-slate-300">Ukuran Font Arab:</span>
                <div className="flex gap-1">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 rounded-md font-bold uppercase ${fontSize === sz ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Main Content Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-12 md:px-24 py-8 space-y-8">
            {view === 'list' ? (
              <div className="max-w-5xl mx-auto space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Daftar Surah Al-Qur'an Tazkia</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredSurahs.map(surah => (
                    <button
                      key={surah.nomor}
                      onClick={() => openSurah(surah)}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-2xs transition-all text-left flex justify-between items-center cursor-pointer"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{surah.namaLatin}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{surah.arti}</p>
                      </div>
                      <span className="font-serif text-lg text-slate-800 dark:text-slate-200" style={{ fontFamily: '"Amiri", serif' }}>
                        {surah.nama}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* EXACT TAZKIA AYAT READER VIEW */
              <div className="max-w-4xl mx-auto space-y-12 pb-24">
                
                {/* Centered Bismillah Header (Tazkia Style) */}
                {selectedSurah && selectedSurah.nomor !== 9 && (
                  <div className="text-center py-6">
                    <p className="font-serif text-3xl sm:text-4xl text-slate-800 dark:text-slate-100 tracking-widest leading-loose" style={{ fontFamily: '"Amiri", serif' }}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>
                )}

                {/* Ayat Rows (Tazkia Design) */}
                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600" />
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-xs">Memuat Ayat...</p>
                  </div>
                ) : (
                  selectedSurah?.ayat?.map(ayat => {
                    const isPlaying = playingAyat === ayat.nomorAyat;
                    const isTahfidzHidden = !!tahfidzHiddenAyats[ayat.nomorAyat];

                    return (
                      <div
                        key={ayat.nomorAyat}
                        id={`ayat-${ayat.nomorAyat}`}
                        className={`pt-6 pb-8 border-b border-slate-200 dark:border-slate-800 space-y-6 transition-all ${
                          isPlaying ? 'bg-blue-50/50 dark:bg-blue-950/30 px-4 rounded-2xl' : ''
                        }`}
                      >
                        {/* 1. ARABIC VERSE - RIGHT ALIGNED WITH EASTERN ARABIC NUMERAL */}
                        <div className="text-right leading-loose">
                          <p className={`font-serif text-slate-900 dark:text-slate-50 ${getFontSizeClass()}`} style={{ fontFamily: '"Amiri", serif' }}>
                            ( {toArabicDigits(ayat.nomorAyat)} ) {ayat.teksArab}
                          </p>
                        </div>

                        {/* 2. TRANSLATIONS (INDONESIAN + ENGLISH) - LEFT ALIGNED */}
                        {!isTahfidzHidden && (
                          <div className="space-y-4 text-left max-w-3xl pt-2">
                            {/* Indonesian Translation Kemenag RI */}
                            <div className="space-y-1">
                              <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                                {ayat.teksIndonesia}
                              </p>
                              <p className="text-xs italic text-slate-400 font-serif">
                                Indonesian Islamic Affairs Ministry
                              </p>
                            </div>

                            {/* English Translation Saheeh International */}
                            <div className="space-y-1">
                              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                                {ayat.teksInggris || `In the name of Allāh, the Entirely Merciful, the Especially Merciful.`}
                              </p>
                              <p className="text-xs italic text-slate-400 font-serif">
                                Saheeh International
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 3. TAZKIA PER-AYAT ACTION TOOLBAR (RIGHT ALIGNED) */}
                        <div className="flex flex-wrap items-center justify-end gap-5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                          
                          {/* Share */}
                          <button
                            onClick={() => shareAyat(ayat)}
                            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-[11px]">Share</span>
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => copyAyatToClipboard(ayat)}
                            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {copiedAyat === ayat.nomorAyat ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            <span className="text-[11px]">{copiedAyat === ayat.nomorAyat ? 'Copied' : 'Copy'}</span>
                          </button>

                          {/* Play */}
                          <button
                            onClick={() => playAyat(ayat)}
                            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                              isPlaying ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                            <span className="text-[11px]">{isPlaying ? 'Playing' : 'Play'}</span>
                          </button>

                          {/* Tahsin (Tajwid Modal) */}
                          <button
                            onClick={() => setActiveTajwidAyat(ayat)}
                            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Sparkle className="w-4 h-4" />
                            <span className="text-[11px]">Tahsin</span>
                          </button>

                          {/* Tahfiz (Toggle Translation) */}
                          <button
                            onClick={() => toggleTahfidzAyat(ayat.nomorAyat)}
                            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                              isTahfidzHidden ? 'text-purple-600 font-bold' : 'hover:text-blue-600'
                            }`}
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-[11px]">Tahfiz</span>
                          </button>

                          {/* Tafsir Modal */}
                          <button
                            onClick={() => openTafsirModal(ayat)}
                            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[11px]">Tafsir</span>
                          </button>

                          {/* Tatbhiq (Tematik) */}
                          <button
                            onClick={() => setActiveTatbhiqAyat(ayat)}
                            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Layers className="w-4 h-4" />
                            <span className="text-[11px]">Tatbhiq</span>
                          </button>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAJID / TAHSIN MODAL */}
      {activeTajwidAyat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                ✨ Panduan Tahsin (Tajwid) Ayat {activeTajwidAyat.nomorAyat}
              </h4>
              <button onClick={() => setActiveTajwidAyat(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="font-serif text-right text-2xl text-slate-800 dark:text-slate-100" style={{ fontFamily: '"Amiri", serif' }}>
              {activeTajwidAyat.teksArab}
            </p>

            <div className="space-y-3 pt-2">
              {TAJWID_RULES.map(rule => (
                <div key={rule.name} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${rule.color}`}>
                    {rule.name}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAFSIR MODAL */}
      {activeTafsirAyat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                📚 Tafsir Kemenag RI • QS. {selectedSurah?.namaLatin} Ayat {activeTafsirAyat.nomorAyat}
              </h4>
              <button onClick={() => setActiveTafsirAyat(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pr-2">
              <p className="font-serif text-right text-2xl text-slate-900 dark:text-slate-100 leading-loose" style={{ fontFamily: '"Amiri", serif' }}>
                {activeTafsirAyat.teksArab}
              </p>
              
              {/* Terjemahan */}
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <strong className="text-green-700 dark:text-green-400 block mb-1 text-xs font-bold">Terjemahan (Kemenag RI):</strong>
                <p className="text-slate-700 dark:text-slate-300 text-sm italic">"{activeTafsirAyat.teksIndonesia}"</p>
              </div>

              {/* Tafsir Content from API */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-blue-600 dark:text-blue-400 block mb-2 font-bold text-xs">Tafsir Kemenag RI (Tahlili & Ringkas):</strong>
                {tafsirData.length > 0 ? (
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {tafsirData.find(t => t.nomorAyat === activeTafsirAyat.nomorAyat)?.teks || 'Tafsir untuk ayat ini belum tersedia dalam database API.'}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-blue-500" />
                    <span className="text-xs">Memuat data tafsir dari API equran.id...</span>
                  </div>
                )}
              </div>

              {/* Referensi */}
              <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Sumber Tafsir: Kementerian Agama Republik Indonesia • API: equran.id/api/v2/tafsir/{selectedSurah?.nomor}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TATBHIQ TEMATIK MODAL */}
      {activeTatbhiqAyat && selectedSurah && (() => {
        // Dynamically match this ayat's surah against THEMATIC_INDEX references
        const matchedThemes = THEMATIC_INDEX.filter(t => t.surahTarget === selectedSurah.nomor);
        const generalThemes = matchedThemes.length > 0 ? matchedThemes : THEMATIC_INDEX.slice(0, 3);
        return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                🏷️ Tatbhiq Tematik • QS. {selectedSurah.namaLatin} Ayat {activeTatbhiqAyat.nomorAyat}
              </h4>
              <button onClick={() => setActiveTatbhiqAyat(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Kategori tematik Al-Qur'an berdasarkan indeks referensi Tazkia untuk surah ini:
            </p>

            <div className="space-y-2 pt-2">
              {generalThemes.map(theme => (
                <div key={theme.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xl shrink-0">{theme.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{theme.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{theme.desc}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Ref: QS. {surahs.find(s => s.nomor === theme.surahTarget)?.namaLatin || theme.surahTarget}: {theme.ayatTarget}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        );
      })()}
    </>
  );
};
