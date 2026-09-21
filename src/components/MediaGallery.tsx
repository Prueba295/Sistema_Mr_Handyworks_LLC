import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioMedia } from '../types';
import { 
  Image as ImageIcon, 
  Sparkles, 
  SlidersHorizontal, 
  Maximize2, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2,
  Tv,
  Eye
} from 'lucide-react';

export const MediaGallery: React.FC = () => {
  const { t, language, portfolio, lightboxMedia, setLightboxMedia } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  
  // Before / After Slider state (0 to 100 percentage)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Find the primary before/after item
  const beforeAfterItem = portfolio.find(p => p.type === 'BEFORE_AFTER') || portfolio[1];

  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleSliderMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
  };

  const filteredPortfolio = portfolio.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'BEFORE_AFTER') return item.type === 'BEFORE_AFTER';
    return item.category === activeFilter;
  });

  return (
    <section id="proyectos" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Proyectos Reales & Antes / Después' : 'Real Projects & Before / After'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.portfolio.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* FEATURED: Interactive Before & After Comparison Slider */}
        {beforeAfterItem && beforeAfterItem.beforeUrl && (
          <div className="mb-16 bg-white dark:bg-[#1C2636] rounded-3xl p-6 sm:p-8 border border-slate-300 dark:border-slate-700 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 mb-1.5">
                  <SlidersHorizontal className="w-3 h-3" />
                  {language === 'es' ? 'Comparativa Interactiva' : 'Interactive Before / After'}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'es' ? beforeAfterItem.titleEs : beforeAfterItem.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.portfolio.dragSlider}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                  {language === 'es' ? 'Desliza hacia los lados ↔' : 'Drag left & right ↔'}
                </span>
              </div>
            </div>

            {/* Slider Container */}
            <div 
              ref={sliderContainerRef}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              className="relative aspect-[16/9] sm:aspect-[16/8] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-300 dark:border-slate-700 shadow-inner group"
            >
              {/* After Image (Background full width) */}
              <img 
                src={beforeAfterItem.url} 
                alt="After Remodel" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-xs tracking-wider shadow-md backdrop-blur-xs">
                {t.portfolio.after}
              </div>

              {/* Before Image (Clipped by slider position) */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={beforeAfterItem.beforeUrl} 
                  alt="Before Remodel" 
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%' }}
                />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/90 text-white font-extrabold text-xs tracking-wider shadow-md backdrop-blur-xs">
                  {t.portfolio.before}
                </div>
              </div>

              {/* Draggable Divider Bar & Handle */}
              <div 
                className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-500 shadow-xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-black tracking-tighter">◀▶</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {language === 'es' ? beforeAfterItem.descriptionEs : beforeAfterItem.descriptionEn}
            </p>
          </div>
        )}

        {/* Gallery Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-[#0B3C5D] text-white shadow-sm dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.portfolio.filterAll}
          </button>
          <button
            onClick={() => setActiveFilter('TV_MOUNTING')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'TV_MOUNTING'
                ? 'bg-[#0B3C5D] text-white shadow-sm dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.portfolio.filterTv}
          </button>
          <button
            onClick={() => setActiveFilter('HOME_THEATER')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'HOME_THEATER'
                ? 'bg-[#0B3C5D] text-white shadow-sm dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Home Theater & Audio
          </button>
          <button
            onClick={() => setActiveFilter('CARPENTRY')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'CARPENTRY'
                ? 'bg-[#0B3C5D] text-white shadow-sm dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.portfolio.filterCarpentry}
          </button>
          <button
            onClick={() => setActiveFilter('DOORS_WINDOWS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'DOORS_WINDOWS'
                ? 'bg-[#0B3C5D] text-white shadow-sm dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.services.filterDoors}
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map(item => {
            const title = language === 'es' ? item.titleEs : item.titleEn;
            const desc = language === 'es' ? item.descriptionEs : item.descriptionEn;

            return (
              <div 
                key={item.id}
                onClick={() => setLightboxMedia(item)}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all cursor-pointer flex flex-col"
              >
                {/* Media Image Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={item.url} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-lg">
                      <Maximize2 className="w-5 h-5 text-amber-500" />
                    </span>
                  </div>

                  {item.type === 'BEFORE_AFTER' && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-[11px] shadow-sm">
                      {language === 'es' ? 'ANTES / DESPUÉS' : 'BEFORE / AFTER'}
                    </span>
                  )}
                </div>

                {/* Content Card */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#0B3C5D] dark:group-hover:text-blue-400 transition-colors">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {t.portfolio.viewDetails}
                    </span>
                    <span className="text-slate-400 text-[11px]">South Bend, IN</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen HD Lightbox Modal */}
      {lightboxMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxMedia(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* High Res Image */}
            <div className="relative aspect-[16/10] bg-black">
              <img 
                src={lightboxMedia.url} 
                alt={language === 'es' ? lightboxMedia.titleEs : lightboxMedia.titleEn}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Footer */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-amber-500 text-slate-950">
                  {lightboxMedia.category}
                </span>
                <span className="text-xs text-slate-400">Mr Handyworks LLC • Brian Cueva</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {language === 'es' ? lightboxMedia.titleEs : lightboxMedia.titleEn}
              </h3>
              <p className="text-sm text-slate-300">
                {language === 'es' ? lightboxMedia.descriptionEs : lightboxMedia.descriptionEn}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {lightboxMedia.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
