import React, { useState, useEffect } from 'react';
import { LogOut, MonitorPlay, RefreshCw, Book, Calendar, Video, ShieldCheck, Settings, Users, Database, PlusCircle, Save, ArrowDownCircle, ArrowUpCircle, X, FileText, Camera, Megaphone, Clock, Smartphone, UserCheck, Key, Search, Link2, Trash2, Moon, BookOpen, Scale, ClipboardList } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ModulCoA } from './ModulCoA';
import { ModulJurnal } from './ModulJurnal';
import { ModulBukuBesar } from './ModulBukuBesar';
import { ModulLaporanKeuangan } from './ModulLaporanKeuangan';
import { ModulAnggaranApproval } from './ModulAnggaranApproval';
import { INITIAL_JURNAL_ENTRIES, JurnalEntry } from '../data/akuntansiData';

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
  homeVisibility: {
    showJadwal: boolean;
    showKalender: boolean;
    showZiswaf: boolean;
    showQuran: boolean;
    showTentang: boolean;
  };
  setHomeVisibility: React.Dispatch<React.SetStateAction<any>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, programs, onAddDonation, homeVisibility, setHomeVisibility }) => {
  const [activeMenu, setActiveMenu] = useState('kas');
  const [kasTab, setKasTab] = useState('ringkasan');
  const [filterPemasukan, setFilterPemasukan] = useState('semua');
  const [filterPengeluaran, setFilterPengeluaran] = useState('semua');
  const [settingTab, setSettingTab] = useState('hero');
  const [showDisplayTV, setShowDisplayTV] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // ZISWAF State
  const [selectedProgram, setSelectedProgram] = useState<number>(programs[0].id);
  const [nominalStr, setNominalStr] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Kas State (Mock)
  const [kasEntries] = useState([
    { id: 1, date: '29/07/2026', desc: 'Infaq Kotak Amal Jumat', type: 'in', amount: 2500000 },
    { id: 2, date: '28/07/2026', desc: 'Pembayaran Listrik Masjid', type: 'out', amount: 1200000 },
    { id: 3, date: '27/07/2026', desc: 'Donasi Hamba Allah (Transfer)', type: 'in', amount: 500000 },
    { id: 4, date: '25/07/2026', desc: 'Kebersihan & Operasional', type: 'out', amount: 300000 },
  ]);

  const totalIn = kasEntries.filter(e => e.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = kasEntries.filter(e => e.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
  const saldoAkhir = totalIn - totalOut;

  const [journals, setJournals] = useState<JurnalEntry[]>(INITIAL_JURNAL_ENTRIES);

  const handleAutoPostJournal = (entry: JurnalEntry) => {
    setJournals(prev => [entry, ...prev]);
  };

  const handleZiswafSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(nominalStr.replace(/\D/g, ''), 10);
    if (nominal && nominal > 0) {
      onAddDonation(selectedProgram, nominal);
      
      const progObj = programs.find(p => p.id === selectedProgram);
      const progTitle = progObj ? progObj.judul : 'Program ZISWAF';

      // Auto create double-entry journal entry for accounting integration
      const newJournal: JurnalEntry = {
        id: `JU-ZIS-${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        noBukti: `BKM-DON-${Date.now().toString().slice(-5)}`,
        keterangan: `Penerimaan Donasi ZISWAF: ${progTitle}`,
        sumber: 'Donasi Umum',
        baris: [
          { kodeAkun: '1-1300', namaAkun: 'Bank BSI - Rekening Donasi/Wakaf (Debit)', debit: nominal, kredit: 0 },
          { kodeAkun: '4-1300', namaAkun: 'Pendapatan Donasi Portal Jamaah (Kredit - Jurnal Lawan)', debit: 0, kredit: nominal },
        ],
        status: 'Posted',
        dibuatOleh: 'Admin Masjid (Form ZISWAF)',
        tanggalBuat: new Date().toISOString().split('T')[0],
      };

      setJournals(prev => [newJournal, ...prev]);
      setNominalStr('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleExportPDF = (type: 'in' | 'out', data: any[]) => {
    try {
      const doc = new jsPDF();
      doc.text(`Laporan Histori ${type === 'in' ? 'Pemasukan' : 'Pengeluaran'} Kas Masjid`, 14, 15);
      
      const tableColumn = ["Tanggal", "Keterangan", "Nominal"];
      const tableRows = data.map(entry => [
        entry.date,
        entry.desc,
        formatRp(entry.amount)
      ]);

      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
      
      doc.save(`Laporan_${type === 'in' ? 'Pemasukan' : 'Pengeluaran'}_Masjid.pdf`);
    } catch (e) {
      alert("Pastikan paket jspdf dan jspdf-autotable telah terinstal dengan baik.");
    }
  };

  const handleExportExcel = (type: 'in' | 'out', data: any[]) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data.map(entry => ({
        Tanggal: entry.date,
        Keterangan: entry.desc,
        Nominal: entry.amount
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Histori_Kas");
      XLSX.writeFile(workbook, `Laporan_${type === 'in' ? 'Pemasukan' : 'Pengeluaran'}_Masjid.xlsx`);
    } catch (e) {
      alert("Pastikan paket xlsx telah terinstal dengan baik.");
    }
  };


  if (showDisplayTV) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col text-slate-800 font-sans overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center relative p-8">
          <img src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=2000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none"></div>

          <button onClick={() => setShowDisplayTV(false)} className="absolute top-4 right-4 p-4 bg-white hover:bg-red-600 rounded-xl transition-colors opacity-30 hover:opacity-100 group z-50 shadow-xl border border-slate-300 hover:border-red-500 cursor-pointer">
            <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="z-10 text-center w-full max-w-6xl">
            <h1 className="text-4xl md:text-6xl font-bold text-lime-600 mb-6 tracking-wider uppercase drop-shadow-lg">Masjid Citra Sentul Raya</h1>
            
            <div className="flex justify-center gap-4 md:gap-8 text-sm md:text-xl font-bold text-slate-700 bg-black/60 py-3 px-8 rounded-full border border-lime-500/30 backdrop-blur-md mb-10 inline-flex shadow-[0_0_20px_rgba(132,204,22,0.1)]">
              <span className="flex items-center gap-2"><span className="text-lime-600 font-normal text-xs uppercase tracking-widest">Imam:</span> Syaikh Abdul Rahman</span>
              <span className="w-px h-6 bg-slate-600 hidden md:block"></span>
              <span className="flex items-center gap-2 hidden md:flex"><span className="text-lime-600 font-normal text-xs uppercase tracking-widest">Khatib:</span> Ust. Dr. Fulan, MA</span>
              <span className="w-px h-6 bg-slate-600 hidden md:block"></span>
              <span className="flex items-center gap-2 hidden md:flex"><span className="text-lime-600 font-normal text-xs uppercase tracking-widest">Muadzin:</span> Akhina Zidan</span>
            </div>
            
            <div className="text-[120px] md:text-[180px] font-bold text-white leading-none font-mono tracking-tighter drop-shadow-[0_0_30px_rgba(132,204,22,0.3)] mb-12">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            <div className="grid grid-cols-5 gap-4 md:gap-8 max-w-5xl mx-auto mt-8">
              {[
                { n: 'SUBUH', t: '04:45' },
                { n: 'DZUHUR', t: '12:02' },
                { n: 'ASHAR', t: '15:23' },
                { n: 'MAGHRIB', t: '17:58', active: true },
                { n: 'ISYA', t: '19:12' }
              ].map(j => (
                <div key={j.n} className={`p-4 md:p-6 rounded-2xl border-2 backdrop-blur-md ${j.active ? 'bg-lime-500/20 border-lime-400' : 'bg-black/40 border-slate-300'}`}>
                  <p className={`text-lg md:text-2xl font-bold mb-2 ${j.active ? 'text-lime-300' : 'text-slate-500'}`}>{j.n}</p>
                  <p className={`text-3xl md:text-5xl font-bold ${j.active ? 'text-slate-800' : 'text-slate-700'}`}>{j.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="h-20 bg-lime-600 flex items-center overflow-hidden border-t-4 border-lime-400 shrink-0">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] text-2xl font-bold text-black px-4">
            *** SELAMAT DATANG DI MASJID CITra SENTUL RAYA *** LURUSKAN DAN RAPATKAN SHAF SHALAT ANDA *** MOHON NONAKTIFKAN ALAT KOMUNIKASI SELAMA IBADAH BERLANGSUNG *** SALURKAN INFAQ TERBAIK ANDA MELALUI QRIS MASJID ***
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700" >
      
      {/* Navbar Minimalis */}
      <div className="bg-white border-b border-slate-200 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">DKM</div>
          <span className="font-bold text-slate-800 hidden sm:block">Portal Pengurus Citra Sentul</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-700 text-slate-600 rounded-full text-xs font-bold transition-colors border border-slate-300">
            <Moon className="w-3.5 h-3.5 text-amber-600 no-invert" /> {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          </button>
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-slate-800 rounded-full text-xs font-bold transition-colors border border-red-500/20">
            <LogOut className="w-3.5 h-3.5" /> LOGOUT
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Banner Premium Hijau Cerah */}
        <div className="bg-gradient-to-r from-lime-500 to-lime-600 border border-lime-600 rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-sm">Portal Admin & Pengurus DKM</h1>
                <span className="px-2 py-0.5 rounded-full bg-white text-lime-700 border border-white/50 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">Role: Administrator</span>
              </div>
              <p className="text-sm text-lime-50 mt-1 font-medium">Manajemen Keuangan Sederhana, Update Program ZISWAF, & Pengaturan Visibilitas.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowDisplayTV(true)} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-amber-500 hover:text-amber-600 border border-amber-200/50 rounded-lg text-xs font-extrabold transition-all shadow-md">
              <MonitorPlay className="w-4 h-4" /> Display TV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-500 hover:text-blue-600 border border-blue-200/50 rounded-lg text-xs font-extrabold transition-all shadow-md">
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>
        </div>

        {/* Scrollable Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6 shadow-lg">
          <div className="flex overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveMenu('kas')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'kas' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Book className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Buku Kas Sederhana</span></button>
            <button onClick={() => setActiveMenu('ziswaf')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'ziswaf' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><PlusCircle className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Input Donasi ZISWAF</span></button>
            <button onClick={() => setActiveMenu('campaign')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'campaign' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Database className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Program & Campaign</span></button>
            <button onClick={() => setActiveMenu('berita')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'berita' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Megaphone className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Pengumuman & Berita</span></button>
            <button onClick={() => setActiveMenu('jumat')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'jumat' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Clock className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Jadwal Petugas & Jumat</span></button>
            <button onClick={() => setActiveMenu('wa')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'wa' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Smartphone className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Broadcast WhatsApp</span></button>
            <button onClick={() => setActiveMenu('verifikasi')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'verifikasi' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><ShieldCheck className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Verifikasi ZISWAF</span></button>
            <button onClick={() => setActiveMenu('galeri')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'galeri' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Video className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Galeri & Artikel Kajian</span></button>
            <button onClick={() => setActiveMenu('kalender')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'kalender' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Calendar className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Kalender & Agenda</span></button>
            <button onClick={() => setActiveMenu('aset')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'aset' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Camera className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Inventaris & Foto Aset</span></button>
            <button onClick={() => setActiveMenu('profil')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'profil' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Users className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Profil & Pengurus</span></button>
            <button onClick={() => setActiveMenu('admin_profil')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'admin_profil' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Settings className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Pengaturan Admin</span></button>
            <button onClick={() => setActiveMenu('pengaturan')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'pengaturan' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Settings className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Pengaturan Aplikasi</span></button>
            <button onClick={() => setActiveMenu('ttd')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'ttd' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><FileText className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Tanda Tangan Laporan</span></button>
            <button onClick={() => setActiveMenu('role')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'role' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Key className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Manajemen Akun & Role</span></button>
            <button onClick={() => setActiveMenu('audit')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'audit' ? 'border-lime-500 text-slate-800 bg-white shadow-sm border border-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}><Search className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Audit Log System</span></button>
            <div className="w-px bg-slate-200 mx-1 self-stretch" />
            <button onClick={() => setActiveMenu('coa')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'coa' ? 'border-indigo-500 text-indigo-700 bg-white shadow-sm' : 'border-transparent text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'}`}><BookOpen className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Akun CoA</span></button>
            <button onClick={() => setActiveMenu('jurnal')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'jurnal' ? 'border-indigo-500 text-indigo-700 bg-white shadow-sm' : 'border-transparent text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'}`}><FileText className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Jurnal Umum</span></button>
            <button onClick={() => setActiveMenu('bukubesar')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'bukubesar' ? 'border-indigo-500 text-indigo-700 bg-white shadow-sm' : 'border-transparent text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'}`}><Book className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Buku Besar</span></button>
            <button onClick={() => setActiveMenu('lapkeu')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'lapkeu' ? 'border-indigo-500 text-indigo-700 bg-white shadow-sm' : 'border-transparent text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'}`}><Scale className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Neraca & Laba Rugi</span></button>
            <button onClick={() => setActiveMenu('anggaran')} className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-4 transition-colors ${activeMenu === 'anggaran' ? 'border-violet-500 text-violet-700 bg-white shadow-sm' : 'border-transparent text-violet-500 hover:text-violet-700 hover:bg-violet-50'}`}><ClipboardList className="w-4 h-4 shrink-0" /><span className="text-sm font-semibold">Anggaran & Approval</span></button>
          </div>
        </div>

        {/* CONTEN AREA */}
        
        {/* MODUL: BUKU KAS SEDERHANA */}
        {activeMenu === 'kas' && (
          <div className="animate-in fade-in">
            {/* Sub-menu Kas */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setKasTab('ringkasan')} className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${kasTab === 'ringkasan' ? 'text-lime-600 border-b-2 border-lime-400' : 'text-slate-500 hover:text-slate-700'}`}>Ringkasan Kas</button>
              <button onClick={() => setKasTab('pemasukan')} className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${kasTab === 'pemasukan' ? 'text-lime-600 border-b-2 border-lime-400' : 'text-slate-500 hover:text-slate-700'}`}>Input Pemasukan</button>
              <button onClick={() => setKasTab('pengeluaran')} className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${kasTab === 'pengeluaran' ? 'text-lime-600 border-b-2 border-lime-400' : 'text-slate-500 hover:text-slate-700'}`}>Input Pengeluaran</button>
              <button onClick={() => setKasTab('laporan')} className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${kasTab === 'laporan' ? 'text-lime-600 border-b-2 border-lime-400' : 'text-slate-500 hover:text-slate-700'}`}>Laporan Keuangan</button>
            </div>

            {kasTab === 'ringkasan' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in">
                {/* Summary Cards */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Saldo Kas Tersedia</p>
                    <p className="text-2xl font-bold text-slate-800">{formatRp(saldoAkhir)}</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><ArrowDownCircle className="w-4 h-4 text-emerald-600" /> Total Pemasukan</p>
                    <p className="text-xl font-bold text-emerald-600">{formatRp(totalIn)}</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><ArrowUpCircle className="w-4 h-4 text-red-600" /> Total Pengeluaran</p>
                    <p className="text-xl font-bold text-red-600">{formatRp(totalOut)}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Catatan Transaksi Terakhir</h3>
                    <button onClick={() => setKasTab('pemasukan')} className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                      + Tambah Transaksi
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-white text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3">Tanggal</th>
                          <th className="px-5 py-3">Keterangan</th>
                          <th className="px-5 py-3 text-right">Masuk (Debit)</th>
                          <th className="px-5 py-3 text-right">Keluar (Kredit)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {kasEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3 text-slate-500">{entry.date}</td>
                            <td className="px-5 py-3 text-slate-700">{entry.desc}</td>
                            <td className="px-5 py-3 text-right font-mono text-emerald-600">
                              {entry.type === 'in' ? formatRp(entry.amount) : '-'}
                            </td>
                            <td className="px-5 py-3 text-right font-mono text-red-600">
                              {entry.type === 'out' ? formatRp(entry.amount) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {kasTab === 'pemasukan' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in">
                <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-xl shadow-xl">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ArrowDownCircle className="w-6 h-6 text-emerald-600" /> Form Input Pemasukan Kas</h3>
                  <form className="space-y-5" onSubmit={e => { e.preventDefault(); alert('Data pemasukan berhasil disimpan!'); setKasTab('ringkasan'); }}>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Tanggal Transaksi</label>
                      <input type="date" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-lime-600" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Keterangan / Sumber Dana</label>
                      <input type="text" placeholder="Contoh: Infaq Kotak Amal Jumat" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-lime-600" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Nominal Pemasukan (Rp)</label>
                      <input type="number" placeholder="Contoh: 1500000" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-lg focus:outline-none focus:border-lime-600" required />
                    </div>
                    <button type="submit" className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-lime-900/20 flex justify-center items-center gap-2">
                      <Save className="w-5 h-5" /> Simpan Pemasukan
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-800 whitespace-nowrap">Histori Pemasukan</h3>
                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                      <select value={filterPemasukan} onChange={(e) => setFilterPemasukan(e.target.value)} className="bg-white border border-slate-300 text-slate-600 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-lime-600 flex-1 min-w-[100px]">
                        <option value="semua">Semua Waktu</option>
                        <option value="07/2026">Juli 2026</option>
                        <option value="06/2026">Juni 2026</option>
                      </select>
                      <button onClick={() => handleExportPDF('in', kasEntries.filter(e => e.type === 'in' && (filterPemasukan === 'semua' || e.date.endsWith(filterPemasukan))))} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 shadow-sm">PDF</button>
                      <button onClick={() => handleExportExcel('in', kasEntries.filter(e => e.type === 'in' && (filterPemasukan === 'semua' || e.date.endsWith(filterPemasukan))))} className="bg-lime-600 hover:bg-lime-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">Excel</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3">Tanggal</th>
                          <th className="px-5 py-3">Keterangan</th>
                          <th className="px-5 py-3 text-right">Nominal (Debit)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {kasEntries.filter(e => e.type === 'in' && (filterPemasukan === 'semua' || e.date.endsWith(filterPemasukan))).map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3 text-slate-500">{entry.date}</td>
                            <td className="px-5 py-3 text-slate-700">{entry.desc}</td>
                            <td className="px-5 py-3 text-right font-mono font-bold text-emerald-600">
                              {formatRp(entry.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {kasTab === 'pengeluaran' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in">
                <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-xl shadow-xl">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ArrowUpCircle className="w-6 h-6 text-red-600" /> Form Input Pengeluaran Kas</h3>
                  <form className="space-y-5" onSubmit={e => { e.preventDefault(); alert('Data pengeluaran berhasil disimpan!'); setKasTab('ringkasan'); }}>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Tanggal Transaksi</label>
                      <input type="date" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-lime-600" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Keterangan / Tujuan Pengeluaran</label>
                      <input type="text" placeholder="Contoh: Pembayaran Listrik & PDAM" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-lime-600" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Nominal Pengeluaran (Rp)</label>
                      <input type="number" placeholder="Contoh: 500000" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-lg focus:outline-none focus:border-lime-600" required />
                    </div>
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-red-900/20 flex justify-center items-center gap-2">
                      <Save className="w-5 h-5" /> Simpan Pengeluaran
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-800 whitespace-nowrap">Histori Pengeluaran</h3>
                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                      <select value={filterPengeluaran} onChange={(e) => setFilterPengeluaran(e.target.value)} className="bg-white border border-slate-300 text-slate-600 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-lime-600 flex-1 min-w-[100px]">
                        <option value="semua">Semua Waktu</option>
                        <option value="07/2026">Juli 2026</option>
                        <option value="06/2026">Juni 2026</option>
                      </select>
                      <button onClick={() => handleExportPDF('out', kasEntries.filter(e => e.type === 'out' && (filterPengeluaran === 'semua' || e.date.endsWith(filterPengeluaran))))} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 shadow-sm">PDF</button>
                      <button onClick={() => handleExportExcel('out', kasEntries.filter(e => e.type === 'out' && (filterPengeluaran === 'semua' || e.date.endsWith(filterPengeluaran))))} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">Excel</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3">Tanggal</th>
                          <th className="px-5 py-3">Keterangan</th>
                          <th className="px-5 py-3 text-right">Nominal (Kredit)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {kasEntries.filter(e => e.type === 'out' && (filterPengeluaran === 'semua' || e.date.endsWith(filterPengeluaran))).map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3 text-slate-500">{entry.date}</td>
                            <td className="px-5 py-3 text-slate-700">{entry.desc}</td>
                            <td className="px-5 py-3 text-right font-mono font-bold text-red-600">
                              {formatRp(entry.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {kasTab === 'laporan' && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl animate-in fade-in">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="w-6 h-6 text-lime-500" /> Cetak Laporan Keuangan</h3>
                    <p className="text-slate-500 text-sm mt-1">Pratinjau seluruh transaksi buku kas sebelum diunduh.</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button onClick={() => alert('Mengunduh format PDF...')} className="bg-slate-100 hover:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors border border-slate-300 text-sm">Download PDF</button>
                    <button onClick={() => alert('Mengunduh format Excel...')} className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-lime-900/20 text-sm">Download Excel</button>
                  </div>
                </div>
                
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-4">Tanggal</th>
                        <th className="px-5 py-4">Keterangan / Uraian</th>
                        <th className="px-5 py-4 text-right">Penerimaan (Debit)</th>
                        <th className="px-5 py-4 text-right">Pengeluaran (Kredit)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {kasEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-slate-500">{entry.date}</td>
                          <td className="px-5 py-4 text-slate-700">{entry.desc}</td>
                          <td className="px-5 py-4 text-right font-mono font-bold text-emerald-600">
                            {entry.type === 'in' ? formatRp(entry.amount) : '-'}
                          </td>
                          <td className="px-5 py-4 text-right font-mono font-bold text-red-600">
                            {entry.type === 'out' ? formatRp(entry.amount) : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/50 font-bold border-t-2 border-slate-300">
                        <td colSpan={2} className="px-5 py-5 text-right text-slate-600">TOTAL SALDO KAS SAAT INI:</td>
                        <td colSpan={2} className="px-5 py-5 text-right text-lime-600 font-mono text-xl">{formatRp(saldoAkhir)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODUL: ZISWAF */}
        {activeMenu === 'ziswaf' && (
          <div className="animate-in fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                  <PlusCircle className="w-6 h-6 text-lime-600" />
                  <h2 className="text-lg font-bold text-slate-800">Input Donasi Manual</h2>
                </div>

                {showSuccess && (
                  <div className="mb-6 p-3 bg-emerald-900/30 border border-emerald-500/50 text-emerald-600 text-sm font-semibold rounded-lg text-center">
                    Data donasi ZISWAF berhasil disimpan!
                  </div>
                )}

                <form onSubmit={handleZiswafSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Pilih Program</label>
                    <select 
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-lime-600"
                    >
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.judul}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Nominal Donasi (Rp)</label>
                    <input 
                      type="text"
                      placeholder="Contoh: 500000"
                      value={nominalStr}
                      onChange={(e) => setNominalStr(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-lime-600 font-mono text-lg"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-lime-900/20">
                    <Save className="w-5 h-5" /> Simpan ke Database
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                  <Database className="w-6 h-6 text-lime-600" />
                  <h2 className="text-lg font-bold text-slate-800">Status Pencapaian Program</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map(p => (
                    <div key={p.id} className="p-5 rounded-xl border border-slate-300 bg-slate-50">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 block">{p.kategori}</span>
                      <h3 className="font-bold text-slate-800 mb-4 line-clamp-1">{p.judul}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Terkumpul:</span><span className="font-bold text-emerald-600">{formatRp(p.terkumpulRp)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Target:</span><span className="font-bold text-slate-600">{formatRp(p.targetRp)}</span></div>
                        <div className="flex justify-between pt-3 border-t border-slate-200 mt-3"><span className="text-slate-500">Total Donatur:</span><span className="font-bold text-lime-600">{p.donatur} Orang</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODUL: GALERI & KAJIAN */}
        {activeMenu === 'galeri' && (
          <div className="animate-in fade-in bg-white p-8 rounded-xl border border-slate-200 text-center">
            <Video className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Manajemen Galeri & YouTube</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Upload dokumentasi kegiatan dan link kajian video.</p>
            <button onClick={() => alert('Membuka jendela upload media & link YouTube...')} className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors inline-flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Tambah Media
            </button>
          </div>
        )}

        {/* MODUL: KALENDER & AGENDA */}
        {activeMenu === 'kalender' && (
          <div className="animate-in fade-in bg-white p-6 md:p-8 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-6 h-6 text-lime-500" /> Form Tambah Agenda Masjid</h2>
            </div>
            
            <form className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Agenda Kegiatan berhasil ditambahkan ke sistem!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nama Kegiatan / Agenda <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Contoh: Kajian Subuh Tematik" className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Kategori</label>
                  <select className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600">
                    <option>Kajian / Ceramah</option>
                    <option>Pendidikan / Tahsin</option>
                    <option>Sosial / Masyarakat</option>
                    <option>Rapat Kepengurusan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Tanggal <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600" required defaultValue="2026-07-29" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Waktu <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="12:00 - 13:00" className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600" required defaultValue="12:00 - 13:00" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Lokasi</label>
                  <input type="text" placeholder="Ruang Utama Masjid Tazkia" className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600" defaultValue="Ruang Utama Masjid Citra Sentul" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Pengisi Acara / Pemateri</label>
                  <input type="text" placeholder="Contoh: Ust. Adi Hidayat (Kosongkan jika tidak ada)" className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Deskripsi Singkat</label>
                <textarea placeholder="Jelaskan detail agenda secara singkat..." rows={3} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">URL Poster/Gambar (Opsional)</label>
                <input type="url" placeholder="https://..." className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-lime-600" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-slate-100 transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white font-bold transition-colors shadow-lg shadow-lime-900/20">Simpan Agenda</button>
              </div>
            </form>
          </div>
        )}

        {/* MODUL: PROFIL PENGURUS */}
        {activeMenu === 'profil' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white p-8 rounded-xl border border-slate-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><Users className="w-6 h-6 text-lime-500" /> Manajemen Profil & Pengurus</h2>
                <p className="text-slate-500 text-sm">Atur daftar dewan pembina, pengurus DKM, dan staf. Data ini akan ditampilkan di halaman "Tentang Kami".</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shrink-0">+ Tambah Pengurus</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Prof. Dr. M. Syafii Antonio', role: 'Dewan Pembina Yayasan', tag: 'PEMBINA', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
                { name: 'Ustadz H. M. Zainuddin, SQ', role: 'Ketua / Direktur DKM', tag: 'PENGURUS', img: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=150&q=80' },
                { name: 'H. Ahmad', role: 'Bendahara Umum', tag: 'PENGURUS', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
              ].map((p, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-4">
                    <img src={p.img} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-slate-300" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{p.role}</p>
                      <span className="bg-lime-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{p.tag}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start">
                    <button className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800"><Settings className="w-4 h-4" /></button>
                    <button className="p-1.5 bg-red-900/20 rounded-lg text-red-600 hover:bg-red-900/40"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODUL: PENGATURAN ADMIN & FOTO PROFIL */}
        {activeMenu === 'admin_profil' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Pengaturan Modul & Kontrol Visibilitas Admin DKM</h2>
              <p className="text-slate-500 text-sm mb-8">Aktifkan atau sembunyikan modul aplikasi, atur parameter nisab zakat, running text TV signage, serta rekening bank.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* 1. Ubah Kata Sandi */}
                <div className="bg-blue-950/30 border border-slate-200/50 p-6 rounded-2xl">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-600" /> Ubah Kata Sandi Akses Portal Admin</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Sandi Lama</label>
                      <input type="password" placeholder="Masukkan kata sandi lama" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                      <input type="password" placeholder="Masukkan kata sandi baru" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru</label>
                      <input type="password" placeholder="Ketik ulang kata sandi baru" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-sm mb-4" />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">Perbarui Kata Sandi</button>
                  </div>
                </div>

                {/* Visibilitas (Mockup) */}
                <div className="bg-blue-950/30 border border-slate-200/50 p-6 rounded-2xl">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><MonitorPlay className="w-5 h-5 text-blue-600" /> 1. Visibilitas Modul Antarmuka Jamaah</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Modul AI Syariah Assistant', desc: 'Menampilkan tombol asisten konsultasi fiqih AI di navigasi.' },
                      { title: 'Modul Mode Display TV Signage Masjid', desc: 'Menampilkan opsi layar penuh jadwal jam shalat TV masjid.' },
                      { title: 'Modul Digital Ibadah (Al-Qur\'an, Shalat)', desc: 'Menyediakan fitur membaca surah mp3 & jadwal shalat.' },
                      { title: 'Stream Live Mutasi Kas Transparansi', desc: 'Menampilkan tabel live pencatatan keuangan ke publik.' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl">
                        <div><h4 className="text-slate-800 font-bold text-sm">{item.title}</h4><p className="text-xs text-slate-500">{item.desc}</p></div>
                        <button className="bg-blue-600/20 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-lg border border-blue-500/30">TAMPIL</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Parameter */}
              <div className="bg-blue-950/30 border border-slate-200/50 p-6 rounded-2xl mb-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Database className="w-5 h-5 text-yellow-500" /> 2. Parameter Bank, QRIS, & Display TV</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-500 mb-2">Pesan Running Text Display TV Signage Masjid:</label>
                  <textarea rows={2} className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-yellow-500 focus:outline-none focus:border-blue-500 text-sm" defaultValue="Selamat Datang di Masjid Citra Sentul Raya - Mohon menonaktifkan nada dering HP selama pelaksanaan Ibadah Shalat Jamaah & Dzikir Akbar."></textarea>
                </div>

                <div className="border border-slate-200/50 rounded-xl p-5 mb-6 bg-white/50">
                  <h4 className="font-bold text-slate-800 mb-4">Teks Promosi Halaman Utama (ZISWAF & Dakwah)</h4>
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Judul Promosi Utama:</label><input type="text" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-sm" defaultValue="Pusat Peradaban Islam & Kesejahteraan Umat" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Sub-Judul Promosi:</label><input type="text" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-yellow-500 font-bold focus:outline-none focus:border-blue-500 text-sm" defaultValue="Melalui Optimalisasi ZISWAF, Dakwah & Zikir" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi & Ajakan Promosi:</label><textarea rows={3} className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-slate-600 focus:outline-none focus:border-blue-500 text-sm" defaultValue="Salurkan Zakat, Infaq, Shadaqah, dan Wakaf Anda secara transparan di Masjid Citra Sentul Raya untuk dakwah, pendidikan pesantren, dan pemberdayaan ekonomi umat."></textarea></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-slate-500 mb-2">Harga Acuan Emas/Gram (Nisab Zakat):</label><input type="text" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-blue-600 focus:outline-none focus:border-blue-500 text-sm font-mono" defaultValue="1350000" /></div>
                  <div><label className="block text-sm font-bold text-slate-500 mb-2">Countdown Timer Iqamah (Menit):</label><input type="text" className="w-full p-3 bg-white border border-slate-300/50 rounded-xl text-yellow-500 focus:outline-none focus:border-blue-500 text-sm font-mono" defaultValue="10" /></div>
                </div>
              </div>

              {/* 3. Media */}
              <div className="bg-blue-950/30 border border-slate-200/50 p-6 rounded-2xl mb-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Camera className="w-5 h-5 text-blue-600" /> 3. Foto Profil, Banner Utama, & Barcode QRIS Masjid (Database Media)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Logo Resmi Masjid', desc: 'Logo ini akan tampil di bagian atas navigasi dan bagian paling bawah (footer) website.', url: 'https://firebasestorage.googleapis.com/v0/b/tazkia...' },
                    { title: 'Foto Banner Hero Masjid', desc: 'Foto ini akan menjadi latar belakang besar (background) saat pertama kali halaman beranda (Home) dibuka.', url: 'https://images.unsplash.com/photo-1589803138861-5...' },
                    { title: 'Gambar Barcode QRIS Masjid', desc: 'Gambar ini akan muncul saat jamaah menekan tombol bayar donasi/ziswaf di halaman beranda.', url: 'https://images.unsplash.com/qris-dummy...' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                        <button className="text-xs bg-blue-600/20 text-blue-600 border border-blue-500/30 px-3 py-1 rounded-lg">Upload</button>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{item.desc}</p>
                      <div className="w-full h-32 bg-white rounded-xl mb-4 border border-slate-200/50 flex items-center justify-center text-slate-600">
                        <Camera className="w-8 h-8 opacity-50" />
                      </div>
                      <label className="block text-[10px] text-blue-600 mb-1">URL Media:</label>
                      <input type="text" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-mono" defaultValue={item.url} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Khutbah & Info */}
              <div className="bg-blue-950/30 border border-slate-200/50 p-6 rounded-2xl">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-yellow-500" /> 4. Pengaturan Informasi Khutbah Jumat & Fitur Aplikasi</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">Parameter Petugas & Khutbah Jumat</h4>
                    <div><label className="block text-xs text-slate-500 mb-1">Topik / Tema Khutbah Jumat:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-yellow-500 font-bold text-sm" defaultValue="Keagungan Zikir & Transparansi Pengelolaan Aset Umat" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-slate-500 mb-1">Nama Khatib Jumat:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-slate-800 text-sm" defaultValue="Ust. Dr. Fulan, MA" /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">Nama Imam Jumat:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-slate-800 text-sm" defaultValue="Syaikh Abdul Rahman" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-slate-500 mb-1">Nama Muadzin Jumat:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-slate-800 text-sm" defaultValue="Akhina Zidan" /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">Waktu Pelaksanaan:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-yellow-500 text-sm" defaultValue="Jumat Ini, 11:55 WIB - Selesai" /></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest border-b border-slate-200/50 pb-2">Info Fitur Aplikasi & Kontak DKM</h4>
                    <div><label className="block text-xs text-slate-500 mb-1">Deskripsi Ringkas Fitur Aplikasi:</label><textarea rows={2} className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-slate-600 text-sm" defaultValue="Ekosistem Digital Masjid Citra Sentul Raya melayani ZISWAF, Al-Qur'an MP3, Jadwal Shalat & Adzan, Penunjuk Arah Kiblat, Sejarah Masjid, serta TV Signage Display."></textarea></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Alamat Lengkap Masjid:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-slate-800 text-sm" defaultValue="Citra Sentul Raya, Bogor Indonesia" /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">No. Kontak WhatsApp Sekretariat DKM:</label><input type="text" className="w-full p-2.5 bg-white border border-slate-300/50 rounded-lg text-blue-600 font-mono text-sm" defaultValue="0812-3456-7890 (Sekretariat DKM)" /></div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 text-right">
                <button onClick={() => alert('Pengaturan Modul & Aplikasi berhasil disimpan!')} className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg">Simpan Semua Pengaturan</button>
              </div>
            </div>
          </div>
        )}

        {/* MODUL: PENGATURAN APLIKASI */}
        {activeMenu === 'pengaturan' && (
          <div className="animate-in fade-in space-y-6">
            
            {/* Secondary Navigation */}
            <div className="bg-lime-100/50 rounded-xl border border-lime-200 overflow-hidden flex flex-wrap gap-1 p-1">
              {[
                { id: 'hero', label: 'Foto Animasi Beranda' },
                { id: 'visibilitas', label: 'Visibilitas Modul' },
                { id: 'qr', label: 'Cetak QR Aplikasi' },
                { id: 'sponsor', label: 'Sponsor & Mitra' },
                { id: 'sejarah', label: 'Profil & Sejarah Masjid' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSettingTab(tab.id)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    settingTab === tab.id 
                      ? 'bg-amber-500 text-slate-900 border-2 border-amber-400' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-menu Content */}
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              
              {settingTab === 'hero' && (
                <div className="animate-in fade-in">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Manajemen Foto Animasi Beranda (Hero Slider)</h2>
                  <p className="text-slate-500 text-sm mb-8">Unggah beberapa foto lebar (resolusi tinggi) untuk ditampilkan berputar secara otomatis di bagian paling atas halaman Beranda Aplikasi.</p>
                  
                  <div className="border-2 border-dashed border-blue-600/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-blue-950/20">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-6">Unggah Foto Baru</h3>
                    <button onClick={() => alert('Membuka file explorer untuk upload foto...')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                      Pilih Media (Foto/Video)
                    </button>
                  </div>
                </div>
              )}

              {settingTab === 'visibilitas' && (
                <div className="animate-in fade-in">
                  <div className="mb-8 border-b border-slate-200 pb-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Settings className="w-6 h-6 text-lime-500" /> Integrasi & Visibilitas</h2>
                    <p className="text-slate-500 text-sm mt-1">Nyalakan/matikan modul yang ingin ditampilkan di Beranda Utama Jamaah.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'showJadwal', label: 'Modul Jadwal Shalat' },
                      { key: 'showKalender', label: 'Modul Kalender Kegiatan' },
                      { key: 'showZiswaf', label: 'Modul Program ZISWAF' },
                      { key: 'showQuran', label: 'Banner Al-Quran Digital' },
                      { key: 'showTentang', label: 'Modul Profil & Sejarah Masjid' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                        <h3 className="font-bold text-slate-800">{item.label}</h3>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" checked={homeVisibility[item.key as keyof typeof homeVisibility]} onChange={() => setHomeVisibility(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof homeVisibility] }))} />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settingTab === 'qr' && (
                <div className="animate-in fade-in flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Cetak QR Code Aplikasi</h2>
                  <p className="text-slate-500 text-sm mb-8 max-w-lg">QR Code ini dapat Anda cetak dan tempel di area masjid (mading, tiang, dll) agar jamaah bisa langsung membuka aplikasi ini di HP mereka.</p>
                  
                  <div className="bg-white p-6 rounded-3xl inline-block shadow-2xl">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://masjid-citra-sentul.app" alt="QR Code" className="w-64 h-64 mb-4 rounded-xl border border-slate-100" />
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-1">Scan Untuk Buka</p>
                    <p className="text-blue-600 font-bold text-xl">Aplikasi Citra Sentul Raya</p>
                  </div>
                </div>
              )}

              {settingTab === 'sponsor' && (
                <div className="animate-in fade-in">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Sponsor & Mitra</h2>
                      <p className="text-slate-500 text-sm">Kelola logo sponsor atau unit usaha yang akan ditampilkan di aplikasi.</p>
                    </div>
                    <button onClick={() => alert('Membuka formulir pendaftaran mitra baru...')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shrink-0">
                      + Tambah Mitra
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between mb-6 shadow-md w-full max-w-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden shadow-sm">
                        <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=150&q=80" alt="Sponsor" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">CSR Mart</h3>
                        <p className="text-xs text-blue-600 flex items-center gap-1 mt-1"><Link2 className="w-3 h-3" /> Aktif</p>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-300 p-2"><Trash2 className="w-5 h-5" /></button>
                  </div>

                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl text-amber-600 text-sm font-semibold flex gap-2 items-start">
                    <span className="shrink-0 text-amber-500">Info:</span>
                    <p>Menambah logo di sini secara otomatis akan memasukkan banner/ikon mitra ke area Footer dan Beranda (jika diaktifkan) sebagai tanda "Sponsored By".</p>
                  </div>
                </div>
              )}

              {settingTab === 'sejarah' && (
                <div className="animate-in fade-in space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Profil & Sejarah Masjid Citra Sentul Raya</h2>
                    <p className="text-slate-500 text-sm">Ubah data sejarah, Visi, Misi, dan link YouTube Profil Masjid. Perubahan akan langsung tampil di menu "Tentang Kami".</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Link YouTube Video Profil</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-sm" defaultValue="https://youtu.be/-oT4ZYK2ZjI?si=-pEBAAicepgcMVPj" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Visi Masjid</label>
                    <textarea rows={2} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-sm" defaultValue="Menjadi Oase Spiritual dan Intelektual Islam yang memberikan pencerahan, kesejukan dan pemberdayaan serta wawasan Rahmatan Lil Alamin."></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Misi Masjid (pisahkan dengan baris baru)</label>
                    <textarea rows={4} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-sm" defaultValue={"Menyelenggarakan pelatihan dan konseling keumatan.\nMengembangkan ekonomi kerakyatan berbasis syariah.\nMenyediakan fasilitas pendidikan berkualitas."}></textarea>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button onClick={() => alert('Profil berhasil diperbarui!')} className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg">Simpan Perubahan</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODUL BARU: TANDA TANGAN LAPORAN */}
        {activeMenu === 'ttd' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white p-8 rounded-xl border border-slate-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><FileText className="w-6 h-6 text-lime-500" /> Manajemen Tanda Tangan Laporan</h2>
                <p className="text-slate-500 text-sm">Atur nama, jabatan, dan wewenang pejabat yang akan tertera pada *footer* laporan akuntansi / cetak PDF.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shrink-0">+ Tambah Pejabat TTD</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { tag: 'PEMBUAT LAPORAN', name: 'Staf Keuangan', pos: 'Akuntan Masjid' },
                { tag: 'DIPERIKSA OLEH', name: 'H. Ahmad', pos: 'Bendahara DKM' },
                { tag: 'DISETUJUI OLEH', name: 'Ustadz H. M. Zainuddin, SQ', pos: 'Ketua / Direktur DKM' },
                { tag: 'MENGETAHUI', name: 'Prof. Dr. M. Syafii Antonio', pos: 'Dewan Pembina' },
              ].map((t, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-lg h-36">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-lime-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t.tag}</span>
                    <div className="flex gap-2">
                      <button className="text-slate-500 hover:text-slate-800"><Settings className="w-3.5 h-3.5" /></button>
                      <button className="text-red-600 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.pos}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODUL BARU: INVENTARIS ASET */}
        {activeMenu === 'aset' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white p-8 rounded-t-xl border border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Manajemen Aset & Inventaris Masjid</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">+ Tambah Barang Inventaris</button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-b-xl overflow-x-auto -mt-6">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Foto Aset</th>
                    <th className="p-4">Kode Aset</th>
                    <th className="p-4">Nama Barang</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Jumlah</th>
                    <th className="p-4">Kondisi</th>
                    <th className="p-4">Lokasi</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4"><img src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=50&q=80" alt="Speaker" className="w-10 h-10 rounded border border-slate-300 object-cover" /></td>
                    <td className="p-4 text-blue-600 font-mono text-xs">SND-01</td>
                    <td className="p-4 font-bold text-slate-800">Sistem Line Array Sound Speaker TOA Professional</td>
                    <td className="p-4">Elektronik & Audio</td>
                    <td className="p-4 font-bold text-slate-800">8 Unit</td>
                    <td className="p-4"><span className="bg-blue-600/20 text-blue-600 px-2 py-1 rounded text-xs">Baik</span></td>
                    <td className="p-4">Ruang Shalat Utama Lt 1</td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-slate-500 hover:text-slate-800"><Settings className="w-4 h-4 inline" /></button>
                      <button className="p-1.5 text-red-600 hover:text-red-300"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODUL BARU: PENGUMUMAN & GALERI */}
        {activeMenu === 'berita' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Manajemen Pengumuman & Galeri Foto Kegiatan Masjid</h2>
                <p className="text-slate-500 text-sm">Kelola siaran berita, galeri dokumentasi kajian, & informasi kegiatan jamaah dengan foto real pict.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shrink-0">+ Tambah Pengumuman / Foto Dokumentasi</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { tag: 'Kajian', title: 'Kajian Rutin Subuh Berkah: Fiqh Muamalah & ZISWAF', desc: 'Diberitahukan kepada seluruh jamaah bahwa Kajian Subuh Berkah bersama KH. Ridwan Kamil, Lc akan dilaksanakan setiap Sabtu subuh dilanjutkan dengan sarapan ramah tamah.', img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=400&q=80' },
                { tag: 'Keuangan', title: 'Laporan Akuntabilitas & Transparansi Kas Masjid Bulan Juni 2026', desc: 'Laporan rincian pemasukan dan pengeluaran kas Masjid Tazkia periode Juni 2026 telah terverifikasi oleh Tim Audit Internal. Informasi selengkapnya dapat diakses pada menu Transparansi.', img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80' },
                { tag: 'Kegiatan', title: 'Pendaftaran Santri Baru TPA Anak & Pembina Muallaf Center', desc: 'Gelombang pendaftaran santri TPA Anak & Muallaf Center angkatan 2026/2027 telah dibuka. Silakan daftar via Sekretariat DKM.', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80' },
              ].map((news, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                  <div className="relative h-48">
                    <img src={news.img} alt={news.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-600 text-xs px-3 py-1 rounded-full border border-slate-300 font-bold">{news.tag}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 text-lg mb-3 leading-snug">{news.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 flex-1">{news.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-auto">
                      <button className="text-blue-600 text-sm font-bold hover:text-slate-500">Edit Post</button>
                      <button className="text-red-600 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODUL BARU: PROGRAM ZISWAF */}
        {activeMenu === 'campaign' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white p-8 rounded-xl border border-slate-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Manajemen Program & Campaign ZISWAF</h2>
                <p className="text-slate-500 text-sm">Buat dan kelola target donasi untuk berbagai program masjid (Zakat, Infaq, Wakaf, Sedekah).</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shrink-0">+ Buat Campaign Baru</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Wakaf Pembangunan Gedung Serbaguna', target: 'Rp 500.000.000', current: 'Rp 125.000.000', p: 25 },
                { title: 'Santunan Yatim & Dhuafa Bulanan', target: 'Rp 20.000.000', current: 'Rp 18.000.000', p: 90 },
                { title: 'Operasional Dakwah & Taklim', target: 'Rp 50.000.000', current: 'Rp 5.000.000', p: 10 },
              ].map((c, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white shadow-sm border border-slate-200 text-lime-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">AKTIF</span>
                    <button className="text-slate-500 hover:text-slate-800"><Settings className="w-4 h-4" /></button>
                  </div>
                  <h3 className="font-bold text-slate-800 text-md mb-4">{c.title}</h3>
                  <div className="mb-2 flex justify-between text-xs text-slate-500">
                    <span>Terkumpul: <b className="text-slate-800">{c.current}</b></span>
                    <span>Target: {c.target}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${c.p}%` }}></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-full bg-slate-100 hover:bg-slate-700 text-slate-800 text-xs font-bold py-2 rounded-lg transition-colors">Tutup Campaign</button>
                    <button className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-600 text-xs font-bold py-2 rounded-lg transition-colors">Lihat Donatur</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODUL BARU: JADWAL JUMAT */}
        {activeMenu === 'jumat' && (
          <div className="animate-in fade-in space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Penjadwalan Imam, Muadzin, & Khatib Jumat</h2>
              <button className="bg-amber-900/40 border border-amber-700/50 text-amber-600 font-bold py-2 px-4 rounded-xl text-sm">
                ⚙️ Pengaturan Khutbah Jumat Lengkap
              </button>
            </div>
            
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Informasi Khutbah Jumat Terkini (Aktif di TV Signage)</span>
                <span className="text-amber-600 font-mono text-sm font-bold">Jumat Ini, 11:55 WIB - Selesai</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-600 mb-6">"Keagungan Zikir & Transparansi Pengelolaan Aset Umat"</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-lime-200 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs mb-1">Khatib Jumat:</p>
                  <p className="text-slate-800 font-bold text-lg">Prof. Dr. KH. Nasaruddin Umar, MA</p>
                </div>
                <div className="bg-white border border-lime-200 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs mb-1">Imam Jumat:</p>
                  <p className="text-slate-800 font-bold text-lg">Ustadz H. M. Zainuddin, Sq</p>
                </div>
                <div className="bg-white border border-lime-200 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs mb-1">Muadzin Jumat:</p>
                  <p className="text-slate-800 font-bold text-lg">Ustadz Bilal Al-Hafiz</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODUL BARU: BROADCAST WA */}
        {activeMenu === 'wa' && (
          <div className="animate-in fade-in space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Fitur Pengiriman Broadcast WhatsApp Resmi DKM</h2>
            <div className="bg-lime-50/50 p-8 rounded-2xl border border-lime-200 max-w-3xl shadow-xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Judul Pengumuman:</label>
                  <input type="text" placeholder="Contoh: Undangan Kajian Subuh Berkah..." className="w-full bg-white border border-lime-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 placeholder-blue-800/50" />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Isi Pesan Siaran:</label>
                  <textarea rows={5} placeholder="Tuliskan isi pesan pengumuman untuk jamaah..." className="w-full bg-white border border-lime-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-blue-500 placeholder-blue-800/50"></textarea>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <span className="transform -rotate-45 text-xl">✈</span> Kirim Pesan Siaran via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODUL BARU: VERIFIKASI ZISWAF */}
        {activeMenu === 'verifikasi' && (
          <div className="animate-in fade-in bg-white p-8 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Antrean Verifikasi Transfer ZISWAF</h2>
            <div className="bg-amber-900/20 border border-amber-500/20 p-5 rounded-xl flex justify-between items-center">
              <div><h3 className="font-bold text-amber-600">Transfer Rp 500.000</h3><p className="text-xs text-slate-500">Dari: 0812*** (BCA) - Program Pembangunan Masjid</p></div>
              <div className="flex gap-2">
                <button onClick={() => alert('Donasi Ditolak. Pesan penolakan terkirim ke donatur.')} className="bg-slate-100 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors">Tolak</button>
                <button onClick={() => alert('Donasi Berhasil Diverifikasi! Dana telah masuk ke sistem.')} className="bg-lime-600 hover:bg-lime-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Verifikasi</button>
              </div>
            </div>
          </div>
        )}

        {/* MODUL BARU: ROLE & AUDIT */}
        {activeMenu === 'role' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-lime-50/50 p-6 rounded-2xl border border-lime-200 flex justify-between items-center shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <span className="text-red-600">♡</span> Manajemen Akun & Role Pengguna
                </h2>
                <p className="text-slate-600 text-sm">Kelola data jamaah, atur hak akses (role) pengurus, jabatan DKM, dan kelola sandi pengguna.</p>
              </div>
              <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-xl transition-colors">+ Tambah Pengurus Baru</button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Nama Jamaah & Tingkatan</th>
                      <th className="p-4">Email & Kontak</th>
                      <th className="p-4">Role Akses</th>
                      <th className="p-4">Tanggal Bergabung</th>
                      <th className="p-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { n: 'Haji Ahmad Subagja', t: 'KETUA DKM', e: 'ahmad.subagja@gmail.com', c: '081298765432', d: '10/1/2026' },
                      { n: 'Haji Bambang Pamungkas, M.M.', t: 'BENDAHARA DKM', e: 'bambang.pamungkas@outlook.com', c: '081311223344', d: '15/1/2026' },
                      { n: 'Ustadz H. M. Zainuddin, Sq', t: 'SEKRETARIS DKM', e: 'zainuddin.sq@masjidtazkia.id', c: '081555667788', d: '1/2/2026' },
                      { n: 'Yudi Haryono', t: 'JEMAAH', e: 'yudiharyono@gmail.com', c: '087812341234', d: '1/2/2026' },
                    ].map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-bold text-slate-800 mb-1">{u.n}</p>
                          <span className="text-[10px] bg-amber-900/40 text-amber-500 border border-amber-700/50 px-2 py-0.5 rounded font-bold">{u.t}</span>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          <p className="mb-1">{u.e}</p>
                          <p>{u.c}</p>
                        </td>
                        <td className="p-4">
                          <select className="bg-white border border-amber-500 text-amber-500 rounded px-3 py-1 text-xs font-bold outline-none">
                            <option>Pengurus DKM</option>
                          </select>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">{u.d}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="bg-lime-100/50 text-slate-500 hover:text-white px-3 py-1 rounded border border-lime-200 text-xs transition-colors">Edit</button>
                            <button className="bg-amber-900/30 text-amber-500 hover:text-amber-600 px-3 py-1 rounded border border-amber-700/50 text-xs transition-colors">Sandi</button>
                            <button className="bg-red-900/30 text-red-600 hover:text-red-300 px-3 py-1 rounded border border-red-800/50 text-xs transition-colors">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'audit' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Waktu (WIB)</th>
                      <th className="p-4">Pengguna</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Aksi</th>
                      <th className="p-4">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { w: '29/7/2026, 19.06.26', n: 'Petugas Masjid Tazkia', a: 'admin', r: 'ADMIN MASJID', ac: 'LOGIN', c: 'bg-emerald-900/50 text-emerald-600', d: 'User logged in successfully' },
                      { w: '29/7/2026, 19.06.14', n: 'Gania', a: '081517045406', r: 'JAMAAH', ac: 'LOGOUT', c: 'bg-red-900/50 text-red-600', d: 'User logged out successfully' },
                      { w: '29/7/2026, 18.33.03', n: 'Gania', a: '081517045406', r: 'JAMAAH', ac: 'LOGIN', c: 'bg-emerald-900/50 text-emerald-600', d: 'User logged in successfully' },
                      { w: '28/7/2026, 16.00.00', n: 'Haji Ahmad Subagja', a: 'ahmad.subagja@gmail.com', r: 'DKM', ac: 'LOGIN', c: 'bg-emerald-900/50 text-emerald-600', d: 'Berhasil melakukan login ke dashboard Pengurus DKM dari perangkat seluler.' },
                      { w: '28/7/2026, 16.15.00', n: 'Haji Ahmad Subagja', a: 'ahmad.subagja@gmail.com', r: 'DKM', ac: 'CREATE_ANNOUNCEMENT', c: 'bg-purple-900/50 text-purple-600', d: 'Berhasil mempublikasikan pengumuman berita: "Kajian Subuh Fiqih Kontemporer".' },
                      { w: '28/7/2026, 17.15.00', n: 'Haji Bambang Pamungkas, M.M.', a: 'bambang.pamungkas@outlook.com', r: 'DKM', ac: 'LOGIN', c: 'bg-emerald-900/50 text-emerald-600', d: 'Berhasil melakukan login ke dashboard Pengurus Bendahara.' },
                      { w: '28/7/2026, 17.30.00', n: 'Haji Bambang Pamungkas, M.M.', a: 'bambang.pamungkas@outlook.com', r: 'DKM', ac: 'ADD_JOURNAL_ENTRY', c: 'bg-red-900/50 text-red-600', d: 'Berhasil menginput data Jurnal Umum untuk Zakat Mal Jamaah senilai Rp 12.500.000.' },
                    ].map((l, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 text-slate-600 text-xs">{l.w}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800 mb-1">{l.n}</p>
                          <p className="text-blue-600 text-xs">{l.a}</p>
                        </td>
                        <td className="p-4"><span className="bg-lime-100/50 text-slate-500 px-2 py-1 rounded text-[10px] font-bold border border-lime-200">{l.r}</span></td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold border border-current/20 ${l.c}`}>{l.ac}</span></td>
                        <td className="p-4 text-slate-600 text-xs">{l.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MODUL AKUNTANSI TERINTEGRASI ── */}
        {activeMenu === 'coa' && <ModulCoA journals={journals} />}
        {activeMenu === 'jurnal' && <ModulJurnal entries={journals} onAddJournal={handleAutoPostJournal} />}
        {activeMenu === 'bukubesar' && <ModulBukuBesar journals={journals} />}
        {activeMenu === 'lapkeu' && <ModulLaporanKeuangan journals={journals} />}
        {activeMenu === 'anggaran' && <ModulAnggaranApproval onAutoPostJournal={handleAutoPostJournal} />}

      </div>
    </div>
  );
};
