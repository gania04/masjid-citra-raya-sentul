CREATE TABLE IF NOT EXISTS public.kajian (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(255) NOT NULL,
    ustadz VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    waktu VARCHAR(50) NOT NULL,
    kuota INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Aktif',
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Kajian
INSERT INTO public.kajian (judul, ustadz, tanggal, waktu, kuota, status, deskripsi)
VALUES 
('Kajian Tafsir Al-Baqarah', 'Ust. Abdul Somad', '2026-09-01', 'Ba''da Maghrib', 100, 'Aktif', 'Membahas tafsir ayat-ayat pilihan dari surat Al-Baqarah.'),
('Kajian Fiqih Muamalah', 'Ust. Erwandi Tarmizi', '2026-09-05', '09:00 - 11:00 WIB', 150, 'Aktif', 'Mengkaji prinsip-prinsip fiqih dalam muamalah kontemporer.')
ON CONFLICT DO NOTHING;

ALTER TABLE public.kajian ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Kajian" ON public.kajian FOR SELECT USING (true);
CREATE POLICY "Public Insert Kajian" ON public.kajian FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Kajian" ON public.kajian FOR UPDATE USING (true);
