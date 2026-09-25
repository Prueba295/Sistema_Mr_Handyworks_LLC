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
  MessageSquare
} from 'lucide-react';

import { PublicOrderModal } from './components/PublicOrderModal';

const sectionLinks = [
  { key: 'home', label: 'Home', icon: House },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'schedule', label: 'Availability', icon: Calendar },
  { key: 'portfolio', label: 'Projects', icon: ImageIcon },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'credentials', label: 'Credentials', icon: ShieldCheck },
] as const;

const renderSection = (page: string) => {
  switch (page) {
    case 'services':
      return <ServicesCatalog />;
    case 'estimator':
      return <ServicesCatalog />;
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

  const [publicOrderId, setPublicOrderId] = React.useState<string | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        navigateTo('admin');
        return;
      }
      const searchParams = new URLSearchParams(window.location.search);
      const queryOrderId = searchParams.get('order') || searchParams.get('view-order') || searchParams.get('id');
      if (queryOrderId) {
        setPublicOrderId(queryOrderId);
        return;
      }

      const orderMatch = hash.match(/^#\/?(?:view-)?order[=/]([A-Za-z0-9_-]+)/i) || 
                         hash.match(/[?&](?:view-)?order=([A-Za-z0-9_-]+)/i) ||
                         hash.match(/^#\/?(ORD-[A-Za-z0-9_-]+)/i);
      if (orderMatch && orderMatch[1]) {
        setPublicOrderId(orderMatch[1]);
        return;
      }
      if (hash && hash.length > 1) {
        const targetId = hash.replace(/^#\/?/, '');
        const el = document.getElementById(targetId);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [navigateTo]);

  return (
    <div className="app-shell min-h-screen selection:bg-[#0B3C5D] selection:text-white transition-colors flex flex-col justify-between">
      <div>
        {currentPage !== 'admin' && <Header />}

        <main className={currentPage === 'admin' ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}>
          {currentPage === 'admin' ? (
            <AdminView />
          ) : (
            <div className="w-full min-w-0">{renderSection(currentPage)}</div>
          )}
        </main>
      </div>

      {currentPage !== 'admin' && <Footer />}

      <BookingWizardModal />
      <QRModal />
      <AdminModal />
      {publicOrderId && (
        <PublicOrderModal
          orderId={publicOrderId}
          onClose={() => {
            setPublicOrderId(null);
            if (window.location.hash.toLowerCase().includes('order') || window.location.hash.toUpperCase().includes('ORD-')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}

      {notification && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5">
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
