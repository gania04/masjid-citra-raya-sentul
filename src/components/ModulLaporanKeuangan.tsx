import React, { useState } from 'react';
import { BarChart3, Scale, TrendingUp, TrendingDown, Download, FileSpreadsheet, Shield, Layers } from 'lucide-react';
import { INITIAL_CHART_OF_ACCOUNTS, INITIAL_JURNAL_ENTRIES, AkunCoA, JurnalEntry } from '../data/akuntansiData';

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

interface ModulLaporanKeuanganProps {
  journals?: JurnalEntry[];
  accounts?: AkunCoA[];
}

export const ModulLaporanKeuangan: React.FC<ModulLaporanKeuanganProps> = ({
  journals = INITIAL_JURNAL_ENTRIES,
  accounts = INITIAL_CHART_OF_ACCOUNTS,
}) => {
  const [tab, setTab] = useState<'neraca' | 'labarugi'>('neraca');

  // Compute Live Balance for an account by adding posted journal entries
  const getLiveBalance = (kode: string) => {
    const akun = accounts.find(a => a.kode === kode);
    if (!akun) return 0;
    let balance = akun.saldoAwal;

    journals.forEach(j => {
      if (j.status === 'Posted') {
        j.baris.forEach(b => {
          if (b.kodeAkun === kode) {
            if (akun.saldoNormal === 'Debit') {
              balance += (b.debit - b.kredit);
            } else {
              balance += (b.kredit - b.debit);
            }
          }
        });
      }
    });
    return balance;
  };

  // Group accounts by category
  const aktivaList = accounts.filter(a => a.jenis === 'Aktiva');
  const kewajibanList = accounts.filter(a => a.jenis === 'Kewajiban');
  const ekuitasList = accounts.filter(a => a.jenis === 'Ekuitas');
  const pendapatanList = accounts.filter(a => a.jenis === 'Pendapatan');
  const bebanList = accounts.filter(a => a.jenis === 'Beban');

  const totalAktiva = aktivaList.reduce((s, a) => s + getLiveBalance(a.kode), 0);
  const totalKewajiban = kewajibanList.reduce((s, a) => s + getLiveBalance(a.kode), 0);
  const totalEkuitas = ekuitasList.reduce((s, a) => s + getLiveBalance(a.kode), 0);

  const totalPendapatan = pendapatanList.reduce((s, a) => s + getLiveBalance(a.kode), 0);
  const totalBeban = bebanList.reduce((s, a) => s + getLiveBalance(a.kode), 0);
  const surplusDefisit = totalPendapatan - totalBeban;

  const isBalanced = Math.abs(totalAktiva - (totalKewajiban + totalEkuitas + surplusDefisit)) < 1;

  // Breakdown sources for transparent integration
  const donasiUmumTotal = journals
    .filter(j => j.status === 'Posted' && j.sumber === 'Donasi Umum')
    .reduce((s, j) => s + j.baris.reduce((b, r) => b + r.debit, 0), 0);

  const donasiPortalTotal = journals
    .filter(j => j.status === 'Posted' && j.sumber === 'Donasi Portal Jamaah')
    .reduce((s, j) => s + j.baris.reduce((b, r) => b + r.debit, 0), 0);

  const aktivaGroups = [...new Set(aktivaList.map(a => a.kelompok))];
  const pendapatanGroups = [...new Set(pendapatanList.map(a => a.kelompok))];
  const bebanGroups = [...new Set(bebanList.map(a => a.kelompok))];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Laporan Keuangan Profesional</h2>
            <p className="text-emerald-200 text-xs sm:text-sm">Standar ISAK 35 / Akuntansi Masjid Terintegrasi</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Mengekspor Laporan Keuangan ke PDF...')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all border border-white/20"
          >
            <Download className="w-4 h-4 text-emerald-300" /> Export PDF
          </button>
          <button
            onClick={() => alert('Mengekspor Laporan Keuangan ke Excel...')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Integration Sources Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Aset (Aktiva)</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-lg font-black font-mono text-slate-900">{formatRp(totalAktiva)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Kas, Bank BSI & Tanah Wakaf</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Donasi Portal Jamaah</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-600">{formatRp(donasiPortalTotal)}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Terintegrasi Realtime</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Donasi Umum / Kotak</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-black font-mono text-amber-700">{formatRp(donasiUmumTotal)}</p>
          <p className="text-[10px] text-amber-700 font-semibold mt-1">✓ Terintegrasi Realtime</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surplus Periode Ini</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className={`text-lg font-black font-mono ${surplusDefisit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {formatRp(surplusDefisit)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Pendapatan dikurangi Beban</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setTab('neraca')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'neraca'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Laporan Neraca (Balance Sheet)
        </button>
        <button
          onClick={() => setTab('labarugi')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'labarugi'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Laporan Surplus & Defisit (Laba Rugi Operasional)
        </button>
      </div>

      {/* REPORT CONTENT: NERACA */}
      {tab === 'neraca' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-0">
          
          {/* Header Document */}
          <div className="p-6 text-center border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">DKM MASJID CITRA SENTUL RAYA</span>
            <h3 className="text-xl font-black text-slate-900 mt-1">LAPORAN NERACA (BALANCE SHEET)</h3>
            <p className="text-xs text-slate-500 font-medium">Periode per 31 Juli 2026 • Disajikan dalam Rupiah (IDR)</p>
          </div>

          {/* Grid Aktiva vs Kewajiban & Ekuitas */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs sm:text-sm">
            
            {/* LEFT COLUMN: AKTIVA */}
            <div className="p-6 space-y-5">
              <h4 className="font-black text-blue-700 uppercase tracking-wider text-xs border-b-2 border-blue-600 pb-2">
                AKTIVA (ASSETS)
              </h4>

              {aktivaGroups.map(grp => (
                <div key={grp} className="space-y-2">
                  <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">{grp}</p>
                  {aktivaList.filter(a => a.kelompok === grp).map(a => {
                    const b = getLiveBalance(a.kode);
                    return (
                      <div key={a.kode} className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-700 font-medium">{a.kode} – {a.nama}</span>
                        <span className="font-mono font-bold text-slate-900">{formatRp(b)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="border-t-2 border-blue-700 pt-4 flex justify-between font-black text-base text-blue-800 bg-blue-50/50 p-3 rounded-xl">
                <span>TOTAL AKTIVA</span>
                <span className="font-mono">{formatRp(totalAktiva)}</span>
              </div>
            </div>

            {/* RIGHT COLUMN: KEWAJIBAN & EKUITAS */}
            <div className="p-6 space-y-5">
              
              {/* Kewajiban */}
              <div className="space-y-3">
                <h4 className="font-black text-rose-700 uppercase tracking-wider text-xs border-b-2 border-rose-600 pb-2">
                  KEWAJIBAN (LIABILITIES)
                </h4>
                {kewajibanList.map(a => (
                  <div key={a.kode} className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">{a.kode} – {a.nama}</span>
                    <span className="font-mono font-bold text-slate-900">{formatRp(getLiveBalance(a.kode))}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-rose-700 pt-1">
                  <span>Total Kewajiban</span>
                  <span className="font-mono">{formatRp(totalKewajiban)}</span>
                </div>
              </div>

              {/* Ekuitas / Saldo Dana */}
              <div className="space-y-3 pt-4">
                <h4 className="font-black text-purple-700 uppercase tracking-wider text-xs border-b-2 border-purple-600 pb-2">
                  SALDO DANA & EKUITAS
                </h4>
                {ekuitasList.map(a => (
                  <div key={a.kode} className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">{a.kode} – {a.nama}</span>
                    <span className="font-mono font-bold text-slate-900">{formatRp(getLiveBalance(a.kode))}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-semibold text-emerald-700">
                  <span>Surplus / Defisit Periode Berjalan</span>
                  <span className="font-mono font-bold">{formatRp(surplusDefisit)}</span>
                </div>
                <div className="flex justify-between font-bold text-purple-700 pt-1">
                  <span>Total Ekuitas & Surplus</span>
                  <span className="font-mono">{formatRp(totalEkuitas + surplusDefisit)}</span>
                </div>
              </div>

              <div className="border-t-2 border-purple-700 pt-4 flex justify-between font-black text-base text-purple-800 bg-purple-50/50 p-3 rounded-xl">
                <span>TOTAL KEWAJIBAN + SALDO DANA</span>
                <span className="font-mono">{formatRp(totalKewajiban + totalEkuitas + surplusDefisit)}</span>
              </div>
            </div>
          </div>

          {/* Balance Check Footer */}
          <div className={`p-4 text-center font-bold text-xs sm:text-sm border-t ${
            isBalanced ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {isBalanced 
              ? '✅ Keseimbangan Neraca Sempurna (Total Aktiva = Total Kewajiban + Saldo Dana & Surplus)' 
              : '⚠️ Neraca Tidak Seimbang! Periksa kembali jurnal yang diposting.'}
          </div>
        </div>
      )}

      {/* REPORT CONTENT: LABA RUGI / SURPLUS DEFISIT */}
      {tab === 'labarugi' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-0">
          
          <div className="p-6 text-center border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">DKM MASJID CITRA SENTUL RAYA</span>
            <h3 className="text-xl font-black text-slate-900 mt-1">LAPORAN SURPLUS & DEFISIT (LABA RUGI)</h3>
            <p className="text-xs text-slate-500 font-medium">Periode 1 Juli 2026 s/d 31 Juli 2026</p>
          </div>

          <div className="p-6 space-y-6 text-xs sm:text-sm">
            
            {/* Section 1: Pendapatan */}
            <div className="space-y-3">
              <h4 className="font-black text-emerald-700 uppercase tracking-wider text-xs border-b-2 border-emerald-600 pb-2">
                1. PENDAPATAN & PENERIMAAN DONASI
              </h4>
              
              {pendapatanGroups.map(grp => (
                <div key={grp} className="space-y-1.5 pl-2">
                  <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">{grp}</p>
                  {pendapatanList.filter(a => a.kelompok === grp).map(a => {
                    const bal = getLiveBalance(a.kode);
                    return (
                      <div key={a.kode} className="flex justify-between py-1.5 border-b border-slate-100 pl-4">
                        <span className="text-slate-700 font-medium">{a.nama}</span>
                        <span className="font-mono font-bold text-emerald-700">{formatRp(bal)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="flex justify-between font-black text-base text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 mt-2">
                <span>TOTAL PENDAPATAN & PENERIMAAN</span>
                <span className="font-mono">{formatRp(totalPendapatan)}</span>
              </div>
            </div>

            {/* Section 2: Beban */}
            <div className="space-y-3 pt-2">
              <h4 className="font-black text-rose-700 uppercase tracking-wider text-xs border-b-2 border-rose-600 pb-2">
                2. BEBAN & PENGELUARAN OPERASIONAL / PROGRAM
              </h4>

              {bebanGroups.map(grp => (
                <div key={grp} className="space-y-1.5 pl-2">
                  <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">{grp}</p>
                  {bebanList.filter(a => a.kelompok === grp).map(a => {
                    const bal = getLiveBalance(a.kode);
                    return (
                      <div key={a.kode} className="flex justify-between py-1.5 border-b border-slate-100 pl-4">
                        <span className="text-slate-700 font-medium">{a.nama}</span>
                        <span className="font-mono font-bold text-rose-700">{formatRp(bal)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="flex justify-between font-black text-base text-rose-800 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 mt-2">
                <span>TOTAL BEBAN & PENGELUARAN</span>
                <span className="font-mono">{formatRp(totalBeban)}</span>
              </div>
            </div>

            {/* Section 3: Net Surplus / Defisit */}
            <div className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
              surplusDefisit >= 0 
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
                : 'bg-rose-600 text-white border-rose-700 shadow-md'
            }`}>
              <div>
                <p className="text-xs uppercase tracking-widest font-black text-white/80">HASIL OPERASIONAL BERSIH</p>
                <h4 className="text-2xl font-black">{surplusDefisit >= 0 ? 'SURPLUS PERIODE INI' : 'DEFISIT PERIODE INI'}</h4>
                <p className="text-xs text-white/80 mt-0.5">Pendapatan Bersih dikurangi Total Pengeluaran Operasional</p>
              </div>

              <p className="text-3xl font-black font-mono tracking-tight bg-white/10 backdrop-blur px-6 py-3 rounded-2xl border border-white/20">
                {formatRp(surplusDefisit)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
