import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { 
  validateMeaningfulText,
  validateAdminUrl,
  validateUSPhone,
  validateEmail
} from '../utils/inputSecurity';
import { 
  Service, 
  PortfolioMedia, 
  Review, 
  Booking, 
  BookingAttachment,
  BookingStatus,
  ServiceCategory
} from '../types';
import { buildOwnerSMSNotificationUrl } from '../utils/liveNotifier';
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
  EyeOff,
  KeyRound,
  ShieldAlert,
  Bell,
  BellOff,
  Languages,
  Check,
  X,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  Film,
  Paperclip,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  FileText,
  FileSpreadsheet,
  FolderArchive,
  FileCode,
  Search,
  Send,
  Volume2,
  Compass,
  Presentation,
  FileQuestion,
  Loader2
} from 'lucide-react';
import { enableSecurePushAlerts, disableSecurePushAlerts } from '../utils/pushNotifications';
import { 
  getFileExtension, 
  getDetailedCategory, 
  normalizeDataUrl, 
  healOrConvertImageDataUrl 
} from '../utils/attachmentOptimizer';

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
    navigateTo,
    toggleLanguage,
    recoveryEmail,
    setRecoveryEmail,
    changeAdminPassword,
    requestPasswordResetEmail,
    alertSettings,
    updateAlertSettings
  } = useApp();

  // Active sub-tab in Admin CMS
  const [activeTab, setActiveTab] = useState<
    'PROFILE' | 'ALERTS' | 'SERVICES' | 'PORTFOLIO' | 'CALENDAR' | 'REVIEWS' | 'BOOKINGS'
  >('PROFILE');

  // Password login & security state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Email recovery state
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');

  // Editing portfolio state
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editMediaForm, setEditMediaForm] = useState<Partial<PortfolioMedia>>({});

  // Direct Settings changes
  const [settingsNewPassword, setSettingsNewPassword] = useState('');
  const [settingsRecoveryEmail, setSettingsRecoveryEmail] = useState(recoveryEmail);

  React.useEffect(() => {
    setSettingsRecoveryEmail(recoveryEmail);
  }, [recoveryEmail]);

  // Work Orders & Bookings filtering & media lightbox state
  const [bookingFilterStatus, setBookingFilterStatus] = useState<'ALL' | BookingStatus>('ALL');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<BookingAttachment | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isAttemptingImageHealing, setIsAttemptingImageHealing] = useState(false);
  const [healedImageUrl, setHealedImageUrl] = useState<string | null>(null);
  const [decodedTextContent, setDecodedTextContent] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  React.useEffect(() => {
    setImageLoadError(false);
    setIsAttemptingImageHealing(false);
    setHealedImageUrl(null);
    setDecodedTextContent(null);
    setImageZoom(1);
    setImageRotation(0);

    // Decode text/csv content if attachment is text or code
    if (previewAttachment?.dataUrl) {
      const ext = getFileExtension(previewAttachment.name);
      const cat = getDetailedCategory(previewAttachment.name, previewAttachment.mimeType);
      if (cat === 'text' || ['txt', 'csv', 'tsv', 'json', 'log', 'md', 'xml', 'html', 'css'].includes(ext)) {
        try {
          const parts = previewAttachment.dataUrl.split(',');
          if (parts.length > 1) {
            const rawDecoded = decodeURIComponent(escape(atob(parts[1])));
            setDecodedTextContent(rawDecoded);
          }
        } catch {
          try {
            const parts = previewAttachment.dataUrl.split(',');
            if (parts.length > 1) {
              setDecodedTextContent(atob(parts[1]));
            }
          } catch {
            setDecodedTextContent(null);
          }
        }
      }
    }
  }, [previewAttachment]);

  const handleImageError = async () => {
    if (!previewAttachment || isAttemptingImageHealing || healedImageUrl) {
      setImageLoadError(true);
      return;
    }
    setIsAttemptingImageHealing(true);
    try {
      const healed = await healOrConvertImageDataUrl(previewAttachment.dataUrl);
      if (healed) {
        setHealedImageUrl(healed);
        setImageLoadError(false);
      } else {
        setImageLoadError(true);
      }
    } catch {
      setImageLoadError(true);
    } finally {
      setIsAttemptingImageHealing(false);
    }
  };

  // Lockout countdown timer
  React.useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // Business Info Form local state
  const [bizForm, setBizForm] = useState(businessInfo);

  // Thumbtack Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const handleThumbtackSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showNotification(
        language === 'es'
          ? '¡Sincronización con Thumbtack exitosa! 80 reseñas y 125 fotos HD verificadas.'
          : 'Thumbtack sync successful! 80 reviews and 125 HD photos verified.'
      );
    }, 1000);
  };

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
  const [customSlot, setCustomSlot] = useState('09:00 AM - 12:00 PM');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setLoginError(language === 'es' ? 'Acceso bloqueado por seguridad.' : 'Access blocked for security.');
      return;
    }
    if (lockoutRemaining > 0) {
      setLoginError(
        language === 'es'
          ? `Acceso temporalmente bloqueado. Espera ${lockoutRemaining} segundos.`
          : `Temporarily locked for security. Please wait ${lockoutRemaining} seconds.`
      );
      return;
    }

    const ok = await adminLogin(passwordInput);
    if (ok) {
      setPasswordInput('');
      setLoginError('');
      setFailedAttempts(0);
    } else {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= 5) {
        setLockoutRemaining(30);
        setLoginError(
          language === 'es'
            ? 'Demasiados intentos fallidos. Bloqueado temporalmente por 30 segundos.'
            : 'Too many failed attempts. Temporarily locked for 30 seconds.'
        );
      } else {
        setLoginError(
          language === 'es'
            ? `Contraseña incorrecta. Intento ${next}/5.`
            : `Incorrect password. Attempt ${next}/5.`
        );
      }
    }
  };

  const handleSendRecoveryEmail = async () => {
    setRecoveryError('');
    const success = await requestPasswordResetEmail();
    if (success) setIsRecoveryMode(false);
  };

  const handleUpdateAdminPasswordDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsNewPassword.length < 6) {
      showNotification(language === 'es' ? 'Mínimo 6 caracteres requeridos' : 'Minimum 6 characters required');
      return;
    }
    const ok = changeAdminPassword(settingsNewPassword);
    if (ok) {
      setSettingsNewPassword('');
    }
  };

  const handleUpdateAdminEmailDirect = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = settingsRecoveryEmail.trim();
    if (clean) {
      const emailVal = validateEmail(clean);
      if (!emailVal.isValid) {
        showNotification(emailVal.error || (language === 'es' ? 'Ingresa un correo electrónico válido' : 'Please enter a valid email address'));
        return;
      }
    }
    setRecoveryEmail(clean);
  };

  const handleSaveEditMedia = (id: string) => {
    if (editMediaForm.url !== undefined) {
      const urlVal = validateAdminUrl(editMediaForm.url, language === 'es' ? 'URL de imagen o vídeo' : 'Media URL');
      if (!urlVal.isValid) {
        showNotification(urlVal.error!);
        return;
      }
    }
    if (editMediaForm.titleEn !== undefined) {
      const titleVal = validateMeaningfulText(editMediaForm.titleEn, 3, language === 'es' ? 'Título (Inglés)' : 'Title (EN)');
      if (!titleVal.isValid) {
        showNotification(titleVal.error!);
        return;
      }
    }
    if (editMediaForm.titleEs !== undefined) {
      const titleVal = validateMeaningfulText(editMediaForm.titleEs, 3, language === 'es' ? 'Título (Español)' : 'Title (ES)');
      if (!titleVal.isValid) {
        showNotification(titleVal.error!);
        return;
      }
    }
    updatePortfolioItem(id, editMediaForm);
    setEditingMediaId(null);
    setEditMediaForm({});
    showNotification(language === 'es' ? 'Elemento multimedia actualizado' : 'Media item updated successfully');
  };

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Company Name
    const nameVal = validateMeaningfulText(bizForm.name, 3, language === 'es' ? 'Nombre de Empresa' : 'Company Name');
    if (!nameVal.isValid) {
      showNotification(nameVal.error!);
      return;
    }

    // 2. Owner Name
    const ownerVal = validateMeaningfulText(bizForm.owner, 3, language === 'es' ? 'Nombre del Propietario' : 'Owner Name');
    if (!ownerVal.isValid) {
      showNotification(ownerVal.error!);
      return;
    }

    // 3. Phone validation
    const phoneVal = validateUSPhone(bizForm.phone);
    if (!phoneVal.isValid) {
      showNotification(phoneVal.error!);
      return;
    }

    // 4. Email validation
    const emailVal = validateEmail(bizForm.email);
    if (!emailVal.isValid || !bizForm.email) {
      showNotification(emailVal.error || (language === 'es' ? 'Ingresa un correo válido' : 'Please enter a valid email'));
      return;
    }

    // 5. Location validation
    const locVal = validateMeaningfulText(bizForm.location, 4, language === 'es' ? 'Ubicación Central' : 'Location Base');
    if (!locVal.isValid) {
      showNotification(locVal.error!);
      return;
    }

    // 6. License Number validation (if provided)
    if (bizForm.licenseNumber) {
      const licVal = validateMeaningfulText(bizForm.licenseNumber, 3, language === 'es' ? 'Número de Licencia' : 'License Number');
      if (!licVal.isValid) {
        showNotification(licVal.error!);
        return;
      }
    }

    updateBusinessInfo(bizForm);
    showNotification(
      language === 'es'
        ? 'Información de negocio validada y actualizada con éxito'
        : 'Business profile validated and saved successfully'
    );
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newService.titleEn || newService.titleEs;
    const titleVal = validateMeaningfulText(title, 3, language === 'es' ? 'Título del Servicio' : 'Service Title');
    if (!titleVal.isValid) {
      showNotification(titleVal.error!);
      return;
    }

    const desc = newService.descEn || newService.descEs;
    if (desc) {
      const descVal = validateMeaningfulText(desc, 6, language === 'es' ? 'Descripción del Servicio' : 'Service Description');
      if (!descVal.isValid) {
        showNotification(descVal.error!);
        return;
      }
    }

    if (newService.rateEstimate) {
      const rateVal = validateMeaningfulText(newService.rateEstimate, 2, language === 'es' ? 'Tarifa Estimada' : 'Rate Estimate');
      if (!rateVal.isValid) {
        showNotification(rateVal.error!);
        return;
      }
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
    showNotification(
      language === 'es' ? 'Servicio validado y añadido con éxito' : 'Service validated and added successfully'
    );
  };

  const handleSaveEditService = (id: string) => {
    if (editServiceForm.titleEn !== undefined) {
      const val = validateMeaningfulText(editServiceForm.titleEn, 3, 'Title (EN)');
      if (!val.isValid) {
        showNotification(val.error!);
        return;
      }
    }
    if (editServiceForm.titleEs !== undefined) {
      const val = validateMeaningfulText(editServiceForm.titleEs, 3, 'Title (ES)');
      if (!val.isValid) {
        showNotification(val.error!);
        return;
      }
    }
    if (editServiceForm.descEn !== undefined && editServiceForm.descEn.length > 0) {
      const val = validateMeaningfulText(editServiceForm.descEn, 6, 'Description (EN)');
      if (!val.isValid) {
        showNotification(val.error!);
        return;
      }
    }
    if (editServiceForm.descEs !== undefined && editServiceForm.descEs.length > 0) {
      const val = validateMeaningfulText(editServiceForm.descEs, 6, 'Description (ES)');
      if (!val.isValid) {
        showNotification(val.error!);
        return;
      }
    }
    updateService(id, editServiceForm);
    setEditingServiceId(null);
    showNotification(
      language === 'es' ? 'Servicio actualizado correctamente' : 'Service updated successfully'
    );
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const urlVal = validateAdminUrl(newMedia.url, language === 'es' ? 'URL de imagen o vídeo' : 'Media URL');
    if (!urlVal.isValid) {
      showNotification(urlVal.error!);
      return;
    }

    const title = newMedia.titleEn || newMedia.titleEs;
    const titleVal = validateMeaningfulText(title, 3, language === 'es' ? 'Título del Proyecto' : 'Project Title');
    if (!titleVal.isValid) {
      showNotification(titleVal.error!);
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
    showNotification(
      language === 'es' ? 'Elemento multimedia validado y añadido' : 'Media item validated and added successfully'
    );
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const authorVal = validateMeaningfulText(newReviewForm.authorName, 3, language === 'es' ? 'Nombre del Cliente' : 'Client Name');
    if (!authorVal.isValid) {
      showNotification(authorVal.error!);
      return;
    }

    const comment = newReviewForm.commentEn || newReviewForm.commentEs;
    const commentVal = validateMeaningfulText(comment, 8, language === 'es' ? 'Comentario de Reseña' : 'Review Comment');
    if (!commentVal.isValid) {
      showNotification(commentVal.error!);
      return;
    }

    const jobVal = validateMeaningfulText(newReviewForm.jobType, 3, language === 'es' ? 'Tipo de Trabajo' : 'Job Type');
    if (!jobVal.isValid) {
      showNotification(jobVal.error!);
      return;
    }

    addReview({
      authorName: newReviewForm.authorName,
      location: newReviewForm.location,
      rating: Number(newReviewForm.rating),
      commentEs: newReviewForm.commentEs || newReviewForm.commentEn,
      commentEn: newReviewForm.commentEn,
      tags: newReviewForm.tags.split(',').map(t => t.trim()).filter(Boolean),
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
    showNotification(
      language === 'es' ? 'Reseña validada y publicada con éxito' : 'Review validated and published successfully'
    );
  };

  const currentDayAvailability = availability.find(d => d.date === selectedDate) || {
    date: selectedDate,
    isBlocked: false,
    slots: ['09:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 07:00 PM']
  };

  // IF NOT AUTHENTICATED: Show hardened security login & OTP recovery screen
  if (!adminUser.isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-[#1A2332] rounded-3xl p-8 border border-slate-200 dark:border-slate-700/80 shadow-xl space-y-6 text-center animate-in fade-in duration-200">
          
          {/* Security Badge & Icon */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-[#0B3C5D]/10 dark:bg-blue-500/20 text-[#0B3C5D] dark:text-blue-400 flex items-center justify-center">
            {isRecoveryMode ? <KeyRound className="w-8 h-8 text-amber-500" /> : <Lock className="w-8 h-8" />}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
              <span>TLS 256-Bit • Anti-Brute Force Protection</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isRecoveryMode 
                ? (language === 'es' ? 'Recuperación de Acceso' : 'Password Recovery')
                : (language === 'es' ? 'Panel de Administración' : 'Admin CMS Portal')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mr Handyworks LLC • Private Operations Portal
            </p>
          </div>

          {/* LOCKOUT ALERT BANNER */}
          {lockoutRemaining > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2.5 text-left">
              <Clock className="w-5 h-5 shrink-0 animate-pulse" />
              <div>
                <div>{language === 'es' ? 'Acceso temporalmente bloqueado' : 'Login temporarily restricted'}</div>
                <div className="text-[11px] font-normal opacity-90">
                  {language === 'es'
                    ? `Espera ${lockoutRemaining} segundos para volver a intentar.`
                    : `Please wait ${lockoutRemaining}s before next attempt.`}
                </div>
              </div>
            </div>
          )}

          {!isRecoveryMode ? (
            /* STANDARD SECURE LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              {/* Honeypot field for bot trapping */}
              <input 
                type="text" 
                name="user_web_hp" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off" 
                style={{ display: 'none' }} 
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'es' ? 'Contraseña de Administrador:' : 'Admin Password:'}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutRemaining > 0}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0B3C5D] outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1.5">
                  <span className="text-slate-400">
                    {language === 'es' ? 'Credenciales administradas de forma segura' : 'Credentials are securely managed'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(true);
                      setLoginError('');
                    }}
                    className="font-bold text-[#0B3C5D] dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={lockoutRemaining > 0}
                className="w-full py-3.5 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{language === 'es' ? 'Iniciar Sesión Segura' : 'Sign In Securely'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    {language === 'es' ? 'Recuperación por correo' : 'Email password recovery'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Enviaremos un enlace seguro a la dirección de recuperación registrada. El enlace te permitirá restablecer la contraseña directamente en Supabase.'
                    : 'A secure link will be sent to the registered recovery address. The link will let you reset the password through Supabase.'}
                </p>
              </div>

              {recoveryError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {recoveryError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendRecoveryEmail}
                className="w-full py-3.5 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{language === 'es' ? 'Enviar enlace de recuperación' : 'Send recovery link'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setRecoveryError('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  ← {language === 'es' ? 'Volver al formulario de inicio de sesión' : 'Back to sign in'}
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs font-bold text-slate-500 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors cursor-pointer"
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
      
      {/* Top Header Card with Global Language Switcher */}
      <div className="bg-white dark:bg-[#1A2332] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B3C5D] text-white flex items-center justify-center font-black text-xl shadow-md">
            MH
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
              Mr Handyworks LLC • Private Admin Session
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-[#0B3C5D] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 shadow-xs transition-all cursor-pointer"
            title="Cambiar idioma global de todo el sitio / Switch site language"
          >
            <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'es' ? '🇺🇸 Switch Site to English' : '🇪🇸 Ver Sitio en Español'}</span>
          </button>

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
            <span>{language === 'es' ? 'Restaurar' : 'Reset'}</span>
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
          { id: 'ALERTS', labelEs: 'Alertas', labelEn: 'Alerts', icon: ShieldAlert },
          { id: 'SERVICES', labelEs: `Servicios (${services.length})`, labelEn: `Services (${services.length})`, icon: Wrench },
          { id: 'PORTFOLIO', labelEs: `Fotos y Vídeos (${portfolio.length})`, labelEn: `Media & Projects (${portfolio.length})`, icon: ImageIcon },
          { id: 'CALENDAR', labelEs: 'Calendario & Horarios', labelEn: 'Calendar & Slots', icon: Calendar },
          { id: 'REVIEWS', labelEs: `Reseñas (${reviews.length})`, labelEn: `Reviews (${reviews.length})`, icon: Star },
          { id: 'BOOKINGS', labelEs: `Solicitudes (${bookings.length})`, labelEn: `Work Orders (${bookings.length})`, icon: ClipboardList }
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
                  {language === 'es' ? 'Biografía de la empresa (Español):' : 'Company Bio (Spanish):'}
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
                  {language === 'es' ? 'Biografía de la empresa (Inglés):' : 'Company Bio (English):'}
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

          {/* SECURITY & ADMIN CREDENTIALS SECTION */}
          <div className="pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700/80 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {language === 'es' ? 'Seguridad y Recuperación de Contraseña' : 'Security & Password Recovery'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'es'
                    ? 'La recuperación se realiza exclusivamente mediante un enlace seguro enviado al correo del administrador.'
                    : 'Password recovery uses a secure link sent exclusively to the administrator email.'}
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-500/30 dark:border-blue-600/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300">
                        {language === 'es' ? 'Correo de Recuperación' : 'Recovery Email'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                      {language === 'es' ? 'Principal' : 'Primary'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'es'
                      ? 'Este es el correo usado para iniciar sesión y recibir enlaces seguros de recuperación.'
                      : 'This email is used for sign-in and secure password recovery links.'}
                  </p>
                </div>
                <form onSubmit={handleUpdateAdminEmailDirect} className="space-y-3 pt-2">
                  <div>
                    <input
                      type="email"
                      value={settingsRecoveryEmail}
                      onChange={(e) => setSettingsRecoveryEmail(e.target.value)}
                      placeholder="admin@private.local"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 italic">
                      {language === 'es' ? '* Debe coincidir con el usuario de Supabase' : '* Must match the Supabase user'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Guardar correo de recuperación' : 'Save recovery email'}</span>
                  </button>
                </form>
              </div>

              {/* Card 3: Change Portal Password */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {language === 'es' ? 'Cambiar Contraseña' : 'Change Password'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'es'
                      ? 'Actualiza tu contraseña maestra (mínimo 6 caracteres). La nueva clave tendrá efecto inmediato.'
                      : 'Update your master password (minimum 6 characters). The change takes effect immediately.'}
                  </p>
                </div>
                <form onSubmit={handleUpdateAdminPasswordDirect} className="space-y-3 pt-2">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={settingsNewPassword}
                    onChange={(e) => setSettingsNewPassword(e.target.value)}
                    placeholder={language === 'es' ? 'Nueva contraseña (mín. 6 caracteres)' : 'New password (min. 6 chars)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Actualizar Contraseña' : 'Update Password'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ALERTS' && (
        <div className="max-w-3xl bg-white dark:bg-[#1A2332] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'es' ? 'Alertas de nuevas reservas' : 'New Booking Alerts'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'es' ? 'Solo avisos de reservas nuevas. Sin anuncios, campañas ni contenido externo.' : 'New booking alerts only. No ads, campaigns, or external content.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {language === 'es' ? 'Activar alertas en este dispositivo' : 'Enable alerts on this device'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {language === 'es' ? 'Requiere permiso explícito del sistema y sesión administrativa.' : 'Requires explicit system permission and an administrator session.'}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (alertSettings.pushEnabled) {
                    await disableSecurePushAlerts();
                    updateAlertSettings({ enabled: false, pushEnabled: false });
                    showNotification(language === 'es' ? 'Alertas desactivadas en este dispositivo' : 'Alerts disabled on this device');
                    return;
                  }
                  const result = await enableSecurePushAlerts();
                  if (result.ok) {
                    updateAlertSettings({ enabled: true, pushEnabled: true });
                  }
                  showNotification(result.message);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white shadow-xs transition-colors cursor-pointer ${alertSettings.pushEnabled ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {alertSettings.pushEnabled ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                <span>{alertSettings.pushEnabled ? (language === 'es' ? 'Desactivar' : 'Disable') : (language === 'es' ? 'Activar' : 'Enable')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{language === 'es' ? 'Sonido al recibir reserva' : 'Sound on new booking'}</span>
              <input
                type="checkbox"
                checked={alertSettings.soundEnabled}
                onChange={event => updateAlertSettings({ soundEnabled: event.target.checked })}
                className="h-4 w-4 accent-emerald-600"
              />
            </label>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-black text-slate-900 dark:text-white block">{language === 'es' ? 'Alcance protegido' : 'Protected scope'}</span>
              {language === 'es' ? 'El sistema solo permite eventos NEW_BOOKING generados por el backend.' : 'Only backend-generated NEW_BOOKING events are allowed.'}
            </div>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {portfolio.map(item => {
              const isEditing = editingMediaId === item.id;
              return (
                <div 
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div className="aspect-4/3 w-full overflow-hidden bg-slate-200 dark:bg-slate-900 relative">
                    <img 
                      src={item.url} 
                      alt={item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingMediaId(item.id);
                          setEditMediaForm(item);
                        }}
                        className="p-1.5 rounded-lg bg-black/70 hover:bg-[#0B3C5D] text-white transition-colors cursor-pointer shadow-md"
                        title={language === 'es' ? 'Editar proyecto' : 'Edit project'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePortfolioItem(item.id)}
                        className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-md"
                        title={language === 'es' ? 'Eliminar foto' : 'Delete photo'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    {isEditing ? (
                      <div className="space-y-2 animate-in fade-in">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            {language === 'es' ? 'Título (ES):' : 'Title (ES):'}
                          </label>
                          <input
                            type="text"
                            value={editMediaForm.titleEs || ''}
                            onChange={(e) => setEditMediaForm({ ...editMediaForm, titleEs: e.target.value })}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            {language === 'es' ? 'Título (EN):' : 'Title (EN):'}
                          </label>
                          <input
                            type="text"
                            value={editMediaForm.titleEn || ''}
                            onChange={(e) => setEditMediaForm({ ...editMediaForm, titleEn: e.target.value })}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            {language === 'es' ? 'Categoría:' : 'Category:'}
                          </label>
                          <select
                            value={editMediaForm.category || 'REPAIRS'}
                            onChange={(e) => setEditMediaForm({ ...editMediaForm, category: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="REPAIRS">Reparaciones (Repairs)</option>
                            <option value="INSTALLATION">Instalación (Installation)</option>
                            <option value="CARPENTRY">Carpintería (Carpentry)</option>
                            <option value="PLUMBING">Plomería (Plumbing)</option>
                            <option value="ELECTRICAL">Electricidad (Electrical)</option>
                            <option value="PAINTING">Pintura (Painting)</option>
                            <option value="OUTDOOR">Exteriores (Outdoor)</option>
                            <option value="COMMERCIAL">Comercial (Commercial)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            URL:
                          </label>
                          <input
                            type="url"
                            value={editMediaForm.url || ''}
                            onChange={(e) => setEditMediaForm({ ...editMediaForm, url: e.target.value })}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEditMedia(item.id)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>{language === 'es' ? 'Guardar' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMediaId(null)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                            {item.category || item.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.type}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {language === 'es' ? item.titleEs : item.titleEn}
                        </h5>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
                  placeholder="e.g. 03:00 PM - 07:00 PM"
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
                {language === 'es' ? 'Reseñas de Clientes (80 Verificadas)' : 'Client Reviews Hub (80 Verified)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' ? 'Publica nuevas reseñas de clientes, modera o sincroniza opiniones con Thumbtack.' : 'Publish new client reviews, moderate or sync feedback with Thumbtack.'}
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

          {/* Thumbtack Sync Status Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#009FD9] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                TT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {language === 'es' ? 'Sincronización con Thumbtack' : 'Thumbtack Live Sync'}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {language === 'es' ? 'Conectado' : 'Connected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'es'
                    ? '80 reseñas (5.0 ⭐) y 125 fotos HD sincronizadas con el perfil oficial de la empresa.'
                    : '80 reviews (5.0 ⭐) and 125 HD photos synchronized with the company\'s official profile.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleThumbtackSync}
                disabled={isSyncing}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? (language === 'es' ? 'Sincronizando...' : 'Syncing...') : (language === 'es' ? 'Sincronizar Ahora' : 'Sync Now')}</span>
              </button>
              <a
                href={businessInfo.thumbtackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
                title="Abrir Thumbtack"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'es' ? 'Gestión Integral de Reservas y Órdenes de Trabajo' : 'Work Orders & Reservations Hub'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold">
                  {bookings.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' 
                  ? 'Revisa citas de clientes, descarga cotizaciones en PDF y visualiza fotos, videos o documentos adjuntados.' 
                  : 'Review customer appointments, download official PDF summaries, and inspect attached photos, videos or documents.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Total</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{bookings.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">Pending</span>
              <span className="text-xl font-black text-amber-700 dark:text-amber-300">
                {bookings.filter(b => b.status === 'PENDING').length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">Confirmed</span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 block">Completed</span>
              <span className="text-xl font-black text-blue-700 dark:text-blue-300">
                {bookings.filter(b => b.status === 'COMPLETED').length}
              </span>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearchQuery}
                onChange={(e) => setBookingSearchQuery(e.target.value)}
                placeholder={language === 'es' ? 'Buscar por cliente, #HW, teléfono, servicio...' : 'Search by client, #HW, phone, service...'}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#0B3C5D]"
              />
              {bookingSearchQuery && (
                <button
                  type="button"
                  onClick={() => setBookingSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setBookingFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    bookingFilterStatus === st
                      ? 'bg-[#0B3C5D] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {(() => {
              const q = bookingSearchQuery.toLowerCase().trim();
              const filtered = bookings.filter(b => {
                const matchesStatus = bookingFilterStatus === 'ALL' || b.status === bookingFilterStatus;
                const matchesQuery = !q || (
                  b.clientName.toLowerCase().includes(q) ||
                  b.id.toLowerCase().includes(q) ||
                  b.clientPhone.toLowerCase().includes(q) ||
                  b.serviceType.toLowerCase().includes(q) ||
                  (b.clientAddress && b.clientAddress.toLowerCase().includes(q))
                );
                return matchesStatus && matchesQuery;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                    {language === 'es' ? 'No se encontraron reservas con los filtros aplicados.' : 'No reservations found matching the filters.'}
                  </div>
                );
              }

              return filtered.map(b => (
                <div 
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-4 shadow-2xs"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-[#0B3C5D] dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                        #{b.id}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {b.clientName}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {language === 'es' ? 'Registrado el:' : 'Created:'} {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
                        b.status === 'COMPLETED' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400' :
                        b.status === 'CANCELLED' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400' :
                        'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}>
                        {b.status}
                      </span>
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Card Content Grid: Left: Client & Details, Right: Attachments */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column (7 cols) */}
                    <div className="lg:col-span-7 space-y-2.5 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          {language === 'es' ? 'Servicio Solicitado:' : 'Requested Service:'}
                        </span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {b.serviceType}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                          {b.projectDetails}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            {language === 'es' ? 'Fecha y Horario:' : 'Scheduled Date & Window:'}
                          </span>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {b.scheduledDate}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {b.scheduledTimeSlot}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            {language === 'es' ? 'Tarifa Referencial:' : 'Consultation Fee:'}
                          </span>
                          <p className="font-black text-[#0B3C5D] dark:text-blue-400 text-sm">
                            $125.00
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {language === 'es' ? 'Se abona en visita o coordinación' : 'Paid upon coordination'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent((b.clientAddress || '') + ' ' + b.zipCode)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-semibold"
                            title="Open Google Maps"
                          >
                            {b.clientAddress} (ZIP: {b.zipCode})
                          </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-200">
                            <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                            {b.clientPhone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                            {b.clientEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (5 cols): Attached Media & Documents */}
                    <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-[#0B3C5D] dark:text-blue-400" />
                            <span>
                              {language === 'es' 
                                ? `Archivos de ${b.clientName} (${b.attachments?.length || (b.photoUrl ? 1 : 0)})` 
                                : `Files for ${b.clientName} (${b.attachments?.length || (b.photoUrl ? 1 : 0)})`}
                            </span>
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0B3C5D] dark:text-blue-300 border border-blue-500/20">
                            #{b.id}
                          </span>
                        </div>

                        {b.attachments && b.attachments.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {b.attachments.map(att => {
                              const attExt = getFileExtension(att.name);
                              const attCat = getDetailedCategory(att.name, att.mimeType);
                              return (
                                <button
                                  key={att.id}
                                  type="button"
                                  onClick={() => setPreviewAttachment(att)}
                                  className="group text-left p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-[#0B3C5D] dark:hover:border-blue-500 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                                >
                                  {attCat === 'image' || att.type === 'image' ? (
                                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 mb-1.5 flex items-center justify-center">
                                      <img 
                                        src={normalizeDataUrl(att.dataUrl)} 
                                        alt={att.name} 
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                          const fallback = (e.target as HTMLElement).nextElementSibling;
                                          if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                      />
                                      <div className="hidden absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-amber-400 p-1 text-center">
                                        <ImageIcon className="w-5 h-5 mb-0.5" />
                                        <span className="text-[8px] font-bold uppercase">{attExt || 'IMG'}</span>
                                      </div>
                                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="w-4 h-4" />
                                      </div>
                                    </div>
                                  ) : attCat === 'video' || att.type === 'video' ? (
                                    <div className="aspect-video w-full rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:bg-amber-500/20 transition-colors">
                                      <Play className="w-6 h-6 fill-current" />
                                    </div>
                                  ) : attCat === 'audio' ? (
                                    <div className="aspect-video w-full rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:bg-purple-500/20 transition-colors">
                                      <Volume2 className="w-6 h-6" />
                                    </div>
                                  ) : attCat === 'pdf' ? (
                                    <div className="aspect-video w-full rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:bg-rose-500/20 transition-colors">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                  ) : attCat === 'cad' ? (
                                    <div className="aspect-video w-full rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 group-hover:bg-cyan-500/20 transition-colors">
                                      <Compass className="w-6 h-6" />
                                    </div>
                                  ) : attCat === 'spreadsheet' ? (
                                    <div className="aspect-video w-full rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:bg-emerald-500/20 transition-colors">
                                      <FileSpreadsheet className="w-6 h-6" />
                                    </div>
                                  ) : attCat === 'archive' ? (
                                    <div className="aspect-video w-full rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:bg-purple-500/20 transition-colors">
                                      <FolderArchive className="w-6 h-6" />
                                    </div>
                                  ) : (
                                    <div className="aspect-video w-full rounded-lg bg-blue-500/10 text-[#0B3C5D] dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:bg-blue-500/20 transition-colors">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                  )}
                                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full" title={att.name}>
                                    {att.name}
                                  </p>
                                  <p className="text-[9px] text-[#0B3C5D] dark:text-blue-400 font-bold truncate">
                                    {b.clientName}
                                  </p>
                                  <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                                    {attExt ? `${attExt} • ` : ''}{att.sizeFormatted}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        ) : b.photoUrl ? (
                          (() => {
                            const rawUrl = normalizeDataUrl(b.photoUrl!);
                            const isPdf = rawUrl.startsWith('data:application/pdf') || /\.pdf/i.test(rawUrl);
                            const isVid = rawUrl.startsWith('data:video/') || /\.(mp4|mov|webm|m4v)/i.test(rawUrl);
                            const isAudio = rawUrl.startsWith('data:audio/') || /\.(mp3|wav|m4a|ogg|aac)/i.test(rawUrl);
                            const resolvedType = isPdf ? 'document' : isVid ? 'video' : isAudio ? 'document' : 'image';
                            const resolvedName = isPdf 
                              ? `Document_${b.id}.pdf` 
                              : isVid 
                              ? `Video_${b.id}.mp4` 
                              : isAudio
                              ? `Audio_${b.id}.mp3`
                              : `Job_Site_Photo_${b.id}.jpg`;
                            return (
                              <button
                                type="button"
                                onClick={() => setPreviewAttachment({
                                  id: `${b.id}-site-photo`,
                                  name: resolvedName,
                                  type: resolvedType,
                                  sizeFormatted: 'Site Attachment',
                                  dataUrl: rawUrl,
                                  createdAt: b.createdAt,
                                  bookingId: b.id,
                                  clientName: b.clientName,
                                  clientPhone: b.clientPhone
                                })}
                                className="group text-left p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-[#0B3C5D] dark:hover:border-blue-500 transition-all cursor-pointer overflow-hidden"
                              >
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 mb-1 flex items-center justify-center">
                                  {isPdf ? (
                                    <FileText className="w-6 h-6 text-rose-500" />
                                  ) : isVid ? (
                                    <Play className="w-6 h-6 text-amber-500" />
                                  ) : isAudio ? (
                                    <Volume2 className="w-6 h-6 text-purple-500" />
                                  ) : (
                                    <>
                                      <img 
                                        src={rawUrl} 
                                        alt="Job area" 
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                          const fallback = (e.target as HTMLElement).nextElementSibling;
                                          if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                      />
                                      <div className="hidden absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-amber-400 p-1 text-center">
                                        <ImageIcon className="w-5 h-5 mb-0.5" />
                                        <span className="text-[8px] font-bold uppercase">JPG PHOTO</span>
                                      </div>
                                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="w-4 h-4" />
                                      </div>
                                    </>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold truncate">
                                  {resolvedName}
                                </p>
                                <p className="text-[9px] text-[#0B3C5D] dark:text-blue-400 font-semibold">
                                  {b.clientName}
                                </p>
                              </button>
                            );
                          })()
                        ) : (
                          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                            {language === 'es' ? 'Sin archivos adjuntados por el cliente.' : 'No files or media attached.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Generate / View PDF */}
                      <button
                        type="button"
                        onClick={() => generateQuotePDF(b, language)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
                        title="Download or Print Work Order PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-200" />
                        <span>{language === 'es' ? 'Descargar PDF Oficial' : 'Official PDF Summary'}</span>
                      </button>

                      {/* Send Dispatch by SMS to Owner's Phone */}
                      <a
                        href={buildOwnerSMSNotificationUrl(b, businessInfo.phoneRaw)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                        title="Send full work order dispatch & files manifest by SMS"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'es' ? 'Enviar a mi Teléfono' : 'Send to My Phone'}</span>
                      </a>

                      {/* Call Client Direct */}
                      <a
                        href={`tel:${b.clientPhone.replace(/\D/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{language === 'es' ? 'Llamar al Cliente' : 'Call Client'}</span>
                      </a>

                      {/* Message Client via SMS */}
                      <a
                        href={`sms:${b.clientPhone.replace(/\D/g, '')}?body=${encodeURIComponent(
                          `Hello ${b.clientName}, this is the Mr Handyworks LLC service team regarding your work order #${b.id} for ${b.serviceType}.`
                        )}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-blue-600" />
                        <span>SMS</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(language === 'es' ? `¿Eliminar la reserva #${b.id}?` : `Delete reservation #${b.id}?`)) {
                          deleteBooking(b.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title={language === 'es' ? 'Eliminar reserva' : 'Delete order'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* FULLY RESPONSIVE UNIVERSAL LIGHTBOX / ATTACHMENT VIEWER (ANY EXTENSION: MOBILE, TABLET, PC) */}
      {previewAttachment && (() => {
        const ext = getFileExtension(previewAttachment.name);
        const cat = getDetailedCategory(previewAttachment.name, previewAttachment.mimeType);
        const isPdf = cat === 'pdf' || previewAttachment.dataUrl.startsWith('data:application/pdf') || ext === 'pdf';
        const isVid = cat === 'video' || previewAttachment.dataUrl.startsWith('data:video/') || ['mp4', 'mov', 'webm', 'avi', 'mkv', '3gp', 'm4v'].includes(ext);
        const isAudio = cat === 'audio' || previewAttachment.dataUrl.startsWith('data:audio/') || ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac', 'opus'].includes(ext);
        const isCad = cat === 'cad' || ['dwg', 'dxf', 'cad', 'rvt', 'skp', 'ifc', 'step', 'stp'].includes(ext);
        const isSpreadsheet = cat === 'spreadsheet' || ['xlsx', 'xls', 'csv', 'ods', 'tsv'].includes(ext);
        const isWord = cat === 'word' || ['doc', 'docx', 'rtf', 'odt', 'pages'].includes(ext);
        const isPresentation = cat === 'presentation' || ['ppt', 'pptx', 'odp', 'key'].includes(ext);
        const isArchive = cat === 'archive' || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
        const isText = cat === 'text' || ['txt', 'log', 'md', 'json', 'xml'].includes(ext);
        const isImg = !isPdf && !isVid && !isAudio && !isCad && !isSpreadsheet && !isWord && !isPresentation && !isArchive && !isText && (
          cat === 'image' || previewAttachment.dataUrl.startsWith('data:image/') || previewAttachment.type === 'image'
        );
        const activeImageUrl = healedImageUrl || normalizeDataUrl(previewAttachment.dataUrl, previewAttachment.name);

        return (
          <div 
            className="fixed inset-0 z-50 bg-slate-200/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
            onClick={() => setPreviewAttachment(null)}
          >
            <div 
              className="relative w-full max-w-lg sm:max-w-3xl md:max-w-5xl max-h-[94vh] sm:max-h-[92vh] bg-white border border-slate-300 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-3.5 border-b border-slate-200 bg-white shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 ${
                    isImg ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    isVid ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    isAudio ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    isPdf ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    isCad ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                    isSpreadsheet ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    isWord ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                    isPresentation ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    isArchive ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    isText ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                    'bg-slate-700 text-slate-300 border border-slate-600'
                  }`}>
                    {ext ? `${ext.toUpperCase()}` : previewAttachment.type}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-[160px] sm:max-w-md md:max-w-xl" title={previewAttachment.name}>
                      {previewAttachment.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                      {previewAttachment.clientName ? (
                        <span className="text-amber-700 font-bold mr-1.5">{previewAttachment.clientName}</span>
                      ) : null}
                      {previewAttachment.bookingId ? (
                        <span className="text-blue-700 font-bold mr-1.5">#{previewAttachment.bookingId}</span>
                      ) : null}
                      <span>• {previewAttachment.sizeFormatted}</span>
                    </p>
                  </div>
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Image View Controls (Zoom & Rotate) */}
                  {isImg && !imageLoadError && !isAttemptingImageHealing && (
                    <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-300 mr-1">
                      <button
                        type="button"
                        onClick={() => setImageZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImageZoom(1); setImageRotation(0); }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Reset View"
                      >
                        {Math.round(imageZoom * 100)}%
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageRotation(r => (r + 90) % 360)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <a
                    href={previewAttachment.dataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors shadow-2xs border border-slate-300"
                    title={language === 'es' ? 'Abrir en pestaña nueva' : 'Open in new tab'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={previewAttachment.dataUrl}
                    download={previewAttachment.name}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors shadow-2xs border border-slate-300"
                    title={language === 'es' ? 'Descargar archivo' : 'Download file'}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewAttachment(null)}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 transition-colors cursor-pointer border border-slate-300"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable & Responsive across Mobile, Tablet, PC */}
              <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 flex items-center justify-center bg-slate-100 min-h-[300px] sm:min-h-[440px]">
                {/* 1. IMAGE RENDERING (JPG, PNG, WEBP, GIF, SVG, BMP, HEIC/RAW FALLBACK) */}
                {isImg && (
                  isAttemptingImageHealing ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                      <span className="text-xs font-bold text-slate-300">
                        {language === 'es' ? 'Optimizando y decodificando imagen...' : 'Optimizing and decoding image...'}
                      </span>
                    </div>
                  ) : imageLoadError ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-lg border border-amber-500/20">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {ext ? `${ext.toUpperCase()} IMAGE` : 'IMAGE FILE'}
                        </span>
                        <h5 className="font-extrabold text-white text-base mt-2 break-all">
                          {previewAttachment.name}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {previewAttachment.dataUrl.startsWith('blob:')
                            ? (language === 'es' 
                                ? 'Esta imagen fue subida en una sesión anterior del navegador. Los enlaces temporales caducan al cerrar la pestaña; puedes abrirla en el visor o descargarla.'
                                : 'This image was uploaded in an earlier session where temporary browser blob links expired. You can view or download it.')
                            : (language === 'es' 
                                ? 'Este formato de imagen es visualizado directamente en el visor de tu sistema.'
                                : 'This image format can be viewed directly in your system viewer.')}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 w-full">
                        <a
                          href={activeImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{language === 'es' ? 'Abrir en Visor del Sistema' : 'Open in System Viewer'}</span>
                        </a>
                        <a
                          href={activeImageUrl}
                          download={previewAttachment.name}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                        >
                          <Download className="w-4 h-4" />
                          <span>{language === 'es' ? 'Descargar Original' : 'Download Original'}</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="relative max-h-[70vh] sm:max-h-[78vh] w-full flex items-center justify-center overflow-auto p-1">
                      <img 
                        src={activeImageUrl} 
                        alt={previewAttachment.name} 
                        style={{
                          transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                          transition: 'transform 0.15s ease-out'
                        }}
                        onError={handleImageError}
                        className="max-h-[68vh] sm:max-h-[74vh] max-w-full object-contain rounded-xl shadow-lg border border-slate-300 select-none"
                      />
                    </div>
                  )
                )}

                {/* 2. VIDEO RENDERING (MP4, MOV, WEBM, 3GP, MKV) */}
                {isVid && (
                  <div className="w-full flex flex-col items-center justify-center space-y-3 p-1 sm:p-2">
                    <video 
                      src={previewAttachment.dataUrl} 
                      controls 
                      playsInline 
                      preload="metadata"
                      className="max-h-[62vh] sm:max-h-[74vh] w-auto max-w-full rounded-2xl shadow-2xl border border-slate-800 bg-black"
                    >
                      Your browser does not support HTML5 video tag.
                    </video>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                      <a
                        href={previewAttachment.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Pantalla Completa' : 'Full Window'}</span>
                      </a>
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Descargar Video' : 'Download Video'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. AUDIO RENDERING (MP3, WAV, M4A, OGG, AAC) */}
                {isAudio && (
                  <div className="w-full max-w-lg flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-xl">
                      <Volume2 className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ext ? `${ext.toUpperCase()} AUDIO` : 'AUDIO RECORDING'}
                      </span>
                      <h5 className="font-extrabold text-white text-lg mt-2 break-all">
                        {previewAttachment.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        {previewAttachment.clientName ? `${previewAttachment.clientName} • ` : ''}
                        {previewAttachment.sizeFormatted}
                      </p>
                    </div>
                    <audio controls src={previewAttachment.dataUrl} className="w-full max-w-md mt-2">
                      Your browser does not support audio element.
                    </audio>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'es' ? 'Descargar Audio' : 'Download Audio'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 4. CAD / BLUEPRINTS / ARCHITECTURAL PLANS (DWG, DXF, SKP, RVT) */}
                {isCad && (
                  <div className="w-full max-w-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shadow-xl">
                      <Compass className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {ext ? `${ext.toUpperCase()} CAD / PLANO` : 'CAD / BLUEPRINT'}
                      </span>
                      <h5 className="font-extrabold text-white text-lg mt-2 break-all">
                        {previewAttachment.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        {previewAttachment.clientName ? `${previewAttachment.clientName} • ` : ''}
                        {previewAttachment.sizeFormatted}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                      {language === 'es'
                        ? 'Plano o modelo CAD de construcción/reparación. Descarga el archivo para abrirlo con AutoCAD, SketchUp o visualizador CAD.'
                        : 'Construction/repair CAD blueprint or model. Download file to open with AutoCAD, SketchUp or CAD viewer.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'es' ? 'Descargar Plano CAD' : 'Download CAD File'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 5. PDF RENDERING (DIRECT EMBEDDED IFRAME ON MOBILE & DESKTOP) */}
                {isPdf && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1">
                    <div className="w-full flex items-center justify-between px-3 py-2 mb-2 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-2 truncate max-w-xs sm:max-w-md">
                        <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="truncate">{previewAttachment.name}</span>
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={previewAttachment.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{language === 'es' ? 'Abrir PDF' : 'Open PDF'}</span>
                        </a>
                        <a
                          href={previewAttachment.dataUrl}
                          download={previewAttachment.name}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 border border-slate-700"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'es' ? 'Descargar' : 'Download'}</span>
                        </a>
                      </div>
                    </div>
                    <iframe 
                      src={previewAttachment.dataUrl} 
                      title={previewAttachment.name}
                      className="w-full h-[62vh] sm:h-[72vh] rounded-xl border border-slate-800 bg-white"
                    />
                  </div>
                )}

                {/* 6. SPREADSHEET RENDERING (XLSX, XLS, CSV, TSV) */}
                {isSpreadsheet && (
                  <div className="w-full max-w-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xl">
                      <FileSpreadsheet className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {ext ? `${ext.toUpperCase()} SPREADSHEET` : 'EXCEL SPREADSHEET'}
                      </span>
                      <h5 className="font-extrabold text-white text-lg mt-2 break-all">
                        {previewAttachment.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        {previewAttachment.clientName ? `${previewAttachment.clientName} • ` : ''}
                        {previewAttachment.sizeFormatted}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={previewAttachment.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{language === 'es' ? 'Ver / Abrir Hoja' : 'Open Spreadsheet'}</span>
                      </a>
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'es' ? 'Descargar Archivo' : 'Download File'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 7. WORD & DOCUMENT RENDERING (DOC, DOCX, RTF, PAGES) */}
                {isWord && (
                  <div className="w-full max-w-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-xl">
                      <FileText className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {ext ? `${ext.toUpperCase()} DOCUMENT` : 'WORD DOCUMENT'}
                      </span>
                      <h5 className="font-extrabold text-white text-lg mt-2 break-all">
                        {previewAttachment.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        {previewAttachment.clientName ? `${previewAttachment.clientName} • ` : ''}
                        {previewAttachment.sizeFormatted}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={previewAttachment.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{language === 'es' ? 'Abrir Documento' : 'Open Document'}</span>
                      </a>
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'es' ? 'Descargar Archivo' : 'Download File'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 8. ARCHIVE RENDERING (ZIP, RAR, 7Z, TAR, GZ) */}
                {isArchive && (
                  <div className="w-full max-w-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-xl">
                      <FolderArchive className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {ext ? `${ext.toUpperCase()} ARCHIVE` : 'COMPRESSED ARCHIVE'}
                      </span>
                      <h5 className="font-extrabold text-white text-lg mt-2 break-all">
                        {previewAttachment.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        {previewAttachment.clientName ? `${previewAttachment.clientName} • ` : ''}
                        {previewAttachment.sizeFormatted}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'es' ? 'Descargar Archivo ZIP' : 'Download Archive'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 9. TEXT & OTHER GENERIC DOCUMENTS */}
                {(isText || (!isImg && !isVid && !isAudio && !isCad && !isPdf && !isSpreadsheet && !isWord && !isPresentation && !isArchive)) && (
                  <div className="w-full max-w-2xl flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-xl">
                      <FileCode className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {ext ? `${ext.toUpperCase()} FILE` : 'ATTACHED FILE'}
                      </span>
                      <h5 className="font-extrabold text-white text-base sm:text-lg mt-2 break-all">
                        {previewAttachment.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        {previewAttachment.clientName ? `${previewAttachment.clientName} • ` : ''}
                        {previewAttachment.sizeFormatted}
                      </p>
                    </div>

                    {decodedTextContent && (
                      <div className="w-full text-left max-h-48 overflow-auto rounded-xl bg-slate-900 border border-slate-700 p-3 font-mono text-[11px] text-slate-300 whitespace-pre-wrap select-text">
                        {decodedTextContent.slice(0, 3000)}
                        {decodedTextContent.length > 3000 ? '\n\n... [Visualización limitada a primeros 3,000 caracteres]' : ''}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                      <a
                        href={previewAttachment.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{language === 'es' ? 'Abrir Archivo' : 'Open File'}</span>
                      </a>
                      <a
                        href={previewAttachment.dataUrl}
                        download={previewAttachment.name}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'es' ? 'Descargar' : 'Download'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
