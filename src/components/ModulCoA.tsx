import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, BookOpen, TrendingUp, TrendingDown, Shield, DollarSign, X, Check, FileSpreadsheet, Upload, RefreshCw, Trash2, Edit3 } from 'lucide-react';
import { INITIAL_CHART_OF_ACCOUNTS, AkunCoA, JurnalEntry } from '../data/akuntansiData';
import { supabase } from '../lib/supabase';

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const JENIS_COLOR: Record<string, string> = {
  Aktiva: 'bg-lime-100 text-lime-700 border-lime-200',
  Kewajiban: 'bg-red-100 text-red-700 border-red-200',
  Ekuitas: 'bg-lime-100 text-lime-700 border-lime-200',
  Pendapatan: 'bg-lime-100 text-lime-700 border-lime-200',
  Beban: 'bg-lime-100 text-lime-700 border-lime-200',
};

interface ModulCoAProps {
  journals?: JurnalEntry[];
}

export const ModulCoA: React.FC<ModulCoAProps> = ({ journals = [] }) => {
  const [accounts, setAccounts] = useState<AkunCoA[]>([]);

  const mapKategoriToJenis = (kategori: string): any => {
    if (kategori === 'Aset') return 'Aktiva';
    if (kategori === 'Liabilitas') return 'Kewajiban';
    if (kategori === 'Aset Bersih') return 'Ekuitas';
    if (kategori === 'Penerimaan') return 'Pendapatan';
    return 'Beban';
  };

  const mapJenisToKategori = (jenis: string) => {
    if (jenis === 'Aktiva') return 'Aset';
    if (jenis === 'Kewajiban') return 'Liabilitas';
    if (jenis === 'Ekuitas') return 'Aset Bersih';
    if (jenis === 'Pendapatan') return 'Penerimaan';
    return 'Beban';
  };

  useEffect(() => {
    const fetchCOA = async () => {
      try {
        const { data, error } = await supabase.from('chart_of_accounts').select('*').order('kode');
        if (!error && data) {
          const formatted: AkunCoA[] = data.map((d: any) => ({
            kode: d.kode,
            nama: d.nama,
            jenis: mapKategoriToJenis(d.kategori),
            kelompok: d.kelompok,
            saldoNormal: d.is_debit ? 'Debit' : 'Kredit',
            saldoAwal: Number(d.saldo) || 0,
            status: d.status as any,
          }));
          setAccounts(formatted);
          localStorage.setItem('masjid_chart_of_accounts', JSON.stringify(formatted));
        } else {
          const saved = localStorage.getItem('masjid_chart_of_accounts');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) setAccounts(parsed);
            } catch (e) {
              console.error('Error loading COA from localStorage', e);
            }
          } else {
            setAccounts(INITIAL_CHART_OF_ACCOUNTS);
          }
        }
      } catch (err) {
        console.error('Error fetching COA:', err);
      }
    };
    fetchCOA();
  }, []);

  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [rawSpreadsheetText, setRawSpreadsheetText] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(true);

  // Editing Account state
  const [editingKode, setEditingKode] = useState<string | null>(null);

  // Form state for new/edit CoA account
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newJenis, setNewJenis] = useState<'Aktiva' | 'Kewajiban' | 'Ekuitas' | 'Pendapatan' | 'Beban'>('Aktiva');
  const [newKelompok, setNewKelompok] = useState('Aktiva Lancar');
  const [newSaldoNormal, setNewSaldoNormal] = useState<'Debit' | 'Kredit'>('Debit');
  const [newSaldoAwal, setNewSaldoAwal] = useState('');
  const [newStatus, setNewStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');

  // Persist accounts state changes to localStorage
  const updateAndSaveAccounts = (newAccList: AkunCoA[]) => {
    setAccounts(newAccList);
    localStorage.setItem('masjid_chart_of_accounts', JSON.stringify(newAccList));
  };

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

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode || !newNama) return;

    const newAcc: AkunCoA = {
      kode: newKode,
      nama: newNama,
      jenis: newJenis,
      kelompok: newKelompok,
      saldoNormal: newSaldoNormal,
      saldoAwal: parseInt(newSaldoAwal.replace(/\D/g, ''), 10) || 0,
      status: newStatus,
    };

    if (editingKode) {
      const updated = accounts.map(a => a.kode === editingKode ? newAcc : a);
      updateAndSaveAccounts(updated);
      
      try {
        await supabase.from('chart_of_accounts').update({
          kode: newAcc.kode,
          nama: newAcc.nama,
          kategori: mapJenisToKategori(newAcc.jenis),
          kelompok: newAcc.kelompok,
          saldo: newAcc.saldoAwal,
          status: newAcc.status,
          is_debit: newAcc.saldoNormal === 'Debit'
        }).eq('kode', editingKode);
      } catch(err) { console.error('Error updating COA', err); }
      
      setEditingKode(null);
    } else {
      updateAndSaveAccounts([...accounts, newAcc]);
      
      try {
        await supabase.from('chart_of_accounts').insert([{
          kode: newAcc.kode,
          nama: newAcc.nama,
          kategori: mapJenisToKategori(newAcc.jenis),
          kelompok: newAcc.kelompok,
          saldo: newAcc.saldoAwal,
          status: newAcc.status,
          is_debit: newAcc.saldoNormal === 'Debit'
        }]);
      } catch(err) { console.error('Error inserting COA', err); }
    }

    setShowAddModal(false);
    setNewKode('');
    setNewNama('');
    setNewSaldoAwal('');
    setNewStatus('Aktif');
  };

  const handleToggleAccountStatus = async (kode: string) => {
    let newStatusStr = 'Aktif';
    const updated = accounts.map(a => {
      if (a.kode === kode) {
        const current = a.status || 'Aktif';
        newStatusStr = current === 'Aktif' ? 'Non-Aktif' : 'Aktif';
        return { ...a, status: newStatusStr as any };
      }
      return a;
    });
    updateAndSaveAccounts(updated);
    
    try {
      await supabase.from('chart_of_accounts').update({ status: newStatusStr }).eq('kode', kode);
    } catch (err) { console.error(err); }
  };

  const handleDeleteAccount = async (kode: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Akun ${kode}?`)) {
      const updated = accounts.filter(a => a.kode !== kode);
      updateAndSaveAccounts(updated);
      try {
        await supabase.from('chart_of_accounts').delete().eq('kode', kode);
      } catch (err) { console.error(err); }
    }
  };

  const handleClearAllAccounts = async () => {
    if (confirm('⚠️ Apakah Anda yakin ingin MENGHAPUS SELURUH COA yang terdaftar saat ini? Tindakan ini akan mengosongkan seluruh master akun.')) {
      updateAndSaveAccounts([]);
      try {
        await supabase.from('chart_of_accounts').delete().neq('kode', 'placeholder'); // delete all
      } catch (err) { console.error(err); }
      alert('✅ Seluruh data COA telah berhasil dihapus dan dikosongkan!');
    }
  };

  const handleEditClick = (akun: AkunCoA) => {
    setEditingKode(akun.kode);
    setNewKode(akun.kode);
    setNewNama(akun.nama);
    setNewJenis(akun.jenis);
    setNewKelompok(akun.kelompok);
    setNewSaldoNormal(akun.saldoNormal);
    setNewSaldoAwal(akun.saldoAwal.toString());
    setNewStatus(akun.status || 'Aktif');
    setShowAddModal(true);
  };

  const handleImportSpreadsheet = async () => {
    if (!rawSpreadsheetText.trim()) {
      setImportStatusMsg('Teks spreadsheet kosong. Silakan paste teks atau tabel dari Google Sheets / Excel.');
      return;
    }

    const lines = rawSpreadsheetText.split('\n');
    const importedAccs: AkunCoA[] = [];
    let successCount = 0;

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      const delimiter = cleanLine.includes('\t') ? '\t' : cleanLine.includes(';') ? ';' : cleanLine.includes(',') ? ',' : ' ';
      const parts = cleanLine.split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ''));

      if (parts.length >= 2) {
        const kode = parts[0];
        const nama = parts[1];
        
        if (kode.toLowerCase().includes('kode') || nama.toLowerCase().includes('nama')) return;

        let jenis: 'Aktiva' | 'Kewajiban' | 'Ekuitas' | 'Pendapatan' | 'Beban' = 'Aktiva';
        const rawJenis = (parts[2] || '').toLowerCase();
        if (rawJenis.includes('kewajiban') || rawJenis.includes('liabilit') || rawJenis.includes('utang') || rawJenis.includes('hutang')) jenis = 'Kewajiban';
        else if (rawJenis.includes('ekuitas') || rawJenis.includes('modal') || rawJenis.includes('dana')) jenis = 'Ekuitas';
        else if (rawJenis.includes('pendapatan') || rawJenis.includes('infaq') || rawJenis.includes('zakat') || rawJenis.includes('donasi')) jenis = 'Pendapatan';
        else if (rawJenis.includes('beban') || rawJenis.includes('biaya') || rawJenis.includes('pengeluaran')) jenis = 'Beban';
        else if (kode.startsWith('2')) jenis = 'Kewajiban';
        else if (kode.startsWith('3')) jenis = 'Ekuitas';
        else if (kode.startsWith('4')) jenis = 'Pendapatan';
        else if (kode.startsWith('5')) jenis = 'Beban';

        const kelompok = parts[3] || (jenis === 'Aktiva' ? 'Aktiva Lancar' : jenis === 'Beban' ? 'Beban Operasional' : 'Pendapatan Donasi');
        const saldoNormal: 'Debit' | 'Kredit' = (parts[4] || '').toLowerCase().includes('kredit') || (jenis === 'Kewajiban' || jenis === 'Ekuitas' || jenis === 'Pendapatan') ? 'Kredit' : 'Debit';
        const saldoAwal = parseInt((parts[5] || '0').replace(/\D/g, ''), 10) || 0;

        importedAccs.push({
          kode,
          nama,
          jenis,
          kelompok,
          saldoNormal,
          saldoAwal,
          status: 'Aktif'
        });
        successCount++;
      }
    });

    if (importedAccs.length > 0) {
      let finalAccs = importedAccs;
      
      try {
        if (replaceExisting) {
          await supabase.from('chart_of_accounts').delete().neq('kode', 'placeholder'); // Clear table first
        }
        
        const upsertData = importedAccs.map(newAcc => ({
          kode: newAcc.kode,
          nama: newAcc.nama,
          kategori: mapJenisToKategori(newAcc.jenis),
          kelompok: newAcc.kelompok,
          saldo: newAcc.saldoAwal,
          status: newAcc.status,
          is_debit: newAcc.saldoNormal === 'Debit'
        }));
        await supabase.from('chart_of_accounts').upsert(upsertData, { onConflict: 'kode' });
      } catch (err) {
        console.error('Bulk insert COA failed:', err);
      }

      if (!replaceExisting) {
        const existingMap = new Map<string, AkunCoA>(accounts.map(a => [a.kode, a]));
        importedAccs.forEach(newA => existingMap.set(newA.kode, newA));
        finalAccs = Array.from(existingMap.values());
      }

      updateAndSaveAccounts(finalAccs);
      setImportStatusMsg(`✅ Berhasil ${replaceExisting ? 'mengosongkan COA lama &' : ''} mengimpor ${successCount} Akun COA baru dari spreadsheet!`);
      setTimeout(() => {
        setShowImportModal(false);
        setRawSpreadsheetText('');
        setImportStatusMsg('');
      }, 1500);
    } else {
      setImportStatusMsg('Format tidak dikenali. Pastikan minimal ada kolom Kode Akun dan Nama Akun.');
    }
  };

  const handleResetDefaultCOA = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh COA yang terdaftar?')) {
      updateAndSaveAccounts([]);
      alert('Daftar COA telah dikosongkan.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-lime-700 via-lime-700 to-lime-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-lime-200" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Chart of Accounts (CoA)</h2>
              <p className="text-lime-200 text-xs sm:text-sm">Struktur Master Akun Keuangan Masjid Citra Sentul Raya ({accounts.length} Akun)</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => {
                setEditingKode(null);
                setNewKode('');
                setNewNama('');
                setNewSaldoAwal('');
                setShowAddModal(true);
              }}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-lime-950 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Akun Baru
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all border border-white/20 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-lime-300" /> Import Google Spreadsheet / CSV
            </button>

            <button
              onClick={async () => {
                if (confirm('Muat ulang 65 Akun COA lengkap dari Google Spreadsheet?')) {
                  updateAndSaveAccounts(INITIAL_CHART_OF_ACCOUNTS);
                  try {
                    await supabase.from('chart_of_accounts').delete().neq('kode', 'placeholder');
                    const upsertData = INITIAL_CHART_OF_ACCOUNTS.map(newAcc => ({
                      kode: newAcc.kode,
                      nama: newAcc.nama,
                      kategori: mapJenisToKategori(newAcc.jenis),
                      kelompok: newAcc.kelompok,
                      saldo: newAcc.saldoAwal,
                      status: newAcc.status || 'Aktif',
                      is_debit: newAcc.saldoNormal === 'Debit'
                    }));
                    await supabase.from('chart_of_accounts').upsert(upsertData, { onConflict: 'kode' });
                  } catch (err) { console.error('Bulk load COA failed', err); }
                  alert('✅ Berhasil memuat 65 Akun COA dari Google Spreadsheet!');
                }
              }}
              title="Muat Ulang 65 Akun COA dari Spreadsheet"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs transition-all border border-emerald-400/40 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Muat COA Spreadsheet
            </button>

            <button
              onClick={handleClearAllAccounts}
              title="Hapus Seluruh COA"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition-all border border-rose-400/30 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Hapus COA
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-lime-200 mb-1">
              <Shield className="w-3.5 h-3.5 text-lime-300" /> Total Aset / Aktiva
            </div>
            <p className="font-black text-lg sm:text-xl text-white font-mono">{formatRp(totalAktiva)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-lime-200 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-lime-300" /> Total Pendapatan
            </div>
            <p className="font-black text-lg sm:text-xl text-lime-300 font-mono">{formatRp(totalPendapatan)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-lime-200 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-300" /> Total Beban
            </div>
            <p className="font-black text-lg sm:text-xl text-rose-300 font-mono">{formatRp(totalBeban)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-lime-200 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-lime-300" /> Saldo Dana Masjid
            </div>
            <p className="font-black text-lg sm:text-xl text-lime-300 font-mono">{formatRp(totalEkuitas)}</p>
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100 transition-all text-slate-800"
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
                  ? 'bg-lime-700 text-white shadow-sm' 
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
                <th className="px-5 py-4 text-center">Status (Enable/Disable)</th>
                <th className="px-5 py-4">Saldo Normal</th>
                <th className="px-5 py-4 text-right">Saldo Saat Ini (Live)</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(akun => {
                const liveSaldo = getLiveSaldo(akun);
                const isEnabled = (akun.status || 'Aktif') === 'Aktif';
                return (
                  <tr key={akun.kode} className={`transition-colors ${isEnabled ? 'hover:bg-slate-50/80' : 'bg-slate-50/50 opacity-60'}`}>
                    <td className="px-5 py-3.5 font-mono font-bold text-lime-700">{akun.kode}</td>
                    <td className={`px-5 py-3.5 font-semibold ${isEnabled ? 'text-slate-800' : 'text-slate-500 line-through'}`}>{akun.nama}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${JENIS_COLOR[akun.jenis]}`}>
                        {akun.jenis}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{akun.kelompok}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleAccountStatus(akun.kode)}
                        title="Klik untuk ubah Status (Enable/Disable)"
                        className={`px-3 py-1 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                          isEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {isEnabled ? '✅ Aktif (Enable)' : '🔴 Non-Aktif (Disable)'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold ${akun.saldoNormal === 'Debit' ? 'text-lime-600' : 'text-lime-600'}`}>
                        {akun.saldoNormal}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold text-sm ${
                      akun.jenis === 'Beban' 
                        ? 'text-rose-600' 
                        : akun.jenis === 'Pendapatan' 
                        ? 'text-lime-600' 
                        : 'text-slate-900'
                    }`}>
                      {formatRp(liveSaldo)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(akun)}
                          title="Edit Akun & Status"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(akun.kode)}
                          title="Hapus Akun"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

      {/* Modal Form Add/Edit Account */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-lime-600" /> {editingKode ? 'Edit Akun CoA' : 'Tambah Akun CoA Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-lime-500"
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
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-lime-500"
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
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-lime-500"
                  >
                    <option value="Aktiva">Aktiva (Asset)</option>
                    <option value="Kewajiban">Kewajiban (Liability)</option>
                    <option value="Ekuitas">Ekuitas (Fund/Equity)</option>
                    <option value="Pendapatan">Pendapatan (Revenue)</option>
                    <option value="Beban">Beban (Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Akun (Enable/Disable)</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'Aktif' | 'Non-Aktif')}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-lime-500"
                  >
                    <option value="Aktif">✅ Aktif (Enable)</option>
                    <option value="Non-Aktif">🔴 Non-Aktif (Disable)</option>
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
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Saldo Pembukaan / Awal (Rp)</label>
                <input
                  type="text"
                  placeholder="0"
                  value={newSaldoAwal}
                  onChange={e => setNewSaldoAwal(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-lime-700 hover:bg-lime-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import Spreadsheet / CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-lime-100 text-lime-800">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Import COA dari Google Spreadsheet / Excel</h3>
                  <p className="text-xs text-slate-500">Copy-paste baris tabel dari Google Sheets / Excel langsung ke kolom di bawah ini</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <p className="font-bold text-slate-800">💡 Panduan Format Baris (Tab, Titik Koma, atau Koma):</p>
              <p className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                KodeAkun [TAB] NamaAkun [TAB] Jenis [TAB] Kelompok [TAB] SaldoNormal [TAB] SaldoAwal<br/>
                <span className="text-lime-700 font-bold">Contoh: 1-1100   Kas Tunai Masjid   Aktiva   Aktiva Lancar   Debit   1000000</span>
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Paste Data Baris Spreadsheet Di Sini:</label>
              <textarea
                rows={8}
                value={rawSpreadsheetText}
                onChange={e => setRawSpreadsheetText(e.target.value)}
                placeholder="Paste baris dari Google Sheets di sini..."
                className="w-full p-3.5 border border-slate-300 rounded-2xl text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:border-lime-500"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-lime-700" /> Upload File CSV / TXT
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          setRawSpreadsheetText(evt.target?.result as string || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={e => setReplaceExisting(e.target.checked)}
                    className="w-4 h-4 text-lime-600 rounded focus:ring-lime-500"
                  />
                  <span>Hapus/Timpa Seluruh COA Lama</span>
                </label>
              </div>
            </div>

            {importStatusMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-bold ${importStatusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                {importStatusMsg}
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImportSpreadsheet}
                className="flex-1 py-3 bg-lime-700 hover:bg-lime-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" /> Impor & Proses Data COA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
