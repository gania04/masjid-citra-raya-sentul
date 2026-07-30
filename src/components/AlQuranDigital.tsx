import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, X, ChevronRight, Play, Pause, 
  Volume2, BookMarked, FileText, Mic2, ArrowLeft, SkipForward, 
  SkipBack, Bookmark, Copy, Check, Sparkles, Filter, VolumeX, List, Radio,
  Eye, EyeOff, Layers, Sparkle, Tag, HelpCircle, ArrowUpRight
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
  const [activeTab, setActiveTab] = useState<Tab>('terjemahan');
  const [tafsirData, setTafsirData] = useState<{ nomorAyat: number; teks: string }[]>([]);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [selectedQari, setSelectedQari] = useState('05');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [hideTranslationForTahfidz, setHideTranslationForTahfidz] = useState(false);
  const [copiedAyat, setCopiedAyat] = useState<number | null>(null);

  // Bookmark State
  const [bookmark, setBookmark] = useState<BookmarkData | null>(() => {
    const saved = localStorage.getItem('masjid_quran_bookmark');
    return saved ? JSON.parse(saved) : null;
  });

  // Audio state
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState('00:00');
  const [audioDuration, setAudioDuration] = useState('00:00');
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
    setActiveTab('terjemahan');
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
    setLoadingTafsir(true);
    try {
      const res = await fetch(`https://equran.id/api/v2/tafsir/${nomorSurah}`);
      const data = await res.json();
      setTafsirData(data.data?.tafsir || []);
    } catch (e) {
      console.error('Error fetching tafsir:', e);
    } finally {
      setLoadingTafsir(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'tafsir' && selectedSurah) {
      fetchTafsir(selectedSurah.nomor);
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
    setAudioProgress(0);
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

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const playFullSurah = () => {
    if (isPlayingFull) { 
      stopAudio(); 
      return; 
    }
    stopAudio();
    const surahAudio = selectedSurah?.audioFull;
    let url = '';
    if (typeof surahAudio === 'object' && surahAudio !== null) {
      url = (surahAudio as { [key: string]: string })[selectedQari] || (Object.values(surahAudio)[0] as string) || '';
    } else if (typeof surahAudio === 'string') {
      url = surahAudio;
    }
    if (!url) return;

    const audio = new Audio(url);
    fullAudioRef.current = audio;
    audio.play();
    setIsPlayingFull(true);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setAudioCurrentTime(formatTime(audio.currentTime));
        setAudioDuration(formatTime(audio.duration));
      }
    };

    audio.onended = () => { 
      setIsPlayingFull(false); 
      setAudioProgress(0); 
    };
  };

  const copyAyatToClipboard = (ayat: Ayat) => {
    const textToCopy = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}" (QS. ${selectedSurah?.namaLatin}: ${ayat.nomorAyat})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyat(ayat.nomorAyat);
    setTimeout(() => setCopiedAyat(null), 2000);
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
      case 'sm': return 'text-2xl sm:text-3xl leading-relaxed';
      case 'lg': return 'text-4xl sm:text-5xl leading-loose';
      case 'xl': return 'text-5xl sm:text-6xl leading-loose';
      default: return 'text-3xl sm:text-4xl leading-loose';
    }
  };

  return (
    <>
      {/* Homepage Integrated Al-Quran Section */}
      <section className="py-12 bg-gradient-to-b from-slate-50 via-lime-50/40 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900 transition-colors" id="quran">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Banner - Reference Tazkia 5T */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <BookOpen className="w-80 h-80 -mt-16 -mr-16 text-emerald-200" />
            </div>
            
            <div className="relative z-10 text-center md:text-left space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Program Al-Qur'an 5T Tazkia Reference
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif flex items-center justify-center md:justify-start gap-3">
                <BookOpen className="w-8 h-8 text-emerald-300" /> Portal Al-Qur'an Digital 5T
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                <strong>5T Framework:</strong> Tahsin (Tajwid Berwarna), Tahfidz (Mode Hifz), Tarjamah (Kemenag RI), Tafsir Lengkap, & Tathbiq (Indeks Ayat Tematik Ekonomi, Muamalat & Ibadah).
              </p>

              {/* 5T Badge Cards */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-800/80 border border-emerald-600/50 text-[11px] font-bold text-emerald-200">
                  ✨ Tahsin
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-teal-800/80 border border-teal-600/50 text-[11px] font-bold text-teal-200">
                  🧠 Tahfidz
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-800/80 border border-amber-600/50 text-[11px] font-bold text-amber-200">
                  📖 Tarjamah
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-800/80 border border-purple-600/50 text-[11px] font-bold text-purple-200">
                  📚 Tafsir
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-800/80 border border-indigo-600/50 text-[11px] font-bold text-indigo-200">
                  🏷️ Tathbiq Tematik
                </span>
              </div>
              
              {bookmark && (
                <div className="pt-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs bg-emerald-950/80 px-3.5 py-1.5 rounded-xl text-emerald-200 flex items-center gap-2 border border-emerald-500/40 shadow-xs">
                    <Bookmark className="w-4 h-4 text-amber-300 fill-amber-300" /> 
                    Terakhir Dibaca: <strong className="text-white font-bold">{bookmark.surahNama} (Ayat {bookmark.ayatNomor})</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {bookmark && (
                <button
                  onClick={jumpToBookmark}
                  className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 px-5 py-3 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
                >
                  <Bookmark className="w-4 h-4 fill-amber-950" /> Lanjutkan Membaca
                </button>
              )}
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm cursor-pointer"
              >
                Buka Qur'an Mode Penuh <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Embedded Navigation Tabs (Surah | Juz | Indeks Tematik | Tajwid) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            
            {/* 4 Main Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setMainNavTab('surah')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  mainNavTab === 'surah'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Daftar Surah (114)
              </button>
              <button
                onClick={() => setMainNavTab('juz')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  mainNavTab === 'juz'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" /> Daftar Juz (30)
              </button>
              <button
                onClick={() => setMainNavTab('tematik')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  mainNavTab === 'tematik'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Tag className="w-4 h-4" /> Indeks Tematik (Tathbiq)
              </button>
              <button
                onClick={() => setMainNavTab('tajwid_guide')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  mainNavTab === 'tajwid_guide'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Sparkle className="w-4 h-4" /> Panduan Tajwid (Tahsin)
              </button>
            </div>

            {/* TAB 1: SURAH LIST */}
            {mainNavTab === 'surah' && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-2">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                      placeholder="Cari surah (Al-Fatihah, Yasin, 36)..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Filter:
                    </span>
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      Semua Surah (114)
                    </button>
                    <button
                      onClick={() => setActiveFilter('popular')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'popular' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      ⭐ Populer
                    </button>
                    <button
                      onClick={() => setActiveFilter('juz30')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'juz30' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      📖 Juz 'Amma
                    </button>
                  </div>
                </div>

                {loadingList ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="text-emerald-800 font-bold text-xs animate-pulse">Memuat Daftar Surah Al-Qur'an...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSurahs.map(surah => (
                      <button
                        key={surah.nomor}
                        onClick={() => {
                          openSurah(surah);
                          setIsOpen(true);
                        }}
                        className="bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between text-left relative overflow-hidden"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold text-sm group-hover:bg-emerald-700 group-hover:text-white transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs">
                            {surah.nomor}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate text-sm">
                              {surah.namaLatin}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {surah.arti}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                              {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-serif text-xl text-emerald-800 dark:text-emerald-300 group-hover:text-emerald-600 transition-colors" style={{ fontFamily: '"Amiri", serif' }}>
                            {surah.nama}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                            Baca <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: JUZ LIST */}
            {mainNavTab === 'juz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {JUZ_LIST.map(j => (
                  <button
                    key={j.id}
                    onClick={() => {
                      const targetSurah = surahs.find(s => s.nomor === j.startSurah) || surahs[0];
                      if (targetSurah) {
                        openSurah(targetSurah, j.startAyat);
                        setIsOpen(true);
                      }
                    }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-700/80 transition-all text-left group flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                          {j.id}
                        </span>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 transition-colors text-sm">
                          {j.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Mulai: Surah #{j.startSurah} (Ayat {j.startAyat}) s/d Surah #{j.endSurah} (Ayat {j.endAyat})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-lg text-emerald-800 dark:text-emerald-300 font-bold block" style={{ fontFamily: '"Amiri", serif' }}>
                        {j.arabic}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                        Buka Juz <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB 3: INDEKS TEMATIK (TATHBIQ) */}
            {mainNavTab === 'tematik' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl">
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                    💡 <strong>Indeks Tematik (Tathbiq):</strong> Jelajahi Al-Qur'an berdasarkan topik pembahasan spesifik seperti Ekonomi Islam, Muamalat, Ibadah, Akhlaq, dan Hukum.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {THEMATIC_INDEX.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        const targetSurah = surahs.find(s => s.nomor === t.surahTarget);
                        if (targetSurah) {
                          openSurah(targetSurah, t.ayatTarget);
                          setIsOpen(true);
                        }
                      }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-700 transition-all text-left cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{t.icon}</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-700 transition-colors">
                          {t.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {t.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-3 flex justify-between items-center text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <span>Lihat Referensi Ayat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PANDUAN TAJWID (TAHSIN) */}
            {mainNavTab === 'tajwid_guide' && (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl">
                  <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                    ✨ <strong>Tahsin & Panduan Hukum Tajwid:</strong> Kode warna pada teks bacaan membantu melatih pengucapan yang makhraj & tartil sesuai hukum tajwid.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TAJWID_RULES.map(rule => (
                    <div key={rule.name} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black border ${rule.color}`}>
                          Hukum: {rule.name}
                        </span>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FULL SCREEN INTERACTIVE READER MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
          
          {/* Top Bar Navigation */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {view === 'detail' ? (
                <button
                  onClick={goBack}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all flex items-center gap-1 text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    🕌
                  </div>
                  <span className="font-extrabold text-sm sm:text-base">Al-Qur'an Digital 5T</span>
                </div>
              )}

              {selectedSurah && view === 'detail' && (
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    QS. {selectedSurah.namaLatin} ({selectedSurah.nomor})
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {selectedSurah.jumlahAyat} Ayat</span>
                </div>
              )}
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-2">
              {view === 'detail' && (
                <>
                  {/* Mode Tahfidz Switch */}
                  <button
                    onClick={() => setHideTranslationForTahfidz(!hideTranslationForTahfidz)}
                    title={hideTranslationForTahfidz ? 'Tampilkan Terjemahan' : 'Sembunyikan Terjemahan (Mode Tahfidz / Latihan Hafalan)'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      hideTranslationForTahfidz
                        ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {hideTranslationForTahfidz ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{hideTranslationForTahfidz ? 'Tahfidz On' : 'Mode Tahfidz'}</span>
                  </button>

                  {/* Font Size Toggle */}
                  <select
                    value={fontSize}
                    onChange={e => setFontSize(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="sm">Font Sedang</option>
                    <option value="md">Font Besar</option>
                    <option value="lg">Font Ekstra Besar</option>
                    <option value="xl">Font Maksimal</option>
                  </select>

                  {/* Qari Selector */}
                  <select
                    value={selectedQari}
                    onChange={e => setSelectedQari(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none hidden md:block"
                  >
                    {RECITERS.map(q => (
                      <option key={q.id} value={q.id}>{q.name}</option>
                    ))}
                  </select>
                </>
              )}

              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Content Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {view === 'list' ? (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none"
                      placeholder="Cari surah..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setMainNavTab('surah')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${mainNavTab === 'surah' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      114 Surah
                    </button>
                    <button
                      onClick={() => setMainNavTab('juz')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${mainNavTab === 'juz' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      30 Juz
                    </button>
                    <button
                      onClick={() => setMainNavTab('tematik')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${mainNavTab === 'tematik' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      Tematik
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredSurahs.map(surah => (
                    <button
                      key={surah.nomor}
                      onClick={() => openSurah(surah)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xs transition-all text-left flex justify-between items-center cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                          {surah.nomor}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 transition-colors">
                            {surah.namaLatin}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{surah.arti}</p>
                        </div>
                      </div>
                      <span className="font-serif text-lg text-emerald-800 dark:text-emerald-300" style={{ fontFamily: '"Amiri", serif' }}>
                        {surah.nama}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* DETAIL READER VIEW */
              <div className="max-w-4xl mx-auto space-y-6 pb-20">
                
                {/* Surah Header Card */}
                {selectedSurah && (
                  <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden text-center space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                        {selectedSurah.tempatTurun} • {selectedSurah.jumlahAyat} AYAT
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white" style={{ fontFamily: '"Amiri", serif' }}>
                        {selectedSurah.nama}
                      </h2>
                      <h3 className="text-xl font-bold text-emerald-200">{selectedSurah.namaLatin}</h3>
                      <p className="text-xs text-emerald-100 italic">"{selectedSurah.arti}"</p>
                    </div>

                    {/* Audio Murottal Full Surah Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10 max-w-md mx-auto">
                      <button
                        onClick={playFullSurah}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        {isPlayingFull ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        {isPlayingFull ? 'Hentikan Audio Surah' : 'Putar Murottal Surah'}
                      </button>

                      {isPlayingFull && (
                        <div className="flex-1 w-full flex items-center gap-2 text-[10px] font-mono text-emerald-200">
                          <span>{audioCurrentTime}</span>
                          <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-300 h-full transition-all" style={{ width: `${audioProgress}%` }} />
                          </div>
                          <span>{audioDuration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bismillah Header (except At-Tawbah) */}
                {selectedSurah && selectedSurah.nomor !== 9 && selectedSurah.nomor !== 1 && (
                  <div className="text-center py-6">
                    <p className="font-serif text-3xl text-emerald-800 dark:text-emerald-300 tracking-wide" style={{ fontFamily: '"Amiri", serif' }}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>
                )}

                {/* Ayat Cards List */}
                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="text-emerald-800 font-bold text-xs animate-pulse">Memuat Ayat Al-Qur'an & Terjemahan...</p>
                  </div>
                ) : (
                  selectedSurah?.ayat?.map(ayat => {
                    const isBookmarked = bookmark?.surahNomor === selectedSurah.nomor && bookmark?.ayatNomor === ayat.nomorAyat;
                    const isPlaying = playingAyat === ayat.nomorAyat;

                    return (
                      <div
                        key={ayat.nomorAyat}
                        id={`ayat-${ayat.nomorAyat}`}
                        className={`p-6 rounded-3xl border transition-all space-y-4 ${
                          isPlaying 
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-300/40' 
                            : isBookmarked
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {/* Ayat Header Actions */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                              {ayat.nomorAyat}
                            </span>
                            <span className="text-slate-400 font-medium">QS. {selectedSurah.namaLatin}: {ayat.nomorAyat}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => playAyat(ayat)}
                              title="Putar Audio Ayat"
                              className={`p-2 rounded-xl transition-all flex items-center gap-1 font-bold text-xs cursor-pointer ${
                                isPlaying
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-100'
                              }`}
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                              <span className="hidden sm:inline">{isPlaying ? 'Memutar' : 'Murottal'}</span>
                            </button>

                            <button
                              onClick={() => saveBookmark(selectedSurah.nomor, selectedSurah.namaLatin, ayat.nomorAyat)}
                              title="Tandai Terakhir Dibaca"
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                isBookmarked
                                  ? 'bg-amber-400 text-amber-950 font-bold'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500'
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-950' : ''}`} />
                            </button>

                            <button
                              onClick={() => copyAyatToClipboard(ayat)}
                              title="Salin Ayat & Terjemahan"
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {copiedAyat === ayat.nomorAyat ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Teks Arab (Utsmani) */}
                        <div className="text-right py-2 leading-loose">
                          <p className={`font-serif text-slate-900 dark:text-slate-50 ${getFontSizeClass()}`} style={{ fontFamily: '"Amiri", serif' }}>
                            {ayat.teksArab}
                          </p>
                        </div>

                        {/* Transliterasi & Terjemahan (Tafsir & Tarjamah) */}
                        {!hideTranslationForTahfidz && (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 italic">
                              {ayat.teksLatin}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                              {ayat.teksIndonesia}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
