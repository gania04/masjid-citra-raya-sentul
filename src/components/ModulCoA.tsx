import React, { useState } from 'react';
import { PlusCircle, Search, BookOpen, TrendingUp, TrendingDown, Shield, DollarSign, X, Check } from 'lucide-react';
import { INITIAL_CHART_OF_ACCOUNTS, AkunCoA, JurnalEntry } from '../data/akuntansiData';

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const JENIS_COLOR: Record<string, string> = {
  Aktiva: 'bg-blue-100 text-blue-700 border-blue-200',
  Kewajiban: 'bg-red-100 text-red-700 border-red-200',
  Ekuitas: 'bg-purple-100 text-purple-700 border-purple-200',
  Pendapatan: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Beban: 'bg-amber-100 text-amber-700 border-amber-200',
};

interface ModulCoAProps {
  journals?: JurnalEntry[];
}

export const ModulCoA: React.FC<ModulCoAProps> = ({ journals = [] }) => {
  const [accounts, setAccounts] = useState<AkunCoA[]>(INITIAL_CHART_OF_ACCOUNTS);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new CoA account
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newJenis, setNewJenis] = useState<'Aktiva' | 'Kewajiban' | 'Ekuitas' | 'Pendapatan' | 'Beban'>('Aktiva');
  const [newKelompok, setNewKelompok] = useState('Aktiva Lancar');
  const [newSaldoNormal, setNewSaldoNormal] = useState<'Debit' | 'Kredit'>('Debit');
  const [newSaldoAwal, setNewSaldoAwal] = useState('');

  // Compute Live Saldo by combining Saldo Awal + Posted Journals
  const getLiveSaldo = (akun: AkunCoA) => {
    let current = akun.saldoAwal;
    journals.forEach(j => {
      if (j.status === 'Posted') {
        j.baris.forEach(b => {
          if (b.kodeAkun === akun.kode) {
            if (akun.saldoNormal === 'Debit') {
              current += (b.debit - b.kredit);
            } else {
              current += (b.kredit - b.debit);
            }
          }
        });
      }
    });
    return current;
  };

  const filtered = accounts.filter(a => {
    const matchSearch = a.kode.includes(search) || a.nama.toLowerCase().includes(search.toLowerCase()) || a.kelompok.toLowerCase().includes(search.toLowerCase());
    const matchJenis = filterJenis === 'Semua' || a.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const totalAktiva = accounts.filter(a => a.jenis === 'Aktiva').reduce((s, a) => s + getLiveSaldo(a), 0);
  const totalKewajiban = accounts.filter(a => a.jenis === 'Kewajiban').reduce((s, a) => s + getLiveSaldo(a), 0);
  const totalEkuitas = accounts.filter(a => a.jenis === 'Ekuitas').reduce((s, a) => s + getLiveSaldo(a), 0);
  const totalPendapatan = accounts.filter(a => a.jenis === 'Pendapatan').reduce((s, a) => s + getLiveSaldo(a), 0);
  const totalBeban = accounts.filter(a => a.jenis === 'Beban').reduce((s, a) => s + getLiveSaldo(a), 0);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode || !newNama) return;

    const newAcc: AkunCoA = {
      kode: newKode,
      nama: newNama,
      jenis: newJenis,
      kelompok: newKelompok,
      saldoNormal: newSaldoNormal,
      saldoAwal: parseInt(newSaldoAwal.replace(/\D/g, ''), 10) || 0,
    };

    setAccounts([...accounts, newAcc]);
    setShowAddModal(false);
    setNewKode('');
    setNewNama('');
    setNewSaldoAwal('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Chart of Accounts (CoA)</h2>
              <p className="text-indigo-200 text-xs sm:text-sm">Struktur Master Akun Keuangan Masjid Citra Sentul Raya</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Akun Baru
          </button>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-300" /> Total Aset / Aktiva
            </div>
            <p className="font-black text-lg sm:text-xl text-white font-mono">{formatRp(totalAktiva)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" /> Total Pendapatan
            </div>
            <p className="font-black text-lg sm:text-xl text-emerald-300 font-mono">{formatRp(totalPendapatan)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-300" /> Total Beban
            </div>
            <p className="font-black text-lg sm:text-xl text-rose-300 font-mono">{formatRp(totalBeban)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-300" /> Saldo Dana Masjid
            </div>
            <p className="font-black text-lg sm:text-xl text-amber-300 font-mono">{formatRp(totalEkuitas)}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kode (1-1100), nama akun, atau kelompok..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Jenis:</span>
          {['Semua', 'Aktiva', 'Kewajiban', 'Ekuitas', 'Pendapatan', 'Beban'].map(j => (
            <button
              key={j}
              onClick={() => setFilterJenis(j)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterJenis === j 
                  ? 'bg-indigo-700 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* Account Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Kode Akun</th>
                <th className="px-5 py-4">Nama Akun (Chart of Accounts)</th>
                <th className="px-5 py-4">Jenis Akun</th>
                <th className="px-5 py-4">Kelompok Sub-Laporan</th>
                <th className="px-5 py-4">Saldo Normal</th>
                <th className="px-5 py-4 text-right">Saldo Saat Ini (Live)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(akun => {
                const liveSaldo = getLiveSaldo(akun);
                return (
                  <tr key={akun.kode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">{akun.kode}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{akun.nama}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${JENIS_COLOR[akun.jenis]}`}>
                        {akun.jenis}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{akun.kelompok}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold ${akun.saldoNormal === 'Debit' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {akun.saldoNormal}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold text-sm ${
                      akun.jenis === 'Beban' 
                        ? 'text-rose-600' 
                        : akun.jenis === 'Pendapatan' 
                        ? 'text-emerald-600' 
                        : 'text-slate-900'
                    }`}>
                      {formatRp(liveSaldo)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-slate-50">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-sm">Akun tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        )}
      </div>

      {/* Modal Form Add Account */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" /> Tambah Akun CoA Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kode Akun (Contoh: 1-1500, 5-1800)</label>
                <input
                  type="text"
                  required
                  placeholder="Kode akun..."
                  value={newKode}
                  onChange={e => setNewKode(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Akun</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beban Pemeliharaan Sound System"
                  value={newNama}
                  onChange={e => setNewNama(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Akun</label>
                  <select
                    value={newJenis}
                    onChange={e => {
                      const v = e.target.value as any;
                      setNewJenis(v);
                      if (v === 'Aktiva' || v === 'Beban') setNewSaldoNormal('Debit');
                      else setNewSaldoNormal('Kredit');
                    }}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Aktiva">Aktiva (Asset)</option>
                    <option value="Kewajiban">Kewajiban (Liability)</option>
                    <option value="Ekuitas">Ekuitas (Fund/Equity)</option>
                    <option value="Pendapatan">Pendapatan (Revenue)</option>
                    <option value="Beban">Beban (Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Saldo Normal</label>
                  <select
                    value={newSaldoNormal}
                    onChange={e => setNewSaldoNormal(e.target.value as any)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Debit">Debit</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kelompok Sub-Laporan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beban Operasional, Aktiva Tetap"
                  value={newKelompok}
                  onChange={e => setNewKelompok(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Saldo Pembukaan / Awal (Rp)</label>
                <input
                  type="text"
                  placeholder="0"
                  value={newSaldoAwal}
                  onChange={e => setNewSaldoAwal(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" /> Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
