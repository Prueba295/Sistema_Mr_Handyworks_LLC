import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  ExternalLink,
  Award,
  Clock3,
  MapPin,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, openBookingWizard, businessInfo } = useApp();

  return (
    <section id="inicio" className="py-5 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_60px_var(--shadow)] lg:grid-cols-[1.12fr_.88fr]">
          <div className="relative min-h-[380px] overflow-hidden bg-[#0b3c5d] p-6 text-white sm:p-9">
            <img src="/images/tv_fireplace_mount.jpg" alt="Professional TV mounting project" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#06243a]/95 via-[#0b3c5d]/80 to-[#0b3c5d]/45" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" /> Licensed, insured & background checked
                </div>
                <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">
                  Reliable work for the place you call home.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-blue-50/85 sm:text-lg">
                  {language === 'es'
                    ? 'Mr Handyworks LLC brinda servicios profesionales de reparación, instalación, mantenimiento y mejoras en South Bend y toda el área de Michiana, con precios claros y comunicación directa.'
                    : 'Mr Handyworks LLC provides professional repairs, installations, maintenance, and improvement services throughout South Bend and the Michiana area, with clear pricing and direct communication.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-white/90">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2"><Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> 5.0 on Thumbtack</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2"><Clock3 className="h-3.5 w-3.5" /> Replies in under 2 hours</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-6 sm:p-9">
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo_handyworks.jpeg" alt="Mr Handyworks LLC" className="h-14 w-14 rounded-2xl border-2 border-[#0B3C5D] bg-white object-cover" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">MR HANDYWORKS LLC</div>
                  <div className="mt-1 text-lg sm:text-xl font-black text-[var(--text)]">Local Contractor & Service Team</div>
                </div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"><Award className="h-5 w-5 text-amber-500" /><div className="mt-2 text-lg font-black text-[var(--text)]">100+</div><div className="text-xs text-[var(--text-muted)]">completed projects</div></div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"><MapPin className="h-5 w-5 text-blue-600" /><div className="mt-2 text-lg font-black text-[var(--text)]">Michiana</div><div className="text-xs text-[var(--text-muted)]">service area</div></div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-sm text-[var(--text)]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span><strong>Clear estimates.</strong> No surprise charges or confusing handoffs.</span>
              </div>
              <button onClick={() => openBookingWizard()} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B3C5D] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0B3C5D]/20 hover:bg-[#07273d]">
                Request your estimate <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href={`tel:${businessInfo.phoneRaw}`} 
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-bold text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
                title={language === 'es' ? 'Llamar a Mr Handyworks LLC' : 'Call Mr Handyworks LLC'}
              >
                <Phone className="h-4 w-4 text-emerald-500" /> 
                <span>{language === 'es' ? 'Llamar Ahora' : 'Call Now'}</span>
              </a>
              <a href={businessInfo.thumbtackUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm font-black text-[var(--text)] hover:border-amber-500"><Star className="h-4 w-4 fill-amber-400 text-amber-500" /> Visit Thumbtack <ExternalLink className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
