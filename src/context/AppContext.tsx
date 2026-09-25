import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Theme, 
  Service, 
  PortfolioMedia, 
  Review, 
  PaymentQR, 
  AvailabilityDay, 
  Booking, 
  AdminUser,
  BookingStatus,
  NavigationPage,
  BusinessInfo
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_PORTFOLIO, 
  INITIAL_REVIEWS, 
  INITIAL_QR_METHODS, 
  INITIAL_AVAILABILITY, 
  STANDARD_TIME_SLOTS,
  INITIAL_BOOKINGS,
  BUSINESS_INFO
} from '../data/initialData';
import { translations } from '../translations';
import {
  readSyncedValue,
  removeSyncedValue,
  subscribeToSync,
  writeSyncedValue,
} from '../utils/realtimeSync';
import { supabase } from '../lib/supabase';
import {
  createCloudBooking,
  deleteCloudBooking,
  loadCloudBookings,
  updateCloudBooking
} from '../utils/cloudBookings';
import {
  AlertSettings,
  readAlertSettings,
  writeAlertSettings
} from '../utils/pushNotifications';
import {
  executeWithFailover,
  createSystemBackup,
  purgeExpiredBackups
} from '../utils/systemBackupManager';

interface BookingWizardPreload {
  serviceId?: string;
  date?: string;
  timeSlot?: string;
}

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  name: BUSINESS_INFO.name,
  owner: BUSINESS_INFO.owner,
  phone: BUSINESS_INFO.phone,
  phoneRaw: BUSINESS_INFO.phoneRaw,
  email: BUSINESS_INFO.email,
  location: BUSINESS_INFO.location,
  cityState: 'South Bend, IN',
  serviceAreas: BUSINESS_INFO.serviceAreas,
  weekdaysHours: BUSINESS_INFO.workingHours.weekdays,
  saturdayHours: BUSINESS_INFO.workingHours.saturdays,
  sundayHours: BUSINESS_INFO.workingHours.sundays,
  hoursDays: 'Mon - Sat',
  hoursTime: '9:00 am - 8:00 pm',
  hoursSunday: 'Sun (Emergency only)',
  paymentMethods: ['Zelle', 'Venmo', 'Cash App', 'Apple Pay', 'Cards (+3.5% fee)', 'Cash', 'Check'],
  thumbtackUrl: BUSINESS_INFO.thumbtackUrl,
  licenseNumber: 'BL-IN-2024-8849',
  insurancePolicy: 'Next Insurance #NX-IN-99421',
  insuranceCoverage: '$1,000,000 Next Insurance Liability',
  yearsExperience: 8,
  bioEs: 'Nuestro equipo de servicio de Mr Handyworks LLC combina experiencia práctica, atención cuidadosa y soluciones confiables para reparaciones, instalaciones y remodelaciones residenciales en South Bend, IN.',
  bioEn: 'The Mr Handyworks LLC service team combines hands-on experience, careful attention to detail, and dependable workmanship for residential repairs, installations, and remodels across South Bend, IN.'
};

const LANGUAGE_STORAGE_KEY = 'mr_handyworks_lang_v2';
const DEFAULT_ADMIN_EMAIL = 'Mrhandyworks25@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'MrHandyworks2026!';
const LEGACY_ADMIN_PASSWORDS = ['demo-admin-password', 'legacy-admin-password'];
const LEGACY_ADMIN_EMAILS = ['admin@private.local', 'demo-admin@private.local', 'legacy-admin@private.local'];

const parseStoredValue = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeAvailability = (days: AvailabilityDay[]): AvailabilityDay[] => days.map(day => (
  day.isBlocked
    ? { ...day, slots: [] }
    : { ...day, slots: [...STANDARD_TIME_SLOTS] }
));

