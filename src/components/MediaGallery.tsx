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
  ChevronLeft,
  ShieldCheck, 
  CheckCircle2,
  Tv,
  Eye,
  Wrench,
  Hammer,
  DoorOpen,
  Layers,
  Lightbulb,
  Paintbrush
} from 'lucide-react';
import { ReviewsTickerCard } from './ReviewsTickerCard';

export const MediaGallery: React.FC = () => {
  const { t, language, portfolio, lightboxMedia, setLightboxMedia } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(18);
  
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

  const displayedPortfolio = filteredPortfolio.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPortfolio.length;

  // Lightbox previous/next navigation
  const currentLightboxIndex = lightboxMedia 
    ? filteredPortfolio.findIndex(p => p.id === lightboxMedia.id) 
    : -1;

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentLightboxIndex > 0) {
      setLightboxMedia(filteredPortfolio[currentLightboxIndex - 1]);
    } else {
      setLightboxMedia(filteredPortfolio[filteredPortfolio.length - 1]);
    }
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentLightboxIndex >= 0 && currentLightboxIndex < filteredPortfolio.length - 1) {
      setLightboxMedia(filteredPortfolio[currentLightboxIndex + 1]);
    } else {
      setLightboxMedia(filteredPortfolio[0]);
    }
  };

  const categoryFilters = [
    { key: 'ALL', labelEs: 'Todos', labelEn: 'All Jobs', count: portfolio.length },
    { key: 'TV_MOUNTING', labelEs: 'TV & Audio', labelEn: 'TV & Audio', count: portfolio.filter(p => p.category === 'TV_MOUNTING').length },
    { key: 'REPAIRS', labelEs: 'Plomería & Reparaciones', labelEn: 'Plumbing & Repairs', count: portfolio.filter(p => p.category === 'REPAIRS').length },
    { key: 'ASSEMBLY', labelEs: 'Muebles & Ensamblaje', labelEn: 'Furniture Assembly', count: portfolio.filter(p => p.category === 'ASSEMBLY').length },
    { key: 'DOORS_WINDOWS', labelEs: 'Puertas & Cerraduras', labelEn: 'Doors & Locks', count: portfolio.filter(p => p.category === 'DOORS_WINDOWS').length },
    { key: 'CARPENTRY', labelEs: 'Carpintería & Repisas', labelEn: 'Carpentry & Shelves', count: portfolio.filter(p => p.category === 'CARPENTRY').length },
    { key: 'PAINTING', labelEs: 'Pintura & Drywall', labelEn: 'Painting & Drywall', count: portfolio.filter(p => p.category === 'PAINTING').length },
    { key: 'INSTALLATION', labelEs: 'Instalaciones', labelEn: 'Installations', count: portfolio.filter(p => p.category === 'INSTALLATION').length },
  ];

  return (
    <section id="proyectos" className="py-8 sm:py-16 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Galería de Trabajos Reales' : 'Real Projects Gallery'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'es' ? 'Nuestros Trabajos y Proyectos' : 'Our Work & Projects'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {language === 'es'
              ? `Explora más de ${portfolio.length} trabajos reales realizados por Brian Cueva en South Bend, Mishawaka y alrededores.`
              : `Explore ${portfolio.length}+ authentic job photos completed by Brian Cueva in South Bend, Mishawaka, and surrounding areas.`}
          </p>
        </div>

        {/* FEATURED: Interactive Before & After Comparison Slider */}
        {beforeAfterItem && beforeAfterItem.beforeUrl && (
          <div className="mb-14 bg-white dark:bg-[#1C2636] rounded-3xl p-6 sm:p-8 border border-slate-300 dark:border-slate-700 shadow-md">
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
              {/* After Image */}
              <img 
                src={beforeAfterItem.url} 
                alt="After Remodel" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-xs tracking-wider shadow-md backdrop-blur-xs">
                {t.portfolio.after}
              </div>

              {/* Before Image */}
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
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none flex-nowrap sm:flex-wrap">
          {categoryFilters.map(filter => {
            const isSelected = activeFilter === filter.key;
            const label = language === 'es' ? filter.labelEs : filter.labelEn;
            if (filter.count === 0 && filter.key !== 'ALL') return null;

            return (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key);
                  setVisibleCount(18);
                }}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0B3C5D] text-white shadow-md dark:bg-blue-600 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs'
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedPortfolio.map((item, idx) => {
            const title = language === 'es' ? item.titleEs : item.titleEn;
            const desc = language === 'es' ? item.descriptionEs : item.descriptionEn;

            return (
              <div 
                key={item.id}
                onClick={() => setLightboxMedia(item)}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-blue-500/50 transition-all cursor-pointer flex flex-col"
              >
                {/* Media Image Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={item.url} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Maximize2 className="w-5 h-5 text-[#0B3C5D] dark:text-blue-400" />
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-bold text-[10px] backdrop-blur-xs shadow-sm">
                    #{idx + 1}
                  </span>

                  {item.category && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#0B3C5D]/90 text-white font-bold text-[10px] backdrop-blur-xs shadow-sm">
                      {item.category.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Content Card */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#0B3C5D] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-[#0B3C5D] dark:text-blue-400 font-semibold">
                    <span className="flex items-center gap-1 group-hover:underline">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Ver fotografía' : 'View photo'}</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">South Bend, IN</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 18)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B3C5D] hover:bg-[#07273d] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{language === 'es' ? 'Cargar más proyectos' : 'Load more projects'}</span>
              <span className="text-xs opacity-80">
                ({displayedPortfolio.length} / {filteredPortfolio.length})
              </span>
            </button>
          </div>
        )}

        {/* Live Reviews Carousel Block */}
        <ReviewsTickerCard />

      </div>

      {/* Fullscreen HD Lightbox Modal with Next / Prev Navigation */}
      {lightboxMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxMedia(null)}
        >
          {/* Previous Button */}
          <button
            onClick={handlePrevMedia}
            className="absolute left-2 sm:left-4 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous image"
            title="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextMedia}
            className="absolute right-2 sm:right-4 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next image"
            title="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxMedia(null)}
              aria-label="Close project preview"
              title="Close project preview"
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/95 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* High Res Image */}
            <div className="relative flex-1 min-h-[300px] max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={lightboxMedia.url} 
                alt={language === 'es' ? lightboxMedia.titleEs : lightboxMedia.titleEn}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Info Footer */}
            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-blue-600 text-white">
                    {lightboxMedia.category}
                  </span>
                  <span className="text-xs text-slate-400">Mr Handyworks LLC • Brian Cueva</span>
                </div>
                {currentLightboxIndex >= 0 && (
                  <span className="text-xs text-slate-400 font-mono">
                    {currentLightboxIndex + 1} / {filteredPortfolio.length}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {language === 'es' ? lightboxMedia.titleEs : lightboxMedia.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {language === 'es' ? lightboxMedia.descriptionEs : lightboxMedia.descriptionEn}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {lightboxMedia.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
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

