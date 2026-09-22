import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, openBookingWizard, businessInfo } = useApp();

  return (
    <section id="inicio" className="py-4 sm:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-[#0B3C5D] bg-white shadow-sm">
                <img src="/logo_handy.webp" alt="Mr Handyworks LLC" className="h-full w-full object-cover" />
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {language === 'es' ? 'Handyman profesional' : 'Professional handyman'}
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-[#0B3C5D] dark:text-white sm:text-3xl">
                  {businessInfo.name}
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  {language === 'es' ? 'Instalaciones, reparaciones y remodelación residencial.' : 'Installations, repairs and residential remodeling.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a href={`tel:${businessInfo.phoneRaw}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B3C5D] px-4 py-3 text-sm font-black text-white shadow-sm">
                <Phone className="w-4 h-4" />
                {businessInfo.phone}
              </a>
              <button onClick={() => openBookingWizard()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-bold text-[var(--text)]">
                {language === 'es' ? 'Solicitar presupuesto' : 'Request estimate'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4 border border-[var(--border)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                {language === 'es' ? 'Servicios' : 'Services'}
              </div>
              <div className="mt-2 text-lg font-black text-[var(--text)]">TV • Paint • Repair</div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4 border border-[var(--border)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                {language === 'es' ? 'Cobertura' : 'Coverage'}
              </div>
              <div className="mt-2 text-lg font-black text-[var(--text)]">South Bend, IN</div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4 border border-[var(--border)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                {language === 'es' ? 'Respuesta' : 'Response'}
              </div>
              <div className="mt-2 text-lg font-black text-[var(--text)]">&lt; 2 horas</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-[var(--text)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-500/15 p-2 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-[var(--text)]">
                  {language === 'es' ? 'Atención clara y sin rodeos' : 'Clear communication and no surprises'}
                </div>
                <div className="mt-1 text-[var(--text-muted)]">
                  {language === 'es'
                    ? 'Cada proyecto se explica con costos claros, calendario realista y trabajo limpio.'
                    : 'Each project comes with clear pricing, a realistic schedule, and clean work habits.'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.15em] text-[var(--primary)]">
                {language === 'es' ? 'Empieza tu proyecto' : 'Start your project'}
              </div>
              <div className="mt-1 text-base font-black text-[var(--text)]">
                {language === 'es' ? 'Elige el servicio, indica tu zona y agenda una fecha.' : 'Choose a service, add your area and select a date.'}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-[var(--text-muted)]">
                <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">01 {language === 'es' ? 'Servicio' : 'Service'}</span>
                <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">02 ZIP</span>
                <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">03 {language === 'es' ? 'Fecha' : 'Date'}</span>
              </div>
            </div>
            <button
              onClick={() => openBookingWizard()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3C5D] px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-[#07273d]"
            >
              {language === 'es' ? 'Comenzar' : 'Get started'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
