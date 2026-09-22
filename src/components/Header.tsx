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
  House,
  Wrench,
  Calculator,
  Image as ImageIcon,
  Star,
  Briefcase,
  UserRound,
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

  const mobileNavItems = [
    { key: 'home', label: 'Home', icon: House },
    { key: 'services', label: 'Services', icon: Wrench },
    { key: 'estimator', label: 'Estimator', icon: Calculator },
    { key: 'portfolio', label: 'Projects', icon: ImageIcon },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'credentials', label: 'Credentials', icon: Briefcase },
    { key: 'admin', label: 'Admin', icon: UserRound },
  ] as const;

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
              <span className="font-semibold">{adminUser.isAuthenticated ? 'Admin' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div
          className="flex min-w-0 items-center space-x-2 sm:space-x-3 cursor-pointer group shrink"
          onClick={() => {
            if (currentPage === 'admin') navigateTo('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border-2 border-[#0B3C5D] bg-white shadow-2xs dark:border-blue-500 sm:h-11 sm:w-11">
            <img src="/logo_handyworks.jpeg" alt="Mr Handyworks LLC Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-black tracking-tight text-[#0B3C5D] dark:text-white sm:text-lg">MR HANDYWORKS</span>
              <span className="hidden rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 sm:inline">LLC</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">Brian Cueva</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] shadow-sm transition-colors cursor-pointer"
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => openBookingWizard()}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0B3C5D] hover:bg-[#07273d] text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>{language === 'es' ? 'Solicitar' : 'Request'}</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] shadow-sm cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <button className="fixed inset-0 z-40 bg-slate-950/40" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-[82vw] max-w-xs flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="text-sm font-black text-[var(--text)]">{language === 'es' ? 'Menú' : 'Menu'}</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-[var(--surface-soft)]" aria-label="Close menu">
                <X className="w-4 h-4 text-[var(--text)]" />
              </button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {mobileNavItems.map(({ key, label, icon: Icon }) => {
                const isActive = currentPage === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo(key as any);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-[#0B3C5D] text-white shadow-sm'
                        : 'bg-[var(--surface-soft)] text-[var(--text)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </span>
                    <span className="text-[10px] opacity-80">→</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[var(--border)] p-4">
              <a href={`tel:${businessInfo.phoneRaw}`} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B3C5D] px-4 py-3 text-sm font-black text-white">
                <Phone className="w-4 h-4" />
                {businessInfo.phone}
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
