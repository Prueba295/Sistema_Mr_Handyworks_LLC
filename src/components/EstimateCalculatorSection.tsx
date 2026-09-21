import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
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
  Info
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const EstimateCalculatorSection: React.FC = () => {
  const { language, openBookingWizard } = useApp();

  const [serviceType, setServiceType] = useState('tv');
  const [hours, setHours] = useState(2);
  const [hardwareIncluded, setHardwareIncluded] = useState(true);
  const [urgency, setUrgency] = useState<'standard' | 'priority'>('standard');

  // Pricing calculation
  const baseRates: Record<string, { hourly: number; base: number; labelEs: string; labelEn: string }> = {
    tv: { hourly: 45, base: 75, labelEs: 'Montaje de TV y Audio', labelEn: 'TV Mounting & Audio' },
    drywall: { hourly: 50, base: 70, labelEs: 'Drywall, Yeso y Pintura', labelEn: 'Drywall & Painting' },
    assembly: { hourly: 40, base: 60, labelEs: 'Ensamblaje de Muebles / Gimnasio', labelEn: 'Furniture / Gym Assembly' },
    doors: { hourly: 48, base: 75, labelEs: 'Puertas de Granero y Cerraduras', labelEn: 'Barn Doors & Locks' },
    plumbing: { hourly: 55, base: 85, labelEs: 'Fontanería Menor y Grifería', labelEn: 'Minor Plumbing & Fixtures' },
    carpentry: { hourly: 52, base: 80, labelEs: 'Repisas Flotantes y Carpintería', labelEn: 'Shelving & Woodwork' },
  };

  const currentRate = baseRates[serviceType] || baseRates.tv;
  const hardwareCost = hardwareIncluded ? 25 : 0;
  const urgencyMultiplier = urgency === 'priority' ? 1.25 : 1.0;

  const estimatedTotal = Math.round((currentRate.base + currentRate.hourly * (hours - 1) + hardwareCost) * urgencyMultiplier);
  const lowRange = Math.max(70, Math.round(estimatedTotal * 0.92));
  const highRange = Math.round(estimatedTotal * 1.08);

  return (
    <section id="cotizador" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Cotizador Online Instantáneo' : 'Instant Online Estimator'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'es' ? 'Calcula el Valor de tu Proyecto' : 'Calculate Your Project Estimate'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {language === 'es'
              ? 'Estimados transparentes basados en tiempos reales de ejecución y estándares profesionales en South Bend, IN.'
              : 'Transparent upfront estimates based on realistic execution times and professional standards in South Bend, IN.'}
          </p>
        </div>

        {/* Interactive Calculator Bento Box */}
        <div className="bg-white dark:bg-[#1C2636] rounded-3xl p-6 sm:p-10 border border-slate-300 dark:border-slate-700 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Controls Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Service Type Selector */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {language === 'es' ? '1. Tipo de Servicio Principal:' : '1. Select Main Service Type:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(baseRates).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setServiceType(key)}
                    className={`p-3 rounded-xl text-left text-xs font-bold transition-all border cursor-pointer ${
                      serviceType === key
                        ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B3C5D]'
                    }`}
                  >
                    {language === 'es' ? item.labelEs : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Estimated Duration Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {language === 'es' ? '2. Tiempo estimado de mano de obra:' : '2. Estimated Labor Duration:'}
                </label>
                <span className="text-xs sm:text-sm font-black text-[#0B3C5D] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  {hours} {hours === 1 ? (language === 'es' ? 'Hora' : 'Hour') : (language === 'es' ? 'Horas' : 'Hours')}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0B3C5D]"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-semibold">
                <span>1 hr ({language === 'es' ? 'Rápido' : 'Quick'})</span>
                <span>4 hrs ({language === 'es' ? 'Medio día' : 'Half day'})</span>
                <span>8 hrs ({language === 'es' ? 'Día completo' : 'Full day'})</span>
              </div>
            </div>

            {/* 3. Materials & Anchors toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                hardwareIncluded
                  ? 'border-[#0B3C5D] bg-blue-50/70 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
              }`}>
                <input
                  type="checkbox"
                  checked={hardwareIncluded}
                  onChange={(e) => setHardwareIncluded(e.target.checked)}
                  className="mt-1 text-[#0B3C5D] rounded"
                />
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'es' ? 'Fijaciones & Anclajes Pesados' : 'Heavy-Duty Hardware & Anchors'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'es' ? 'Brian aporta anclajes Fischer/Toggle (+ $25)' : 'Pro provides pro anchors/toggles (+ $25)'}
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                urgency === 'priority'
                  ? 'border-[#0B3C5D] bg-blue-50/70 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
              }`}>
                <input
                  type="checkbox"
                  checked={urgency === 'priority'}
                  onChange={(e) => setUrgency(e.target.checked ? 'priority' : 'standard')}
                  className="mt-1 text-[#0B3C5D] rounded"
                />
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'es' ? 'Cita Prioritaria (Hoy / 24h)' : 'Priority Service (24h)'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'es' ? 'Atención urgente garantizada' : 'Fast-track slot on schedule'}
                  </div>
                </div>
              </label>
            </div>

          </div>

          {/* Result Card Right Column (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#131B28] dark:to-[#172132] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-700 shadow-md space-y-6 text-center lg:text-left">
            
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-[#0B3C5D] dark:text-blue-300">
                {language === 'es' ? 'Estimado Preliminar Calculado:' : 'Calculated Estimate Range:'}
              </div>
              
              <div className="mt-2 text-4xl sm:text-5xl font-black text-[#0B3C5D] dark:text-white tracking-tight flex items-baseline justify-center lg:justify-start gap-1">
                <span>${lowRange}</span>
                <span className="text-2xl text-slate-400 font-normal">-</span>
                <span>${highRange}</span>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center lg:justify-start gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Incluye inspección, herramientas y limpieza final.' : 'Includes inspection, pro tooling & clean-up.'}</span>
              </p>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-200 dark:border-slate-700 py-3 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>{language === 'es' ? 'Tarifa Base Inicial:' : 'Base Diagnostic & Setup:'}</span>
                <span className="font-bold">${currentRate.base}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'es' ? `Mano de obra (${hours} hrs):` : `Labor (${hours} hrs):`}</span>
                <span className="font-bold">${currentRate.hourly * (hours - 1)}</span>
              </div>
              {hardwareIncluded && (
                <div className="flex justify-between">
                  <span>{language === 'es' ? 'Materiales & Anclajes de fijación:' : 'Pro Hardware & Anchors:'}</span>
                  <span className="font-bold">$25</span>
                </div>
              )}
            </div>

            {/* Corporate Blue Button */}
            <button
              onClick={() => openBookingWizard()}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#0B3C5D] hover:bg-[#07273D] active:bg-[#051A29] shadow-md shadow-[#0B3C5D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{language === 'es' ? 'Reservar con este Estimado' : 'Book with this Estimate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'es' ? 'Precio garantizado sin cargos ocultos' : 'Guaranteed pricing, no hidden fees'}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
