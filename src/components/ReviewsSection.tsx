import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/initialData';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink, 
  PlusCircle, 
  X, 
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { t, language, reviews, addReview } = useApp();
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Form State for new review
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [jobType, setJobType] = useState('TV Mounting');
  const [comment, setComment] = useState('');

  const tags = [
    'ALL',
    'TV Mounting',
    'Home Theater',
    'Repairs',
    'Doors & Windows',
    'Bathroom',
    'Assembly',
    'Painting'
  ];

  const filteredReviews = reviews.filter(rev => {
    if (rev.status !== 'APPROVED') return false;
    const matchesTag = activeTag === 'ALL' || rev.tags.some(t => t.toLowerCase() === activeTag.toLowerCase());
    const commentText = (language === 'es' ? rev.commentEs : (rev.commentEn || rev.commentEs)).toLowerCase();
    const authorText = rev.authorName.toLowerCase();
    const jobText = rev.jobType.toLowerCase();
    const q = searchFilter.toLowerCase();
    const matchesSearch = searchFilter === '' || commentText.includes(q) || authorText.includes(q) || jobText.includes(q);
    return matchesTag && matchesSearch;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    addReview({
      authorName: authorName.trim(),
      location: location.trim() || 'South Bend, IN',
      rating,
      commentEs: comment.trim(),
      commentEn: comment.trim(),
      tags: [jobType],
      jobType: jobType
    });

    setIsSubmitModalOpen(false);
    setAuthorName('');
    setLocation('');
    setComment('');
  };

  const keywordChips = [
    { label: 'jobs', count: 26 },
    { label: 'install', count: 10 },
    { label: 'project', count: 8 },
    { label: 'quality', count: 7 },
    { label: 'hire', count: 6 },
    { label: 'fixed', count: 4 },
    { label: 'tv', count: 4 },
    { label: 'handyman', count: 3 },
    { label: 'door', count: 3 },
    { label: 'bathroom', count: 3 }
  ];

  return (
    <section id="resenas" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{language === 'es' ? 'Reseñas Verificadas de Clientes' : 'Verified Client Reviews'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.reviews.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Overall Rating & Stats Bento Bar */}
        <div className="mb-10 bg-white dark:bg-[#1C2636] rounded-3xl p-6 sm:p-8 border border-slate-300 dark:border-slate-700 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Score Block */}
          <div className="lg:col-span-4 text-center lg:text-left lg:border-r border-slate-200 dark:border-slate-700 lg:pr-8">
            <div className="text-5xl sm:text-6xl font-black text-[#0B3C5D] dark:text-white tracking-tight flex items-baseline justify-center lg:justify-start gap-2">
              <span>5.0</span>
              <span className="text-xl text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-500 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-500" />
              ))}
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {t.reviews.totalReviews}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              98% {language === 'es' ? 'calificaciones de 5 estrellas' : '5-star ratings'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
              <a
                href={BUSINESS_INFO.thumbtackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <span>Thumbtack Top Pro</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Breakdown Bars matching Image 5 */}
          <div className="lg:col-span-5 space-y-2 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-14 text-slate-700 dark:text-slate-300">5 {language === 'es' ? 'estrellas' : 'stars'}</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[98%]"></div>
              </div>
              <span className="w-8 text-right text-slate-600 dark:text-slate-400">98%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 text-slate-700 dark:text-slate-300">4 {language === 'es' ? 'estrellas' : 'stars'}</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-amber-500/30 rounded-full w-[0%]"></div>
              </div>
              <span className="w-8 text-right text-slate-600 dark:text-slate-400">0%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 text-slate-700 dark:text-slate-300">3 {language === 'es' ? 'estrellas' : 'stars'}</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-amber-500/30 rounded-full w-[1%]"></div>
              </div>
              <span className="w-8 text-right text-slate-600 dark:text-slate-400">1%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 text-slate-700 dark:text-slate-300">2 {language === 'es' ? 'estrellas' : 'stars'}</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-amber-500/30 rounded-full w-[0%]"></div>
              </div>
              <span className="w-8 text-right text-slate-600 dark:text-slate-400">0%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 text-slate-700 dark:text-slate-300">1 {language === 'es' ? 'estrella' : 'star'}</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-amber-500/30 rounded-full w-[1%]"></div>
              </div>
              <span className="w-8 text-right text-slate-600 dark:text-slate-400">1%</span>
            </div>
          </div>

          {/* Action to leave a review with Corporate Blue */}
          <div className="lg:col-span-3 text-center lg:text-right space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'es' 
                ? '¿Brian realizó un trabajo en tu hogar? Tu testimonio es muy valioso.' 
                : 'Did Brian work on your home? We value your review.'}
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.reviews.leaveReviewBtn}</span>
            </button>
          </div>

        </div>

        {/* Thumbtack Image 5 Keyword Filter Row */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">
            {language === 'es' ? 'Menciones Frecuentes de Clientes:' : 'Frequent Client Mentions:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchFilter(searchFilter === chip.label ? '' : chip.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  searchFilter.toLowerCase() === chip.label.toLowerCase()
                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#0B3C5D]'
                }`}
              >
                <span>{chip.label}</span>
                <span className="ml-1 opacity-60">• {chip.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Tag Badges */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTag === tag
                      ? 'bg-[#0B3C5D] text-white dark:bg-blue-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tag === 'ALL' ? t.reviews.filterAll : tag}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={language === 'es' ? 'Filtrar opiniones...' : 'Filter reviews...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0B3C5D]"
              />
            </div>
          </div>
        </div>

        {/* Reviews Masonry / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(rev => {
            const comment = language === 'es' ? rev.commentEs : (rev.commentEn || rev.commentEs);

            return (
              <div 
                key={rev.id}
                className="rounded-2xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Review Header: Author + Star Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">
                          {rev.authorName}
                        </span>
                        {rev.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.reviews.verifiedHire}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {rev.location} • {rev.jobType}
                      </p>
                    </div>

                    <div className="flex text-amber-500 shrink-0">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{comment}"
                  </p>
                </div>

                {/* Footer source & tags */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {rev.source === 'Thumbtack' ? 'Thumbtack Verified' : 'Direct Client'}
                  </span>
                  <div className="flex gap-1">
                    {rev.tags.slice(0, 2).map((tg, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Leave a Review Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.reviews.modalTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              {t.reviews.modalSubtitle}
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.reviews.nameLabel} *
                </label>
                <input 
                  type="text" 
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ej: Laura M."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.reviews.locationLabel}
                  </label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="South Bend, IN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.reviews.jobTypeLabel}
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  >
                    <option value="TV Mounting">TV Mounting</option>
                    <option value="Home Theater">Home Theater & Sound</option>
                    <option value="General Repairs">General Repairs</option>
                    <option value="Furniture Assembly">Furniture Assembly</option>
                    <option value="Painting">Painting</option>
                    <option value="Doors & Windows">Doors & Windows</option>
                    <option value="Bathroom Remodel">Bathroom Remodel</option>
                    <option value="Carpentry & Shelving">Carpentry & Shelving</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.reviews.ratingLabel}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${num <= rating ? 'fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.reviews.commentLabel} *
                </label>
                <textarea 
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos sobre la puntualidad, calidad del trabajo y tu experiencia con Brian..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#082a42] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors"
                >
                  {t.reviews.submitReview}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
