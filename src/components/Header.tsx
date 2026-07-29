import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { getPrayerTimesSentul, getNextPrayerInfo } from '../utils/prayerTimes';

interface HeaderProps {
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const prayerTimes = getPrayerTimesSentul();
  const nextPrayer = getNextPrayerInfo(prayerTimes);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).replace('.', ':') + ' WIB';

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Kalender Kegiatan', id: 'kalender' },
    { name: 'ZISWAF', id: 'ziswaf' },
    { name: 'Tentang Kami', id: 'tentang' },
    { name: 'Kontak Kami', id: 'kontak' },
  ];

  const handleScroll = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-lime-600 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div>Official Masjid Citra Sentul Raya • Sirkuit Sentul, Bogor</div>
          <div className="flex gap-4 items-center">
            <span>Kiblat: 295°</span>
            <span className="font-bold">{timeString}</span>
            <span className="bg-white/20 px-2 py-1 rounded">
              {nextPrayer.name}: {nextPrayer.time}
            </span>
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-1 ml-4 hover:text-lime-200 transition-colors bg-black/10 px-2 py-1 rounded"
            >
              <Settings className="w-3 h-3" /> Pengelola
            </button>
          </div>
        </div>
      </div>

      {/* Main Logo & Nav Area */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center text-white shadow-md">
              <span className="text-2xl">🕌</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-slate-900 leading-tight">
                Masjid Citra Sentul Raya
              </h1>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">Islamic Center</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-lime-600 hover:bg-lime-50 rounded-lg transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile Admin Button */}
          <button 
            onClick={onAdminClick}
            className="md:hidden flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg"
          >
            <Settings className="w-4 h-4" /> Panel
          </button>
        </div>
      </div>
    </header>
  );
};
