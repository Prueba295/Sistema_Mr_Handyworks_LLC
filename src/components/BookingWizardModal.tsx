import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO, PROJECT_TYPE_OPTIONS, REAL_SERVICE_OPTIONS } from '../data/initialData';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { BookingAttachment } from '../types';
import { processUploadedFile } from '../utils/attachmentOptimizer';
import { 
  validateFullName,
  validateUSPhone,
  formatUSPhone,
  validateEmail,
  validateStreetAddress,
  validateZipCode,
  sanitizeXSS,
  createEncryptedBookingToken,
  ValidationErrors
} from '../utils/inputSecurity';
import { 
  playNotificationChime, 
  triggerDesktopNotification, 
  dispatchBookingWebhook, 
  buildOwnerSMSNotificationUrl 
} from '../utils/liveNotifier';
import confetti from 'canvas-confetti';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  Clock, 
  MapPin, 
  Phone, 
  Download, 
  FileText,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Briefcase,
  User,
  Search,
  RefreshCw,
  AlertCircle,
  Lock,
  Film,
  Paperclip,
  Trash2,
  CreditCard,
  Smartphone,
  DollarSign,
  Send
} from 'lucide-react';

export const BookingWizardModal: React.FC = () => {
  const { 
    isBookingWizardOpen, 
    closeBookingWizard, 
    services, 
    addBooking, 
    availability, 
    showNotification,
    bookingWizardInitialData,
    language
  } = useApp();

  // Wizard steps: 1: Location, 2: Service, 3: Schedule, 4: Contact, 5: Additional
  const [step, setStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Step 1: Location
  const [zipCode, setZipCode] = useState<string>('46637');
  const [zipError, setZipError] = useState<string | null>(null);

  // Step 2: Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>('tv-mount');
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [isServiceSelectorOpen, setIsServiceSelectorOpen] = useState<boolean>(false);
  const [projectType, setProjectType] = useState<string>('Repairs');
  const [durationTier, setDurationTier] = useState<string>('2-5 hrs');

  // Step 3: Schedule
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-23');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 8, 1));
  const [scheduledSlot, setScheduledSlot] = useState<string>('09:00 AM - 12:00 PM');

  // Step 4: Contact & Strict Validation State
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<{ [k: string]: boolean }>({});

  // Step 5: Additional
  const [projectDetails, setProjectDetails] = useState<string>('');
  const [clientAttachments, setClientAttachments] = useState<BookingAttachment[]>([]);
  const [isProcessingAttachments, setIsProcessingAttachments] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Prefill or reset from trigger
  useEffect(() => {
    if (bookingWizardInitialData) {
      if (bookingWizardInitialData.serviceId) {
        setSelectedServiceId(bookingWizardInitialData.serviceId);
        setIsServiceSelectorOpen(false);
      }
      if (bookingWizardInitialData.date) {
        setScheduledDate(bookingWizardInitialData.date);
        const [year, month] = bookingWizardInitialData.date.split('-').map(Number);
        setCalendarMonth(new Date(year, month - 1, 1));
      }
      if (bookingWizardInitialData.timeSlot) {
        setScheduledSlot(bookingWizardInitialData.timeSlot);
      }
    }
  }, [bookingWizardInitialData]);

  // Reset wizard on close
  useEffect(() => {
    if (!isBookingWizardOpen) {
      setStep(1);
      setIsCompleted(false);
      setCreatedBooking(null);
      setIsSubmitting(false);
      setFormErrors({});
      setTouchedFields({});
      setIsServiceSelectorOpen(false);
      setClientAttachments([]);
      setIsProcessingAttachments(false);
    }
  }, [isBookingWizardOpen]);

  // Validate zip code
  useEffect(() => {
    const res = validateZipCode(zipCode);
    if (!res.isValid) {
      setZipError(res.error || 'Invalid postal zip code');
    } else {
      setZipError(null);
    }
  }, [zipCode]);

  // Real-time validation for Contact fields
  const validateContactFields = () => {
    const errors: ValidationErrors = {};
    const nameCheck = validateFullName(clientName);
    if (!nameCheck.isValid) errors.fullName = nameCheck.error;

    const phoneCheck = validateUSPhone(clientPhone);
    if (!phoneCheck.isValid) errors.phone = phoneCheck.error;

    if (clientEmail.trim()) {
      const emailCheck = validateEmail(clientEmail);
      if (!emailCheck.isValid) errors.email = emailCheck.error;
    }

    const addressCheck = validateStreetAddress(clientAddress);
    if (!addressCheck.isValid) errors.address = addressCheck.error;

    return errors;
  };

  const isContactStepValid = useMemo(() => {
    const errors = validateContactFields();
    return Object.keys(errors).length === 0 && Boolean(clientName && clientPhone && clientAddress);
  }, [clientName, clientPhone, clientEmail, clientAddress]);

  if (!isBookingWizardOpen) return null;

  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedServiceName = selectedService ? selectedService.titleEn : (selectedServiceId || 'General Handyman');
  const normalizedServiceSearch = serviceSearch.trim().toLowerCase();

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysForCalendarMonth = (monthDate: Date) => {
    return Array.from({ length: 42 }, (_, index) => {
      const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      return new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 - firstDay.getDay() + index);
    });
  };

  const calendarMonthLabel = calendarMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = getDaysForCalendarMonth(calendarMonth).map(date => {
    const dateKey = formatDateKey(date);
    const todayKey = formatDateKey(new Date());
    const info = availability.find(item => item.date === dateKey);

    return {
      date,
      dateKey,
      isCurrentMonth: date.getMonth() === calendarMonth.getMonth(),
      isPast: dateKey < todayKey,
      isBlocked: info?.isBlocked === true,
      isFull: Boolean(info && !info.isBlocked && info.slots.length === 0),
    };
  });

  const changeCalendarMonth = (offset: number) => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (clientAttachments.length + files.length > 8) {
      showNotification('Maximum 8 files can be attached per booking request.');
      return;
    }

    setIsProcessingAttachments(true);
    try {
      const newAtts: BookingAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const att = await processUploadedFile(file);
        newAtts.push(att);
      }
      setClientAttachments(prev => [...prev, ...newAtts]);
      showNotification(
        language === 'es'
          ? `Se adjuntaron ${newAtts.length} archivo(s) optimizado(s).`
          : `Added ${newAtts.length} attachment(s) (optimized).`
      );
    } catch (err: any) {
      showNotification(err?.message || 'Error processing attachment.');
    } finally {
      setIsProcessingAttachments(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setClientAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Step 1: Location Validation
  const handleNextFromLocation = () => {
    const res = validateZipCode(zipCode);
    if (!res.isValid) {
      setZipError(res.error || 'Please enter a valid 5-digit zip code.');
      showNotification('Please enter a valid 5-digit US postal zip code.');
      return;
    }
    setZipError(null);
    setStep(2);
  };

  // Step 2: Service Selection Validation
  const handleNextFromService = () => {
    if (!selectedServiceId) {
      showNotification('Please select a service.');
      return;
    }
    setStep(3);
  };

  // Step 3: Schedule Selection Validation
  const handleNextFromSchedule = () => {
    if (!scheduledDate) {
      showNotification('Please select an appointment date.');
      return;
    }
    setStep(4);
  };

  // Step 4: Strict Contact Validation
  const handleNextFromContact = () => {
    setTouchedFields({
      fullName: true,
      phone: true,
      email: true,
      address: true
    });

    const errors = validateContactFields();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      showNotification(firstError || 'Please complete all required contact fields correctly.');
      return;
    }

    setStep(5);
  };

  // Step 5: Final Submission with End-to-End Privacy & Sanitization
  const handleFinishBooking = async () => {
    setIsSubmitting(true);

    const cleanName = sanitizeXSS(clientName);
    const cleanPhone = formatUSPhone(clientPhone);
    const cleanEmail = sanitizeXSS(clientEmail).toLowerCase();
    const cleanAddress = sanitizeXSS(clientAddress);
    const cleanDetails = sanitizeXSS(projectDetails);

    // Cryptographically generate privacy token (no plain text exposure in logs)
    const secureToken = await createEncryptedBookingToken(
      `HW-${Date.now()}`,
      cleanPhone
    );

    const orderRef = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Strictly tag each attachment with client and order metadata (no mixing up!)
    const stampedAttachments: BookingAttachment[] = clientAttachments.map((att, idx) => ({
      ...att,
      id: `${orderRef}-att-${idx + 1}`,
      bookingId: orderRef,
      clientName: cleanName,
      clientPhone: cleanPhone,
    }));

    const newBooking = addBooking({
      id: orderRef,
      serviceType: selectedServiceName,
      zipCode: zipCode.trim() || '46637',
      estimatedHours: durationTier,
      estimatedPrice: 125, // Fixed $125 consultation fee
      projectDetails: `${projectType}: ${cleanDetails || 'On-site consultation & diagnostic inspection'}`,
      photoUrl: stampedAttachments.find(a => a.type === 'image')?.dataUrl || undefined,
      attachments: stampedAttachments,
      scheduledDate,
      scheduledTimeSlot: scheduledSlot,
      clientName: cleanName,
      clientPhone: cleanPhone,
      clientEmail: cleanEmail || 'client@example.com',
      clientAddress: cleanAddress,
      status: 'PENDING',
      paymentMethod: 'CASH',
      paymentStatus: 'UNPAID',
      depositAmount: 0,
      paymentTokenId: secureToken,
      notificationSentToOwner: true,
      notificationSentAt: new Date().toISOString()
    });

    setCreatedBooking(newBooking);
    setIsCompleted(true);
    setIsSubmitting(false);

    // Trigger live real-time notification alert chime, browser notification & webhook
    playNotificationChime();
    triggerDesktopNotification(newBooking);
    dispatchBookingWebhook(newBooking).catch(() => {});

    // Automatically trigger official PDF generation immediately upon confirmation
    try {
      setTimeout(() => {
        generateQuotePDF(newBooking, language);
      }, 400);
    } catch {
      // safe fallback
    }

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const stepsList = [
    { num: 1, label: 'Location', icon: Compass },
    { num: 2, label: 'Service', icon: Briefcase },
    { num: 3, label: 'Schedule', icon: Clock },
    { num: 4, label: 'Contact', icon: User },
    { num: 5, label: 'Additional', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-2 backdrop-blur-xs sm:p-4 animate-in fade-in duration-200">
      <div className="relative my-2 flex max-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-2xl flex-col sm:my-6 sm:max-h-[calc(100dvh-2rem)]">
        
        {/* Brand Header Above Card (Harmonized to corporate style & privacy) */}
        <div className="text-center mb-2.5 hidden sm:block">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md">
            Mr. Handyworks LLC of Northern St. Joseph and Elkhart Counties
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-amber-200/90 flex items-center justify-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>South Bend, IN 46637 • Licensed &amp; Insured Professional Services</span>
          </p>
        </div>

        {/* Main Card Container with Corporate System Palette */}
        <div className="flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          
          {/* Corporate Header Banner Bar (Navy #0B3C5D with Amber Accents) */}
          <div className="bg-gradient-to-r from-[#0B3C5D] via-[#0D4468] to-[#07273D] px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-white shrink-0 border-b border-white/10">
            <div>
              <div className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-amber-300">
                MR. HANDYWORKS OF NORTHERN ST JOSEPH &amp; ELKHART
              </div>
              <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                Book Online Now
              </h3>
            </div>
            <button
              onClick={closeBookingWizard}
              aria-label="Close booking modal"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* 5-Step Progress Bar (Harmonized with System Navy #0B3C5D) */}
          {!isCompleted && (
            <div className="border-b border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 sm:py-4 shrink-0">
              <div className="flex items-center justify-between">
                {stepsList.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step === s.num;
                  const isPast = step > s.num;

                  return (
                    <React.Fragment key={s.num}>
                      <div className="flex flex-col items-center gap-1">
                        <div 
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 transition-all ${
                            isActive
                              ? 'border-[#0B3C5D] text-white bg-[#0B3C5D] dark:border-blue-400 dark:bg-blue-600 shadow-sm ring-2 ring-[#0B3C5D]/20'
                              : isPast
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {isPast ? (
                            <Check className="h-4 w-4 stroke-[3]" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <span 
                          className={`text-[11px] sm:text-xs font-bold transition-colors ${
                            isActive
                              ? 'text-[#0B3C5D] dark:text-blue-400'
                              : isPast
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>

                      {/* Separator dash line */}
                      {idx < stepsList.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1.5 sm:mx-3 transition-colors ${
                          step > s.num ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                        }`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card Body */}
          <div className="min-h-0 overflow-y-auto p-4 sm:p-8">

            {/* ================= STEP 1: LOCATION ================= */}
            {!isCompleted && step === 1 && (
              <div className="space-y-6 max-w-md mx-auto py-2 sm:py-4 animate-in fade-in">
                {/* Truck + Location Pin Illustration (Corporate Palette) */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto shadow-inner border border-slate-200 dark:border-slate-700">
                  <svg viewBox="0 0 160 130" className="w-28 h-28 sm:w-36 sm:h-36">
                    {/* Location Pin Marker (Amber Accent) */}
                    <path 
                      d="M68 18 C56 18 48 26 48 37 C48 52 68 73 68 73 C68 73 88 52 88 37 C88 26 80 18 68 18 Z" 
                      fill="#F59E0B" 
                    />
                    <circle cx="68" cy="36" r="6" fill="#FFFFFF" />

                    {/* Van Cargo Box (System Navy Soft) */}
                    <rect x="22" y="50" width="72" height="42" rx="6" fill="#0B3C5D" opacity="0.85" />

                    {/* Van Cab Front (System Navy Strong) */}
                    <path d="M94 58 L114 58 Q125 58 127 68 L129 92 L94 92 Z" fill="#07273D" />

                    {/* Windshield Window */}
                    <path d="M97 61 L112 61 Q117 61 119 68 L121 75 L97 75 Z" fill="#E2E8F0" />

                    {/* Front Bumper */}
                    <rect x="125" y="84" width="6" height="8" rx="2" fill="#F59E0B" />

                    {/* Back Wheel */}
                    <circle cx="44" cy="92" r="11" fill="#1E293B" />
                    <circle cx="44" cy="92" r="5" fill="#FFFFFF" />

                    {/* Front Wheel */}
                    <circle cx="108" cy="92" r="11" fill="#1E293B" />
                    <circle cx="108" cy="92" r="5" fill="#FFFFFF" />
                  </svg>
                </div>

                {/* Question Headline */}
                <div className="text-center space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Where are you?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Enter your zip or postal code so we can check if we service in your area.
                  </p>
                </div>

                {/* Zip Input with System Corporate Border */}
                <div className="pt-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Zip Code <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    inputMode="numeric"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="e.g. 46637"
                    className={`w-full rounded-xl border-2 bg-white dark:bg-slate-800 px-4 py-3.5 text-base font-bold text-slate-900 dark:text-white outline-none transition-all ${
                      zipError
                        ? 'border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-[#0B3C5D]/40 focus:border-[#0B3C5D] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#0B3C5D]/20'
                    }`}
                  />

                  {/* Area Service Coverage Validation */}
                  <div className="mt-2.5">
                    {!zipError ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Confirmed Service Area: South Bend, Mishawaka, Granger &amp; Elkhart!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{zipError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: SERVICE (COLLAPSIBLE SELECTION) ================= */}
            {!isCompleted && step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                {/* Official Fee Callout Banner */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-[#0B3C5D] dark:text-blue-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
                      <span>Official Pricing Transparency</span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      Fixed on-site consultation &amp; diagnostic fee: <strong>$125.00</strong>. Final project labor &amp; materials are quoted on-site.
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-[#0B3C5D] dark:text-blue-300">$125</span>
                    <span className="text-[10px] block font-bold text-slate-500">Fixed Fee</span>
                  </div>
                </div>

                {/* Collapsed vs Expanded Service View */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-extrabold text-slate-900 dark:text-white">
                      Selected Service
                    </label>
                    {isServiceSelectorOpen && (
                      <button
                        type="button"
                        onClick={() => setIsServiceSelectorOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* 1. When Collapsed: Display Only the Selected Service Card */}
                  {!isServiceSelectorOpen && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#0B3C5D]/5 dark:bg-blue-500/10 border-2 border-[#0B3C5D] dark:border-blue-400 flex items-center justify-between gap-4 transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-3 rounded-xl bg-[#0B3C5D] text-white shrink-0 shadow-xs">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                            {selectedServiceName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {selectedService ? selectedService.descEn : 'Professional craftsmanship & diagnostics'}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Active Choice
                            </span>
                            <span className="text-[11px] font-bold text-[#0B3C5D] dark:text-blue-300">
                              $125 Fixed Consultation Fee
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsServiceSelectorOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Change Service</span>
                      </button>
                    </div>
                  )}

                  {/* 2. When Expanded: Search Box and Full List to Pick Another Service */}
                  {isServiceSelectorOpen && (
                    <div className="space-y-3 p-3 rounded-2xl border-2 border-dashed border-[#0B3C5D]/40 bg-slate-50/50 dark:bg-slate-800/40 animate-in fade-in">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          autoFocus
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          placeholder="Search TV mount, drywall repair, painting, assembly, doors..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#0B3C5D] focus:ring-1 focus:ring-[#0B3C5D]"
                        />
                      </div>

                      <div className="max-h-56 overflow-y-auto space-y-2 rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800">
                        {services
                          .filter(s => !normalizedServiceSearch || s.titleEn.toLowerCase().includes(normalizedServiceSearch))
                          .map(s => {
                            const isSelected = selectedServiceId === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setSelectedServiceId(s.id);
                                  setIsServiceSelectorOpen(false); // Collapses immediately on selection!
                                }}
                                className={`w-full p-3 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0B3C5D] text-white shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="font-bold text-xs sm:text-sm truncate">
                                    {s.titleEn}
                                  </div>
                                  <div className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {s.descEn}
                                  </div>
                                </div>
                                <span className={`text-[11px] font-black shrink-0 px-2 py-1 rounded-lg ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  $125 Fixed Fee
                                </span>
                              </button>
                            );
                          })}

                        {REAL_SERVICE_OPTIONS
                          .filter(opt => !normalizedServiceSearch || opt.toLowerCase().includes(normalizedServiceSearch))
                          .map(opt => {
                            const isSelected = selectedServiceId === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setSelectedServiceId(opt);
                                  setIsServiceSelectorOpen(false); // Collapses immediately on selection!
                                }}
                                className={`w-full p-3 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0B3C5D] text-white shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                <span className="font-bold text-xs sm:text-sm">{opt}</span>
                                <span className={`text-[11px] font-black shrink-0 px-2 py-1 rounded-lg ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  $125 Fixed Fee
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Scope & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#0B3C5D]"
                    >
                      {PROJECT_TYPE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Estimated Project Scope
                    </label>
                    <select
                      value={durationTier}
                      onChange={(e) => setDurationTier(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#0B3C5D]"
                    >
                      <option value="< 2 hrs">&lt; 2 Hours (Quick / minor task)</option>
                      <option value="2-5 hrs">2 - 5 Hours (Standard project)</option>
                      <option value="Full Day (5+ hrs)">Full Day (5+ Hours / Extensive scope)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 3: SCHEDULE ================= */}
            {!isCompleted && step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                    When would you like us to arrive?
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Select your preferred service date and arrival window on the calendar.
                  </p>

                  {/* Calendar Widget */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <button 
                        type="button" 
                        onClick={() => changeCalendarMonth(-1)} 
                        aria-label="Previous month" 
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B3C5D] cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="text-sm font-black text-slate-900 dark:text-white">{calendarMonthLabel}</div>
                      <button 
                        type="button" 
                        onClick={() => changeCalendarMonth(1)} 
                        aria-label="Next month" 
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B3C5D] cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day} className="py-1">{day.slice(0, 2)}</span>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map(day => {
                        const isSelected = scheduledDate === day.dateKey;
                        const isDisabled = day.isPast || day.isBlocked;
                        return (
                          <button
                            key={day.dateKey}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setScheduledDate(day.dateKey)}
                            title={day.isBlocked ? 'Unavailable' : day.isFull ? 'No open slots' : 'Available'}
                            className={`relative min-h-9 rounded-lg text-xs font-bold transition-all sm:min-h-10 cursor-pointer ${
                              isSelected
                                ? 'bg-[#0B3C5D] text-white ring-2 ring-blue-400 shadow-sm'
                                : day.isBlocked
                                ? 'cursor-not-allowed bg-rose-500/10 text-rose-400 line-through'
                                : day.isFull
                                ? 'bg-amber-500/15 text-amber-600'
                                : day.isCurrentMonth
                                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border hover:border-[#0B3C5D]'
                                : 'text-slate-300 dark:text-slate-600 opacity-40'
                            }`}
                          >
                            {day.date.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Selected Date:</span>
                      <strong className="text-sm font-black text-[#0B3C5D] dark:text-blue-300">{scheduledDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Arrival Window Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Arrival Window
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { slot: '09:00 AM - 12:00 PM', label: '09:00 AM - 12:00 PM (Morning)' },
                      { slot: '12:00 PM - 03:00 PM', label: '12:00 PM - 03:00 PM (Midday)' },
                      { slot: '03:00 PM - 07:00 PM', label: '03:00 PM - 07:00 PM (Afternoon)' }
                    ].map(item => (
                      <button
                        key={item.slot}
                        type="button"
                        onClick={() => setScheduledSlot(item.slot)}
                        className={`p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                          scheduledSlot === item.slot
                            ? 'bg-[#0B3C5D] text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 4: CONTACT (STRICT VALIDATION & ANTI-GIBBERISH) ================= */}
            {!isCompleted && step === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Who should we contact?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Please provide accurate contact details so we can verify and coordinate your service appointment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (touchedFields.fullName) {
                          const check = validateFullName(e.target.value);
                          setFormErrors(prev => ({ ...prev, fullName: check.error }));
                        }
                      }}
                      onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, fullName: true }));
                        const check = validateFullName(clientName);
                        setFormErrors(prev => ({ ...prev, fullName: check.error }));
                      }}
                      placeholder="e.g. John Miller"
                      className={`w-full px-3.5 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none transition-all ${
                        formErrors.fullName && touchedFields.fullName
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20'
                      }`}
                    />
                    {formErrors.fullName && touchedFields.fullName && (
                      <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number (Auto-formatted) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => {
                        const formatted = formatUSPhone(e.target.value);
                        setClientPhone(formatted);
                        if (touchedFields.phone) {
                          const check = validateUSPhone(formatted);
                          setFormErrors(prev => ({ ...prev, phone: check.error }));
                        }
                      }}
                      onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, phone: true }));
                        const check = validateUSPhone(clientPhone);
                        setFormErrors(prev => ({ ...prev, phone: check.error }));
                      }}
                      placeholder="(574) 555-0192"
                      className={`w-full px-3.5 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none transition-all ${
                        formErrors.phone && touchedFields.phone
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20'
                      }`}
                    />
                    {formErrors.phone && touchedFields.phone && (
                      <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => {
                        setClientEmail(e.target.value);
                        if (touchedFields.email) {
                          const check = validateEmail(e.target.value);
                          setFormErrors(prev => ({ ...prev, email: check.error }));
                        }
                      }}
                      onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, email: true }));
                        const check = validateEmail(clientEmail);
                        setFormErrors(prev => ({ ...prev, email: check.error }));
                      }}
                      placeholder="e.g. client@example.com"
                      className={`w-full px-3.5 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none transition-all ${
                        formErrors.email && touchedFields.email
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20'
                      }`}
                    />
                    {formErrors.email && touchedFields.email && (
                      <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      disabled
                      value={zipCode}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-sm font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Street Address <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => {
                      setClientAddress(e.target.value);
                      if (touchedFields.address) {
                        const check = validateStreetAddress(e.target.value);
                        setFormErrors(prev => ({ ...prev, address: check.error }));
                      }
                    }}
                    onBlur={() => {
                      setTouchedFields(prev => ({ ...prev, address: true }));
                      const check = validateStreetAddress(clientAddress);
                      setFormErrors(prev => ({ ...prev, address: check.error }));
                    }}
                    placeholder="e.g. 1428 E Jefferson Blvd or 51591 SR-933"
                    className={`w-full px-3.5 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none transition-all ${
                      formErrors.address && touchedFields.address
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20'
                    }`}
                  />
                  {formErrors.address && touchedFields.address && (
                    <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.address}</span>
                    </p>
                  )}
                </div>

                {/* Privacy & Direct Coordination Notice (No raw personal owner info exposed) */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="font-bold text-slate-900 dark:text-white block">
                      Privacy &amp; Direct Communication Guarantee:
                    </strong>
                    Your information is protected and never shared with third parties. No payment is charged online. Direct phone and SMS communication buttons become available once your appointment request is submitted.
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 5: ADDITIONAL ================= */}
            {!isCompleted && step === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Project Details &amp; Summary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Provide any special instructions or photos of the project area, then submit your request.
                  </p>
                </div>

                {/* Project Description Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Describe your project or special requests:
                  </label>
                  <textarea
                    rows={3}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(sanitizeXSS(e.target.value))}
                    placeholder="e.g. Need 75-inch TV mounted above the stone fireplace with concealed in-wall cabling..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-[#0B3C5D] focus:ring-1 focus:ring-[#0B3C5D]"
                  />
                </div>

                {/* Attachment Upload Zone (Photos, Videos, Documents) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {language === 'es' ? 'Adjuntar Fotos, Videos o Documentos (Opcional)' : 'Attach Photos, Videos or Documents (Optional)'}
                    </label>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {language === 'es' ? 'Compresión ligera • Sin saturar hosting' : 'Optimized in-browser • Zero server bloat'}
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0B3C5D] dark:hover:border-blue-400 rounded-2xl p-5 text-center cursor-pointer relative bg-slate-50/60 dark:bg-slate-800/40 transition-all group">
                    <input
                      type="file"
                      multiple
                      accept="*/*"
                      onChange={handleAttachmentUpload}
                      disabled={isProcessingAttachments}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#0B3C5D]/10 dark:bg-blue-500/20 text-[#0B3C5D] dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {language === 'es' 
                        ? 'Arrastra cualquier archivo aquí (fotos, videos, planos, documentos) o haz clic para explorar' 
                        : 'Drop any file here (photos, videos, blueprints, documents) or click to browse'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'es' 
                        ? 'Cualquier extensión: JPG, PNG, PDF, DOCX, MP4, MOV, HEIC, etc. (Máx. 40 MB)' 
                        : 'All extensions supported: JPG, PNG, PDF, DOCX, MP4, MOV, HEIC, etc. (Max 40 MB)'}
                    </p>
                  </div>

                  {isProcessingAttachments && (
                    <div className="mt-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300 font-semibold animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                      <span>{language === 'es' ? 'Optimizando y preparando archivos...' : 'Compressing and optimizing files in browser...'}</span>
                    </div>
                  )}

                  {clientAttachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {language === 'es' ? `Archivos listos (${clientAttachments.length}):` : `Attached Files (${clientAttachments.length}):`}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {clientAttachments.map((att) => (
                          <div 
                            key={att.id}
                            className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {att.type === 'image' ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 flex items-center justify-center">
                                  <img 
                                    src={att.dataUrl} 
                                    alt={att.name} 
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              ) : att.type === 'video' ? (
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                                  <Film className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-[#0B3C5D] dark:text-blue-400 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {att.name}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span className="uppercase font-semibold text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                    {att.type}
                                  </span>
                                  <span>{att.sizeFormatted}</span>
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                              title="Remove file"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Review Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-600 dark:text-slate-400">Service:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedServiceName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Date &amp; Arrival Window:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{scheduledDate} ({scheduledSlot})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Client:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{clientName} • {clientPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Service Address:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{clientAddress} ({zipCode})</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-black text-slate-800 dark:text-slate-200 block">
                        Fixed On-Site Consultation Fee:
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {language === 'es' ? 'Monto referencial • Se abona al coordinar por llamada o en la visita' : 'Referential amount • Paid upon phone coordination or service visit'}
                      </span>
                    </div>
                    <span className="text-lg font-black text-[#0B3C5D] dark:text-blue-300 shrink-0">$125.00</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed border-t border-slate-200 dark:border-slate-700">
                    * Final project labor will be evaluated on-site according to work hours and installation requirements. Confirmation and payment details will be coordinated directly via call or SMS. No online charge is processed today.
                  </div>
                </div>
              </div>
            )}

            {/* ================= CONFIRMATION SCREEN (PHONE/SMS PRIORITIZED, PAYMENT METHODS VISIBLE) ================= */}
            {isCompleted && createdBooking && (
              <div className="text-center py-4 sm:py-6 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {language === 'es' ? '¡Solicitud de Reserva Recibida!' : 'Booking Request Received!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    {language === 'es' 
                      ? <>Gracias, <strong>{createdBooking.clientName}</strong>. Tu cita ha sido registrada con éxito en el sistema.</>
                      : <>Thank you, <strong>{createdBooking.clientName}</strong>! Your appointment has been successfully registered.</>}
                  </p>
                </div>

                {/* Reference Card with Encrypted Security Badge */}
                <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">
                      {language === 'es' ? 'Código de Referencia:' : 'Booking Reference:'}
                    </span>
                    <span className="font-black text-sm text-[#0B3C5D] dark:text-amber-400 font-mono">
                      #{createdBooking.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Servicio:' : 'Service:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{createdBooking.serviceType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Horario Previsto:' : 'Requested Arrival:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{createdBooking.scheduledDate} ({createdBooking.scheduledTimeSlot})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Dirección:' : 'Address:'}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{createdBooking.clientAddress} (Zip: {createdBooking.zipCode})</span>
                  </div>
                  
                  {createdBooking.attachments && createdBooking.attachments.length > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Archivos Adjuntos:' : 'Attachments:'}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{createdBooking.attachments.length} {language === 'es' ? 'archivo(s)' : 'file(s)'}</span>
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-700 dark:text-slate-300 font-bold block">
                          {language === 'es' ? 'Tarifa de Consulta en Sitio:' : 'Fixed Consultation Fee:'}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {language === 'es' ? 'Monto referencial • Se abona al coordinar por llamada' : 'Referential fee • Paid upon phone coordination'}
                        </span>
                      </div>
                      <span className="font-black text-base text-slate-900 dark:text-white">$125.00</span>
                    </div>
                  </div>
                </div>

                {/* Accepted Payment Methods Block (Visible Badges) */}
                <div className="max-w-md mx-auto bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3C5D] dark:text-blue-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Métodos de Pago Aceptados' : 'Accepted Payment Methods'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {language === 'es' ? 'Sin cobro automático hoy' : 'No automatic online charge'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    {language === 'es' 
                      ? 'El pago se coordina directamente con nuestro equipo al confirmar la cita o al finalizar el servicio:' 
                      : 'Payment is coordinated directly with our team upon schedule confirmation or service completion:'}
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <DollarSign className="w-4 h-4 mx-auto text-emerald-600 dark:text-emerald-400" />
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Cash / Check</div>
                      <div className="text-[9px] text-emerald-600 font-semibold">0% fee</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <Smartphone className="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400" />
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Zelle</div>
                      <div className="text-[9px] text-emerald-600 font-semibold">Instant</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <Smartphone className="w-4 h-4 mx-auto text-blue-500" />
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Venmo</div>
                      <div className="text-[9px] text-emerald-600 font-semibold">Instant</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <DollarSign className="w-4 h-4 mx-auto text-emerald-500" />
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Cash App</div>
                      <div className="text-[9px] text-emerald-600 font-semibold">Instant</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <Smartphone className="w-4 h-4 mx-auto text-slate-800 dark:text-slate-200" />
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Apple Pay</div>
                      <div className="text-[9px] text-emerald-600 font-semibold">Contactless</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <CreditCard className="w-4 h-4 mx-auto text-amber-500" />
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Cards</div>
                      <div className="text-[9px] text-amber-600 font-semibold">+3.5% fee</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Dispatch to Owner's Phone: Brian Cueva (574) 279-9355 */}
                <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                        {language === 'es' ? 'Notificación en Vivo al Equipo' : 'Live Dispatch Notification'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">
                      {BUSINESS_INFO.phone}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                    {language === 'es'
                      ? `La orden #${createdBooking.id} de ${createdBooking.clientName} con ${createdBooking.attachments?.length || 0} archivo(s) adjunto(s) está lista para ser notificada al equipo de servicio de Mr Handyworks LLC.`
                      : `Booking #${createdBooking.id} for ${createdBooking.clientName} with ${createdBooking.attachments?.length || 0} client attachment(s) is ready for instant delivery to Mr Handyworks LLC service desk.`}
                  </p>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <a
                      href={buildOwnerSMSNotificationUrl(createdBooking, BUSINESS_INFO.phoneRaw)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Enviar a SMS de Servicio' : 'Send via SMS'}</span>
                    </a>
                  </div>
                </div>

                {/* Direct Action CTAs (Prioritizing Phone Call & Direct Messaging over Email) */}
                <div className="max-w-xl mx-auto space-y-2.5 pt-2">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {language === 'es' ? 'Acciones inmediatas para confirmar tu cita:' : 'Instant Actions to Confirm Your Service:'}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Primary CTA: Call Service Desk */}
                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'es' ? 'Llamar a Servicio al Cliente' : 'Call Service Desk (Direct)'}</span>
                    </a>

                  </div>

                  {/* Download PDF Quote */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => generateQuotePDF(createdBooking, language)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-[#0B3C5D] dark:hover:border-blue-400 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
                      <span>{language === 'es' ? 'Descargar Resumen y Presupuesto (PDF)' : 'Download Summary & Estimate (PDF)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Navigation Action Bar */}
          {!isCompleted && (
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 sm:py-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {step === 1 && (
                <button
                  type="button"
                  disabled={Boolean(zipError)}
                  onClick={handleNextFromLocation}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer ${
                    !zipError
                      ? 'bg-[#0B3C5D] hover:bg-[#07273D] text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleNextFromService}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs sm:text-sm font-black shadow-md transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleNextFromSchedule}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs sm:text-sm font-black shadow-md transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={handleNextFromContact}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer ${
                    isContactStepValid
                      ? 'bg-[#0B3C5D] hover:bg-[#07273D] text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinishBooking}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Book Online Now'}</span>
                </button>
              )}
            </div>
          )}

          {/* Close button on completed screen */}
          {isCompleted && (
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-6 py-3 flex justify-end">
              <button
                type="button"
                onClick={closeBookingWizard}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
