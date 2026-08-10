import React, { useState } from 'react';
import { Wallet, Upload, X, CheckCircle } from 'lucide-react';

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
  onDonate?: (programId: number, nominal: number, metode: string, bukti: string | null, namaDonatur: string, kontakDonatur: string) => void;
}

export const DaftarProgram: React.FC<DaftarProgramProps> = ({ programs, onDonate }) => {
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [nominal, setNominal] = useState('');
  const [metode, setMetode] = useState('QRIS');
  const [buktiDonasi, setBuktiDonasi] = useState<File | null>(null);
  const [namaDonatur, setNamaDonatur] = useState('');
  const [kontakDonatur, setKontakDonatur] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');
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
                  {prog.targetRp > 0 && (
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
                  )}
                  
                  <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Terkumpul:</p>
                      <p className="font-bold text-lime-700">{formatRp(prog.terkumpulRp)}</p>
                    </div>
                    {(!prog.targetRp || prog.targetRp === 0) && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Partisipasi:</p>
                        <p className="font-bold text-slate-700">{prog.donatur} Donatur</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 bg-lime-50 px-3 py-1.5 rounded-lg border border-lime-200">
                      <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                      Verifikasi DKM
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedProgramId(prog.id);
                        setStep('form');
                        setNominal('');
                        setMetode('QRIS');
                        setBuktiDonasi(null);
                        setNamaDonatur('');
                        setKontakDonatur('');
                      }}
                      className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      Donasi Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DONASI */}
      {selectedProgramId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button onClick={() => setSelectedProgramId(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5 text-slate-500" />
            </button>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {step === 'form' ? 'Mulai Berdonasi' : 'Alhamdulillah'}
              </h2>
              <p className="text-sm text-slate-500 mb-6 line-clamp-1">
                {programs.find(p => p.id === selectedProgramId)?.judul}
              </p>

              {step === 'form' ? (
                <div className="space-y-4 h-[60vh] overflow-y-auto no-scrollbar pb-10">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap (Opsional)</label>
                    <input type="text" placeholder="Hamba Allah" value={namaDonatur} onChange={(e) => setNamaDonatur(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-lime-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">No. WhatsApp / Email</label>
                    <input type="text" placeholder="Untuk info konfirmasi" value={kontakDonatur} onChange={(e) => setKontakDonatur(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-lime-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Nominal (Rp)</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[50000, 100000, 500000].map(val => (
                        <button key={val} onClick={() => setNominal(val.toString())} className={`py-2 text-sm font-bold border rounded-xl transition-colors ${nominal === val.toString() ? 'border-lime-600 bg-lime-50 text-lime-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          {val / 1000}k
                        </button>
                      ))}
                    </div>
                    <input type="text" placeholder="Nominal Lainnya..." value={nominal} onChange={(e) => setNominal(e.target.value.replace(/\D/g, ''))} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-lime-600" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Metode Pembayaran</label>
                    <select value={metode} onChange={(e) => setMetode(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-lime-600 mb-3">
                      <option value="QRIS">Scan QRIS (Semua Bank/E-Wallet)</option>
                      <option value="Bank Transfer (BSI)">Bank BSI (No: 711 222 3333)</option>
                      <option value="Bank Transfer (Mandiri)">Bank Mandiri (No: 133 00 1111 2222)</option>
                    </select>
                    
                    {metode === 'QRIS' && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center animate-in fade-in">
                        <p className="text-sm font-bold text-slate-700 mb-2">Scan QRIS Berikut:</p>
                        <div className="bg-white p-2 inline-block rounded-xl shadow-sm border border-slate-100 mb-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" className="w-32 h-32 mx-auto" />
                        </div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">A.N: Masjid Citra Sentul Raya</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Bukti Transfer <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-lime-400 transition-colors" onClick={() => document.getElementById('bukti-upload')?.click()}>
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-500">{buktiDonasi ? buktiDonasi.name : 'Klik untuk memilih file foto/screenshot'}</p>
                      <input id="bukti-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) setBuktiDonasi(e.target.files[0]) }} />
                    </div>
                  </div>

                  <button 
                    disabled={!nominal || !buktiDonasi || !kontakDonatur}
                    onClick={() => {
                      if (onDonate) {
                        onDonate(selectedProgramId, parseInt(nominal), metode, buktiDonasi ? URL.createObjectURL(buktiDonasi) : null, namaDonatur, kontakDonatur);
                      }
                      setStep('success');
                    }}
                    className="w-full mt-4 py-3 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg cursor-pointer"
                  >
                    Kirim Konfirmasi Donasi
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-lime-500 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Konfirmasi Diterima!</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Jazakumullah Khairan. Donasi Anda sedang menunggu verifikasi dari pengurus DKM (Admin). Status dapat dicek pada menu Histori.
                  </p>
                  <button onClick={() => setSelectedProgramId(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer">
                    Kembali
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
