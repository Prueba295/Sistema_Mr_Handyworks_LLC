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
  Calendar
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    notification, 
    openBookingWizard, 
    language, 
    currentPage, 
    businessInfo,
    navigateTo 
  } = useApp();

  // On initial hash or page change, if hash is present, smoothly scroll to it
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
        {/* Top Sticky Header */}
        <Header />

        {/* Content Router */}
        <main>
          {currentPage === 'admin' ? (
            <AdminView />
          ) : (
            <div className="space-y-0">
              <Hero />
              <ServicesCatalog />
              <EstimateCalculatorSection />
              <MediaGallery />
              <ReviewsSection />
              <Credentials />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Booking & Admin Modals */}
      <BookingWizardModal />
      <QRModal />
      <AdminModal />

      {/* Mobile Sticky Quick Action Bar */}
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

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
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
