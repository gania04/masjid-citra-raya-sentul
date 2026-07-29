import React, { useState } from 'react';
import { ArrowLeft, Save, PlusCircle, Database, Settings } from 'lucide-react';

interface Program {
  id: number;
  kategori: string;
  judul: string;
  terkumpulRp: number;
  targetRp: number;
  donatur: number;
}

interface AdminDashboardProps {
  onBack: () => void;
  programs: Program[];
  onAddDonation: (programId: number, nominal: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, programs, onAddDonation }) => {
  const [selectedProgram, setSelectedProgram] = useState<number>(programs[0].id);
  const [nominalStr, setNominalStr] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(nominalStr.replace(/\D/g, ''), 10);
    
    if (nominal && nominal > 0) {
      onAddDonation(selectedProgram, nominal);
      setNominalStr('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Admin Header */}
      <div className="bg-lime-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 bg-lime-800 hover:bg-lime-900 rounded-lg transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5" /> Panel Pengelola
              </h1>
              <p className="text-lime-200 text-xs">Sistem Informasi Masjid Citra Sentul Raya</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-lime-800 px-3 py-1.5 rounded-lg text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Online
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Form Input */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <PlusCircle className="w-6 h-6 text-lime-600" />
              <h2 className="text-lg font-bold text-slate-900">Input Donasi Baru</h2>
            </div>

            {showSuccess && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-lg flex items-center justify-center">
                Data donasi berhasil disimpan!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Pilih Program ZISWAF
                </label>
                <select 
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:outline-none"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.judul}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nominal Donasi (Rp)
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: 500000"
                  value={nominalStr}
                  onChange={(e) => setNominalStr(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:outline-none font-mono text-lg"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors"
              >
                <Save className="w-5 h-5" />
                Simpan Donasi
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Database className="w-6 h-6 text-lime-600" />
              <h2 className="text-lg font-bold text-slate-900">Status Program Real-time</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map(p => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="text-xs font-bold text-lime-600 uppercase mb-1 block">{p.kategori}</span>
                  <h3 className="font-bold text-slate-800 mb-4">{p.judul}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Terkumpul:</span>
                      <span className="font-bold text-lime-700">{formatRp(p.terkumpulRp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target:</span>
                      <span className="font-bold text-slate-800">{formatRp(p.targetRp)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
                      <span className="text-slate-500">Total Donatur:</span>
                      <span className="font-bold text-slate-800">{p.donatur} Orang</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
