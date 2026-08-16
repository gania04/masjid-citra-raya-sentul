import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HeartHandshake,
  CreditCard,
  Copy,
  Check,
  Send,
  Sparkles,
  QrCode,
  Building,
  UserCheck,
  MessageSquare,
  FileCheck,
  PackageCheck,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Download,
  X,
} from 'lucide-react';
import { PAKET_WAKAF_LIST } from '../data/mockData';
import { formatRupiah, buildWhatsAppLink, generateUniqueCode } from '../utils/formatters';
import { Muwakif } from '../types';

interface WakafFormProps {
  onAddMuwakif: (newMuwakif: Muwakif) => void;
  onShowCertificate: (muwakif: Muwakif) => void;
}

export const WakafForm: React.FC<WakafFormProps> = ({ onAddMuwakif, onShowCertificate }) => {
  const [selectedPaket, setSelectedPaket] = useState<string>('p-3'); // Default 1m²
  const [customNominal, setCustomNominal] = useState<string>('1500000');
  const [nama, setNama] = useState<string>('');
  const [isHambaAllah, setIsHambaAllah] = useState<boolean>(false);
  const [telepon, setTelepon] = useState<string>('');
  const [pesanDoa, setPesanDoa] = useState<string>('');
  const [metodePembayaran, setMetodePembayaran] = useState<'BSI' | 'QRIS'>('BSI');
  const [showQrisModal, setShowQrisModal] = useState<boolean>(false);
  const [isQrisZoomed, setIsQrisZoomed] = useState<boolean>(false);
  
  const [uniqueCode] = useState<number>(() => generateUniqueCode());
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedRek, setCopiedRek] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedMuwakif, setLastSubmittedMuwakif] = useState<Muwakif | null>(null);

  const handleDownloadQris = async () => {
    try {
      const response = await fetch('/images/qris-masjid.jpg');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'QRIS-Masjid-Citra-Sentul-Raya.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      const link = document.createElement('a');
      link.href = '/images/qris-masjid.jpg';
      link.download = 'QRIS-Masjid-Citra-Sentul-Raya.jpg';
      link.target = '_blank';
      link.click();
    }
  };

  // Compute base nominal
  const selectedPaketObj = PAKET_WAKAF_LIST.find((p) => p.id === selectedPaket);
  const baseNominal = selectedPaket === 'custom'
    ? Math.max(10000, parseInt(customNominal || '0', 10))
    : selectedPaketObj ? selectedPaketObj.nominal : 100000;

  const totalTransfer = baseNominal + uniqueCode;

  const handleSelectPaket = (id: string, nominal: number) => {
    setSelectedPaket(id);
    if (id !== 'custom') {
      setCustomNominal(nominal.toString());
    }
  };

  const handleCopy = (text: string, type: 'nominal' | 'rek') => {
    navigator.clipboard.writeText(text);
    if (type === 'nominal') {
      setCopiedNominal(true);
      setTimeout(() => setCopiedNominal(false), 2000);
    } else {
      setCopiedRek(true);
      setTimeout(() => setCopiedRek(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const donorName = isHambaAllah ? 'Hamba Allah' : (nama.trim() || 'Hamba Allah');
    
    const newMuwakif: Muwakif = {
      id: 'mw-' + Date.now(),
      nama: donorName,
      nominal: totalTransfer,
      paket: selectedPaketObj ? selectedPaketObj.nama : 'Wakaf Nominal Bebas',
      tanggal: new Date().toISOString().split('T')[0],
      pesanDoa: pesanDoa.trim() || 'Semoga wakaf ini membawa keberkahan dan pahala yang tak terputus.',
      isHambaAllah,
      isVerified: true,
      metode: metodePembayaran,
    };

    onAddMuwakif(newMuwakif);
    setLastSubmittedMuwakif(newMuwakif);
    setIsSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#84cc16', '#10b981', '#059669', '#d97706'],
      });
    } catch {
      // Ignore if canvas confetti isn't supported
    }
  };

  return (
    <div id="wakaf" className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden my-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-6 sm:p-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 text-lime-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Pilihan Paket Wakaf Cepat & Otomatis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kalkulator & Form Wakaf Online
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Salurkan wakaf terbaik Anda untuk pembangunan Masjid Citra Sentul Raya. Pilih paket atau masukkan nominal kustom secara bebas.
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-600/60 rounded-2xl p-3 text-right">
            <span className="text-[10px] text-emerald-300 block">Nomor Rekening Resmi BSI</span>
            <span className="text-xl font-mono font-black text-lime-300">7257159102</span>
            <span className="text-[10px] text-emerald-200 block font-semibold">a.n. Masjid Citra Sentul Raya</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: Pilih Paket Wakaf */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>1. Pilih Paket Wakaf Pembangunan</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PAKET_WAKAF_LIST.map((paket) => {
                  const isSelected = selectedPaket === paket.id;
                  return (
                    <button
                      key={paket.id}
                      type="button"
                      onClick={() => handleSelectPaket(paket.id, paket.nominal)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      {paket.populer && (
                        <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                          {paket.badge}
                        </span>
                      )}

                      <div>
                        <span className="text-xs font-bold text-emerald-800 block mb-1">
                          {paket.nama}
                        </span>
                        <span className="text-lg font-black text-slate-900 block">
                          {formatRupiah(paket.nominal)}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {paket.deskripsi}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                        <span className={isSelected ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                          {isSelected ? '✓ Terpilih' : 'Pilih Paket'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Nominal Option */}
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaket('custom')}
                    className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-colors ${
                      selectedPaket === 'custom'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Atur Nominal Bebas
                  </button>

                  {selectedPaket === 'custom' && (
                    <div className="flex-1 relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="10000"
                        step="10000"
                        value={customNominal}
                        onChange={(e) => setCustomNominal(e.target.value)}
                        placeholder="Contoh: 500000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STEP 2: Data Wakif / Donatur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. Identitas Wakif / Donatur</span>
                </label>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isHambaAllah}
                          onChange={(e) => setIsHambaAllah(e.target.checked)}
                          className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Sembunyikan Nama (Hamba Allah)</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      disabled={isHambaAllah}
                      value={isHambaAllah ? 'Hamba Allah' : nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda / Keluarga"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 disabled:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Nomor WhatsApp (Opsional, untuk e-sertifikat)
                    </label>
                    <input
                      type="tel"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>3. Pesan Niat & Doa Keberkahan</span>
                </label>

                <div>
                  <textarea
                    rows={4}
                    value={pesanDoa}
                    onChange={(e) => setPesanDoa(e.target.value)}
                    placeholder="Tuliskan niat wakaf atau doa untuk diri sendiri, keluarga, atau almarhum/almarhumah tercinta..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* STEP 3: Metode Pembayaran & Kode Unik Transfer */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>4. Metode Pembayaran & Rincian Transfer</span>
              </label>

              {/* Toggle Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMetodePembayaran('BSI')}
                  className={`flex-1 p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                    metodePembayaran === 'BSI'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-4 h-4 text-lime-400" />
                  <span>Transfer BSI (Bank Syariah Indonesia)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodePembayaran('QRIS')}
                  className={`flex-1 p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                    metodePembayaran === 'QRIS'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-lime-400" />
                  <span>QRIS Instant (Mobile Banking / E-Wallet)</span>
                </button>
              </div>

              {/* Summary Transfer Card */}
              <div className="bg-emerald-950 text-white p-5 rounded-2xl border-2 border-emerald-600 space-y-4">
                {metodePembayaran === 'BSI' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                      <div>
                        <span className="text-xs text-emerald-300 block">Bank Tujuan</span>
                        <span className="text-sm font-bold text-white">Bank Syariah Indonesia (BSI)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-300 block">Atas Nama Rekening</span>
                        <span className="text-sm font-bold text-lime-300">Masjid Citra Sentul Raya</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-emerald-900 p-3.5 rounded-xl border border-emerald-700">
                      <div>
                        <span className="text-[11px] text-emerald-300 block font-semibold uppercase">Nomor Rekening BSI</span>
                        <span className="text-2xl font-mono font-black text-lime-300 tracking-wider">
                          7257159102
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('7257159102', 'rek')}
                        className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        {copiedRek ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedRek ? 'Tersalin!' : 'Salin No. Rek'}</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-800">
                      <div>
                        <span className="text-[11px] text-emerald-300 block font-semibold">Total Nominal Transfer (+Kode Unik)</span>
                        <span className="text-2xl font-black text-white">
                          {formatRupiah(totalTransfer)}
                        </span>
                        <span className="text-[10px] text-emerald-400 block mt-0.5">
                          *Termasuk kode unik verifikasi otomatis Rp {uniqueCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(totalTransfer.toString(), 'nominal')}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-emerald-500"
                      >
                        {copiedNominal ? <Check className="w-4 h-4 text-lime-300" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedNominal ? 'Tersalin!' : 'Salin Nominal Exact'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* QRIS Card */
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white p-3 rounded-2xl border-2 border-lime-400 shadow-md text-center group relative overflow-hidden">
                      <div 
                        onClick={() => setShowQrisModal(true)}
                        className="relative cursor-pointer overflow-hidden rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <img 
                          src="/images/qris-masjid.jpg" 
                          alt="QRIS Official Masjid Citra Sentul Raya" 
                          className="w-44 h-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                          <ZoomIn className="w-4 h-4" />
                          <span>Klik Perbesar</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-800 block font-mono">
                          NMID : ID1023304558381
                        </span>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsQrisZoomed(false);
                              setShowQrisModal(true);
                            }}
                            className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <ZoomIn className="w-3 h-3" />
                            Perbesar
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={handleDownloadQris}
                            className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            Unduh QR
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs bg-lime-400/20 text-lime-300 px-2.5 py-1 rounded-md font-bold inline-block border border-lime-400/30">
                          QRIS Standar Nasional (GPN)
                        </span>
                        <span className="text-xs bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded-md font-semibold inline-block border border-emerald-700">
                          Verifikasi Otomatis
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white">Scan & Bayar Sekarang</h4>
                      <p className="text-xs text-emerald-200 leading-relaxed max-w-md">
                        Mendukung semua aplikasi e-Wallet & Mobile Banking: BCA Mobile, Livin Mandiri, BRImo, BSI Mobile, GoPay, OVO, Dana, ShopeePay, LinkAja, dll.
                      </p>

                      <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-emerald-300 block font-medium">Nominal Wakaf:</span>
                          <span className="text-2xl font-black text-lime-300">{formatRupiah(totalTransfer)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(totalTransfer.toString(), 'nominal')}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-lime-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-emerald-600 cursor-pointer"
                        >
                          {copiedNominal ? <Check className="w-3.5 h-3.5 text-lime-300" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedNominal ? 'Tersalin' : 'Salin Nominal'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit & Confirm Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-extrabold text-base tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5 text-lime-300" />
                <span>Niatkan & Konfirmasi Wakaf</span>
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS SUBMISSION PANEL */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Alhamdulillah! Niat Wakaf Terdaftar
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Jazakumullah Khairan Katsiran
              </h3>
              <p className="text-slate-600 text-sm">
                Terima kasih, <strong className="text-emerald-800 font-bold">{lastSubmittedMuwakif?.nama}</strong>. Semoga Allah melipatgandakan rezeki, melapangkan setiap urusan, dan membangunkan rumah di surga-Nya.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between border-b border-emerald-200 pb-2">
                <span className="text-slate-500">Nominal Wakaf:</span>
                <span className="font-extrabold text-emerald-800 text-sm">{formatRupiah(lastSubmittedMuwakif?.nominal || 0)}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200 pb-2">
                <span className="text-slate-500">Paket:</span>
                <span className="font-semibold">{lastSubmittedMuwakif?.paket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode:</span>
                <span className="font-bold text-slate-800">{lastSubmittedMuwakif?.metode}</span>
              </div>
            </div>

            {/* Actions: WA Confirm & View Digital Certificate */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              {lastSubmittedMuwakif && (
                <>
                  <a
                    href={buildWhatsAppLink('081219200400', {
                      nama: lastSubmittedMuwakif.nama,
                      nominal: lastSubmittedMuwakif.nominal,
                      paket: lastSubmittedMuwakif.paket,
                      pesanDoa: lastSubmittedMuwakif.pesanDoa,
                      metode: lastSubmittedMuwakif.metode,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 text-lime-300" />
                    <span>Kirim Bukti via WhatsApp Pak Leo</span>
                  </a>

                  <button
                    onClick={() => onShowCertificate(lastSubmittedMuwakif)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Lihat & Cetak E-Sertifikat Wakaf</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                Wakaf Lagi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN / INTERACTIVE ZOOM QRIS MODAL */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl space-y-4 border border-slate-200 my-auto">
            <button
              onClick={() => {
                setShowQrisModal(false);
                setIsQrisZoomed(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                QRIS Resmi DKM
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                MASJID CITRA SENTUL RAYA
              </h3>
              <p className="text-xs text-slate-500 font-mono">NMID: ID1023304558381</p>
            </div>

            {/* QR Image Container with Click-to-Zoom */}
            <div className="relative group">
              <div 
                onClick={() => setIsQrisZoomed(!isQrisZoomed)}
                className={`bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner inline-block overflow-hidden cursor-pointer transition-all duration-300 ${
                  isQrisZoomed ? 'scale-125 z-10 shadow-2xl ring-4 ring-emerald-500/30' : 'hover:border-emerald-400'
                }`}
              >
                <img
                  src="/images/qris-masjid.jpg"
                  alt="QRIS Masjid Citra Sentul Raya Full"
                  className="w-full max-w-[280px] h-auto rounded-xl mx-auto shadow-sm select-none"
                />
              </div>

              <div className="mt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQrisZoomed(!isQrisZoomed)}
                  className="text-xs text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isQrisZoomed ? (
                    <>
                      <ZoomOut className="w-3.5 h-3.5" />
                      <span>Kecilkan (Reset Zoom)</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Klik Gambar / Tombol Untuk Zoom</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Arahkan kamera scanner aplikasi m-banking atau e-wallet (BSI, BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay) untuk melakukan pembayaran.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadQris}
                className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-lime-300" />
                <span>Unduh Gambar QRIS</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQrisModal(false);
                  setIsQrisZoomed(false);
                }}
                className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
