import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Sun,
  Moon,
  Lock,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    openBookingWizard,
    adminUser,
    currentPage,
    navigateTo,
    businessInfo,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md shadow-[0_1px_0_var(--shadow)] transition-colors">
      <div className="bg-slate-900 dark:bg-[#0B111B] text-slate-200 border-b border-slate-800/80 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">
              {language === 'es' ? 'Servicio profesional en South Bend' : 'Professional service in South Bend'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a href={`tel:${businessInfo.phoneRaw}`} className="inline-flex items-center gap-1.5 text-white hover:text-blue-300 font-bold transition-colors">
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{businessInfo.phone}</span>
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('admin');
              }}
              className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer"
              title="Portal Privado"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="font-semibold">{adminUser.isAuthenticated ? (language === 'es' ? 'Admin' : 'Admin') : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => {
            if (currentPage === 'admin') navigateTo('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-[#0B3C5D] dark:border-blue-500 shadow-2xs bg-white">
            <img src="/logo_handy.webp" alt="Mr Handyworks LLC Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-[#0B3C5D] dark:text-white">MR HANDYWORKS</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">LLC</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">Brian Cueva</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0B3C5D] transition-colors cursor-pointer"
            title="Cambiar Idioma / Change Language"
          >
            <span className={language === 'es' ? 'text-[#0B3C5D] dark:text-blue-400 font-black' : 'text-slate-400'}>ES</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className={language === 'en' ? 'text-[#0B3C5D] dark:text-blue-400 font-black' : 'text-slate-400'}>EN</span>
          </button>

          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] hover:text-[var(--primary)] transition-colors cursor-pointer shadow-2xs"
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => openBookingWizard()}
            className="inline-flex items-center gap-1.5 bg-[#0B3C5D] hover:bg-[#07273d] text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>{language === 'es' ? 'Solicitar' : 'Request'}</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <a href={`tel:${businessInfo.phoneRaw}`} className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#0B3C5D] dark:text-blue-400" />
            <span>{language === 'es' ? `Llamar: ${businessInfo.phone}` : `Call: ${businessInfo.phone}`}</span>
          </a>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('services');
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-[var(--text)] hover:bg-[var(--surface-soft)] flex items-center gap-2.5"
          >
            <span>{language === 'es' ? 'Servicios' : 'Services'}</span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('estimator');
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-[var(--text)] hover:bg-[var(--surface-soft)]"
          >
            {language === 'es' ? 'Cotizador' : 'Estimator'}
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('portfolio');
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-[var(--text)] hover:bg-[var(--surface-soft)]"
          >
            {language === 'es' ? 'Proyectos' : 'Projects'}
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('reviews');
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-[var(--text)] hover:bg-[var(--surface-soft)]"
          >
            {language === 'es' ? 'Reseñas' : 'Reviews'}
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('credentials');
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-[var(--text)] hover:bg-[var(--surface-soft)]"
          >
            {language === 'es' ? 'Credenciales' : 'Credentials'}
          </button>
        </div>
      )}
    </header>
  );
};
