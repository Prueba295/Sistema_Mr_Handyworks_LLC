import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { 
  Service, 
  PortfolioMedia, 
  Review, 
  Booking, 
  BookingStatus,
  ServiceCategory
} from '../types';
import { 
  Lock, 
  LogOut, 
  Building2, 
  Wrench, 
  Image as ImageIcon, 
  Calendar, 
  Star, 
  QrCode, 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    language, 
    adminUser, 
    adminLogin, 
    adminLogout, 
    businessInfo, 
    updateBusinessInfo,
    services, 
    addService, 
    updateService, 
    deleteService,
    portfolio, 
    addPortfolioItem, 
    updatePortfolioItem, 
    deletePortfolioItem,
    reviews, 
    addReview, 
    updateReview, 
    deleteReview, 
    moderateReview,
    availability, 
    toggleDateBlock, 
    addSlotToDate, 
    removeSlotFromDate,
    bookings, 
    updateBookingStatus, 
    deleteBooking,
    qrMethods, 
    updateQRMethod,
    showNotification,
    resetToDefaults,
    navigateTo
  } = useApp();

  // Active sub-tab in Admin CMS
  const [activeTab, setActiveTab] = useState<
    'PROFILE' | 'SERVICES' | 'PORTFOLIO' | 'CALENDAR' | 'REVIEWS' | 'BOOKINGS' | 'PAYMENTS'
  >('PROFILE');

  // Password login form
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Business Info Form local state
  const [bizForm, setBizForm] = useState(businessInfo);

  // New Service Form State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    category: 'REPAIRS',
    titleEs: '',
    titleEn: '',
    descEs: '',
    descEn: '',
    estimatedHours: '1-3 hrs',
    rateEstimate: '$85 - $160',
    iconName: 'Wrench',
    popular: false
  });

  // Editing service state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<Partial<Service>>({});

  // New Portfolio Item Form State
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMedia, setNewMedia] = useState<Omit<PortfolioMedia, 'id'>>({
    titleEs: '',
    titleEn: '',
    type: 'IMAGE',
    url: '',
    beforeUrl: '',
    category: 'REPAIRS',
    tags: ['Handyman', 'Quality'],
    descriptionEs: '',
    descriptionEn: '',
    featured: true
  });

  // New Review Form State
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    authorName: '',
    location: 'South Bend, IN',
    rating: 5,
    commentEs: '',
    commentEn: '',
    jobType: 'Home Repairs',
    tags: 'Quality, Punctual, Professional'
  });

  // Calendar slot picker state
  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  const [customSlot, setCustomSlot] = useState('09:00 AM - 11:30 AM');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await adminLogin(passwordInput);
    if (ok) {
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError(language === 'es' ? 'Contraseña incorrecta. (Prueba: brian2026)' : 'Incorrect password. (Try: brian2026)');
    }
  };

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo(bizForm);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.titleEn && !newService.titleEs) {
      showNotification(language === 'es' ? 'Por favor ingrese un título' : 'Please enter a title');
      return;
    }
    addService({
      ...newService,
      titleEn: newService.titleEn || newService.titleEs,
      titleEs: newService.titleEs || newService.titleEn,
      descEn: newService.descEn || newService.descEs,
      descEs: newService.descEs || newService.descEn
    });
    setIsAddingService(false);
    setNewService({
      category: 'REPAIRS',
      titleEs: '',
      titleEn: '',
      descEs: '',
      descEn: '',
      estimatedHours: '1-3 hrs',
      rateEstimate: '$85 - $160',
      iconName: 'Wrench',
      popular: false
    });
  };

  const handleSaveEditService = (id: string) => {
    updateService(id, editServiceForm);
    setEditingServiceId(null);
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.url) {
      showNotification(language === 'es' ? 'Ingrese una URL de imagen' : 'Please enter an image URL');
      return;
    }
    addPortfolioItem({
      ...newMedia,
      titleEn: newMedia.titleEn || newMedia.titleEs,
      titleEs: newMedia.titleEs || newMedia.titleEn
    });
    setIsAddingMedia(false);
    setNewMedia({
      titleEs: '',
      titleEn: '',
      type: 'IMAGE',
      url: '',
      beforeUrl: '',
      category: 'REPAIRS',
      tags: ['Handyman', 'Quality'],
      descriptionEs: '',
      descriptionEn: '',
      featured: true
    });
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.authorName || !newReviewForm.commentEn) {
      showNotification(language === 'es' ? 'Complete nombre y comentario' : 'Please complete name and comment');
      return;
    }
    addReview({
      authorName: newReviewForm.authorName,
      location: newReviewForm.location,
      rating: Number(newReviewForm.rating),
      commentEs: newReviewForm.commentEs || newReviewForm.commentEn,
      commentEn: newReviewForm.commentEn,
      tags: newReviewForm.tags.split(',').map(t => t.trim()),
      jobType: newReviewForm.jobType,
      featured: true
    });
    setIsAddingReview(false);
    setNewReviewForm({
      authorName: '',
      location: 'South Bend, IN',
      rating: 5,
      commentEs: '',
      commentEn: '',
      jobType: 'Home Repairs',
      tags: 'Quality, Punctual, Professional'
    });
  };

  const currentDayAvailability = availability.find(d => d.date === selectedDate) || {
    date: selectedDate,
    isBlocked: false,
    slots: ['09:00 AM - 11:30 AM', '01:30 PM - 03:30 PM', '04:00 PM - 06:30 PM']
  };

  // IF NOT AUTHENTICATED: Show professional login screen
  if (!adminUser.isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-[#1A2332] rounded-3xl p-8 border border-slate-200 dark:border-slate-700/80 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0B3C5D]/10 dark:bg-blue-500/20 text-[#0B3C5D] dark:text-blue-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'es' ? 'Panel de Administración' : 'Admin CMS Portal'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mr Handyworks LLC • Brian Cueva
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'es' ? 'Contraseña de Acceso:' : 'Admin Password:'}
              </label>
              <input 
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="brian2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {language === 'es' ? 'Clave de demostración: brian2026' : 'Demo key: brian2026'}
              </span>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs font-bold text-slate-500 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors"
            >
              ← {language === 'es' ? 'Volver al Sitio Principal' : 'Back to Main Site'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN CMS PORTAL
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B3C5D] text-white flex items-center justify-center font-black text-xl shadow-md">
            BC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Centro de Control y Edición' : 'Admin Management Hub'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                {language === 'es' ? 'Activo' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Mr Handyworks LLC • Brian Cueva ({adminUser.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Ver Sitio Web' : 'View Public Site'}</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-amber-300 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors cursor-pointer"
            title="Restaurar datos iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Restaurar Predeterminados' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={adminLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-700/80">
        {[
          { id: 'PROFILE', labelEs: 'Datos del Negocio', labelEn: 'Business Info', icon: Building2 },
          { id: 'SERVICES', labelEs: `Servicios (${services.length})`, labelEn: `Services (${services.length})`, icon: Wrench },
          { id: 'PORTFOLIO', labelEs: `Fotos y Vídeos (${portfolio.length})`, labelEn: `Media & Projects (${portfolio.length})`, icon: ImageIcon },
          { id: 'CALENDAR', labelEs: 'Calendario & Horarios', labelEn: 'Calendar & Slots', icon: Calendar },
          { id: 'REVIEWS', labelEs: `Reseñas (${reviews.length})`, labelEn: `Reviews (${reviews.length})`, icon: Star },
          { id: 'BOOKINGS', labelEs: `Solicitudes (${bookings.length})`, labelEn: `Work Orders (${bookings.length})`, icon: ClipboardList },
          { id: 'PAYMENTS', labelEs: 'Métodos de Pago & QR', labelEn: 'Payment & QR Links', icon: QrCode },
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B3C5D] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1A2332] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0B3C5D]'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUSINESS PROFILE & EDITING */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'es' ? 'Editar Información General y Enlaces' : 'Edit Business Information & Links'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'es' 
                ? 'Todos los cambios se guardan instantáneamente y se reflejan en todo el sitio web.' 
                : 'All changes are saved instantly and reflected live across the entire website.'}
            </p>
          </div>

          <form onSubmit={handleSaveBusinessInfo} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Nombre de la Empresa:' : 'Company Name:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.name}
                  onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Propietario / Artesano:' : 'Owner / Craftsman:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.owner}
                  onChange={(e) => setBizForm({ ...bizForm, owner: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Teléfono de Contacto:' : 'Phone Number:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.phone}
                  onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Correo Electrónico:' : 'Email Address:'}
                </label>
                <input 
                  type="email"
                  value={bizForm.email}
                  onChange={(e) => setBizForm({ ...bizForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Ubicación Central:' : 'Location Base:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.location}
                  onChange={(e) => setBizForm({ ...bizForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Póliza de Seguro:' : 'Insurance Coverage:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.insuranceCoverage}
                  onChange={(e) => setBizForm({ ...bizForm, insuranceCoverage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Número de Licencia:' : 'License Number:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.licenseNumber}
                  onChange={(e) => setBizForm({ ...bizForm, licenseNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Enlace Perfil Thumbtack:' : 'Thumbtack Profile URL:'}
                </label>
                <input 
                  type="url"
                  value={bizForm.thumbtackUrl}
                  onChange={(e) => setBizForm({ ...bizForm, thumbtackUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Horario Lunes a Viernes:' : 'Weekdays Hours:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.weekdaysHours}
                  onChange={(e) => setBizForm({ ...bizForm, weekdaysHours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Horario Sábados:' : 'Saturday Hours:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.saturdayHours}
                  onChange={(e) => setBizForm({ ...bizForm, saturdayHours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Horario Domingos:' : 'Sunday Hours:'}
                </label>
                <input 
                  type="text"
                  value={bizForm.sundayHours}
                  onChange={(e) => setBizForm({ ...bizForm, sundayHours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Biografías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Biografía de Brian Cueva (Español):' : 'Brian Cueva Bio (Spanish):'}
                </label>
                <textarea 
                  rows={4}
                  value={bizForm.bioEs}
                  onChange={(e) => setBizForm({ ...bizForm, bioEs: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Biografía de Brian Cueva (Inglés):' : 'Brian Cueva Bio (English):'}
                </label>
                <textarea 
                  rows={4}
                  value={bizForm.bioEn}
                  onChange={(e) => setBizForm({ ...bizForm, bioEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700/80">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-blue-200" />
                <span>{language === 'es' ? 'Guardar Cambios' : 'Save Business Information'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SERVICES MANAGEMENT */}
      {activeTab === 'SERVICES' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Catálogo de Servicios' : 'Services Management'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' ? 'Agrega, edita precios, tiempos o elimina servicios en vivo.' : 'Add, edit rates, hours or remove services in real-time.'}
              </p>
            </div>

            <button
              onClick={() => setIsAddingService(!isAddingService)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'es' ? 'Añadir Nuevo Servicio' : 'Add New Service'}</span>
            </button>
          </div>

          {/* Add Service Collapsible Form */}
          {isAddingService && (
            <form onSubmit={handleCreateService} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-blue-500/30 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3C5D] dark:text-blue-400">
                {language === 'es' ? 'Nuevo Servicio' : 'New Service'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Título (Inglés):' : 'Title (English):'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={newService.titleEn}
                    onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                    placeholder="e.g. Ceiling Fan Installation"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Título (Español):' : 'Title (Spanish):'}
                  </label>
                  <input 
                    type="text"
                    value={newService.titleEs}
                    onChange={(e) => setNewService({ ...newService, titleEs: e.target.value })}
                    placeholder="ej. Instalación de Ventilador de Techo"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Categoría:' : 'Category:'}
                  </label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value as ServiceCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="REPAIRS">REPAIRS</option>
                    <option value="INSTALLATION">INSTALLATION</option>
                    <option value="TV_MOUNTING">TV_MOUNTING</option>
                    <option value="PAINTING">PAINTING</option>
                    <option value="ASSEMBLY">ASSEMBLY</option>
                    <option value="DOORS_WINDOWS">DOORS_WINDOWS</option>
                    <option value="WALLS">WALLS</option>
                    <option value="HOME_THEATER">HOME_THEATER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Tarifa Estimada:' : 'Rate Estimate:'}
                  </label>
                  <input 
                    type="text"
                    value={newService.rateEstimate}
                    onChange={(e) => setNewService({ ...newService, rateEstimate: e.target.value })}
                    placeholder="e.g. $95 - $180"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Horas Estimadas:' : 'Estimated Hours:'}
                  </label>
                  <input 
                    type="text"
                    value={newService.estimatedHours}
                    onChange={(e) => setNewService({ ...newService, estimatedHours: e.target.value })}
                    placeholder="e.g. 1-2 hrs"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox"
                    id="popular-check"
                    checked={newService.popular}
                    onChange={(e) => setNewService({ ...newService, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0B3C5D]"
                  />
                  <label htmlFor="popular-check" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'es' ? 'Marcar como Popular / Destacado' : 'Mark as Popular / Featured'}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Descripción (Inglés):' : 'Description (English):'}
                  </label>
                  <textarea 
                    rows={2}
                    value={newService.descEn}
                    onChange={(e) => setNewService({ ...newService, descEn: e.target.value })}
                    placeholder="Detailed explanation of work..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Descripción (Español):' : 'Description (Spanish):'}
                  </label>
                  <textarea 
                    rows={2}
                    value={newService.descEs}
                    onChange={(e) => setNewService({ ...newService, descEs: e.target.value })}
                    placeholder="Explicación detallada del trabajo..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B3C5D] text-white font-bold text-xs"
                >
                  {language === 'es' ? 'Guardar Servicio' : 'Save Service'}
                </button>
              </div>
            </form>
          )}

          {/* Existing Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(srv => {
              const isEditing = editingServiceId === srv.id;
              return (
                <div 
                  key={srv.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        defaultValue={srv.titleEn}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, titleEn: e.target.value })}
                        className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-900"
                        placeholder="Title EN"
                      />
                      <input 
                        type="text"
                        defaultValue={srv.rateEstimate}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, rateEstimate: e.target.value })}
                        className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-900"
                        placeholder="Rate (e.g. $95 - $160)"
                      />
                      <input 
                        type="text"
                        defaultValue={srv.estimatedHours}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, estimatedHours: e.target.value })}
                        className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-900"
                        placeholder="Hours (e.g. 1-2 hrs)"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEditService(srv.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                        >
                          {language === 'es' ? 'Guardar' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingServiceId(null)}
                          className="px-3 py-1 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs"
                        >
                          {language === 'es' ? 'Cancelar' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300">
                            {srv.category}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                            {language === 'es' ? srv.titleEs : srv.titleEn}
                          </h4>
                        </div>
                        {srv.popular && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-600 font-black px-2 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {language === 'es' ? srv.descEs : srv.descEn}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-[#0B3C5D] dark:text-blue-400 font-bold">{srv.rateEstimate}</span>
                        <span className="text-slate-400">{srv.estimatedHours}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                    <button
                      onClick={() => {
                        setEditingServiceId(srv.id);
                        setEditServiceForm(srv);
                      }}
                      className="p-1.5 text-slate-500 hover:text-[#0B3C5D] dark:hover:text-blue-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Editar servicio"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteService(srv.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PORTFOLIO, PHOTOS & VIDEOS */}
      {activeTab === 'PORTFOLIO' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Gestión de Fotos, Vídeos y Trabajos Realizados' : 'Portfolio Media & Projects'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' ? 'Sube fotos de proyectos, enlaces de video y comparativas de Antes / Después.' : 'Upload project pictures, video links and Before / After comparisons.'}
              </p>
            </div>

            <button
              onClick={() => setIsAddingMedia(!isAddingMedia)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'es' ? 'Añadir Foto o Video' : 'Add Photo or Video'}</span>
            </button>
          </div>

          {/* Add Media Form */}
          {isAddingMedia && (
            <form onSubmit={handleCreateMedia} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-blue-500/30 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3C5D] dark:text-blue-400">
                {language === 'es' ? 'Nuevo Proyecto / Foto' : 'New Project Media'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Tipo de Medio:' : 'Media Type:'}
                  </label>
                  <select
                    value={newMedia.type}
                    onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="IMAGE">Foto Estándar (Image)</option>
                    <option value="BEFORE_AFTER">Antes y Después (Before / After)</option>
                    <option value="VIDEO">Vídeo (Video)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Título (Inglés):' : 'Title (English):'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={newMedia.titleEn}
                    onChange={(e) => setNewMedia({ ...newMedia, titleEn: e.target.value })}
                    placeholder="e.g. Master Bedroom TV Mount"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'URL de Imagen Principal:' : 'Main Image URL:'}
                  </label>
                  <input 
                    type="url"
                    required
                    value={newMedia.url}
                    onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {newMedia.type === 'BEFORE_AFTER' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'es' ? 'URL de Imagen "Antes" (Before):' : '"Before" Image URL:'}
                    </label>
                    <input 
                      type="url"
                      value={newMedia.beforeUrl}
                      onChange={(e) => setNewMedia({ ...newMedia, beforeUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMedia(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B3C5D] text-white font-bold text-xs"
                >
                  {language === 'es' ? 'Publicar Proyecto' : 'Publish Project'}
                </button>
              </div>
            </form>
          )}

          {/* Media Items Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map(item => (
              <div 
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
              >
                <div className="aspect-4/3 w-full overflow-hidden bg-slate-200 dark:bg-slate-900">
                  <img 
                    src={item.url} 
                    alt={item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                    {item.type}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                    {language === 'es' ? item.titleEs : item.titleEn}
                  </h5>
                </div>

                <button
                  onClick={() => deletePortfolioItem(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CALENDAR & AVAILABILITY */}
      {activeTab === 'CALENDAR' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'es' ? 'Gestión de Calendario y Disponibilidad en Vivo' : 'Live Calendar & Availability Slots'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'es' ? 'Bloquea días libres, agrega turnos de trabajo o modifica horarios disponibles.' : 'Block days off, add custom job slots or modify schedule availability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Day Selector */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'es' ? 'Seleccionar Fecha para Editar:' : 'Select Date to Manage:'}
              </label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
              />

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'es' ? 'Estado del Día:' : 'Day Status:'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                    currentDayAvailability.isBlocked 
                      ? 'bg-rose-500/10 text-rose-600' 
                      : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {currentDayAvailability.isBlocked ? 'BLOQUEADO / NO DISPONIBLE' : 'ABIERTO / DISPONIBLE'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleDateBlock(selectedDate)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  {currentDayAvailability.isBlocked 
                    ? (language === 'es' ? 'Desbloquear y Habilitar Día' : 'Unblock & Enable Date')
                    : (language === 'es' ? 'Bloquear Día Completo' : 'Block Entire Date')}
                </button>
              </div>
            </div>

            {/* Slots for this day */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'es' ? `Horarios Disponibles para el ${selectedDate}:` : `Available Slots for ${selectedDate}:`}
                </h4>
                <span className="text-xs text-slate-500">
                  {currentDayAvailability.slots.length} {language === 'es' ? 'turnos activos' : 'active slots'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentDayAvailability.slots.length > 0 ? (
                  currentDayAvailability.slots.map(slot => (
                    <div 
                      key={slot}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#0B3C5D] dark:text-blue-400" />
                      <span>{slot}</span>
                      <button
                        onClick={() => removeSlotFromDate(selectedDate, slot)}
                        className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                        title="Remover horario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold w-full">
                    {language === 'es' ? 'No hay turnos disponibles para esta fecha.' : 'No slots scheduled for this date.'}
                  </div>
                )}
              </div>

              {/* Add Custom Slot */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-2">
                <input 
                  type="text"
                  value={customSlot}
                  onChange={(e) => setCustomSlot(e.target.value)}
                  placeholder="e.g. 02:00 PM - 04:30 PM"
                  className="flex-1 w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customSlot.trim()) {
                      addSlotToDate(selectedDate, customSlot.trim());
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0B3C5D] text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  <span>{language === 'es' ? 'Agregar Horario' : 'Add Slot'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS MODERATION & CREATION */}
      {activeTab === 'REVIEWS' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Reseñas de Clientes (79 Verificadas)' : 'Client Reviews Hub (79 Verified)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' ? 'Publica nuevas reseñas de clientes, modera o elimina comentarios.' : 'Publish new client reviews, moderate or remove feedback.'}
              </p>
            </div>

            <button
              onClick={() => setIsAddingReview(!isAddingReview)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'es' ? 'Añadir Nueva Reseña' : 'Add New Review'}</span>
            </button>
          </div>

          {/* Add Review Form */}
          {isAddingReview && (
            <form onSubmit={handleCreateReview} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-blue-500/30 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3C5D] dark:text-blue-400">
                {language === 'es' ? 'Crear Reseña de Cliente' : 'Create Client Review'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Nombre del Cliente:' : 'Client Name:'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={newReviewForm.authorName}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, authorName: e.target.value })}
                    placeholder="e.g. Jessica Miller"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Ubicación:' : 'Location:'}
                  </label>
                  <input 
                    type="text"
                    value={newReviewForm.location}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, location: e.target.value })}
                    placeholder="Granger, IN"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'es' ? 'Calificación (1 - 5):' : 'Rating (1 - 5):'}
                  </label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="5">5 Estrellas (Exceptional)</option>
                    <option value="4">4 Estrellas (Great)</option>
                    <option value="3">3 Estrellas (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'es' ? 'Comentario del Cliente (Inglés):' : 'Client Testimonial (English):'}
                </label>
                <textarea 
                  rows={3}
                  required
                  value={newReviewForm.commentEn}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, commentEn: e.target.value })}
                  placeholder="Brian did an outstanding job mounting our 75-inch OLED..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingReview(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B3C5D] text-white font-bold text-xs"
                >
                  {language === 'es' ? 'Guardar Reseña' : 'Publish Review'}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.map(rev => (
              <div 
                key={rev.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {rev.authorName}
                    </span>
                    <span className="text-xs text-slate-400">({rev.location})</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "{language === 'es' ? rev.commentEs : rev.commentEn}"
                  </p>
                  <span className="text-[10px] text-slate-400 block">{rev.date} • {rev.jobType}</span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar reseña"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INBOUND BOOKINGS & WORK ORDERS */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'es' ? 'Solicitudes de Trabajo y Cotizaciones' : 'Work Orders & Inbound Bookings'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'es' ? 'Revisa detalles de clientes, actualiza estado del proyecto o descarga cotizaciones en PDF.' : 'Review customer job details, update status, or download formal PDF quotes.'}
            </p>
          </div>

          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.map(b => (
                <div 
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0B3C5D] dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        #{b.id}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {b.clientName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600' :
                        b.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600' :
                        b.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-600' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>{b.serviceType}</strong> • {b.scheduledDate} ({b.scheduledTimeSlot}) • ZIP: {b.zipCode}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {b.clientPhone} • {b.clientEmail}
                    </p>

                    {b.projectDetails && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        "{b.projectDetails}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => generateQuotePDF(b, language)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B3C5D] text-white text-xs font-bold hover:bg-[#07273D] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <select
                      value={b.status}
                      onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Eliminar cita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-xs text-slate-500">
                {language === 'es' ? 'No hay solicitudes de trabajo registradas.' : 'No active work orders.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: PAYMENT METHODS & QR */}
      {activeTab === 'PAYMENTS' && (
        <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'es' ? 'Métodos de Pago y Códigos QR' : 'Payment Methods & QR Accounts'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'es' ? 'Actualiza tu Zelle, Venmo, Cash App o PayPal para recibir anticipos y pagos.' : 'Update your Zelle, Venmo, Cash App or PayPal to receive deposits and payments.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {qrMethods.map(qr => (
              <div 
                key={qr.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {qr.provider}
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                    {qr.displayName}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'es' ? 'Cuenta / Identificador:' : 'Account ID / Tag:'}
                  </label>
                  <input 
                    type="text"
                    defaultValue={qr.accountInfo}
                    onBlur={(e) => updateQRMethod(qr.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
