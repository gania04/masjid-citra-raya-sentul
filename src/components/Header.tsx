import React, { useState, useEffect } from 'react';
import { Bot, User, Sun, Moon, Sparkles } from 'lucide-react';
import { getPrayerTimesSentul, getNextPrayerInfo } from '../utils/prayerTimes';

interface HeaderProps {
  onLoginClick: () => void;
  onAiClick: () => void;
  onQuranClick?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAutoNight?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLoginClick, 
  onAiClick, 
  onQuranClick,
  isDarkMode,
  onToggleDarkMode,
  isAutoNight = false
}) => {
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
    { name: "Al-Qur'an Digital", id: 'quran' },
    { name: 'Kalender Kegiatan', id: 'kalender' },
    { name: 'ZISWAF', id: 'ziswaf' },
    { name: 'Tentang Kami', id: 'tentang' },
    { name: 'Kontak Kami', id: 'kontak' },
  ];

  const handleScroll = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'quran' && onQuranClick) {
      onQuranClick();
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 border-b shadow-sm ${
      isDarkMode 
        ? 'bg-slate-900/95 backdrop-blur-md border-slate-800 text-white' 
        : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900'
    }`}>
      {/* Top Info Bar */}
      <div className={`text-xs py-2 px-4 hidden md:block transition-colors ${
        isDarkMode ? 'bg-emerald-950 text-emerald-200 border-b border-emerald-900/50' : 'bg-lime-600 text-white'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span>Official Masjid Citra Sentul Raya • Sirkuit Sentul, Bogor</span>
            {isAutoNight && (
              <span className="bg-indigo-900/80 text-indigo-200 border border-indigo-700/50 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Moon className="w-3 h-3 text-amber-300" /> Mode Malam Otomatis (18:00 - 06:00)
              </span>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <span>Kiblat: 295°</span>
            <span className="font-bold font-mono">{timeString}</span>
            <span className={`px-2.5 py-0.5 rounded-md font-bold ${
              isDarkMode ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/40' : 'bg-white/20 text-white'
            }`}>
              {nextPrayer.name}: {nextPrayer.time}
            </span>
          </div>
        </div>
      </div>

      {/* Main Logo & Nav Area */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-3.5 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all ${
              isDarkMode ? 'bg-emerald-600 text-white border border-emerald-500/30' : 'bg-lime-500 text-white'
            }`}>
              <span className="text-2xl">🕌</span>
            </div>
            <div>
              <h1 className={`text-xl font-serif font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Masjid Citra Sentul Raya
              </h1>
              <p className={`text-[10px] tracking-widest uppercase font-bold ${isDarkMode ? 'text-emerald-400' : 'text-slate-500'}`}>
                Islamic Center • Bogor
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800' 
                    : 'text-slate-600 hover:text-lime-600 hover:bg-lime-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 mt-2 md:mt-0">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Beralih ke Mode Siang (Light Mode)' : 'Beralih ke Mode Malam (Dark Mode)'}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Siang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Malam</span>
                </>
              )}
            </button>

            <button 
              onClick={onAiClick}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 border-2 border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-bold text-xs sm:text-sm rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4" /> Tanya AI
            </button>

            <button 
              onClick={onLoginClick}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 border-2 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs uppercase active:scale-95 cursor-pointer ${
                isDarkMode 
                  ? 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500' 
                  : 'border-slate-900 text-slate-900 bg-white hover:bg-slate-900 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