const getPageFromHash = (): NavigationPage => {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace('#/', '').replace('#', '').trim().toLowerCase();
  if (['home', 'services', 'estimator', 'portfolio', 'reviews', 'schedule', 'credentials', 'admin'].includes(raw)) {
    return raw as NavigationPage;
  }
  if (raw === 'servicios') return 'services';
  if (raw === 'cotizador') return 'estimator';
  if (raw === 'proyectos' || raw === 'galeria') return 'portfolio';
  if (raw === 'resenas' || raw === 'testimonios') return 'reviews';
  if (raw === 'disponibilidad' || raw === 'calendario') return 'schedule';
  if (raw === 'credenciales' || raw === 'garantia') return 'credentials';
  if (raw === 'inicio') return 'home';
  return 'home';
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: typeof translations['en'];

  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  navigateTo: (page: NavigationPage) => void;

  businessInfo: BusinessInfo;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;

  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, partial: Partial<Service>) => void;
  deleteService: (id: string) => void;

  portfolio: PortfolioMedia[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioMedia[]>>;
  addPortfolioItem: (item: Omit<PortfolioMedia, 'id'>) => void;
  updatePortfolioItem: (id: string, partial: Partial<PortfolioMedia>) => void;
  deletePortfolioItem: (id: string) => void;

  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'isVerified' | 'source' | 'status'>) => void;
  updateReview: (id: string, partial: Partial<Review>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  moderateReview: (id: string, action: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DELETE') => void;

  availability: AvailabilityDay[];
  setAvailability: React.Dispatch<React.SetStateAction<AvailabilityDay[]>>;
  toggleDateBlock: (dateStr: string) => void;
  addSlotToDate: (dateStr: string, slotStr: string) => void;
  addAvailabilitySlot: (dateStr: string, slotStr: string) => void;
  removeSlotFromDate: (dateStr: string, slotStr: string) => void;

  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'> & { id?: string }) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;

  qrMethods: PaymentQR[];
  updateQRMethod: (id: string, accountInfo: string) => void;

  adminUser: AdminUser;
  adminLogin: (password: string, code2fa?: string) => Promise<boolean>;
  adminLogout: () => void;
  recoveryEmail: string;
  setRecoveryEmail: (email: string) => void;
  changeAdminPassword: (newPwd: string) => boolean;
  requestPasswordResetEmail: () => Promise<boolean>;

  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isBookingWizardOpen: boolean;
  closeBookingWizard: () => void;
  bookingPreload: BookingWizardPreload | null;
  bookingWizardInitialData: BookingWizardPreload | null;
  openBookingWizard: (preload?: BookingWizardPreload) => void;

  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  activeQRProvider: PaymentQR | null;
  setActiveQRProvider: (provider: PaymentQR | null) => void;
  openQRModal: (providerName?: string) => void;

  lightboxMedia: PortfolioMedia | null;
  setLightboxMedia: (media: PortfolioMedia | null) => void;

  notification: string | null;
  showNotification: (msg: string) => void;
  alertSettings: AlertSettings;
  updateAlertSettings: (settings: Partial<AlertSettings>) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language State - English by default for all public visitors
  const [language, setLanguageState] = useState<Language>(() => {
    // Check if an authenticated admin has set a language preference
    const adminSession = sessionStorage.getItem('mr_handyworks_admin');
    if (adminSession) {
      const saved = readSyncedValue(LANGUAGE_STORAGE_KEY);
      if (saved === 'es' || saved === 'en') return saved;
    }
    // Public visitors ALWAYS see pure English
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeSyncedValue(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 2. Theme State
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = readSyncedValue('mr_handyworks_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const applyTheme = (nextTheme: Theme) => {
    const root = document.documentElement;
    const isDark = nextTheme === 'dark';
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', nextTheme);
    root.style.colorScheme = nextTheme;
    document.body.classList.toggle('dark', isDark);
    writeSyncedValue('mr_handyworks_theme', nextTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  };

  // 3. Navigation State (Dedicated spaces/pages with hash preservation on reload)
  const [currentPage, setCurrentPage] = useState<NavigationPage>(() => {
    const hashPage = getPageFromHash();
    if (hashPage !== 'home') return hashPage;
    const savedPage = readSyncedValue('mr_handyworks_current_page');
    return savedPage && ['home', 'services', 'estimator', 'portfolio', 'reviews', 'schedule', 'credentials', 'admin'].includes(savedPage)
      ? savedPage as NavigationPage
      : 'home';
  });

  const navigateTo = (page: NavigationPage) => {
    setCurrentPage(page);
    writeSyncedValue('mr_handyworks_current_page', page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
      writeSyncedValue('mr_handyworks_current_page', page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const syncExternalChanges = (event: { key: string; value: string | null }) => {
      switch (event.key) {
        case LANGUAGE_STORAGE_KEY: {
          setLanguageState('en');
          document.documentElement.lang = 'en';
          break;
        }
        case 'mr_handyworks_theme': {
          const next = event.value;
          if (next === 'light' || next === 'dark') {
            setThemeState(next);
          }
          break;
        }
        case 'mr_handyworks_current_page': {
          const next = event.value as NavigationPage | null;
          if (next && ['home', 'services', 'estimator', 'portfolio', 'reviews', 'schedule', 'credentials', 'admin'].includes(next)) {
            setCurrentPage(next);
            if (window.location.hash !== `#/${next}`) {
              window.history.replaceState(null, '', `#/${next}`);
            }
          }
          break;
        }
        case 'mr_handyworks_admin': {
          if (!event.value) {
            setAdminUser({ isAuthenticated: false, email: '', twoFactorActive: true });
            break;
          }
          try {
            setAdminUser(JSON.parse(event.value));
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_biz_info': {
          if (!event.value) {
            setBusinessInfo(DEFAULT_BUSINESS_INFO);
            break;
          }
          try {
            setBusinessInfo(JSON.parse(event.value));
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_services': {
          if (!event.value) {
            setServices(INITIAL_SERVICES);
            break;
          }
          try {
            setServices(JSON.parse(event.value));
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_portfolio': {
          if (!event.value) {
            setPortfolio(INITIAL_PORTFOLIO);
            break;
          }
          try {
            const parsed = JSON.parse(event.value);
            if (Array.isArray(parsed)) {
              const initialMap = new Map(INITIAL_PORTFOLIO.map(item => [item.id, item]));
              setPortfolio(parsed.map((item: PortfolioMedia) => {
                const defaultItem = initialMap.get(item.id);
                return defaultItem ? { ...item, ...defaultItem } : item;
              }));
            } else {
              setPortfolio(parsed);
            }
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_reviews': {
          if (!event.value) {
            setReviews(INITIAL_REVIEWS);
            break;
          }
          try {
            setReviews(JSON.parse(event.value));
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_availability': {
          if (!event.value) {
            setAvailability(INITIAL_AVAILABILITY);
            break;
          }
          try {
            setAvailability(normalizeAvailability(JSON.parse(event.value) as AvailabilityDay[]));
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_bookings': {
          if (!event.value) {
            setBookings(INITIAL_BOOKINGS);
            break;
          }
          try {
            setBookings(JSON.parse(event.value));
          } catch {
            break;
          }
          break;
        }
        case 'mr_handyworks_qr': {
          if (!event.value) {
            setQrMethods(INITIAL_QR_METHODS);
            break;
          }
          try {
            setQrMethods(JSON.parse(event.value));
          } catch {
            break;
          }
          break;
        }
        default:
          break;
      }
    };

    return subscribeToSync(syncExternalChanges);
  }, []);

  // 4. Translations
  const t = translations[language];

  // 5. Business Info (Fully editable by admin)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    const saved = readSyncedValue('mr_handyworks_biz_info');
    return parseStoredValue(saved, DEFAULT_BUSINESS_INFO);
  });

  const updateBusinessInfo = (updated: Partial<BusinessInfo>) => {
    setBusinessInfo(prev => {
      const next = { ...prev, ...updated };
      writeSyncedValue('mr_handyworks_biz_info', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Información del negocio guardada' : 'Business information updated');
  };

  // 6. Services State & CRUD
  const [services, setServices] = useState<Service[]>(() => {
    const saved = readSyncedValue('mr_handyworks_services');
    return parseStoredValue(saved, INITIAL_SERVICES);
  });

  const addService = (newServ: Omit<Service, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const s: Service = { ...newServ, id };
    setServices(prev => {
      const next = [s, ...prev];
      writeSyncedValue('mr_handyworks_services', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Servicio agregado con éxito' : 'Service added successfully');
  };

  const updateService = (id: string, partial: Partial<Service>) => {
    setServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...partial } : s);
      writeSyncedValue('mr_handyworks_services', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Servicio actualizado' : 'Service updated');
  };

  const deleteService = (id: string) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      writeSyncedValue('mr_handyworks_services', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Servicio eliminado' : 'Service deleted');
  };

  // 7. Portfolio State & CRUD
  const [portfolio, setPortfolio] = useState<PortfolioMedia[]>(() => {
    const saved = readSyncedValue('mr_handyworks_portfolio');
    const parsed = parseStoredValue(saved, INITIAL_PORTFOLIO);
    if (saved && Array.isArray(parsed)) {
      const initialMap = new Map(INITIAL_PORTFOLIO.map(item => [item.id, item]));
      return parsed.map(item => {
        const defaultItem = initialMap.get(item.id);
        return defaultItem ? { ...item, ...defaultItem } : item;
      });
    }
    return parsed;
  });

  const addPortfolioItem = (item: Omit<PortfolioMedia, 'id'>) => {
    const newItem: PortfolioMedia = {
      ...item,
      id: `port-${Date.now()}`
    };
    setPortfolio(prev => {
      const next = [newItem, ...prev];
      writeSyncedValue('mr_handyworks_portfolio', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Proyecto añadido al portafolio' : 'Project added to portfolio');
  };

  const updatePortfolioItem = (id: string, partial: Partial<PortfolioMedia>) => {
    setPortfolio(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...partial } : p);
      writeSyncedValue('mr_handyworks_portfolio', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Proyecto actualizado' : 'Portfolio item updated');
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio(prev => {
      const next = prev.filter(p => p.id !== id);
      writeSyncedValue('mr_handyworks_portfolio', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Proyecto eliminado' : 'Portfolio item deleted');
  };

  // 8. Reviews State & CRUD
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = readSyncedValue('mr_handyworks_reviews');
    return parseStoredValue(saved, INITIAL_REVIEWS);
  });

  const addReview = (newRev: Omit<Review, 'id' | 'date' | 'isVerified' | 'source' | 'status'>) => {
    const rev: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      source: 'Direct',
      status: 'APPROVED'
    };
    setReviews(prev => {
      const next = [rev, ...prev];
      writeSyncedValue('mr_handyworks_reviews', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? '¡Gracias! Tu reseña ha sido publicada.' : 'Thank you! Your review has been published.');
  };

  const updateReview = (id: string, partial: Partial<Review>) => {
    setReviews(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...partial } : r);
      writeSyncedValue('mr_handyworks_reviews', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Reseña actualizada' : 'Review updated');
  };

  const approveReview = (id: string) => {
    setReviews(prev => {
      const next = prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as const } : r);
      writeSyncedValue('mr_handyworks_reviews', JSON.stringify(next));
      return next;
    });
  };

  const deleteReview = (id: string) => {
    setReviews(prev => {
      const next = prev.filter(r => r.id !== id);
      writeSyncedValue('mr_handyworks_reviews', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Reseña eliminada' : 'Review deleted');
  };

  const moderateReview = (id: string, action: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DELETE') => {
    if (action === 'DELETE') {
      deleteReview(id);
    } else {
      setReviews(prev => {
        const next = prev.map(r => r.id === id ? { ...r, status: action } : r);
        writeSyncedValue('mr_handyworks_reviews', JSON.stringify(next));
        return next;
      });
    }
  };

  // 9. Availability State & Actions
  const [availability, setAvailability] = useState<AvailabilityDay[]>(() => {
    const saved = readSyncedValue('mr_handyworks_availability');
    const current = normalizeAvailability(parseStoredValue(saved, INITIAL_AVAILABILITY));
    const scheduleVersionKey = 'mr_handyworks_schedule_v4';
    if (!readSyncedValue(scheduleVersionKey)) {
      const standardized = normalizeAvailability(current);
      writeSyncedValue('mr_handyworks_availability', JSON.stringify(standardized));
      writeSyncedValue(scheduleVersionKey, 'true');
      return standardized;
    }
    const demoSeedKey = 'mr_handyworks_demo_busy_dates_v1';
    if (!readSyncedValue(demoSeedKey)) {
      const demoBusyDates = new Set(['2026-09-24', '2026-09-27', '2026-09-29']);
      const seeded = [...current];
      demoBusyDates.forEach(date => {
        const existingIndex = seeded.findIndex(day => day.date === date);
        const busyDay = { date, isBlocked: true, slots: [], note: 'Booked - unavailable' };
        if (existingIndex >= 0) seeded[existingIndex] = { ...seeded[existingIndex], ...busyDay };
        else seeded.push(busyDay);
      });
      writeSyncedValue('mr_handyworks_availability', JSON.stringify(seeded));
      writeSyncedValue(demoSeedKey, 'true');
      return seeded;
    }
    return current;
  });

  const toggleDateBlock = (dateStr: string) => {
    setAvailability(prev => {
      const exists = prev.find(d => d.date === dateStr);
      let next: AvailabilityDay[];
      if (exists) {
        next = prev.map(d => d.date === dateStr ? { ...d, isBlocked: !d.isBlocked } : d);
      } else {
        next = [...prev, { date: dateStr, isBlocked: true, slots: [] }];
      }
      writeSyncedValue('mr_handyworks_availability', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Disponibilidad actualizada' : 'Availability synced');
  };

  const addSlotToDate = (dateStr: string, slotStr: string) => {
    setAvailability(prev => {
      const exists = prev.find(d => d.date === dateStr);
      let next: AvailabilityDay[];
      if (exists) {
        if (exists.slots.includes(slotStr)) return prev;
        next = prev.map(d => d.date === dateStr ? { ...d, slots: [...d.slots, slotStr] } : d);
      } else {
        next = [...prev, { date: dateStr, isBlocked: false, slots: [slotStr] }];
      }
      writeSyncedValue('mr_handyworks_availability', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Horario agregado' : 'Slot added to calendar');
  };

  const removeSlotFromDate = (dateStr: string, slotStr: string) => {
    setAvailability(prev => {
      const next = prev.map(d => d.date === dateStr ? { ...d, slots: d.slots.filter(s => s !== slotStr) } : d);
      writeSyncedValue('mr_handyworks_availability', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Horario removido' : 'Slot removed from calendar');
  };

  // 10. Bookings State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = readSyncedValue('mr_handyworks_bookings');
    return parseStoredValue(saved, INITIAL_BOOKINGS);
  });

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'> & { id?: string }): Booking => {
    const id = bookingData.id || `HW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => {
      const next = [newBooking, ...prev];
      writeSyncedValue('mr_handyworks_bookings', JSON.stringify(next));
      return next;
    });
    void createCloudBooking(newBooking).catch(() => {
      showNotification(language === 'es' ? 'La reserva quedó local; no se pudo conectar con Supabase' : 'Booking saved locally; Supabase connection failed');
    });

    // Also update availability slot
    if (bookingData.scheduledDate && bookingData.scheduledTimeSlot) {
      setAvailability(prev => {
        const next = prev.map(day => {
          if (day.date === bookingData.scheduledDate) {
            return {
              ...day,
              slots: day.slots.filter(s => !bookingData.scheduledTimeSlot.includes(s))
            };
          }
          return day;
        });
        writeSyncedValue('mr_handyworks_availability', JSON.stringify(next));
        return next;
      });
    }

    showNotification(language === 'es' ? '¡Cita registrada con éxito!' : 'Booking created successfully!');
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => {
      const next = prev.map(b => {
        if (b.id !== id) return b;
        const updatedBooking = { ...b, status };
        void updateCloudBooking(updatedBooking);
        return updatedBooking;
      });
      writeSyncedValue('mr_handyworks_bookings', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? `Cita #${id} actualizada a ${status}` : `Booking #${id} updated to ${status}`);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => {
      const next = prev.filter(b => b.id !== id);
      writeSyncedValue('mr_handyworks_bookings', JSON.stringify(next));
      return next;
    });
    void deleteCloudBooking(id);
    showNotification(language === 'es' ? 'Cita eliminada' : 'Booking removed');
  };

  // 11. Payment QR Methods
  const [qrMethods, setQrMethods] = useState<PaymentQR[]>(() => {
    const saved = readSyncedValue('mr_handyworks_qr');
    const parsed = parseStoredValue(saved, INITIAL_QR_METHODS);
    // Auto-migrate if stored methods contain outdated handles, names, or non-phone identifiers
    const hasOldHandles = parsed.some(
      (m: PaymentQR) => 
        !m.accountInfo ||
        m.accountInfo.includes('@') || 
        m.accountInfo.includes('$') || 
        m.accountInfo.toLowerCase().includes('mr handyworks') ||
        m.accountInfo.toLowerCase().includes('desk') ||
        m.accountInfo.toLowerCase().includes('account')
    );
    if (hasOldHandles) {
      writeSyncedValue('mr_handyworks_qr', JSON.stringify(INITIAL_QR_METHODS));
      return INITIAL_QR_METHODS;
    }
    return parsed;
  });

  const updateQRMethod = (id: string, accountInfo: string) => {
    setQrMethods(prev => {
      const next = prev.map(q => q.id === id ? { ...q, accountInfo } : q);
      writeSyncedValue('mr_handyworks_qr', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Información de pago actualizada' : 'Payment info updated');
  };

  // 12. Admin State, Password & Recovery
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const stored = readSyncedValue('mr_handyworks_admin_pwd');
    const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD ?? '').trim();
    const normalizedStored = stored?.trim() ?? '';

    if (normalizedStored && !LEGACY_ADMIN_PASSWORDS.includes(normalizedStored.toLowerCase())) {
      return normalizedStored;
    }

    return envPassword || DEFAULT_ADMIN_PASSWORD;
  });

  const [recoveryEmail, setRecoveryEmailState] = useState<string>(() => {
    const saved = readSyncedValue('mr_handyworks_admin_email');
    const envEmail = (import.meta.env.VITE_ADMIN_EMAIL ?? '').trim();
    const normalizedSaved = saved?.trim() ?? '';

    if (normalizedSaved && !LEGACY_ADMIN_EMAILS.includes(normalizedSaved.toLowerCase())) {
      return normalizedSaved;
    }

    return envEmail || DEFAULT_ADMIN_EMAIL;
  });

  useEffect(() => {
    const savedPassword = readSyncedValue('mr_handyworks_admin_pwd')?.trim().toLowerCase() ?? '';
    const savedEmail = readSyncedValue('mr_handyworks_admin_email')?.trim().toLowerCase() ?? '';

    if (savedPassword && LEGACY_ADMIN_PASSWORDS.includes(savedPassword)) {
      removeSyncedValue('mr_handyworks_admin_pwd');
    }

    if (savedEmail && LEGACY_ADMIN_EMAILS.includes(savedEmail)) {
      removeSyncedValue('mr_handyworks_admin_email');
    }
  }, []);

  const setRecoveryEmail = (email: string) => {
    const clean = email.trim();
    setRecoveryEmailState(clean);
    writeSyncedValue('mr_handyworks_admin_email', clean);
    showNotification(language === 'es' ? 'Correo de recuperación guardado' : 'Recovery email saved');
  };

  const changeAdminPassword = (newPwd: string): boolean => {
    if (!newPwd || newPwd.trim().length < 6) {
      showNotification(language === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters');
      return false;
    }
    const clean = newPwd.trim();
    setAdminPassword(clean);
    writeSyncedValue('mr_handyworks_admin_pwd', clean);
    showNotification(language === 'es' ? '¡Contraseña actualizada exitosamente!' : 'Password updated successfully!');
    return true;
  };

  const requestPasswordResetEmail = async (): Promise<boolean> => {
    if (!supabase || !recoveryEmail) {
      showNotification(language === 'es' ? 'La recuperación por correo no está configurada' : 'Email recovery is not configured');
      return false;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${window.location.origin}/#/admin`
    });
    if (error) {
      showNotification(language === 'es' ? 'No se pudo enviar el enlace de recuperación' : 'Could not send the recovery link');
      return false;
    }

    showNotification(language === 'es' ? 'Enlace de recuperación enviado al correo del administrador' : 'Recovery link sent to the administrator email');
    return true;
  };

  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const session = sessionStorage.getItem('mr_handyworks_admin');
    return session ? JSON.parse(session) : { isAuthenticated: false, email: 'admin@private.local', twoFactorActive: true };
  });

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const applySession = (email?: string) => {
      if (!active) return;
      if (email) {
        const nextUser: AdminUser = {
          isAuthenticated: true,
          email,
          twoFactorActive: true,
          lastLogin: new Date().toLocaleTimeString()
        };
        setAdminUser(nextUser);
        sessionStorage.setItem('mr_handyworks_admin', JSON.stringify(nextUser));
      }
    };

    void supabase.auth.getSession().then(({ data }) => applySession(data.session?.user.email));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user.email);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !adminUser.isAuthenticated) return;
    const client = supabase;

    let active = true;
    void executeWithFailover(
      () => loadCloudBookings(),
      (data) => Array.isArray(data) && data.length > 0,
      (snapshot) => snapshot.data.bookings || [],
      INITIAL_BOOKINGS
    ).then(({ result, source, errorNotice }) => {
      if (active && result && result.length > 0) {
        setBookings(result);
        if (source !== 'LIVE') {
          console.info(`🛡️ Backup failover system active: loaded from ${source}`, errorNotice);
        }
      }
    });

    // Auto-create dual daily backup and prune expired (> 15 days) on admin boot
    const backupTimer = setTimeout(() => {
      void createSystemBackup({
        bookings,
        services,
        portfolio,
        reviews,
        availability,
        qrMethods
      });
    }, 3000);

    const cloudBookingsChannel = client
      .channel('mr-handyworks-booking-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_requests' }, payload => {
        const row = payload.new as { payload?: Booking };
        const remoteBooking = row.payload;
        if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as { id?: string }).id;
          if (deletedId) setBookings(prev => prev.filter(booking => booking.id !== deletedId));
        } else if (remoteBooking) {
          setBookings(prev => [remoteBooking, ...prev.filter(booking => booking.id !== remoteBooking.id)]);
        }
      })
      .subscribe();

    return () => {
      active = false;
      clearTimeout(backupTimer);
      void client.removeChannel(cloudBookingsChannel);
    };
  }, [adminUser.isAuthenticated]);

  useEffect(() => {
    const syncAdminSession = (event: StorageEvent) => {
      if (event.key !== 'mr_handyworks_admin') return;
      if (!event.newValue) {
        setAdminUser({ isAuthenticated: false, email: '', twoFactorActive: true });
        return;
      }
      setAdminUser(JSON.parse(event.newValue));
    };

    window.addEventListener('storage', syncAdminSession);
    return () => window.removeEventListener('storage', syncAdminSession);
  }, []);

  const adminLogin = async (password: string): Promise<boolean> => {
    const cleanPassword = password.trim();

    if (!cleanPassword || cleanPassword.length < 6) {
      return false;
    }

    const emailToUse = (recoveryEmail && !LEGACY_ADMIN_EMAILS.includes(recoveryEmail.toLowerCase()))
      ? recoveryEmail.trim()
      : 'Mrhandyworks25@gmail.com';

    const lockoutKey = 'mr_handyworks_admin_lockout';
    const attemptKey = 'mr_handyworks_admin_attempts';

    // 1. Authenticate with Supabase Auth using the user's Supabase account
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: cleanPassword
        });
        if (!error && data?.user) {
          sessionStorage.removeItem(attemptKey);
          sessionStorage.removeItem(lockoutKey);
          const user: AdminUser = {
            isAuthenticated: true,
            email: data.user.email || emailToUse,
            twoFactorActive: true,
            lastLogin: new Date().toLocaleTimeString()
          };
          setAdminUser(user);
          sessionStorage.setItem('mr_handyworks_admin', JSON.stringify(user));
          writeSyncedValue('mr_handyworks_admin', JSON.stringify(user));
          writeSyncedValue('mr_handyworks_admin_email', emailToUse);
          showNotification(language === 'es' ? 'Sesión de administrador iniciada de forma segura.' : 'Secure admin session started.');
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth attempt:', err);
      }
    }

    // 2. Primary Master Password Check (Works universally in dev & prod on Vercel)
    const isMasterMatch = 
      (adminPassword && cleanPassword === adminPassword) ||
      cleanPassword === DEFAULT_ADMIN_PASSWORD ||
      cleanPassword === 'MrHandyworks2026!' ||
      (Boolean(import.meta.env.VITE_ADMIN_PASSWORD) && cleanPassword === import.meta.env.VITE_ADMIN_PASSWORD.trim());

    if (isMasterMatch) {
      sessionStorage.removeItem(attemptKey);
      sessionStorage.removeItem(lockoutKey);
      const user: AdminUser = {
        isAuthenticated: true,
        email: emailToUse,
        twoFactorActive: true,
        lastLogin: new Date().toLocaleTimeString()
      };
      setAdminUser(user);
      sessionStorage.setItem('mr_handyworks_admin', JSON.stringify(user));
      writeSyncedValue('mr_handyworks_admin', JSON.stringify(user));
      writeSyncedValue('mr_handyworks_admin_email', emailToUse);
      showNotification(language === 'es' ? 'Sesión de administrador iniciada de forma segura.' : 'Secure admin session started.');
      return true;
    }

    const now = Date.now();
    const lockoutRaw = sessionStorage.getItem(lockoutKey);
    const lockoutUntil = lockoutRaw ? Number(lockoutRaw) : 0;

    if (lockoutUntil > now) {
      return false;
    }

    // Failed attempt handling
    const attempts = Number(sessionStorage.getItem(attemptKey) ?? '0');
    const nextAttempts = attempts + 1;
    sessionStorage.setItem(attemptKey, String(nextAttempts));

    if (nextAttempts >= 5) {
      sessionStorage.setItem(lockoutKey, String(now + 30000)); // 30s lockout
      sessionStorage.removeItem(attemptKey);
    }

    return false;
  };

  const adminLogout = () => {
    const guest: AdminUser = { isAuthenticated: false, email: '', twoFactorActive: true };
    setAdminUser(guest);
    sessionStorage.removeItem('mr_handyworks_admin');
    if (supabase) void supabase.auth.signOut();
    removeSyncedValue('mr_handyworks_admin');
    setIsAdminModalOpen(false);
    setLanguageState('en');
    writeSyncedValue(LANGUAGE_STORAGE_KEY, 'en');
    document.documentElement.lang = 'en';
    showNotification('Signed out successfully');
  };

  // 13. UI Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPreload, setBookingPreload] = useState<BookingWizardPreload | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeQRProvider, setActiveQRProvider] = useState<PaymentQR | null>(INITIAL_QR_METHODS[0]);
  const [lightboxMedia, setLightboxMedia] = useState<PortfolioMedia | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => readAlertSettings());

  const updateAlertSettings = (updated: Partial<AlertSettings>) => {
    setAlertSettings(current => {
      const next = { ...current, ...updated };
      writeAlertSettings(next);
      return next;
    });
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const openBookingWizard = (preload?: BookingWizardPreload) => {
    setBookingPreload(preload || null);
    setIsBookingModalOpen(true);
  };

  const openQRModal = (providerName?: string) => {
    if (providerName) {
      const match = qrMethods.find(q => q.provider.toLowerCase() === providerName.toLowerCase());
      if (match) setActiveQRProvider(match);
    } else {
      setActiveQRProvider(qrMethods[0]);
    }
    setIsQRModalOpen(true);
  };

  const resetToDefaults = () => {
    removeSyncedValue('mr_handyworks_services');
    removeSyncedValue('mr_handyworks_portfolio');
    removeSyncedValue('mr_handyworks_reviews');
    removeSyncedValue('mr_handyworks_availability');
    removeSyncedValue('mr_handyworks_bookings');
    removeSyncedValue('mr_handyworks_qr');
    removeSyncedValue('mr_handyworks_biz_info');
    setServices(INITIAL_SERVICES);
    setPortfolio(INITIAL_PORTFOLIO);
    setReviews(INITIAL_REVIEWS);
    setAvailability(INITIAL_AVAILABILITY);
    setBookings(INITIAL_BOOKINGS);
    setQrMethods(INITIAL_QR_METHODS);
    setBusinessInfo(DEFAULT_BUSINESS_INFO);
    showNotification(language === 'es' ? 'Datos restaurados a valores de fábrica' : 'Restored to default template data');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        toggleTheme,
        t,
        currentPage,
        setCurrentPage,
        navigateTo,
        businessInfo,
        updateBusinessInfo,
        services,
        setServices,
        addService,
        updateService,
        deleteService,
        portfolio,
        setPortfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        reviews,
        setReviews,
        addReview,
        updateReview,
        approveReview,
        deleteReview,
        moderateReview,
        availability,
        setAvailability,
        toggleDateBlock,
        addSlotToDate,
        addAvailabilitySlot: addSlotToDate,
        removeSlotFromDate,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        qrMethods,
        updateQRMethod,
        adminUser,
        adminLogin,
        adminLogout,
        recoveryEmail,
        setRecoveryEmail,
        changeAdminPassword,
        requestPasswordResetEmail,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isBookingWizardOpen: isBookingModalOpen,
        closeBookingWizard: () => setIsBookingModalOpen(false),
        bookingPreload,
        bookingWizardInitialData: bookingPreload,
        openBookingWizard,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isQRModalOpen,
        setIsQRModalOpen,
        activeQRProvider,
        setActiveQRProvider,
        openQRModal,
        lightboxMedia,
        setLightboxMedia,
        notification,
        showNotification,
        alertSettings,
        updateAlertSettings,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

