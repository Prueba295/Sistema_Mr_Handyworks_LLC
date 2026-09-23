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
  MapPin,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  FileText,
  Award
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const HomeView: React.FC = () => {
  const { language, openBookingWizard, navigateTo } = useApp();

  const trustPillars = [
    {
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-500/10',
      titleEs: 'Garantía de Mano de Obra de 30 Días',
      titleEn: '30-Day Workmanship Guarantee',
      descEs: 'Mr Handyworks LLC respalda nuestra mano de obra durante 30 días posteriores a la finalización del proyecto. Si surge un problema derivado de nuestra mano de obra, contáctanos y evaluaremos el problema realizando las correcciones pertinentes sin cargo adicional de mano de obra. Esta garantía no cubre defectos de productos o materiales, desgaste normal, mal uso, condiciones preexistentes u ocultas, materiales suministrados por el cliente, ni trabajos modificados o realizados por terceros.',
      descEn: 'Mr Handyworks LLC backs our workmanship for 30 days following project completion. If an issue results from our workmanship, contact us and we’ll evaluate the issue and make appropriate corrections at no additional labor charge. This guarantee does not cover product or material defects, normal wear, misuse, pre-existing or concealed conditions, customer-supplied materials, or work altered or performed by others.'
    },
    {
      icon: UserCheck,
      color: 'text-blue-500 bg-blue-500/10',
      titleEs: 'Equipo de Servicio Profesional',
      titleEn: 'Professional Service Team',
      descEs: 'Tu proyecto puede ser realizado por el propietario, un miembro del equipo de Mr Handyworks o un subcontratista calificado según el alcance, la agenda y los requerimientos del trabajo. Mr Handyworks LLC se mantiene como tu punto principal de contacto.',
      descEn: 'Your project may be performed by the owner, a Mr Handyworks team member, or a qualified subcontractor depending on project scope, scheduling, and trade requirements. Mr Handyworks LLC remains your primary point of contact.'
    },
    {
      icon: DollarSign,
      color: 'text-amber-500 bg-amber-500/10',
      titleEs: 'Estimados y Precios Claros',
      titleEn: 'Clear Estimates & Pricing',
      descEs: 'Las consultas en sitio inician en $125. Los estimados se basan en las condiciones visibles y el alcance acordado al momento de la evaluación. Condiciones ocultas, trabajos adicionales, cambios de materiales o ajustes de alcance pueden requerir precios adicionales y aprobación del cliente.',
      descEn: 'On-site consultations start at $125. Estimates are based on the visible conditions and agreed scope at the time of evaluation. Concealed conditions, additional work, material changes, or changes in scope may require additional pricing and customer approval.'
    },
    {
      icon: Clock,
      color: 'text-indigo-500 bg-indigo-500/10',
      titleEs: 'Llegada Programada y Limpieza Profesional',
      titleEn: 'Scheduled Arrival & Professional Clean-Up',
      descEs: 'Brindamos una ventana de llegada estimada y comunicamos demoras significativas siempre que sea posible. Se toman precauciones razonables para proteger el área de trabajo, seguidas de una limpieza general del sitio al concluir el trabajo.',
      descEn: 'We provide an estimated arrival window and communicate significant delays whenever possible. Reasonable precautions are taken to protect the work area, followed by general job-site clean-up upon completion.'
    }
  ];

  const steps = [
    {
      step: '01',
      titleEs: '01 — Solicita tu Servicio',
      titleEn: '01 — Request Your Service',
      descEs: 'Selecciona tu servicio y la franja de horario preferida a través de nuestro formulario de reserva en línea.',
      descEn: 'Select your service and preferred appointment window through our online booking form.'
    },
    {
      step: '02',
      titleEs: '02 — Confirmación del Proyecto',
      titleEn: '02 — Project Confirmation',
      descEs: 'Un miembro de nuestro equipo te contactará para confirmar tu cita, detalles del proyecto, requisitos de acceso y cualquier información adicional necesaria antes del servicio.',
      descEn: 'A member of our team will contact you to confirm your appointment, project details, access requirements, and any additional information needed before service.'
    },
    {
      step: '03',
      titleEs: '03 — Servicio y Finalización',
      titleEn: '03 — Service & Completion',
      descEs: 'Tu profesional asignado de Mr Handyworks completa el alcance de trabajo aprobado. El pago final vence al completarse el servicio, a menos que se establezcan términos de pago diferentes en tu presupuesto o contrato por escrito.',
      descEn: 'Your assigned Mr Handyworks professional completes the approved scope of work. Final payment is due upon completion unless different payment terms are stated in your written estimate or agreement.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Pillars (Why Homeowners Choose Mr Handyworks) */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'es' ? 'Compromiso de Confianza' : 'The Mr Handyworks Standard'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'es' ? '¿Por qué los propietarios eligen a Mr Handyworks?' : 'Why Homeowners Choose Mr Handyworks'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
            {language === 'es'
              ? 'Servicio profesional, comunicación clara y mano de obra de calidad de un equipo local en el que puedes confiar.'
              : 'Professional service, clear communication, and quality workmanship from a local team you can rely on.'}
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
                  <h3 className="font-black text-base text-slate-900 dark:text-white mb-2 leading-snug">
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

      {/* 3. Simple 3-Step Workflow */}
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
                <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                  {language === 'es' ? st.descEs : st.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Accepted Payments Callout inside Step 3 flow */}
        <div className="mt-8 p-4 rounded-2xl bg-white/10 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-100">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <span className="font-black text-white block">
                {language === 'es' ? 'Métodos de Pago Aceptados:' : 'Accepted Payments:'}
              </span>
              <span>
                {language === 'es'
                  ? 'Apple Pay, Cash App, Venmo, tarjetas de crédito/débito, efectivo y cheques. Aplica una comisión de procesamiento del 3.5% a pagos con tarjeta.'
                  : 'Apple Pay, Cash App, Venmo, credit/debit cards, cash, and checks. A 3.5% processing fee applies to card payments.'}
              </span>
            </div>
          </div>
          <button
            onClick={() => openBookingWizard()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0B3C5D] font-black text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0B3C5D]" />
            <span>{language === 'es' ? 'Solicitar Servicio' : 'Request Service'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Estimates & Project Conditions Disclaimer (Point 11) */}
      <section className="max-w-6xl mx-auto p-5 sm:p-6 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 text-slate-800 dark:text-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wide text-xs">
              {language === 'es' ? 'Estimados y Condiciones del Proyecto' : 'Estimates & Project Conditions'}
            </h4>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {language === 'es'
                ? 'Los estimados se basan en la información y las condiciones visibles disponibles al momento de la cotización. Daños ocultos, áreas inaccesibles, condiciones imprevistas del lugar, cambios solicitados por el cliente o trabajos adicionales fuera del alcance original pueden afectar el precio, los materiales y el cronograma. Cualquier trabajo adicional será consultado con el cliente antes de proceder.'
                : 'Estimates are based on information and visible conditions available at the time of quoting. Concealed damage, inaccessible areas, unforeseen site conditions, customer-requested changes, or additional work outside the original scope may affect pricing, materials, and scheduling. Additional work will be discussed with the customer before proceeding.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Service Area Map / Coverage */}
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
