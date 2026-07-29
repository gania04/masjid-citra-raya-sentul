import React, { useState, useEffect } from 'react';
import { BookOpen, Search, X, ChevronRight } from 'lucide-react';

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export const AlQuranDigital = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch only when modal is opened for the first time
  useEffect(() => {
    if (isOpen && surahs.length === 0) {
      setLoading(true);
      fetch('https://equran.id/api/v2/surat')
        .then((res) => res.json())
        .then((data) => {
          setSurahs(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch Al-Quran data', err);
          setLoading(false);
        });
    }
  }, [isOpen, surahs.length]);

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arti.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Banner di Beranda */}
      <section className="py-8 bg-lime-50" id="quran">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-lime-600 to-green-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <BookOpen className="w-64 h-64 -mt-10 -mr-10" />
            </div>
            
            <div className="relative z-10 text-center md:text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif flex items-center justify-center md:justify-start gap-3">
                <BookOpen className="w-8 h-8 text-lime-200" />
                Al-Qur'an Digital
              </h2>
              <p className="text-lime-100 max-w-lg">
                Baca Al-Qur'an kapan saja dan di mana saja. Terjemahan lengkap 114 Surah untuk menemani ibadah Anda.
              </p>
            </div>
            
            <button
              onClick={() => setIsOpen(true)}
              className="relative z-10 flex items-center gap-2 bg-white text-lime-700 hover:bg-lime-50 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              Buka Al-Qur'an
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Modal / Full Screen Overlay Al-Quran */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-in fade-in slide-in-from-bottom-10">
          {/* Header Modal */}
          <div className="bg-white border-b border-lime-200 px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-100 text-lime-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg leading-tight">Al-Qur'an Digital</h2>
                <p className="text-[10px] sm:text-xs text-slate-500">Masjid Citra Sentul Raya</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-full transition-colors"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body Modal */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-8 sticky top-0 z-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-4 border-2 border-lime-200 rounded-2xl leading-5 bg-white/90 backdrop-blur placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 transition-all shadow-sm text-slate-800 font-medium"
                  placeholder="Cari Surah (contoh: Al-Baqarah, Yasin)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* List Surah */}
              {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-200 border-t-lime-600"></div>
                  <p className="text-lime-700 font-medium animate-pulse">Memuat ayat suci...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSurahs.map((surah) => (
                    <div
                      key={surah.nomor}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-lime-400 transition-all cursor-pointer group flex items-center gap-4"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center bg-lime-50 rounded-xl text-lime-700 font-bold group-hover:bg-lime-500 group-hover:text-white transition-colors">
                        <div className="absolute inset-0 border-2 border-lime-200/50 rotate-45 rounded-xl opacity-50"></div>
                        <span>{surah.nomor}</span>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-lime-600 transition-colors">
                          {surah.namaLatin}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                          {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-2xl text-lime-600 mb-1">{surah.nama}</div>
                        <div className="text-[10px] text-slate-400 max-w-[100px] truncate" title={surah.arti}>
                          {surah.arti}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredSurahs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-500">
                      Surah "<span className="font-bold text-slate-700">{searchQuery}</span>" tidak ditemukan.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
