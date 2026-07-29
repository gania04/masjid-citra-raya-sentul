import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

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

              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase">Penceramah / Pengisi:</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{event.speaker}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
