import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, X, ChevronRight, Play, Pause, 
  Volume2, BookMarked, FileText, Mic2, ArrowLeft, SkipForward, 
  SkipBack, Bookmark, Copy, Check, Sparkles, Filter, VolumeX, List, Radio
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
type FilterType = 'all' | 'popular' | 'juz30';

const RECITERS = [
  { id: '05', name: 'Mishary Rashid Al-Afasy' },
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
];

const TAJWID_RULES = [
  { name: 'Idgham', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'Memasukkan bunyi nun mati/tanwin ke huruf berikutnya' },
  { name: 'Ikhfa', color: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Menyamarkan bunyi nun mati/tanwin dengan dengung' },
  { name: 'Iqlab', color: 'bg-rose-100 text-rose-800 border-rose-300', desc: 'Mengubah bunyi nun mati/tanwin menjadi M saat bertemu Ba' },
  { name: 'Izhar', color: 'bg-sky-100 text-sky-800 border-sky-300', desc: 'Membaca nun mati/tanwin dengan jelas tanpa dengung' },
  { name: 'Qalqalah', color: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'Memantulkan huruf qalqalah (ق ط ب ج د) yang sukun' },
  { name: 'Mad', color: 'bg-orange-100 text-orange-800 border-orange-300', desc: 'Membaca panjang 2 harokat atau lebih sesuai hukum mad' },
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

  // Fetch Surah List on Mount immediately
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
      // Auto play next verse if enabled
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
      <section className="py-12 bg-gradient-to-b from-slate-50 via-lime-50/40 to-white" id="quran">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-lime-700 to-green-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <BookOpen className="w-80 h-80 -mt-16 -mr-16" />
            </div>
            
            <div className="relative z-10 text-center md:text-left space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-lime-100">
                <Sparkles className="w-3.5 h-3.5" /> Portal Al-Qur'an Digital Masjid Citra Sentul Raya
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif flex items-center justify-center md:justify-start gap-3">
                <BookOpen className="w-8 h-8 text-lime-200" /> Al-Qur'an Digital Complete
              </h2>
              <p className="text-lime-100 text-sm leading-relaxed">
                Baca 114 Surah lengkap, dengarkan audio Murottal 5 Qari ternama, pelajari terjemahan Kemenag RI, tafsir lengkap per ayat, dan panduan Tajwid interaktif.
              </p>
              
              {bookmark && (
                <div className="pt-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs bg-lime-900/70 px-3.5 py-1.5 rounded-xl text-lime-200 flex items-center gap-2 border border-lime-400/40 shadow-xs">
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
                className="flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-lime-50 px-6 py-3 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
              >
                Buka Mode Penuh <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Embedded Search & Interactive Surah List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Search Input & Category Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-6 border-b border-slate-100">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
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

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Semua Surah (114)
                </button>
                <button
                  onClick={() => setActiveFilter('popular')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'popular' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  ⭐ Surah Populer
                </button>
                <button
                  onClick={() => setActiveFilter('juz30')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'juz30' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  📖 Juz 'Amma
                </button>
              </div>
            </div>

            {/* Loading Grid State */}
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
                    className="bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between text-left relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white rounded-xl text-emerald-700 font-bold text-sm group-hover:bg-emerald-700 group-hover:text-white transition-colors border border-slate-200 group-hover:border-emerald-700 shadow-2xs">
                        {surah.nomor}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate text-sm">
                          {surah.namaLatin}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {surah.arti}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                          {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-serif text-xl text-emerald-800 group-hover:text-emerald-600 transition-colors" style={{ fontFamily: '"Amiri", serif' }}>
                        {surah.nama}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                        Baca <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}

                {filteredSurahs.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-700 font-bold text-sm">Surah tidak ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Screen Interactive Reader Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 overflow-hidden font-sans">
          
          {/* Top Bar Navigation */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {view === 'detail' && (
                <button 
                  onClick={goBack} 
                  className="p-2 rounded-xl bg-slate-100 hover:bg-lime-50 text-slate-700 hover:text-lime-700 transition-colors"
                  title="Kembali ke Daftar Surah"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-lime-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base leading-tight flex items-center gap-2">
                  {view === 'list' ? "Al-Qur'an Digital Complete" : (selectedSurah ? `${selectedSurah.nomor}. Surah ${selectedSurah.namaLatin}` : 'Memuat...')}
                </h2>
                <p className="text-xs text-slate-500">
                  {view === 'list' ? 'Masjid Citra Sentul Raya' : (selectedSurah ? `${selectedSurah.tempatTurun} • ${selectedSurah.jumlahAyat} Ayat • ${selectedSurah.arti}` : '')}
                </p>
              </div>
            </div>

            {/* Quick Controls in Top Bar */}
            <div className="flex items-center gap-2">
              {view === 'detail' && (
                <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 gap-1">
                  <span className="px-2">Ukuran Teks:</span>
                  {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-2 py-1 rounded-lg uppercase ${fontSize === size ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}

              <button 
                onClick={handleClose} 
                className="p-2.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-full transition-colors"
                title="Tutup Reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Content Body */}
          <div className="flex-1 overflow-y-auto">
            {view === 'list' ? (
              <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
                
                {/* Search & Filter Header */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
                      placeholder="Cari surah berdasarkan nama, arti, atau nomor (misal: Ya Sin, Al-Baqarah, 36)..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" /> Kategori:
                      </span>
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Semua Surah (114)
                      </button>
                      <button
                        onClick={() => setActiveFilter('popular')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === 'popular' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        ⭐ Surah Populer
                      </button>
                      <button
                        onClick={() => setActiveFilter('juz30')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === 'juz30' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        📖 Juz 'Amma (Juz 30)
                      </button>
                    </div>

                    {bookmark && (
                      <button
                        onClick={jumpToBookmark}
                        className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Terakhir: {bookmark.surahNama} ({bookmark.ayatNomor})
                      </button>
                    )}
                  </div>
                </div>

                {/* Loading state */}
                {loadingList ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="text-emerald-800 font-bold animate-pulse text-sm">Memuat Al-Qur'an Digital...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredSurahs.map(surah => (
                      <button
                        key={surah.nomor}
                        onClick={() => openSurah(surah)}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex items-center gap-4 text-left w-full relative overflow-hidden"
                      >
                        <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center bg-emerald-50 rounded-xl text-emerald-700 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-100">
                          {surah.nomor}
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                            {surah.namaLatin}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate">
                            {surah.arti}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                            {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-serif text-2xl text-emerald-700" style={{ fontFamily: '"Amiri", serif' }}>
                            {surah.nama}
                          </div>
                        </div>
                      </button>
                    ))}

                    {filteredSurahs.length === 0 && (
                      <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 font-bold">Surah tidak ditemukan</p>
                        <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian yang lain.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="text-emerald-800 font-bold animate-pulse text-sm">Memuat Teks, Terjemahan, Tajwid & Audio...</p>
                  </div>
                ) : selectedSurah ? (
                  <>
                    {/* Surah Banner Card */}
                    <div className="bg-gradient-to-br from-emerald-800 via-lime-700 to-green-700 rounded-3xl p-6 text-white shadow-lg text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <BookOpen className="w-64 h-64 absolute -right-10 -bottom-10" />
                      </div>
                      
                      <div className="relative z-10 space-y-3">
                        <div className="font-serif text-5xl mb-2" style={{ fontFamily: '"Amiri", serif' }}>
                          {selectedSurah.nama}
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                          Surah {selectedSurah.namaLatin} ({selectedSurah.nomor})
                        </h1>
                        <p className="text-lime-100 text-sm">
                          "{selectedSurah.arti}" • {selectedSurah.tempatTurun} • {selectedSurah.jumlahAyat} Ayat
                        </p>

                        {/* Controls Bar: Audio Full & Qari Selector */}
                        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={playFullSurah}
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm"
                          >
                            {isPlayingFull ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                            {isPlayingFull ? 'Hentikan Audio Surah' : 'Putar Audio Full Surah'}
                          </button>

                          {/* Reciter Select Dropdown */}
                          <div className="inline-flex items-center gap-2 bg-emerald-950/40 backdrop-blur px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                            <Volume2 className="w-4 h-4 text-lime-300" />
                            <span className="text-lime-200">Qari:</span>
                            <select
                              value={selectedQari}
                              onChange={(e) => {
                                setSelectedQari(e.target.value);
                                if (isPlayingFull || playingAyat) stopAudio();
                              }}
                              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
                            >
                              {RECITERS.map(r => (
                                <option key={r.id} value={r.id} className="bg-slate-800 text-white">
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Full Audio Progress Bar */}
                        {isPlayingFull && (
                          <div className="mt-4 mx-auto max-w-md bg-black/20 p-3 rounded-2xl border border-white/20 space-y-1">
                            <div className="flex justify-between text-xs text-lime-100 font-mono">
                              <span>{audioCurrentTime}</span>
                              <span>{audioDuration}</span>
                            </div>
                            <div className="bg-white/30 rounded-full h-2 overflow-hidden cursor-pointer">
                              <div className="bg-amber-300 h-full rounded-full transition-all duration-300" style={{ width: `${audioProgress}%` }} />
                            </div>
                            <p className="text-[10px] text-lime-200 pt-1">
                              Sedang diputar: Surah {selectedSurah.namaLatin} ({RECITERS.find(r => r.id === selectedQari)?.name})
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation Tabs (Terjemahan, Tafsir, Tajwid) */}
                    <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex flex-wrap gap-1 sticky top-16 z-20">
                      {([
                        { key: 'terjemahan', label: 'Terjemahan & Audio', icon: BookMarked },
                        { key: 'tafsir', label: 'Tafsir Kemenag', icon: FileText },
                        { key: 'tajwid', label: 'Panduan Tajwid', icon: Mic2 },
                      ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => handleTabChange(key)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === key
                              ? 'bg-emerald-700 text-white shadow-md'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" /> {label}
                        </button>
                      ))}
                    </div>

                    {/* Auto-Play Toggle & Jump to Ayat Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Lompat ke Ayat:</span>
                        <select
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val) {
                              const el = document.getElementById(`ayat-${val}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="">Pilih Ayat (1 - {selectedSurah.jumlahAyat})</option>
                          {selectedSurah.ayat.map(a => (
                            <option key={a.nomorAyat} value={a.nomorAyat}>Ayat {a.nomorAyat}</option>
                          ))}
                        </select>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoPlayNext}
                          onChange={(e) => setAutoPlayNext(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span>Putar Otomatis Ayat Selanjutnya</span>
                      </label>
                    </div>

                    {/* Tajwid Rules Explanation Box */}
                    {activeTab === 'tajwid' && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <Mic2 className="w-4 h-4 text-emerald-600" /> Keterangan & Panduan Hukum Tajwid
                          </h3>
                          <span className="text-xs text-slate-400">Pewarnaan & Kaidah Bacaan</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {TAJWID_RULES.map(rule => (
                            <div key={rule.name} className={`p-3 rounded-xl border ${rule.color} space-y-1`}>
                              <div className="font-bold text-xs">{rule.name}</div>
                              <p className="text-[11px] leading-tight opacity-90">{rule.desc}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                          💡 <strong>Tips Pembelajaran Tajwid:</strong> Gunakan audio murottal di bawah ini untuk mendengarkan lafaz asli dari Qari pilihan Anda guna menyempurnakan makhraj dan panjang-pendek (mad) bacaan.
                        </p>
                      </div>
                    )}

                    {/* Tafsir Loading State */}
                    {activeTab === 'tafsir' && loadingTafsir && (
                      <div className="flex flex-col items-center justify-center py-12 gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600" />
                        <p className="text-xs text-emerald-800 font-bold animate-pulse">Mengambil Tafsir Kemenag RI...</p>
                      </div>
                    )}

                    {/* Ayat List Cards */}
                    <div className="space-y-4">
                      {/* Bismillah Header */}
                      {selectedSurah.nomor !== 1 && selectedSurah.nomor !== 9 && (
                        <div className="text-center py-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-2xs">
                          <p className="font-serif text-3xl text-emerald-900" style={{ fontFamily: '"Amiri", serif' }}>
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                          </p>
                        </div>
                      )}

                      {selectedSurah.ayat.map((ayat) => {
                        const tafsirAyat = tafsirData.find(t => t.nomorAyat === ayat.nomorAyat);
                        const isPlaying = playingAyat === ayat.nomorAyat;
                        const isBookmarked = bookmark?.surahNomor === selectedSurah.nomor && bookmark?.ayatNomor === ayat.nomorAyat;

                        return (
                          <div
                            key={ayat.nomorAyat}
                            id={`ayat-${ayat.nomorAyat}`}
                            className={`bg-white rounded-2xl border transition-all shadow-xs ${
                              isPlaying 
                                ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/30' 
                                : isBookmarked 
                                ? 'border-amber-400 bg-amber-50/20' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {/* Ayat Header Action Bar */}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100 rounded-t-2xl">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-700 text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-xs">
                                  {ayat.nomorAyat}
                                </div>
                                <span className="text-xs font-bold text-slate-500">
                                  Ayat {ayat.nomorAyat}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Bookmark Button */}
                                <button
                                  onClick={() => saveBookmark(selectedSurah.nomor, selectedSurah.namaLatin, ayat.nomorAyat)}
                                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                                    isBookmarked 
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50'
                                  }`}
                                  title="Tandai Terakhir Dibaca"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                                  <span className="hidden sm:inline">{isBookmarked ? 'Tersimpan' : 'Tandai'}</span>
                                </button>

                                {/* Copy Button */}
                                <button
                                  onClick={() => copyAyatToClipboard(ayat)}
                                  className="p-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                  title="Salin Teks Ayat"
                                >
                                  {copiedAyat === ayat.nomorAyat ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>

                                {/* Audio Play Button */}
                                <button
                                  onClick={() => playAyat(ayat)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                                    isPlaying
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
                                  }`}
                                >
                                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                                  {isPlaying ? 'Berhenti' : 'Putar Audio'}
                                </button>
                              </div>
                            </div>

                            {/* Ayat Body Content */}
                            <div className="p-5 space-y-5">
                              {/* Arab Text */}
                              <p
                                className={`text-right text-slate-900 ${getFontSizeClass()}`}
                                style={{ 
                                  fontFamily: '"Amiri", "Traditional Arabic", serif', 
                                  direction: 'rtl' 
                                }}
                              >
                                {ayat.teksArab}
                              </p>

                              {/* Tab Content 1: Terjemahan */}
                              {activeTab === 'terjemahan' && (
                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                  <p className="text-slate-500 text-xs sm:text-sm italic leading-relaxed font-serif">
                                    {ayat.teksLatin}
                                  </p>
                                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                                    <span className="text-emerald-700 font-bold mr-1.5">Artinya:</span>
                                    {ayat.teksIndonesia}
                                  </p>
                                </div>
                              )}

                              {/* Tab Content 2: Tafsir */}
                              {activeTab === 'tafsir' && (
                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                  <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" /> Tafsir Kementerian Agama RI
                                  </p>
                                  {tafsirAyat ? (
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                                      {tafsirAyat.teks}
                                    </p>
                                  ) : loadingTafsir ? (
                                    <p className="text-slate-400 text-xs animate-pulse">Memuat tafsir Kemenag...</p>
                                  ) : (
                                    <p className="text-slate-400 text-xs italic">Tafsir tidak tersedia untuk ayat ini.</p>
                                  )}
                                </div>
                              )}

                              {/* Tab Content 3: Tajwid */}
                              {activeTab === 'tajwid' && (
                                <div className="pt-3 border-t border-slate-100 space-y-3">
                                  <div>
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Transliterasi Tajwid</span>
                                    <p className="text-slate-700 text-sm italic bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 font-serif">
                                      {ayat.teksLatin}
                                    </p>
                                  </div>

                                  <div>
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Terjemahan Ringkas</span>
                                    <p className="text-slate-700 text-xs leading-relaxed">{ayat.teksIndonesia}</p>
                                  </div>

                                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-1">
                                    <p className="text-xs font-bold text-amber-800">📖 Panduan Membaca & Tajwid</p>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                      Perhatikan ketepatan harokat dan panjang pendek (Mad). Tekan tombol <strong>Putar Audio</strong> untuk menyelaraskan makhraj huruf sesuai lantunan Qari.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Surah Navigation (Prev & Next Surah) */}
                    <div className="flex gap-3 pt-6 border-t border-slate-200">
                      {selectedSurah.nomor > 1 && (
                        <button
                          onClick={() => openSurah(surahs[selectedSurah.nomor - 2])}
                          className="flex-1 flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-4 rounded-2xl text-sm font-bold transition-all shadow-xs"
                        >
                          <SkipBack className="w-4 h-4 text-emerald-700" />
                          <div className="text-left truncate">
                            <span className="text-[10px] text-slate-400 block font-normal">Surah Sebelumnya</span>
                            <span>{surahs[selectedSurah.nomor - 2]?.namaLatin || `Surah ${selectedSurah.nomor - 1}`}</span>
                          </div>
                        </button>
                      )}

                      {selectedSurah.nomor < 114 && (
                        <button
                          onClick={() => openSurah(surahs[selectedSurah.nomor])}
                          className="flex-1 flex items-center justify-end gap-2 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-4 rounded-2xl text-sm font-bold transition-all shadow-xs"
                        >
                          <div className="text-right truncate">
                            <span className="text-[10px] text-slate-400 block font-normal">Surah Selanjutnya</span>
                            <span>{surahs[selectedSurah.nomor]?.namaLatin || `Surah ${selectedSurah.nomor + 1}`}</span>
                          </div>
                          <SkipForward className="w-4 h-4 text-emerald-700" />
                        </button>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
