export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export type ServiceCategory = 
  | 'REPAIRS'
  | 'INSTALLATION'
  | 'ASSEMBLY'
  | 'PAINTING'
  | 'TV_MOUNTING'
  | 'DOORS_WINDOWS'
  | 'WALLS'
  | 'CARPENTRY'
  | 'HOME_THEATER';

export interface Service {
  id: string;
  category: ServiceCategory;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  estimatedHours: string;
  rateEstimate: string;
  iconName: string;
  popular?: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress?: string;
  zipCode: string;
  serviceType: string;
  estimatedHours: string;
  estimatedPrice: number;
  projectDetails: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string; // e.g. "09:00 AM - 11:30 AM"
  photoUrl?: string;
  status: BookingStatus;
  paymentMethod: 'ZELLE' | 'PAYPAL' | 'VENMO' | 'CASHAPP' | 'CARD' | 'CASH';
  paymentStatus: 'UNPAID' | 'DEPOSIT_PAID' | 'PAID_IN_FULL';
  depositAmount?: number;
  createdAt: string;
  notes?: string;
}

export interface AvailabilityDay {
  date: string; // YYYY-MM-DD
  isBlocked: boolean;
  slots: string[]; // e.g. ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:30 PM"]
  note?: string;
}

export interface PortfolioMedia {
  id: string;
  titleEs: string;
  titleEn: string;
  type: 'IMAGE' | 'VIDEO' | 'BEFORE_AFTER';
  url: string;
  beforeUrl?: string;
  category: ServiceCategory;
  tags: string[];
  descriptionEs: string;
  descriptionEn: string;
  featured?: boolean;
  author?: string | null;
  date?: string | null;
}

export interface Review {
  id: string;
  authorName: string;
  location: string;
  rating: number; // 1-5
  date: string;
  commentEs: string;
  commentEn: string;
  tags: string[];
  isVerified: boolean;
  source: 'Thumbtack' | 'Direct' | 'HomeAdvisor';
  jobType: string;
  jobDetails?: string;
  featured?: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface PaymentQR {
  id: string;
  provider: 'Zelle' | 'PayPal' | 'Venmo' | 'CashApp';
  accountInfo: string;
  displayName: string;
  instructionsEs: string;
  instructionsEn: string;
  qrCodeUrl?: string;
  isActive: boolean;
}

export type NavigationPage = 
  | 'home' 
  | 'services' 
  | 'estimator' 
  | 'portfolio' 
  | 'reviews' 
  | 'schedule' 
  | 'credentials' 
  | 'admin';

export interface BusinessInfo {
  name: string;
  owner: string;
  phone: string;
  phoneRaw: string;
  email: string;
  location: string;
  cityState: string;
  serviceAreas: string[];
  weekdaysHours: string;
  saturdayHours: string;
  sundayHours: string;
  hoursDays: string;
  hoursTime: string;
  hoursSunday: string;
  paymentMethods: string[];
  thumbtackUrl: string;
  licenseNumber: string;
  insurancePolicy: string;
  insuranceCoverage: string;
  yearsExperience: number;
  bioEs: string;
  bioEn: string;
}

export interface AdminUser {
  isAuthenticated: boolean;
  email: string;
  twoFactorActive: boolean;
  lastLogin?: string;
}
