import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO, PROJECT_TYPE_OPTIONS, REAL_SERVICE_OPTIONS } from '../data/initialData';
import { generateQuotePDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  Clock, 
  MapPin, 
  DollarSign, 
  CreditCard, 
  QrCode, 
  Calendar as CalendarIcon, 
  Phone, 
  Sparkles, 
  Download, 
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const BookingWizardModal: React.FC = () => {
  const { 
    isBookingWizardOpen, 
    closeBookingWizard, 
    bookingWizardInitialData, 
    services, 
    availability, 
    addBooking, 
    setIsQRModalOpen, 
    setActiveQRProvider,
    qrMethods,
    language, 
    t,
    showNotification 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Step 1 Form fields
  const [selectedServiceId, setSelectedServiceId] = useState<string>('tv-mount');
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('46617');
  const [isZipValid, setIsZipValid] = useState<boolean>(true);
  const [durationTier, setDurationTier] = useState<string>('2-5 hrs');
  const [projectType, setProjectType] = useState<string>('Repairs');

  // Step 2 Form fields
  const [projectDetails, setProjectDetails] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Step 3 Form fields
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-22');
  const [scheduledSlot, setScheduledSlot] = useState<string>('09:00 AM - 11:30 AM');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'QR_CODE' | 'STRIPE' | 'ON_COMPLETION'>('QR_CODE');
  const [qrChoice, setQrChoice] = useState<string>('Zelle');

  // Initialize or prefill from trigger
  useEffect(() => {
    if (bookingWizardInitialData) {
      if (bookingWizardInitialData.serviceId) {
        setSelectedServiceId(bookingWizardInitialData.serviceId);
      }
      if (bookingWizardInitialData.date) {
        setScheduledDate(bookingWizardInitialData.date);
      }
      if (bookingWizardInitialData.timeSlot) {
        setScheduledSlot(bookingWizardInitialData.timeSlot);
      }
    }
  }, [bookingWizardInitialData]);

  // Zip validation (South Bend / Mishawaka / Granger / Elkhart region: 465xx, 466xx, etc.)
  useEffect(() => {
    const validArea = /^46[5-6][0-9]{2}$/.test(zipCode.trim()) || zipCode.length >= 5;
    setIsZipValid(validArea);
  }, [zipCode]);

  if (!isBookingWizardOpen) return null;

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedServiceName = currentService && currentService.id === selectedServiceId
    ? (language === 'es' ? currentService.titleEs : currentService.titleEn)
    : selectedServiceId;

  // Calculate estimated price based on duration tier
  const calculateEstimatedPrice = (): number => {
    switch (durationTier) {
      case '< 2 hrs': return 145;
      case '2-5 hrs': return 260;
      case 'Full Day (5+ hrs)': return 480;
      default: return 220;
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      urls.push(URL.createObjectURL(file));
    }
    setUploadedPhotos(prev => [...prev, ...urls]);
  };

  const handleFinishBooking = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      showNotification(language === 'es' ? 'Por favor completa tu nombre y teléfono de contacto.' : 'Please enter your name and phone number.');
      return;
    }

    const price = calculateEstimatedPrice();
    const isDeposit = paymentMethod === 'QR_CODE' || paymentMethod === 'STRIPE';

    const mappedPayment: 'ZELLE' | 'PAYPAL' | 'VENMO' | 'CASHAPP' | 'CARD' | 'CASH' =
      paymentMethod === 'STRIPE'
        ? 'CARD'
        : paymentMethod === 'QR_CODE'
        ? (qrChoice.toUpperCase() as 'ZELLE' | 'PAYPAL' | 'VENMO' | 'CASHAPP') || 'ZELLE'
        : 'CASH';

    const newBooking = addBooking({
      serviceType: selectedServiceName,
      zipCode: zipCode.trim() || '46601',
      estimatedHours: durationTier,
      estimatedPrice: price,
      projectDetails: `${projectType}: ${projectDetails.trim() || (language === 'es' ? 'Consulta de servicio estándar' : 'Standard service request')}`,
      photoUrl: uploadedPhotos[0] || undefined,
      scheduledDate,
      scheduledTimeSlot: scheduledSlot,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || 'client@example.com',
      clientAddress: clientAddress.trim() || 'South Bend Area',
      status: 'PENDING',
      paymentMethod: mappedPayment,
      paymentStatus: isDeposit ? 'DEPOSIT_PAID' : 'UNPAID',
      depositAmount: isDeposit ? 50 : undefined
    });

    setCreatedBooking(newBooking);
    setIsCompleted(true);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    if (paymentMethod === 'QR_CODE') {
      const matched = qrMethods.find(q => q.provider.toLowerCase() === qrChoice.toLowerCase()) || qrMethods[0];
      setActiveQRProvider(matched);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#0B3C5D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {t.booking.title}
              </h3>
              <p className="text-xs text-amber-200">
                Mr Handyworks LLC • Brian Cueva
              </p>
            </div>
          </div>
          <button
            onClick={closeBookingWizard}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Indicator (if not completed) */}
        {!isCompleted && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-[#0B3C5D] text-white dark:bg-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </span>
              <span className="text-xs font-bold hidden sm:inline text-slate-700 dark:text-slate-300">
                {t.booking.step1}
              </span>
            </div>

            <div className="w-12 h-0.5 bg-slate-300 dark:bg-slate-700"></div>

            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-[#0B3C5D] text-white dark:bg-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </span>
              <span className="text-xs font-bold hidden sm:inline text-slate-700 dark:text-slate-300">
                {t.booking.step2}
              </span>
            </div>

            <div className="w-12 h-0.5 bg-slate-300 dark:bg-slate-700"></div>

            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-[#0B3C5D] text-white dark:bg-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </span>
              <span className="text-xs font-bold hidden sm:inline text-slate-700 dark:text-slate-300">
                {t.booking.step3}
              </span>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Service Type, Zip, Hours */}
          {!isCompleted && step === 1 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <label className="block text-sm font-black text-[var(--text)]">
                      {language === 'es' ? '1. ¿Qué servicio necesitas?' : '1. What service do you need?'}
                    </label>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {language === 'es' ? 'Elige una opción del catálogo real de Brian.' : 'Choose from Brian\'s real service catalog.'}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[10px] font-black text-[var(--primary)]">
                    {REAL_SERVICE_OPTIONS.length}+ {language === 'es' ? 'opciones' : 'options'}
                  </span>
                </div>

                <input
                  type="search"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder={language === 'es' ? 'Buscar TV, pintura, plomería...' : 'Search TV, painting, plumbing...'}
                  className="mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />

                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  size={5}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {services.map(s => {
                    const label = language === 'es' ? s.titleEs : s.titleEn;
                    if (serviceSearch && !label.toLowerCase().includes(serviceSearch.toLowerCase())) return null;
                    return <option key={s.id} value={s.id}>{label} ({s.rateEstimate})</option>;
                  })}
                  {REAL_SERVICE_OPTIONS.filter(option => !serviceSearch || option.toLowerCase().includes(serviceSearch.toLowerCase())).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="mt-2 text-xs font-bold text-[var(--primary)]">
                  {language === 'es' ? 'Seleccionado:' : 'Selected:'} {selectedServiceName}
                </div>
              </div>

              {/* Zip Code with instant radius check */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  2. {t.booking.zipCode} *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="46601"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  {isZipValid ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'es' ? 'Área de servicio confirmada (St. Joseph County)' : 'Confirmed service area (St. Joseph County)'}
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {language === 'es' ? 'Ingresa tu código postal de 5 dígitos para verificar cobertura.' : 'Please enter a 5-digit zip code to verify coverage.'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {language === 'es' ? '3. Tipo de proyecto' : '3. Project type'}
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {PROJECT_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>

              {/* Hours Duration Calculator */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  4. {t.booking.estimatedHours}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: '< 2 hrs', label: language === 'es' ? '< 2 horas' : '< 2 hours', price: '$145' },
                    { id: '2-5 hrs', label: language === 'es' ? '2 a 5 horas' : '2 to 5 hours', price: '$260' },
                    { id: 'Full Day (5+ hrs)', label: language === 'es' ? 'Día completo (5+ hrs)' : 'Full Day (5+ hrs)', price: '$480+' }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setDurationTier(tier.id)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        durationTier === tier.id
                          ? 'border-[#0B3C5D] dark:border-blue-500 bg-[#0B3C5D]/5 dark:bg-blue-500/10 ring-2 ring-[#0B3C5D] dark:ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {tier.label}
                      </span>
                      <span className="text-sm font-extrabold text-[#0B3C5D] dark:text-amber-400 mt-2">
                        {tier.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  5. {language === 'es' ? 'Fecha preferida' : 'Preferred date'}
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Instant rate estimate box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">
                    {t.booking.calcRate}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'es' ? 'Incluye mano de obra y equipo profesional' : 'Includes professional labor & equipment'}
                  </div>
                </div>
                <div className="text-2xl font-black text-[#0B3C5D] dark:text-amber-300">
                  ${calculateEstimatedPrice()}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Project Description and Photo Upload */}
          {!isCompleted && step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.detailsLabel} *
                </label>
                <textarea
                  rows={4}
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder={t.booking.detailsPlaceholder}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.attachPhoto}
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0B3C5D] dark:hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer relative bg-slate-50/50 dark:bg-slate-800/40 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {language === 'es' ? 'Arrastra fotos del área o haz clic para subir' : 'Drop photos of the project area or click to browse'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {language === 'es' ? 'JPG, PNG hasta 10MB por foto' : 'JPG, PNG up to 10MB each'}
                  </p>
                </div>

                {/* Uploaded Photos Preview Grid */}
                {uploadedPhotos.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {uploadedPhotos.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300">
                        <img src={url} alt="Upload preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Contact, Schedule & Payment Method */}
          {!isCompleted && step === 3 && (
            <div className="space-y-6">
              
              {/* Schedule slot confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.booking.preferredDate}
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.booking.preferredSlot}
                  </label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="09:00 AM - 11:30 AM">09:00 AM - 11:30 AM (Mañana)</option>
                    <option value="11:30 AM - 02:00 PM">11:30 AM - 02:00 PM (Mediodía)</option>
                    <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM (Tarde)</option>
                    <option value="04:30 PM - 07:00 PM">04:30 PM - 07:00 PM (Final de tarde)</option>
                  </select>
                </div>
              </div>

              {/* Client Contact Inputs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {language === 'es' ? 'Tus Datos de Contacto' : 'Your Contact Details'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={t.booking.clientName + ' *'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder={t.booking.clientPhone + ' *'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder={t.booking.clientEmail}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder={t.booking.clientAddress}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t.booking.paymentSectionTitle}
                </label>

                <div className="space-y-2.5">
                  {/* Option 1: QR Code deposit */}
                  <div 
                    onClick={() => setPaymentMethod('QR_CODE')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'QR_CODE'
                        ? 'border-[#0B3C5D] dark:border-blue-500 bg-[#0B3C5D]/5 dark:bg-blue-500/10 ring-2 ring-[#0B3C5D] dark:ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {t.booking.payWithQR}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {language === 'es' ? 'Abono de $50 mediante Zelle, PayPal, Venmo o CashApp' : '$50 deposit via Zelle, PayPal, Venmo, or CashApp'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600">$50 Deposit</span>
                  </div>

                  {/* Option 2: Stripe Tokenization Simulation */}
                  <div 
                    onClick={() => setPaymentMethod('STRIPE')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'STRIPE'
                        ? 'border-[#0B3C5D] dark:border-blue-500 bg-[#0B3C5D]/5 dark:bg-blue-500/10 ring-2 ring-[#0B3C5D] dark:ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {t.booking.payWithCard}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {language === 'es' ? 'Procesamiento encriptado de tarjeta' : 'Encrypted credit/debit card processing'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Stripe Card</span>
                  </div>

                  {/* Option 3: Pay on Completion */}
                  <div 
                    onClick={() => setPaymentMethod('ON_COMPLETION')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'ON_COMPLETION'
                        ? 'border-[#0B3C5D] dark:border-blue-500 bg-[#0B3C5D]/5 dark:bg-blue-500/10 ring-2 ring-[#0B3C5D] dark:ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {t.booking.payCash}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {language === 'es' ? 'Paga al terminar el trabajo y comprobar la calidad' : 'Pay when work is completed to your satisfaction'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">No Upfront</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* CONFIRMATION / COMPLETED SCREEN */}
          {isCompleted && createdBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t.booking.successTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t.booking.successMsg}
                </p>
              </div>

              {/* Reference ID card */}
              <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.booking.successRef}</span>
                  <span className="font-extrabold text-sm text-[#0B3C5D] dark:text-amber-400">
                    {createdBooking.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Cliente' : 'Client'}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{createdBooking.clientName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Cita' : 'Appointment'}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{createdBooking.scheduledDate} ({createdBooking.scheduledTimeSlot})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Total Estimado' : 'Estimated Total'}:</span>
                  <span className="font-bold text-emerald-600">${createdBooking.estimatedPrice}.00</span>
                </div>
              </div>

              {/* Action Buttons: PDF Download + QR Gateway + Call */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => generateQuotePDF(createdBooking, language)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B3C5D] dark:bg-blue-600 hover:bg-[#07273d] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.booking.downloadQuote}</span>
                </button>

                {paymentMethod === 'QR_CODE' && (
                  <button
                    onClick={() => {
                      setIsQRModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{language === 'es' ? 'Ver Código QR para Abono ($50)' : 'Open QR Code for Deposit ($50)'}</span>
                  </button>
                )}

                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:border-[#0B3C5D] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {!isCompleted && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Atrás' : 'Back'}</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B3C5D] hover:bg-[#082a42] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-colors cursor-pointer"
              >
                <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishBooking}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>{t.booking.confirmBookingBtn}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
