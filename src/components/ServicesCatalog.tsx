import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, Service } from '../types';
import { 
  Tv, 
  Speaker, 
  Wrench, 
  Hammer, 
  Paintbrush, 
  DoorOpen, 
  Layers, 
  Lightbulb, 
  Clock, 
  DollarSign, 
  Check, 
  ArrowRight, 
  Sparkles,
  Search,
  ShieldCheck
} from 'lucide-react';
import { ReviewsTickerCard } from './ReviewsTickerCard';

export const ServicesCatalog: React.FC = () => {
  const { t, language, services, openBookingWizard } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv': return <Tv className="w-6 h-6 text-amber-500" />;
      case 'Speaker': return <Speaker className="w-6 h-6 text-indigo-500" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-emerald-500" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-purple-500" />;
      case 'DoorOpen': return <DoorOpen className="w-6 h-6 text-rose-500" />;
      case 'Layers': return <Layers className="w-6 h-6 text-amber-600" />;
      default: return <Lightbulb className="w-6 h-6 text-amber-500" />;
    }
  };

  const categories = [
    { id: 'ALL', label: t.services.allCategories },
    { id: 'TV_MOUNTING', label: t.services.filterTv },
    { id: 'HOME_THEATER', label: 'Home Theater' },
    { id: 'REPAIRS', label: t.services.filterRepairs },
    { id: 'ASSEMBLY', label: t.services.filterAssembly },
    { id: 'PAINTING', label: t.services.filterPainting },
    { id: 'DOORS_WINDOWS', label: t.services.filterDoors },
    { id: 'CARPENTRY', label: t.services.filterCarpentry }
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'ALL' || service.category === activeCategory;
    const title = language === 'es' ? service.titleEs : service.titleEn;
    const desc = language === 'es' ? service.descEs : service.descEn;
    const matchesSearch = searchQuery === '' || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="servicios" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Servicios Residenciales' : 'Residential Handyman Services'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.services.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {t.services.subtitle}
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-4 mb-10">
          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'es' ? 'Buscar servicio (ej: TV, pintura, cerradura...)' : 'Search service (e.g. TV, painting, lock...)'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] dark:focus:ring-blue-500"
            />
          </div>

          {/* Categories Pill Container */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto px-2 py-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0B3C5D] text-white shadow-md shadow-[#0B3C5D]/20 dark:bg-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-[#0B3C5D]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consultation & Deposit Policy Banner */}
        <div className="mb-10 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0B3C5D] text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-extrabold text-[#0B3C5D] dark:text-blue-300 block text-sm sm:text-base">
                {language === 'es' ? 'Consultas en Sitio inician en $125' : 'On-Site Consultations start at $125'}
              </span>
              <span className="mt-0.5 block text-slate-600 dark:text-slate-400">
                {language === 'es'
                  ? 'Los estimados se basan en condiciones visibles y alcance acordado. Coordinación directa con el equipo de Mr Handyworks LLC.'
                  : 'Estimates are based on visible conditions and agreed scope. Direct coordination with the Mr Handyworks LLC team.'}
              </span>
            </div>
          </div>
          <button
            onClick={() => openBookingWizard()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {t.services.bookService}
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map(service => {
            const title = language === 'es' ? service.titleEs : service.titleEn;
            const desc = language === 'es' ? service.descEs : service.descEn;

            return (
              <div 
                key={service.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-[#0B3C5D]/40 transition-all duration-300"
              >
                <div>
                  {/* Top Category Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {getIcon(service.iconName)}
                    </div>
                    {service.popular && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        {t.services.popularBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B3C5D] dark:group-hover:text-blue-300 transition-colors">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Bottom Stats & Action */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.services.estimatedHours} <strong className="text-slate-800 dark:text-slate-200">{service.estimatedHours}</strong></span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#0B3C5D] dark:text-blue-300">
                      <span>
                        {language === 'es'
                          ? 'Consulta: $125 (Precio varía por horas)'
                          : 'Consultation: $125 (Varies by hours)'}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingWizard({ serviceId: service.id })}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#0B3C5D] hover:bg-[#07273D] text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.services.bookService}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>



        {/* Live Reviews Carousel Block */}
        <ReviewsTickerCard />

      </div>
    </section>
  );
};
