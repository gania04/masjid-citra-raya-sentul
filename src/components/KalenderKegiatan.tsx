import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X, CheckCircle } from 'lucide-react';

export const KalenderKegiatan = () => {
  const events = [
    {
      id: 1,
      title: 'Kajian Rutin Ba\'da Maghrib',
      date: 'Setiap Hari Ahad',
      time: '18:30 - Selesai',
      location: 'Ruang Shalat Utama',
      speaker: 'Ust. H. Ahmad Farhan, M.A.',
      type: 'Kajian'
    },
    {
      id: 2,
      title: 'Tahsin Al-Qur\'an Anak & Dewasa',
      date: 'Setiap Hari Sabtu',
      time: '16:00 - 17:30',
      location: 'Seluruh Area Masjid',
      speaker: 'Tim Pengajar TPA',
      type: 'Edukasi'
    },
    {
      id: 3,
      title: 'Tabligh Akbar Bulan Muharram',
      date: 'Sabtu, 28 Agustus 2026',
      time: '08:00 - 11:30',
      location: 'Halaman & Ruang Utama',
      speaker: 'KH. Abdullah Gymnastiar',
      type: 'Event Besar'
    }
  ];

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({ nama: '', noHp: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDaftar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.noHp) return;
    
    const newReg = {
      id: Date.now(),
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      nama: formData.nama,
      noHp: formData.noHp,
      tanggal: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('kegiatan_registrations') || '[]');
    localStorage.setItem('kegiatan_registrations', JSON.stringify([newReg, ...existing]));
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedEvent(null);
      setFormData({ nama: '', noHp: '' });
    }, 2000);
  };

  return (
    <section className="py-16 bg-white" id="kalender">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lime-600 font-bold uppercase tracking-wider text-sm mb-2">Agenda Masjid</p>
          <h2 className="text-3xl font-bold text-slate-900 font-serif mb-4">Kalender Kegiatan</h2>
          <p className="text-slate-600">Jadwal kajian rutin dan event spesial di Masjid Citra Sentul Raya</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-lime-300 hover:shadow-lg transition-all group">
              <div className="inline-block px-3 py-1 bg-lime-100 text-lime-700 text-xs font-bold rounded-full mb-4">
                {event.type}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lime-700 transition-colors">
                {event.title}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-lime-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-lime-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-lime-500" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Penceramah / Pengisi:</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{event.speaker}</p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Daftar Kegiatan</h3>
                <p className="text-xs text-slate-500">{selectedEvent.title}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {showSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-lime-100 text-lime-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">Berhasil Mendaftar!</h4>
                    <p className="text-sm text-slate-500 mt-1">Terima kasih, sampai jumpa di kegiatan.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDaftar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.nama}
                      onChange={e => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-lime-500" 
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">No. WhatsApp</label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.noHp}
                      onChange={e => setFormData({ ...formData, noHp: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-lime-500" 
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold rounded-xl mt-4 transition-colors cursor-pointer shadow-md text-sm">
                    Konfirmasi Pendaftaran
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
