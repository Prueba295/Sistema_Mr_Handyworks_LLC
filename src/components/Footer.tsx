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
  const { businessInfo, navigateTo } = useApp();

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
              <div className="text-[11px] text-[var(--text-muted)]">Brian Cueva</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            <a href={`tel:${businessInfo.phoneRaw}`} className="hover:text-[var(--text)]">{businessInfo.phone}</a>
            <button onClick={() => navigateTo('services')} className="hover:text-[var(--text)]">Services</button>
            <button onClick={() => navigateTo('portfolio')} className="hover:text-[var(--text)]">Projects</button>
            <button onClick={() => navigateTo('admin')} className="hover:text-[var(--text)]">Admin</button>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--border)] pt-4 text-[11px] text-[var(--text-muted)] flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Mr Handyworks LLC</span>
          <span>Clean, clear and reliable work.</span>
        </div>
      </div>
    </footer>
  );
};
