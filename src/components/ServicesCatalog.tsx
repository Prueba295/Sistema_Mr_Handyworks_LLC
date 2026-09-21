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
  Search
} from 'lucide-react';

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

          {/* Categories Pill Scroll */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const title = language === 'es' ? service.titleEs : service.titleEn;
            const desc = language === 'es' ? service.descEs : service.descEn;

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl bg-white dark:bg-[#1C2636] p-6 border border-slate-300 dark:border-slate-700 shadow-xs hover:shadow-lg hover:border-[#0B3C5D] dark:hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top bar with Icon & Popular Pill */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {getIcon(service.iconName)}
                    </div>
                    {service.popular && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-500/15 text-[#0B3C5D] dark:text-blue-300 border border-blue-500/20">
                        <Sparkles className="w-3 h-3" />
                        {t.services.popularBadge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-[#0B3C5D] dark:group-hover:text-blue-400 transition-colors">
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
                      <span>{service.rateEstimate}</span>
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

        {/* Custom inquiry banner with softer corporate styling */}
        <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#151E2B] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-black text-lg sm:text-xl text-[#0B3C5D] dark:text-blue-400">
              {language === 'es' ? '¿Tienes un proyecto personalizado en mente?' : 'Have a custom residential project in mind?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {t.services.customRequest}
            </p>
          </div>
          <button
            onClick={() => openBookingWizard()}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            {language === 'es' ? 'Consultar con Brian' : 'Inquire with Brian'}
          </button>
        </div>

      </div>
    </section>
  );
};
