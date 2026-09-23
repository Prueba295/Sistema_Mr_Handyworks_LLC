import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

export const ReviewsTickerCard: React.FC = () => {
  const { reviews, language, navigateTo } = useApp();

  // Get active approved reviews
  const activeReviews = reviews.filter(r => r.status === 'APPROVED' || !r.status);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-switch every 8 seconds
  useEffect(() => {
    if (isPaused || activeReviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, activeReviews.length]);

  if (activeReviews.length === 0) return null;

  const currentReview = activeReviews[currentIndex] || activeReviews[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
  };

  return (
    <div 
      className="mt-16 max-w-4xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-[#1A2332] dark:to-[#111827] border border-slate-200 dark:border-slate-700/80 shadow-lg p-6 sm:p-8 transition-all">
        
        {/* Subtle top 8-second progress indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div 
            key={currentIndex}
            className={`h-full bg-[#0B3C5D] dark:bg-blue-500 ${!isPaused ? 'animate-[reviewProgress_8s_linear]' : ''}`}
            style={{ width: isPaused ? '100%' : undefined }}
          />
        </div>

        {/* Header row: badge, counter and manual navigation controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Reseña Verificada de Thumbtack' : 'Verified Thumbtack Review'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
              {currentIndex + 1} / {activeReviews.length}
            </span>
          </div>

          {/* Manual Previous / Next Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous review"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0B3C5D] hover:text-white dark:hover:bg-blue-600 transition-colors cursor-pointer"
              title={language === 'es' ? 'Reseña anterior' : 'Previous review'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next review"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0B3C5D] hover:text-white dark:hover:bg-blue-600 transition-colors cursor-pointer"
              title={language === 'es' ? 'Siguiente reseña' : 'Next review'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Review Content */}
        <div key={currentReview.id} className="space-y-4 animate-in fade-in duration-300">
          {/* Star rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < currentReview.rating 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
            <span className="text-xs font-black text-slate-900 dark:text-white ml-1.5">
              {currentReview.rating}.0
            </span>
          </div>

          {/* Review text with decorative quote */}
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#0B3C5D]/10 dark:text-blue-400/10 pointer-events-none" />
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed pl-4 border-l-2 border-[#0B3C5D]/30 dark:border-blue-500/40">
              "{language === 'es' ? currentReview.commentEs : currentReview.commentEn}"
            </p>
          </div>

          {/* Reviewer details & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentReview.authorName}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal text-xs">
                  {currentReview.location || 'South Bend, IN'}
                </span>
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                {currentReview.jobType}
              </div>
            </div>

            <button
              onClick={() => navigateTo('reviews')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3C5D] dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>
                {language === 'es' 
                  ? 'Ver las 80+ reseñas reales' 
                  : 'Read all 80+ genuine reviews'}
              </span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
