import React from 'react';
import { useApp } from '../context/AppContext';
import { Hero } from './Hero';
import { 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  UserCheck, 
  ArrowRight, 
  Sparkles, 
  MapPin
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const HomeView: React.FC = () => {
  const { language, openBookingWizard } = useApp();

  const trustPillars = [
    {
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-500/10',
      titleEs: 'Garantía de Satisfacción 100%',
      titleEn: '100% Satisfaction Guarantee',
      descEs: 'Brian se asegura de que cada detalle quede perfecto. Si algo no está a tu entera satisfacción, se corrige sin costo adicional.',
      descEn: 'Brian ensures every detail is spot-on. If something isn’t to your complete satisfaction, we fix it promptly at no extra charge.'
    },
    {
      icon: UserCheck,
      color: 'text-blue-500 bg-blue-500/10',
      titleEs: 'Trato Directo con el Propietario',
      titleEn: 'Direct Work with the Owner',
      descEs: 'Sin intermediarios ni personal no calificado. Brian Cueva atiende, cotiza y ejecuta tu proyecto con responsabilidad total.',
      descEn: 'No confusing handoffs or unknown subcontractors. Brian Cueva personally quotes and completes your home project with care.'
    },
    {
      icon: DollarSign,
      color: 'text-amber-500 bg-amber-500/10',
      titleEs: 'Consulta Fija y Cotización Transparente',
      titleEn: 'Fixed Consultation & Transparent Quotes',
      descEs: 'Tarifa fija de consulta en sitio ($125). Cotización de mano de obra justa y clara según horas, tamaño y tipo de instalación.',
      descEn: 'Fixed on-site consultation fee ($125). Fair and clear labor quote based on project hours, size, and installation scope.'
    },
    {
      icon: Clock,
      color: 'text-indigo-500 bg-indigo-500/10',
      titleEs: 'Puntualidad y Eficiencia',
      titleEn: 'Punctuality & Clean Finish',
      descEs: 'Llegada en el horario acordado, trabajo limpio con protección de pisos y muebles, y retiro de todos los residuos de obra.',
      descEn: 'On-time arrival, floor and furniture protection throughout the project, and thorough clean-up before leaving.'
    }
  ];

  const steps = [
    {
      step: '01',
      titleEs: 'Agenda tu Cita Online',
      titleEn: 'Book Online in Minutes',
      descEs: 'Elige tu servicio y franja horaria preferida en nuestro formulario interactivo.',
      descEn: 'Select your service and preferred arrival window in our interactive booking form.'
    },
    {
      step: '02',
      titleEs: 'Coordinación Directa',
      titleEn: 'Direct Coordination',
      descEs: 'Brian Cueva te contacta directamente por llamada o WhatsApp para afinar requerimientos y confirmar la cita.',
      descEn: 'Brian Cueva reaches out directly via phone call or WhatsApp to confirm your schedule and project details.'
    },
    {
      step: '03',
      titleEs: 'Trabajo Impecable y Garantizado',
      titleEn: 'Job Done & Guaranteed',
      descEs: 'Evaluación y ejecución profesional. Pago final al terminar mediante Zelle, Venmo, Cash App, Apple Pay, Tarjeta, Cash o Check.',
      descEn: 'Expert on-site evaluation and craftsmanship. Final settlement upon completion via Zelle, Venmo, Cash App, Apple Pay, Cards, Cash, or Check.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Pillars (Por qué elegir a Mr Handyworks) */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'es' ? 'Compromiso de Confianza' : 'The Mr Handyworks Standard'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'es' ? '¿Por qué los propietarios eligen a Brian Cueva?' : 'Why Homeowners Choose Brian Cueva'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            {language === 'es'
              ? 'Calidad profesional con la tranquilidad de trabajar con un especialista licenciado y verificado.'
              : 'Professional precision backed by licensed, background-checked craftsmanship you can rely on.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#1A2332] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${p.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white mb-2">
                    {language === 'es' ? p.titleEs : p.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'es' ? p.descEs : p.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works (Cómo Funciona en 3 Pasos) */}
      <section className="max-w-6xl mx-auto p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0B3C5D] text-white shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            {language === 'es' ? 'Proceso Simple y Transparente' : 'Simple 3-Step Workflow'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
            {language === 'es' ? 'Cómo funciona tu proyecto de inicio a fin' : 'How We Take Care of Your Project'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((st, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black text-emerald-400/80 block mb-2 font-mono">
                  {st.step}
                </span>
                <h3 className="font-extrabold text-lg text-white mb-2">
                  {language === 'es' ? st.titleEs : st.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                  {language === 'es' ? st.descEs : st.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => openBookingWizard()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0B3C5D] font-black text-xs sm:text-sm shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0B3C5D]" />
            <span>{language === 'es' ? 'Comenzar mi Solicitud' : 'Start My Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Service Area Map / Coverage */}
      <section className="max-w-6xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-[#1A2332] border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 uppercase">
            <MapPin className="w-4 h-4" />
            <span>{language === 'es' ? 'Área de Cobertura en Michiana' : 'Michiana Service Area'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {language === 'es' ? 'Servicio a Domicilio en South Bend y Alrededores' : 'Mobile On-Site Service across South Bend & Region'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {language === 'es'
              ? 'Atención rápida y puntual en los siguientes condados y códigos postales:'
              : 'Fast, prompt service across local counties and neighborhoods:'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {BUSINESS_INFO.serviceAreas.map((area, i) => (
            <span 
              key={i}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
            >
              📍 {area}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
