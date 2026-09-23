import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AvailabilityDay } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AvailabilityCalendar: React.FC = () => {
  const { t, language, availability, openBookingWizard } = useApp();

  // Current selected date: default to first available date or today
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const firstAvail = availability.find(a => !a.isBlocked && a.slots.length > 0);
    return firstAvail ? firstAvail.date : '2026-09-22';
  });

  const selectedDayInfo = availability.find(a => a.date === selectedDate);

  const formatDateLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleSlotClick = (slot: string) => {
    openBookingWizard({
      date: selectedDate,
      timeSlot: slot
    });
  };

  return (
    <section id="disponibilidad" className="py-12 sm:py-20 bg-[#F4F6F9] dark:bg-[#0B111A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#0B3C5D] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Sección 06 • Disponibilidad y Horarios' : 'Section 06 • Live Availability & Schedule'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.availability.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            {t.availability.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1C2636] rounded-3xl p-6 sm:p-8 border border-slate-300 dark:border-slate-700 shadow-md">
          
          {/* Legend row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>{t.availability.legendAvailable}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>{t.availability.legendBooked}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span>{t.availability.legendBlocked}</span>
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'es' ? 'Privacidad protegida: Sin datos de terceros' : 'Privacy secured: No 3rd party info displayed'}</span>
            </div>
          </div>

          {/* Date Selector Strip (Adaptive for Desktop & 48px+ Mobile Touch Targets) */}
          <div className="py-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {t.availability.selectDatePrompt}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
              {availability.slice(0, 10).map((day) => {
                const isSelected = selectedDate === day.date;
                const isAvailable = !day.isBlocked && day.slots.length > 0;
                const isFull = !day.isBlocked && day.slots.length === 0;

                return (
                  <button
                    key={day.date}
                    onClick={() => !day.isBlocked && setSelectedDate(day.date)}
                    disabled={day.isBlocked}
                    className={`min-h-[56px] min-w-[48px] p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B3C5D] text-white shadow-md ring-2 ring-amber-400 dark:bg-blue-600'
                        : day.isBlocked
                        ? 'bg-slate-200/60 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed opacity-60'
                        : isFull
                        ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 hover:border-[#0B3C5D]'
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase">
                      {formatDateLabel(day.date).split(',')[0] || formatDateLabel(day.date).split(' ')[0]}
                    </span>
                    <span className="text-base font-extrabold mt-0.5">
                      {day.date.split('-')[2]}
                    </span>
                    <span className="text-[10px] mt-0.5 font-medium">
                      {day.isBlocked 
                        ? (language === 'es' ? 'Cerrado' : 'Closed') 
                        : isFull 
                        ? (language === 'es' ? 'Lleno' : 'Full')
                        : `${day.slots.length} ${language === 'es' ? 'libres' : 'open'}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Area for the Selected Day */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0B3C5D] dark:text-blue-400" />
                <span>{t.availability.slotsFor} <strong>{formatDateLabel(selectedDate)}</strong>:</span>
              </h3>
              {selectedDayInfo?.note && (
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                  {selectedDayInfo.note}
                </span>
              )}
            </div>

            {selectedDayInfo && selectedDayInfo.slots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {selectedDayInfo.slots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlotClick(slot)}
                    className="min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm bg-white dark:bg-slate-700 border border-emerald-500/40 text-slate-800 dark:text-slate-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-between shadow-xs cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500 group-hover:text-white" />
                      <span>{slot}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto" />
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {t.availability.noSlots}
                </p>
                <button
                  onClick={() => openBookingWizard({ date: selectedDate })}
                  className="mt-2 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-[#0B3C5D] hover:bg-[#07273D] text-white transition-colors cursor-pointer"
                >
                  <span>{language === 'es' ? 'Solicitar Cita de Emergencia' : 'Request Special Slot'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer fast action */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              {language === 'es'
                ? '¿Necesitas un horario especial fuera de agenda? Puedes consultar directamente con nuestro equipo de servicio.'
                : 'Need an off-hours or emergency appointment? Inquire directly with our service desk.'}
            </div>

            <button
              onClick={() => openBookingWizard({ date: selectedDate })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] active:bg-[#051A29] text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{t.availability.reserveSlot}</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
