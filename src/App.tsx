import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HomeView } from './components/HomeView';
import { Credentials } from './components/Credentials';
import { ServicesCatalog } from './components/ServicesCatalog';
import { EstimateCalculatorSection } from './components/EstimateCalculatorSection';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
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
  { key: 'home', label: 'Home', icon: House },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'estimator', label: 'Estimator', icon: Calculator },
  { key: 'schedule', label: 'Availability', icon: Calendar },
  { key: 'portfolio', label: 'Projects', icon: ImageIcon },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'credentials', label: 'Credentials', icon: ShieldCheck },
  { key: 'admin', label: 'Admin', icon: UserRound },
] as const;

const renderSection = (page: string) => {
  switch (page) {
    case 'services':
      return <ServicesCatalog />;
    case 'estimator':
      return <EstimateCalculatorSection />;
    case 'schedule':
      return <AvailabilityCalendar />;
    case 'portfolio':
      return <MediaGallery />;
    case 'reviews':
      return <ReviewsSection />;
    case 'credentials':
      return <Credentials />;
    case 'admin':
      return <AdminView />;
    default:
      return <HomeView />;
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
            <div className="w-full min-w-0">{renderSection(currentPage)}</div>
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
            title="Call Brian"
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
