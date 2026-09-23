import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  FileText,
  DollarSign,
  Layers,
  Wrench,
  Zap,
  Info,
  AlertCircle,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  CalendarCheck,
  Search
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { ReviewsTickerCard } from './ReviewsTickerCard';

export const EstimateCalculatorSection: React.FC = () => {
  const { language, openBookingWizard } = useApp();

  const [selectedService, setSelectedService] = useState('tv');
  const [projectScale, setProjectScale] = useState<'minor' | 'standard' | 'major'>('standard');

  const servicesInfo: Record<string, { labelEs: string; labelEn: string; factorsEs: string[]; factorsEn: string[]; scopeEs: string; scopeEn: string }> = {
    tv: {
      labelEs: 'Montaje de TV y Audio',
      labelEn: 'TV Mounting & Audio',
      factorsEs: [
        'Pared de yeso (drywall), ladrillo, piedra o sobre chimenea',
        'Tamaño de la pantalla (32" hasta 85"+)',
        'Ocultamiento interno de cables vs canaleta exterior',
        'Instalación de barra de sonido o soportes de consola'
      ],
      factorsEn: [
        'Drywall, brick, stone fireplace or solid wood mounting surface',
        'Display diagonal dimension (32" up to 85"+)',
        'In-wall power & HDMI concealment vs surface raceway',
        'Soundbar bracket and streaming box placement'
      ],
      scopeEs: 'Evaluación técnica de resistencia de viga, cableado y anclajes pesados.',
      scopeEn: 'Stud radar testing, weight rating inspection and clean cable pathway.'
    },
    drywall: {
      labelEs: 'Drywall, Yeso y Pintura',
      labelEn: 'Drywall & Painting',
      factorsEs: [
        'Tamaño del área dañada o número de habitaciones',
        'Tipo de textura a igualar (naranja, lisa, drop knock)',
        'Reparación de filtración previa o grietas estructurales',
        'Capas de pintura de acabado y preparación de bordes'
      ],
      factorsEn: [
        'Dimensions of damage or room square footage',
        'Texture matching (orange peel, smooth, knockdown)',
        'Previous leak repair or structural drywall settling',
        'Finish paint coats, primer application and masking'
      ],
      scopeEs: 'Inspección de humedad, nivelación y acabado invisible.',
      scopeEn: 'Moisture assessment, feather sanding and seamless texture match.'
    },
    assembly: {
      labelEs: 'Ensamblaje de Muebles / Gimnasio',
      labelEn: 'Furniture & Gym Assembly',
      factorsEs: [
        'Cantidad de componentes y complejidad del manual',
        'Muebles modulares grandes (IKEA Pax, escritorios ejecutivos)',
        'Máquinas de gimnasio con poleas y calibración de peso',
        'Anclaje antivuelco a pared para seguridad de niños'
      ],
      factorsEn: [
        'Total part count and assembly manual intricacy',
        'Large modular systems (IKEA Pax wardrobes, executive desks)',
        'Home gym equipment with cables, pulleys and weight stacks',
        'Anti-tip wall anchoring for child safety compliance'
      ],
      scopeEs: 'Calibración milimétrica, fijaciones de refuerzo y retiro de empaques.',
      scopeEn: 'Level calibration, heavy wall anchors and packaging removal.'
    },
    doors: {
      labelEs: 'Puertas de Granero y Cerraduras',
      labelEn: 'Barn Doors & Smart Locks',
      factorsEs: [
        'Peso de la hoja de puerta (madera sólida vs núcleo hueco)',
        'Instalación de viga de soporte / cabezal de carga',
        'Cerraduras inteligentes digitales y ajuste de marco',
        'Nivelación y burletes de aislamiento térmico'
      ],
      factorsEn: [
        'Door slab weight (solid wood vs hollow core)',
        'Structural header support board installation',
        'Smart deadbolt integration and strike plate alignment',
        'Level sliding glide adjustment and weatherstripping'
      ],
      scopeEs: 'Revisión de plomada, seguridad en marco y deslizamiento suave.',
      scopeEn: 'Plumb check, heavy track bolting and frictionless travel.'
    },
    plumbing: {
      labelEs: 'Fontanería Menor y Grifería',
      labelEn: 'Minor Plumbing & Fixtures',
      factorsEs: [
        'Tipo de grifo, lavabo, inodoro o triturador de basura',
        'Condición de las válvulas de cierre y tuberías existentes',
        'Acceso debajo del gabinete o detrás del tabique',
        'Prueba de estanqueidad y sellado de silicona impermeable'
      ],
      factorsEn: [
        'Fixture type (sink faucet, toilet replacement, garbage disposal)',
        'Condition of shut-off angle valves and copper/PEX lines',
        'Under-sink cabinet clearances and drain slope',
        'High-pressure seal testing and waterproof silicone'
      ],
      scopeEs: 'Verificación de presión, sellos anti-fuga y drenaje óptimo.',
      scopeEn: 'Pressure testing, anti-leak gaskets and optimal drain flow.'
    },
    carpentry: {
      labelEs: 'Repisas Flotantes y Carpintería',
      labelEn: 'Shelving & Finish Carpentry',
      factorsEs: [
        'Longitud y profundidad de las repisas',
        'Capacidad de carga requerida (libros, adornos pesados)',
        'Integración de iluminación LED oculta',
        'Molduras decorativas, zócalos o revestimiento shiplap'
      ],
      factorsEn: [
        'Shelf span length, depth and wood species',
        'Required load capacity (heavy books, dinnerware)',
        'Concealed warm LED wiring integration',
        'Crown molding, baseboard casing or shiplap wall accent'
      ],
      scopeEs: 'Anclaje estructural directo a vigas con nivelación 3D.',
      scopeEn: 'Direct stud structural mounting with precision laser level.'
    }
  };

  const currentInfo = servicesInfo[selectedService] || servicesInfo.tv;

  return (
    <section id="cotizador" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Transparencia Total • Política de Precios' : 'Clear Terms • Pricing Policy'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'es' ? 'Consulta en Sitio y Cotización Justa' : 'On-Site Consultation & Custom Estimates'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {language === 'es'
              ? 'No publicamos precios fijos arbitrarios: cada proyecto es único y el valor exacto varía según las horas de trabajo, el tamaño y el tipo de instalación requerida.'
              : 'We do not publish rigid flat rates: every home is unique, and final pricing varies based on labor hours, project size, and installation requirements.'}
          </p>
        </div>

        {/* Bento Box Container */}
        <div className="bg-white dark:bg-[#1C2636] rounded-3xl p-6 sm:p-10 border border-slate-300 dark:border-slate-700 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Scope Evaluator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Service selector */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                {language === 'es' ? '1. Selecciona la especialidad de tu proyecto:' : '1. Select Your Project Area:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(servicesInfo).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedService(key)}
                    className={`p-3 rounded-xl text-left text-xs font-bold transition-all border cursor-pointer ${
                      selectedService === key
                        ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B3C5D]'
                    }`}
                  >
                    {language === 'es' ? item.labelEs : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale / Magnitude of project */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {language === 'es' ? '2. Magnitud estimada del trabajo:' : '2. Estimated Project Magnitude:'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'minor', labelEs: 'Puntual / Menor', labelEn: 'Quick / Small', descEs: '< 2 horas', descEn: '< 2 hours' },
                  { id: 'standard', labelEs: 'Estándar', labelEn: 'Standard', descEs: '2 a 5 horas', descEn: '2 to 5 hours' },
                  { id: 'major', labelEs: 'Proyecto Amplio', labelEn: 'Extensive', descEs: 'Día completo (5+ hrs)', descEn: 'Full Day (5+ hrs)' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectScale(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      projectScale === item.id
                        ? 'border-[#0B3C5D] dark:border-blue-400 bg-[#0B3C5D]/5 dark:bg-blue-500/10 ring-2 ring-[#0B3C5D] dark:ring-blue-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {language === 'es' ? item.labelEs : item.labelEn}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {language === 'es' ? item.descEs : item.descEn}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* What Brian Evaluates */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0B3C5D] dark:text-blue-300">
                <Wrench className="w-4 h-4" />
                <span>
                  {language === 'es' 
                    ? `Factores que determinan el costo en ${currentInfo.labelEs}:` 
                    : `Factors determining final cost for ${currentInfo.labelEn}:`}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {(language === 'es' ? currentInfo.factorsEs : currentInfo.factorsEn).map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                💡 {language === 'es' ? currentInfo.scopeEs : currentInfo.scopeEn}
              </p>
            </div>

            {/* Policy Box on Booking and Direct Coordination */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block font-black mb-1">
                  {language === 'es' ? 'Política de Estimados y Consultas en Sitio:' : 'Estimates & On-Site Consultation Policy:'}
                </strong>
                {language === 'es'
                  ? 'Las consultas en sitio inician en $125. Los estimados se basan en las condiciones visibles y el alcance acordado al momento de la evaluación. La confirmación y detalles se coordinan directamente con el equipo de Mr Handyworks LLC.'
                  : 'On-site consultations start at $125. Estimates are based on visible conditions and agreed scope at evaluation. Confirmation and details are coordinated directly with the Mr Handyworks LLC team.'}
              </div>
            </div>

          </div>

          {/* Right Column: Formal Consultation Rates & Payment Options (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#131B28] dark:to-[#172132] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-700 shadow-md space-y-6">
            
            {/* Consultation Fee Card */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-black mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Tarifa Oficial Declarada' : 'Official Stated Rate'}</span>
              </div>

              <div className="text-xs uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                {language === 'es' ? 'Consulta en Sitio (Inicia en):' : 'On-Site Diagnostic & Consultation (Starts at):'}
              </div>
              
              <div className="mt-2 text-4xl sm:text-5xl font-black text-[#0B3C5D] dark:text-white tracking-tight">
                $125
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {language === 'es'
                  ? 'Incluye visita técnica en tu domicilio por un profesional de Mr Handyworks LLC, inspección con instrumental técnico y propuesta formal adaptada a tus necesidades.'
                  : 'Includes on-site visit by a Mr Handyworks LLC professional, precision diagnostics, and tailored scope review for your home.'}
              </p>
            </div>

            {/* Coordination Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {language === 'es' ? 'Confirmación de Agenda:' : 'Booking Confirmation:'}
                </span>
                <span className="text-xs font-black text-[#0B3C5D] dark:text-blue-400">
                  {language === 'es' ? 'Llamada o SMS' : 'Call or SMS'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{language === 'es' ? 'Canal de Coordinación:' : 'Coordination Channel:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {language === 'es' ? 'Línea Directa / SMS' : 'Direct Call / SMS'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{language === 'es' ? 'Costo del Trabajo:' : 'Service Work:'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Varía según horas y tamaño' : 'Varies by hours & scope'}
                </span>
              </div>
            </div>

            {/* Payment Methods Breakdown */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {language === 'es' ? 'Métodos de Pago Aceptados:' : 'Accepted Payment Methods:'}
              </div>

              <div className="space-y-2 text-xs">
                {/* Apps fee-free */}
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">Zelle • Venmo • Cash App • Apple Pay</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    {language === 'es' ? 'Sin comisión' : '0% Fee'}
                  </span>
                </div>

                {/* Cards with 3.5% fee */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {language === 'es' ? 'Tarjetas de Débito o Crédito' : 'Debit or Credit Cards'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    +3.5% {language === 'es' ? 'sistema' : 'fee'}
                  </span>
                </div>

                {/* Cash or check */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {language === 'es' ? 'Efectivo (Cash) o Cheque (Check)' : 'Cash or Check'}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {language === 'es' ? 'Saldo al completar' : 'Upon completion'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => openBookingWizard({ serviceId: selectedService })}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#0B3C5D] hover:bg-[#07273D] active:bg-[#051A29] shadow-md shadow-[#0B3C5D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{language === 'es' ? 'Solicitar Consulta en Sitio' : 'Request On-Site Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'es'
                  ? 'Coordinación directa vía llamada o SMS con Mr Handyworks LLC'
                  : 'Direct communication via phone call or SMS with Mr Handyworks LLC'}
              </span>
            </div>

          </div>

        </div>

        {/* Live Reviews Carousel Block */}
        <ReviewsTickerCard />

      </div>
    </section>
  );
};
