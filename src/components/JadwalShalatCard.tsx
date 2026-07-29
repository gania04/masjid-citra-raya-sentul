import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Volume2, VolumeX, Compass } from 'lucide-react';
import { getPrayerTimesSentul, getHijriDateIndo, getNextPrayerInfo } from '../utils/prayerTimes';

export const JadwalShalatCard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const jadwal = getPrayerTimesSentul(currentTime);
  const nextPrayer = getNextPrayerInfo(jadwal);
  const hijriDate = getHijriDateIndo();

  const prayerList = [
    { name: 'Imsak', time: jadwal.imsak, icon: '🌅' },
    { name: 'Subuh', time: jadwal.subuh, icon: '🌌' },
    { name: 'Syuruq', time: jadwal.syuruq, icon: '☀️' },
    { name: 'Dzuhur', time: jadwal.dzuhur, icon: '🌤️' },
    { name: 'Ashar', time: jadwal.ashar, icon: '🌇' },
    { name: 'Maghrib', time: jadwal.maghrib, icon: '🌆' },
    { name: 'Isya', time: jadwal.isya, icon: '🌃' },
  ];

  return (
    <div id="jadwal" className="py-12 bg-lime-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-lime-500 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-700 border border-lime-500 text-lime-100 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{hijriDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Jadwal Shalat & Adzan
            </h2>
            <p className="text-xs sm:text-sm text-lime-100 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-lime-300" />
              <span>Citra Sentul Raya, Kabupaten Bogor</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-lime-700/80 border border-lime-500 px-5 py-3 rounded-2xl text-right shadow-md">
            <div className="flex items-center gap-3 pr-4 border-r border-lime-500">
              <Compass className="w-8 h-8 text-lime-200" />
              <div className="text-left">
                <span className="text-[10px] text-lime-200 block font-semibold uppercase">Arah Kiblat</span>
                <span className="text-lg font-bold text-white tracking-wider">
                  295° <span className="text-xs font-normal">Barat Laut</span>
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-[10px] text-lime-200 block font-semibold uppercase">Waktu Real-time</span>
              <span className="text-2xl font-mono font-black text-white tracking-wider">
                {currentTime.toLocaleTimeString('id-ID', { hour12: false })} WIB
              </span>
            </div>
          </div>
        </div>

        {/* Next Prayer Highlight Banner */}
        <div className="bg-gradient-to-r from-lime-500 via-lime-400 to-green-500 border-2 border-white/50 rounded-2xl p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-lime-900 font-extrabold uppercase tracking-widest block">
              Menuju Adzan Berikutnya
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-lime-950">
              {nextPrayer.name} - <span className="text-white font-mono">{nextPrayer.time} WIB</span>
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-3 rounded-full bg-lime-600 hover:bg-lime-700 text-white transition-colors shadow-md border border-lime-300"
              title={isAudioMuted ? 'Matikan Notifikasi Adzan' : 'Aktifkan Notifikasi Adzan'}
            >
              {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="bg-lime-700/80 px-5 py-3 rounded-xl border border-lime-500 text-center">
              <span className="text-[10px] text-lime-200 block uppercase">Sisa Waktu</span>
              <span className="text-lg sm:text-xl font-bold text-white animate-pulse">
                {nextPrayer.remainingText}
              </span>
            </div>
          </div>
        </div>

        {/* Prayer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {prayerList.map((p) => {
            const isCurrentNext = nextPrayer.name.includes(p.name);
            return (
              <div
                key={p.name}
                className={`p-4 rounded-2xl text-center border transition-all ${
                  isCurrentNext
                    ? 'bg-white text-lime-700 border-white shadow-lg scale-105 font-black'
                    : 'bg-lime-700/60 text-white border-lime-500 hover:bg-lime-700'
                }`}
              >
                <span className="text-2xl block mb-1">{p.icon}</span>
                <span className={`text-xs block font-semibold ${isCurrentNext ? 'text-lime-600 font-bold' : 'text-lime-200'}`}>
                  {p.name}
                </span>
                <span className={`text-lg font-mono font-black ${isCurrentNext ? 'text-lime-800' : 'text-white'}`}>
                  {p.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
