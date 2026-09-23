import React from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/initialData';
import { 
  ShieldCheck, 
  Award, 
  FileCheck, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  UserCheck, 
  Wrench,
  ExternalLink
} from 'lucide-react';

export const Credentials: React.FC = () => {
  const { t, language, openBookingWizard } = useApp();

  return (
    <section id="credenciales" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Garantía, Seguro y Credenciales' : 'Guarantee, Insurance & Credentials'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.credentials.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {t.credentials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brian Cueva's Profile & Personal Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Story Card */}
            <div className="bg-white dark:bg-[#1C2636] rounded-2xl p-6 sm:p-8 border border-slate-300 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#0B3C5D] shadow-sm bg-white shrink-0">
                  <img 
                    src="/logo_handyworks.jpeg"
                    alt="Brian Cueva - Mr Handyworks LLC" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                    {language === 'es' ? 'Conoce al Fundador • Meet the Owner' : 'Meet the Owner'}
                  </span>
                  <h3 className="font-black text-xl text-[#0B3C5D] dark:text-white">
                    Brian Cueva
                  </h3>
                  <p className="text-sm font-bold text-slate-600 dark:text-blue-300">
                    Owner, Mr Handyworks LLC
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    South Bend, Indiana • {BUSINESS_INFO.phone}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {t.credentials.bio1}
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {t.credentials.bio2}
              </p>

              <div className="pt-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#0B3C5D] dark:text-blue-300 mb-3">
                  {t.credentials.guaranteeTitle}
                </h4>
                <ul className="space-y-2.5">
                  {t.credentials.guarantees.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => openBookingWizard()}
                  className="px-5 py-2.5 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  {language === 'es' ? 'Solicitar Servicio' : 'Request Service'}
                </button>
                <a
                  href={BUSINESS_INFO.thumbtackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:border-[#0B3C5D] transition-colors"
                >
                  <span>{language === 'es' ? 'Ver Perfil en Thumbtack' : 'View Thumbtack Profile'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Formal Credentials Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Card 1: Top Pro Status */}
            <div className="bg-white dark:bg-[#1C2636] rounded-2xl p-5 sm:p-6 border border-slate-300 dark:border-slate-700 shadow-xs hover:border-[#0B3C5D] transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {t.credentials.certTopPro}
                    </h4>
                    <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300">
                      Top 3%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {t.credentials.certTopProDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Background Checked */}
            <div className="bg-white dark:bg-[#1C2636] rounded-2xl p-5 sm:p-6 border border-slate-300 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {t.credentials.certBg}
                    </h4>
                    <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      Checkr Verified
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {t.credentials.certBgDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Insured & Bonded */}
            <div className="bg-white dark:bg-[#1C2636] rounded-2xl p-5 sm:p-6 border border-slate-300 dark:border-slate-700 shadow-xs hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {t.credentials.certInsured}
                    </h4>
                    <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300">
                      $1,000,000 Policy
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {t.credentials.certInsuredDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Precision Tools & Cleanliness */}
            <div className="bg-white dark:bg-[#1C2636] rounded-2xl p-5 sm:p-6 border border-slate-300 dark:border-slate-700 shadow-xs hover:border-[#0B3C5D] transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0B3C5D] dark:text-blue-400 shrink-0">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'es' ? 'Herramientas de Precisión y Nivel Láser' : 'Laser Level Precision & Pro Gear'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {language === 'es'
                      ? 'Uso de localizadores de vigas magnéticos y radares, niveles láser 3D, y aspiradoras con filtro HEPA para no dejar polvo residual.'
                      : 'Commercial stud radars, 3D cross-line laser alignment, and HEPA filtered extraction to keep your living quarters dust-free.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
