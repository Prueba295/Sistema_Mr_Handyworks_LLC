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
  Wrench,
  Calculator,
  Image as ImageIcon,
  Star
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
    businessInfo
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (currentPage === 'admin') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#141D2B]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
      
      {/* Top Micro-Bar: Trust credentials & direct phone call */}
      <div className="bg-slate-900 dark:bg-[#0B111B] text-slate-200 border-b border-slate-800/80 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 text-slate-300">
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'es' ? 'Top Pro 5.0 • Licenciado y Asegurado' : 'Top Pro 5.0 • Licensed & Insured'}</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              {language === 'es' ? 'Servicio en South Bend, Mishawaka, Granger y Elkhart' : 'Serving South Bend, Mishawaka, Granger & Elkhart'}
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <a 
              href={`tel:${businessInfo.phoneRaw}`} 
              className="inline-flex items-center gap-1.5 text-white hover:text-blue-300 font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{businessInfo.phone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <button
              id="header-admin-login-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('admin');
              }}
              className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer"
              title="Portal Privado Brian Cueva"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="font-semibold">{adminUser.isAuthenticated ? (language === 'es' ? 'Admin Activo' : 'Admin Active') : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Single Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => {
            if (currentPage === 'admin') navigateTo('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-[#0B3C5D] dark:border-blue-500 shadow-2xs bg-white">
            <img 
              src="/images/mr_handyworks_logo.jpg" 
              alt="Mr Handyworks LLC Logo" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-[#0B3C5D] dark:text-white">
                MR HANDYWORKS
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                LLC
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">
              Brian Cueva • {language === 'es' ? 'Top Pro 5.0 Estrellas' : 'Top Pro 5.0 Stars'}
            </p>
          </div>
        </div>

        {/* Clean Desktop Navigation Links (No Duplication) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200">
          <button
            onClick={() => handleNavClick('servicios')}
            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
            <span>{language === 'es' ? 'Servicios' : 'Services'}</span>
          </button>

          <button
            onClick={() => handleNavClick('cotizador')}
            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'es' ? 'Cotizador' : 'Instant Estimate'}</span>
          </button>

          <button
            onClick={() => handleNavClick('proyectos')}
            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'es' ? 'Fotos' : 'Portfolio'}</span>
          </button>

          <button
            onClick={() => handleNavClick('resenas')}
            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{language === 'es' ? 'Reseñas (5.0 ★)' : 'Reviews (5.0 ★)'}</span>
          </button>
        </nav>

        {/* Right Controls: Language, Theme, CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Language Toggle */}
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

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:text-[#0B3C5D] transition-colors cursor-pointer shadow-2xs"
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Primary CTA Button */}
          <button
            id="header-cta-estimate-btn"
            onClick={() => openBookingWizard()}
            className="inline-flex items-center gap-1.5 bg-[#0B3C5D] hover:bg-[#07273d] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>{language === 'es' ? 'Pedir Presupuesto' : 'Request Estimate'}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141D2B] px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('servicios')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
          >
            <Wrench className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
            <span>{language === 'es' ? 'Servicios y Tarifas' : 'Services & Rates'}</span>
          </button>

          <button
            onClick={() => handleNavClick('cotizador')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
          >
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'es' ? 'Cotizador Online' : 'Instant Estimate'}</span>
          </button>

          <button
            onClick={() => handleNavClick('proyectos')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
          >
            <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'es' ? 'Fotos y Trabajos Reales' : 'Real Work & Photos'}</span>
          </button>

          <button
            onClick={() => handleNavClick('resenas')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{language === 'es' ? 'Reseñas de Clientes (5.0 ★)' : 'Client Reviews (5.0 ★)'}</span>
          </button>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <a
              href={`tel:${businessInfo.phoneRaw}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#0B3C5D] dark:text-blue-400" />
              <span>{language === 'es' ? `Llamar: ${businessInfo.phone}` : `Call: ${businessInfo.phone}`}</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('admin');
              }}
              className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>{language === 'es' ? 'Acceso Privado Brian' : 'Private Admin Access'}</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
