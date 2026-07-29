import React from 'react';

export const Hero = () => {
  return (
    <section className="bg-white py-16 px-4 text-center border-b border-slate-100">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-lime-600 font-bold uppercase tracking-wider text-sm mb-4">
          Ekosistem Digital Masjid Citra Sentul Raya
        </p>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-6">
          Pusat Peradaban Islam & Kesejahteraan Umat Melalui Optimalisasi ZISWAF, Dakwah & Zikir
        </h2>
        
        <p className="text-slate-600 text-base sm:text-lg max-w-3xl leading-relaxed mb-8">
          Salurkan Zakat, Infaq, Shadaqah, dan Wakaf Anda secara transparan di Masjid Citra Sentul Raya untuk dakwah, pendidikan, dan pemberdayaan ekonomi umat.
          <br />
          <span className="font-semibold text-lime-600 mt-2 block">#ZISWAFMasjidCitraSentul</span>
        </p>
      </div>
    </section>
  );
};
