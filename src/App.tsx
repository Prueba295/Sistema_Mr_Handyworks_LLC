import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Credentials } from './components/Credentials';
import { ServicesCatalog } from './components/ServicesCatalog';
import { EstimateCalculatorSection } from './components/EstimateCalculatorSection';
import { MediaGallery } from './components/MediaGallery';
import { ReviewsSection } from './components/ReviewsSection';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { BookingWizardModal } from './components/BookingWizardModal';
import { QRModal } from './components/QRModal';
import { AdminModal } from './components/AdminModal';
import {
  CheckCircle2,
  Phone,
  Calendar,
  Wrench,
  Calculator,
  Image as ImageIcon,
  Star,
  ShieldCheck,
  House,
  UserRound,
  BriefcaseBusiness,
} from 'lucide-react';

const sectionLinks = [
  { key: 'home', es: 'Inicio', en: 'Home', icon: House },
  { key: 'services', es: 'Servicios', en: 'Services', icon: Wrench },
  { key: 'estimator', es: 'Cotizador', en: 'Estimator', icon: Calculator },
  { key: 'portfolio', es: 'Proyectos', en: 'Projects', icon: ImageIcon },
  { key: 'reviews', es: 'Reseñas', en: 'Reviews', icon: Star },
  { key: 'credentials', es: 'Credenciales', en: 'Credentials', icon: ShieldCheck },
  { key: 'admin', es: 'Admin', en: 'Admin', icon: UserRound },
] as const;

const renderSection = (page: string) => {
  switch (page) {
    case 'services':
      return <ServicesCatalog />;
    case 'estimator':
      return <EstimateCalculatorSection />;
    case 'portfolio':
      return <MediaGallery />;
    case 'reviews':
      return <ReviewsSection />;
    case 'credentials':
      return <Credentials />;
    case 'admin':
      return <AdminView />;
    default:
      return <Hero />;
  }
};

const MainLayout: React.FC = () => {
  const {
    notification,
    openBookingWizard,
    language,
    currentPage,
    businessInfo,
    navigateTo,
  } = useApp();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const targetId = hash.replace(/^#\/?/, '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  return (
    <div className="app-shell min-h-screen selection:bg-[#0B3C5D] selection:text-white transition-colors flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentPage === 'admin' ? (
            <AdminView />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
              <aside className="hidden lg:block">
                <div className="sticky top-28 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
                  <div className="mb-3 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {language === 'es' ? 'Navegación' : 'Navigation'}
                  </div>

                  <nav className="space-y-1.5">
                    {sectionLinks.map(({ key, es, en, icon: Icon }) => {
                      const isActive = currentPage === key;
                      return (
                        <button
                          key={key}
                          onClick={() => navigateTo(key as any)}
                          className={`w-full flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                            isActive
                              ? 'bg-[#0B3C5D] text-white shadow-sm'
                              : 'bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface-strong)]'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{language === 'es' ? es : en}</span>
                          </span>
                          <span className="text-[10px] opacity-80">→</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-4 rounded-2xl bg-[var(--surface-soft)] p-3">
                    <div className="mb-1 text-[11px] font-bold text-[var(--text-muted)]">
                      {language === 'es' ? 'Contacto directo' : 'Direct contact'}
                    </div>
                    <a href={`tel:${businessInfo.phoneRaw}`} className="block text-sm font-bold text-[var(--text)]">
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">{renderSection(currentPage)}</div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      <BookingWizardModal />
      <QRModal />
      <AdminModal />

      {currentPage !== 'admin' && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center gap-2 bg-slate-900/95 dark:bg-[#141D2B]/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-700/60 text-white">
          <button
            onClick={() => openBookingWizard()}
            className="flex-1 py-3 px-4 rounded-xl bg-white text-[#0B3C5D] hover:bg-slate-100 font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#0B3C5D]" />
            <span>{language === 'es' ? 'Pedir Cotización' : 'Request Estimate'}</span>
          </button>

          <a
            href={`tel:${businessInfo.phoneRaw}`}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Llamar a Brian"
          >
            <Phone className="w-4 h-4 text-blue-300" />
          </a>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
