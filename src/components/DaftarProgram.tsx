import React from 'react';

interface Program {
  id: number;
  kategori: string;
  judul: string;
  deskripsi: string;
  terkumpulPersen: number;
  terkumpulRp: number;
  targetRp: number;
  donatur: number;
  gambar: string;
}

interface DaftarProgramProps {
  programs: Program[];
}

export const DaftarProgram: React.FC<DaftarProgramProps> = ({ programs }) => {
  const formatRp = (angka: number) => {
    if (angka >= 1000000000) {
      return `Rp ${(angka / 1000000000).toFixed(1).replace('.0', '')}M`;
    }
    if (angka >= 1000000) {
      return `Rp ${(angka / 1000000).toFixed(0)}Jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <section className="py-16 bg-white" id="ziswaf">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lime-600 font-bold uppercase tracking-wider text-sm mb-2">Program Unggulan</p>
          <h2 className="text-3xl font-bold text-slate-900 font-serif mb-2">Daftar Program ZISWAF</h2>
          <p className="text-slate-600">Grafik Statistik Perolehan Zakat, Infaq, Sedekah & Wakaf</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={prog.gambar}
                  alt={prog.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-lime-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {prog.kategori}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">{prog.judul}</h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow">{prog.deskripsi}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-lime-700">Terkumpul {prog.terkumpulPersen}%</span>
                      <span className="text-slate-500">{prog.donatur} Donatur</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-lime-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(prog.terkumpulPersen, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Terkumpul:</p>
                      <p className="font-bold text-lime-700">{formatRp(prog.terkumpulRp)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Target:</p>
                      <p className="font-bold text-slate-900">{formatRp(prog.targetRp)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-lime-700 bg-lime-50 py-2 rounded-lg border border-lime-200">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                    Verifikasi DKM
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
