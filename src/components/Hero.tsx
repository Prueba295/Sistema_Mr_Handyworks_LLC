import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Sparkles,
  MapPin,
  Share2,
  Briefcase,
  CreditCard
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { 
    language, 
    openBookingWizard, 
    showNotification,
    businessInfo,
    reviews
  } = useApp();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mr Handyworks LLC - Brian Cueva',
        text: 'Top Pro Handyman en South Bend, IN. Calificación 5.0 (79 Reseñas).',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification(language === 'es' ? '¡Enlace copiado al portapapeles!' : 'Link copied to clipboard!');
    }
  };

  return (
    <section id="inicio" className="pt-4 pb-12 sm:pb-16 bg-[#F4F6F9] dark:bg-[#0F1722] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Banner */}
        <div className="bg-white dark:bg-[#151E2B] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Profile Avatar / Emblem */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#0B3C5D] dark:border-blue-500 shadow-md bg-white shrink-0">
                <img 
                  src="/logo_handy.webp" 
                  alt="Brian Cueva - Mr Handyworks LLC" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B3C5D] dark:text-white tracking-tight">
                  {businessInfo.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                  <a 
                    href="#resenas"
                    className="inline-flex items-center gap-1 font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-[#0B3C5D] dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="text-emerald-700 dark:text-emerald-400 font-black">Exceptional 5.0</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-slate-500 text-xs sm:text-sm font-normal">({reviews.length} {language === 'es' ? 'reseñas' : 'reviews'})</span>
                  </a>

                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    <Award className="w-3 h-3 text-blue-600" />
                    <span>Top Pro</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{businessInfo.cityState}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                title="Compartir perfil"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'es' ? 'Compartir' : 'Share'}</span>
              </button>

              <a
                href={`tel:${businessInfo.phoneRaw}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-[#0B3C5D] hover:bg-[#07273D] text-white shadow-sm transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-blue-200" />
                <span>{language === 'es' ? 'Llamar a Brian' : 'Call Brian'}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Split Grid: Left Details & Right Fast Action Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): About, Verified Stats, Hours, Payment methods */}
          <div className="lg:col-span-7 space-y-6">

            {/* About Card */}
            <div className="bg-white dark:bg-[#151E2B] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-xl font-extrabold text-[#0B3C5D] dark:text-white">
                {language === 'es' ? 'Lo esencial de nuestro servicio' : 'What matters most about our service'}
              </h2>
              
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                <p>
                  {language === 'es' ? businessInfo.bioEs : businessInfo.bioEn}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {['TV Mounting', 'Painting', 'Assembly', 'Repairs', 'Carpentry'].map((item) => (
                  <span key={item} className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    {item}
                  </span>
                ))}
              </div>

              {/* Quick Action links */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#servicios"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-blue-200" />
                  <span>{language === 'es' ? 'Ver Servicios y Tarifas' : 'View Services & Rates'}</span>
                </a>
                <a
                  href="#cotizador"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0B3C5D] dark:text-blue-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{language === 'es' ? 'Calcular Presupuesto Online' : 'Calculate Instant Estimate'}</span>
                </a>
              </div>
            </div>

            {/* Overview Bento Card (Verified Facts) */}
            <div className="bg-white dark:bg-[#151E2B] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <h3 className="text-lg font-extrabold text-[#0B3C5D] dark:text-white mb-4">
                {language === 'es' ? 'Garantía y Credenciales Verificadas' : 'Verified Credentials & Track Record'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Award className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Thumbtack Top Pro</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'es' ? 'Top 3% mejor calificados' : 'Top 3% rated handyman'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Briefcase className="w-5 h-5 text-[#0B3C5D] dark:text-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">100+ Jobs Completed</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'es' ? 'Proyectos residenciales' : 'Residential projects in IN'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{language === 'es' ? 'Seguro por $1,000,000' : '$1,000,000 Liability'}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{language === 'es' ? 'Póliza activa y verificada' : 'Active verified policy'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Background Checked</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Checkr Certified 100%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours & Payment Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Business Hours */}
              <div className="bg-white dark:bg-[#151E2B] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <h4 className="font-bold text-sm text-[#0B3C5D] dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
                  <span>{language === 'es' ? 'Horario de Atención' : 'Business hours'}</span>
                </h4>
                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold">{businessInfo.hoursDays}</span>
                    <span>{businessInfo.hoursTime}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-500">
                    <span>{businessInfo.hoursSunday}</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-[#151E2B] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <h4 className="font-bold text-sm text-[#0B3C5D] dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
                  <span>{language === 'es' ? 'Métodos de Pago' : 'Payment methods'}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Acepta Zelle, Apple Pay, Efectivo, Tarjeta, PayPal y Venmo al finalizar el trabajo.'
                    : 'Accepts Zelle, Apple Pay, Cash, Credit card, PayPal, and Venmo upon job completion.'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {businessInfo.paymentMethods.map((method, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Fast Direct Action Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-[#151E2B] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#0B3C5D] dark:text-white">
                    {language === 'es' ? 'Solicita tu Servicio' : 'Book a Service'}
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{language === 'es' ? 'Respuesta < 2h' : 'Responds in < 2h'}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'es' 
                    ? 'Atención directa de Brian Cueva. Presupuesto sin sorpresas.' 
                    : 'Direct attention from Brian Cueva. Upfront pricing with zero surprises.'}
                </p>
              </div>

              {/* Call to action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => openBookingWizard()}
                  className="w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#0B3C5D] hover:bg-[#07273D] active:bg-[#051A29] shadow-md shadow-[#0B3C5D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>{language === 'es' ? 'Pedir Cotización en Línea' : 'Request Estimate Online'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${businessInfo.phoneRaw}`}
                  className="w-full py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
                  <span>{language === 'es' ? `Llamar: ${businessInfo.phone}` : `Call: ${businessInfo.phone}`}</span>
                </a>
              </div>

              {/* Service Areas */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0B3C5D] dark:text-blue-400" />
                  <span>{language === 'es' ? 'Zona de Cobertura en Indiana:' : 'Service Coverage Area:'}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {language === 'es'
                    ? 'South Bend, Mishawaka, Granger, Elkhart y áreas cercanas en St. Joseph County.'
                    : 'South Bend, Mishawaka, Granger, Elkhart, and surrounding St. Joseph County communities.'}
                </p>
              </div>

              {/* Guarantee Note */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B3C5D] dark:text-blue-300">
                    {language === 'es' ? 'Garantía Total de Trabajo:' : 'Workmanship Guarantee:'}
                  </span>{' '}
                  {language === 'es'
                    ? 'Cada servicio cuenta con garantía de mano de obra y respaldo de seguro comercial.'
                    : "Every project comes with workmanship warranty and active commercial liability coverage."}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
