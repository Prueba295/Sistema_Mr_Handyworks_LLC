import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  House,
  Wrench,
  Calculator,
  Calendar,
  Image as ImageIcon,
  Star,
  Briefcase,
  UserRound,
  ChevronRight,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    theme,
    toggleTheme,
    openBookingWizard,
    adminUser,
    currentPage,
    navigateTo,
    businessInfo,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileMenuOpen]);

  const mobileNavItems = [
    { key: 'home', label: language === 'es' ? 'Inicio' : 'Home', icon: House },
    { key: 'services', label: language === 'es' ? 'Servicios' : 'Services', icon: Wrench },
    { key: 'schedule', label: language === 'es' ? 'Disponibilidad' : 'Availability', icon: Calendar },
    { key: 'portfolio', label: language === 'es' ? 'Proyectos' : 'Projects', icon: ImageIcon },
    { key: 'reviews', label: language === 'es' ? 'Reseñas' : 'Reviews', icon: Star },
    { key: 'credentials', label: language === 'es' ? 'Credenciales' : 'Credentials', icon: Briefcase },
  ] as const;

  const mobileMenuContent = isMobileMenuOpen && typeof document !== 'undefined' ? (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      {/* Dimmed backdrop covering full viewport */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        onClick={() => setIsMobileMenuOpen(false)}
        aria-label="Close menu"
      />

      {/* Slide-over solid drawer container anchored to LEFT */}
      <aside className="fixed inset-y-0 left-0 z-50 flex h-full h-[100dvh] w-[85vw] max-w-xs sm:max-w-sm flex-col bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-2xl border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-250 ease-out">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3.5 bg-slate-50/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-[#0B3C5D] dark:border-blue-500 bg-white shrink-0">
              <img src="/logo_handyworks.jpeg" alt="Mr Handyworks Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-[#0B3C5D] dark:text-white uppercase leading-none">
                MR HANDYWORKS
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Home Services & Repairs</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 shadow-2xs cursor-pointer"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close menu"
              title="Close menu"
            >
              <X className="h-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {mobileNavItems.map(({ key, label, icon: Icon }) => {
            const isActive = currentPage === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo(key as any);
                }}
                className={`group flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0B3C5D] to-[#154E74] text-white shadow-md'
                    : 'bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-slate-700 text-[#0B3C5D] dark:text-blue-400 shadow-2xs'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{label}</span>
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openBookingWizard();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B3C5D] hover:bg-[#07273d] px-4 py-3 text-sm font-black text-white shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>{language === 'es' ? 'Solicitar Cotización' : 'Request Estimate'}</span>
          </button>

          <a
            href={`tel:${businessInfo.phoneRaw}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>{language === 'es' ? 'Llamar a Servicio' : 'Call Service Desk'}</span>
          </a>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'es' ? 'Licenciado y Asegurado • South Bend, IN' : 'Licensed & Insured • South Bend, IN'}</span>
          </div>
        </div>
      </aside>
    </div>
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md shadow-[0_1px_0_var(--shadow)] transition-colors">
        <div className="bg-slate-900 dark:bg-[#0B111B] text-slate-200 border-b border-slate-800/80 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">
                {language === 'es' ? 'Servicio profesional en South Bend' : 'Professional service in South Bend'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a 
                href={`tel:${businessInfo.phoneRaw}`} 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600/30 hover:bg-emerald-600/50 text-white font-bold text-[11px] transition-colors shadow-2xs border border-emerald-500/30"
                title={language === 'es' ? 'Llamar al servicio' : 'Call service desk'}
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{language === 'es' ? 'Llamar' : 'Call Now'}</span>
              </a>

              <button 
                onClick={() => navigateTo('admin')} 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/25 text-white font-bold text-[11px] transition-colors shadow-2xs border border-white/20 cursor-pointer"
                title="Admin Portal"
              >
                <Lock className="w-3 h-3 text-amber-300" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Left: Global Menu Trigger + Brand Logo & Identity */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white shadow-xs cursor-pointer transition-colors shrink-0"
              aria-label="Menu"
              title={language === 'es' ? 'Menú Principal' : 'Main Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              className="flex min-w-0 items-center space-x-2.5 cursor-pointer group"
              onClick={() => {
                if (currentPage === 'admin') navigateTo('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border-2 border-[#0B3C5D] bg-white shadow-2xs dark:border-blue-500 sm:h-10 sm:w-10">
                <img src="/logo_handyworks.jpeg" alt="Mr Handyworks LLC Logo" className="w-full h-full object-cover" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm sm:text-base font-black tracking-tight text-[#0B3C5D] dark:text-white">
                    MR HANDYWORKS
                  </span>
                  <span className="hidden rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 sm:inline">
                    LLC
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  Home Services & Repairs
                </p>
              </div>
            </div>
          </div>

          {/* Right: Theme Toggle & Quote CTA */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 shadow-xs transition-colors cursor-pointer"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => openBookingWizard()}
              className="inline-flex items-center gap-1.5 bg-[#0B3C5D] hover:bg-[#07273d] text-white font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{language === 'es' ? 'Cotizar' : 'Get Quote'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Render mobile menu at root body level via Portal to avoid backdrop-filter and sticky positioning bugs */}
      {mobileMenuContent && createPortal(mobileMenuContent, document.body)}
    </>
  );
};

