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
  const { businessInfo, navigateTo, language } = useApp();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
              <img src="/logo_handyworks.jpeg" alt="Mr Handyworks LLC" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-black text-[var(--text)]">Mr Handyworks LLC</div>
              <div className="text-[11px] text-[var(--text-muted)]">Home Services & Repairs</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            <a 
              href={`tel:${businessInfo.phoneRaw}`} 
              className="hover:text-[var(--text)] inline-flex items-center gap-1.5 font-bold text-[#0B3C5D] dark:text-blue-400"
              title="Call Service Desk"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Direct</span>
            </a>
            <button onClick={() => navigateTo('services')} className="hover:text-[var(--text)] cursor-pointer">Services</button>
            <button onClick={() => navigateTo('portfolio')} className="hover:text-[var(--text)] cursor-pointer">Projects</button>
            <button onClick={() => navigateTo('reviews')} className="hover:text-[var(--text)] cursor-pointer">Reviews</button>
            <button onClick={() => navigateTo('credentials')} className="hover:text-[var(--text)] cursor-pointer">Credentials</button>
          </div>
        </div>

        <div className="mt-5 border-t border-[var(--border)] pt-4 text-[11px] text-[var(--text-muted)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-1.5">
            © {new Date().getFullYear()} Mr Handyworks LLC • All rights reserved.
            <button
              onClick={() => navigateTo('admin')}
              className="opacity-20 hover:opacity-100 transition-opacity p-0.5 text-slate-400 dark:text-slate-500 cursor-pointer"
              aria-label="Staff Portal"
              title="Staff Portal"
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
          </span>

          {/* Developer Credit: M.I.S WEB DEVELOPMENT & DESIGN */}
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'es' ? 'Desarrollo web:' : 'Web Design & Dev:'}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 bg-white rounded-md p-0.5 shadow-2xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                <img 
                  src="/logo-desarrolladores.png" 
                  alt="M.I.S WEB DEVELOPMENT & DESIGN Logo" 
                  className="h-full w-full object-contain" 
                />
              </div>
              <span className="text-[11px] font-black tracking-tight text-slate-900 dark:text-slate-100">
                M.I.S WEB DEVELOPMENT &amp; DESIGN
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
