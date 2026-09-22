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
  paymentMethods: ['Zelle', 'Apple Pay', 'Venmo', 'PayPal', 'Cash', 'Cards'],
  thumbtackUrl: BUSINESS_INFO.thumbtackUrl,
  licenseNumber: 'BL-IN-2024-8849',
  insurancePolicy: 'Next Insurance #NX-IN-99421',
  insuranceCoverage: '$1,000,000 Next Insurance Liability',
  yearsExperience: 8,
  bioEs: 'Brian Cueva es el fundador y maestro artesano detrás de Mr Handyworks LLC en South Bend, IN. Con más de 8 años de experiencia directa y una calificación perfecta de 5.0 en Thumbtack (Top Pro), Brian se especializa en montaje de TV, instalaciones residenciales, pintura, plomería menor y reparaciones generales con garantía de satisfacción del 100%.',
  bioEn: 'Brian Cueva is the owner and master craftsman behind Mr Handyworks LLC in South Bend, IN. With over 8 years of hands-on experience and a 5.0 perfect rating on Thumbtack (Top Pro), Brian specializes in precision TV mounting, home repairs, painting, fixture installations, and custom handyman solutions with a 100% satisfaction guarantee.'
};

const parseStoredValue = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

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
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;

  qrMethods: PaymentQR[];
  updateQRMethod: (id: string, accountInfo: string) => void;

  adminUser: AdminUser;
  adminLogin: (password: string, code2fa?: string) => Promise<boolean>;
  adminLogout: () => void;

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
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = readSyncedValue('mr_handyworks_lang');
    if (saved === 'es' || saved === 'en') return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('es') ? 'es' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeSyncedValue('mr_handyworks_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const nextLang = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
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
        case 'mr_handyworks_lang': {
          const next = event.value;
          if (next === 'es' || next === 'en') {
            setLanguageState(next);
            document.documentElement.lang = next;
          }
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
            setPortfolio(JSON.parse(event.value));
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
            setAvailability(JSON.parse(event.value));
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
    return parseStoredValue(saved, INITIAL_PORTFOLIO);
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
    return parseStoredValue(saved, INITIAL_AVAILABILITY);
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

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const id = `HW-${Math.floor(1000 + Math.random() * 9000)}`;
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
      const next = prev.map(b => b.id === id ? { ...b, status } : b);
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
    showNotification(language === 'es' ? 'Cita eliminada' : 'Booking removed');
  };

  // 11. Payment QR Methods
  const [qrMethods, setQrMethods] = useState<PaymentQR[]>(() => {
    const saved = readSyncedValue('mr_handyworks_qr');
    return parseStoredValue(saved, INITIAL_QR_METHODS);
  });

  const updateQRMethod = (id: string, accountInfo: string) => {
    setQrMethods(prev => {
      const next = prev.map(q => q.id === id ? { ...q, accountInfo } : q);
      writeSyncedValue('mr_handyworks_qr', JSON.stringify(next));
      return next;
    });
    showNotification(language === 'es' ? 'Información de pago actualizada' : 'Payment info updated');
  };

  // 12. Admin State
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const session = sessionStorage.getItem('mr_handyworks_admin');
    return session ? JSON.parse(session) : { isAuthenticated: false, email: 'brian@mrhandyworks.com', twoFactorActive: true };
  });

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
    const lockoutKey = 'mr_handyworks_admin_lockout';
    const attemptKey = 'mr_handyworks_admin_attempts';

    const now = Date.now();
    const lockoutRaw = sessionStorage.getItem(lockoutKey);
    const lockoutUntil = lockoutRaw ? Number(lockoutRaw) : 0;

    if (lockoutUntil > now) {
      return false;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return false;
    }

    const attempts = Number(sessionStorage.getItem(attemptKey) ?? '0');

    if (cleanPassword === 'brian2026') {
      sessionStorage.removeItem(attemptKey);
      sessionStorage.removeItem(lockoutKey);
      const user: AdminUser = {
        isAuthenticated: true,
        email: 'brian@mrhandyworks.com',
        twoFactorActive: true,
        lastLogin: new Date().toLocaleTimeString()
      };
      setAdminUser(user);
      sessionStorage.setItem('mr_handyworks_admin', JSON.stringify(user));
      writeSyncedValue('mr_handyworks_admin', JSON.stringify(user));
      showNotification(language === 'es' ? 'Bienvenido Brian Cueva (Sesión Segura)' : 'Welcome Brian Cueva (Secure Session)');
      return true;
    }

    const nextAttempts = attempts + 1;
    sessionStorage.setItem(attemptKey, String(nextAttempts));

    if (nextAttempts >= 5) {
      sessionStorage.setItem(lockoutKey, String(now + 60000));
      sessionStorage.removeItem(attemptKey);
    }

    return false;
  };

  const adminLogout = () => {
    const guest: AdminUser = { isAuthenticated: false, email: '', twoFactorActive: true };
    setAdminUser(guest);
    sessionStorage.removeItem('mr_handyworks_admin');
    removeSyncedValue('mr_handyworks_admin');
    setIsAdminModalOpen(false);
    showNotification(language === 'es' ? 'Sesión cerrada correctamente' : 'Signed out successfully');
  };

  // 13. UI Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPreload, setBookingPreload] = useState<BookingWizardPreload | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeQRProvider, setActiveQRProvider] = useState<PaymentQR | null>(INITIAL_QR_METHODS[0]);
  const [lightboxMedia, setLightboxMedia] = useState<PortfolioMedia | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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

