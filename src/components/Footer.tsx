import React from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/initialData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  Lock, 
  ArrowUp,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t, openBookingWizard, businessInfo, navigateTo } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 transition-colors">
      
      {/* Upper CTA Banner with Soft Corporate Theme */}
      <div className="bg-slate-800 dark:bg-[#101724] py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">
              {language === 'es' ? '¿Listo para renovar o reparar tu hogar?' : 'Ready to repair or upgrade your home?'}
            </h3>
            <p className="text-slate-300 text-sm">
              {language === 'es' 
                ? 'Respuesta en menos de 2 horas. Presupuestos claros y sin sorpresas.' 
                : 'Responses under 2 hours. Clear upfront pricing with zero surprises.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBookingWizard()}
              className="px-6 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              {t.hero.ctaQuote}
            </button>
            <a
              href={`tel:${businessInfo.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-300" />
              <span>{businessInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-blue-400/40 bg-white">
                <img 
                  src="/images/mr_handyworks_logo.jpg" 
                  alt="Mr Handyworks Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-xl tracking-tight text-white">
                  MR HANDYWORKS LLC
                </h4>
                <p className="text-xs text-blue-300 font-bold">
                  Brian Cueva • Master Craftsman
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {language === 'es' 
                ? 'Servicios profesionales de ensamblaje, montaje de TV, pintura, carpintería y remodelación residencial en South Bend, Mishawaka, Granger y Elkhart.' 
                : 'Top-tier home repair, TV wall mounting, interior painting, and residential renovations across Michiana and St. Joseph County.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </span>
              <span className="font-bold">5.0 / 5.0</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-300 font-bold">Thumbtack Top Pro</span>
            </div>
          </div>

          {/* Quick Section Nav Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
              {language === 'es' ? 'Navegación' : 'Navigation'}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors cursor-pointer">
                  {language === 'es' ? 'Inicio' : 'Home'}
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors cursor-pointer">
                  {language === 'es' ? 'Servicios y Tarifas' : 'Services & Rates'}
                </a>
              </li>
              <li>
                <a href="#cotizador" className="hover:text-white transition-colors cursor-pointer">
                  {language === 'es' ? 'Cotizador Online' : 'Instant Estimate'}
                </a>
              </li>
              <li>
                <a href="#proyectos" className="hover:text-white transition-colors cursor-pointer">
                  {language === 'es' ? 'Fotos y Trabajos' : 'Photo Gallery'}
                </a>
              </li>
              <li>
                <a href="#resenas" className="hover:text-white transition-colors cursor-pointer">
                  {language === 'es' ? 'Reseñas de Clientes' : 'Client Reviews'}
                </a>
              </li>
              <li>
                <a href="#credenciales" className="hover:text-white transition-colors cursor-pointer">
                  {language === 'es' ? 'Garantía y Seguro' : 'Guarantee & Insurance'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contacts */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              {language === 'es' ? 'Contacto Directo' : 'Direct Contact'}
            </h5>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>brian@mrhandyworks.com</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>South Bend, IN 46617</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Service Areas */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              {language === 'es' ? 'Área de Cobertura' : 'Service Areas'}
            </h5>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• South Bend, IN</li>
              <li>• Mishawaka, IN</li>
              <li>• Granger, IN</li>
              <li>• Elkhart, IN</li>
              <li>• Notre Dame Campus Area</li>
              <li>• St. Joseph County</li>
            </ul>
          </div>

          {/* Col 5: Verified Badges & Discrete Portal */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              {language === 'es' ? 'Garantía & Seguros' : 'Insurance & Trust'}
            </h5>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Checkr Background Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Award className="w-4 h-4" />
                <span>$1,000,000 General Liability</span>
              </div>
              <a
                href={BUSINESS_INFO.thumbtackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <span>Thumbtack Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Discrete Admin Link in Footer */}
            <div className="pt-4">
              <button
                onClick={() => navigateTo('admin')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>{t.nav.adminLogin}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Mr Handyworks LLC. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'} Owner: Brian Cueva.
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>{language === 'es' ? 'Volver arriba' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
