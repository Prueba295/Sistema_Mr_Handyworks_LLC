import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { BUSINESS_INFO } from '../data/initialData';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  ExternalLink, 
  Image as ImageIcon,
  CheckCircle2,
  File,
  Film,
  Mail
} from 'lucide-react';

interface PublicOrderModalProps {
  orderId?: string;
  onClose: () => void;
}

export const PublicOrderModal: React.FC<PublicOrderModalProps> = ({ orderId, onClose }) => {
  const { bookings, language } = useApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const booking = bookings.find(b => b.id === orderId);

  if (!booking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'es' ? 'Orden no encontrada' : 'Order Not Found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'es' 
              ? `No se encontró la orden #${orderId || ''}. Verifique el enlace recibido.` 
              : `Order #${orderId || ''} was not found. Please verify the link received.`}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0B3C5D] text-white text-xs font-bold hover:bg-[#07273D] transition-colors cursor-pointer"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  const attachments = booking.attachments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative my-4 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B3C5D] via-[#0D4468] to-[#07273D] px-6 py-4 flex items-center justify-between text-white shrink-0 border-b border-white/10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              Mr Handyworks LLC • Public Order Viewer
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
              <span>Order #{booking.id}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-black uppercase border ${
                booking.status === 'CONFIRMED' ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40' :
                booking.status === 'CANCELLED' ? 'bg-rose-500/25 text-rose-300 border-rose-400/40' :
                booking.status === 'COMPLETED' ? 'bg-blue-500/25 text-blue-300 border-blue-400/40' :
                'bg-amber-500/25 text-amber-300 border-amber-400/40'
              }`}>
                {booking.status}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Service & Client Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'es' ? 'Datos del Cliente' : 'Customer Info'}
              </div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                {booking.clientName}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-[#0B3C5D] dark:text-blue-400" />
                <a href={`tel:${booking.clientPhone}`} className="hover:underline font-semibold">
                  {booking.clientPhone}
                </a>
              </div>
              {booking.clientEmail && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <a href={`mailto:${booking.clientEmail}`} className="hover:underline font-semibold text-blue-600 dark:text-blue-400 break-all">
                    {booking.clientEmail}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{booking.clientAddress || 'South Bend area'} (ZIP: {booking.zipCode})</span>
              </div>
            </div>

            {/* Service & Appointment */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'es' ? 'Servicio y Fecha' : 'Service & Appointment'}
              </div>
              <div className="font-extrabold text-sm text-[#0B3C5D] dark:text-blue-400">
                {booking.serviceType}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>{booking.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>{booking.scheduledTimeSlot}</span>
              </div>
            </div>

          </div>

          {/* Official Admin Resolution & Message (If set by admin) */}
          {booking.adminNotes && (
            <div className={`p-4 rounded-2xl border space-y-1.5 ${
              booking.status === 'CONFIRMED' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' :
              booking.status === 'CANCELLED' ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800' :
              booking.status === 'COMPLETED' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800' :
              'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
            }`}>
              <div className={`text-[11px] font-black uppercase tracking-wider flex items-center justify-between ${
                booking.status === 'CONFIRMED' ? 'text-emerald-700 dark:text-emerald-400' :
                booking.status === 'CANCELLED' ? 'text-rose-700 dark:text-rose-400' :
                booking.status === 'COMPLETED' ? 'text-blue-700 dark:text-blue-400' :
                'text-amber-700 dark:text-amber-400'
              }`}>
                <span>📢 {language === 'es' ? 'Resolución Oficial de Mr Handyworks LLC:' : 'Official Admin Resolution & Note:'}</span>
                {booking.statusUpdatedAt && (
                  <span className="text-[10px] opacity-75 font-normal">{new Date(booking.statusUpdatedAt).toLocaleDateString()}</span>
                )}
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold italic leading-relaxed">
                "{booking.adminNotes}"
              </p>
            </div>
          )}

          {/* Scope of Work */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-700 space-y-1.5">
            <div className="text-[11px] font-bold text-[#0B3C5D] dark:text-blue-400 uppercase tracking-wider">
              {language === 'es' ? 'Descripción del Trabajo' : 'Scope of Work'}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {booking.projectDetails}
            </p>
          </div>

          {/* Attached Files & Photos Gallery (MANDATORY PUBLIC ACCESS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>{language === 'es' ? 'Archivos y Fotos Adjuntos' : 'Attached Photos & Files'} ({attachments.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {language === 'es' ? 'Acceso libre sin registro' : 'Public access, no login needed'}
              </span>
            </div>

            {attachments.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                {language === 'es' ? 'No se adjuntaron archivos adicionales en esta orden.' : 'No additional files were attached to this order.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((att, idx) => {
                  const isImg = att.type === 'image' || att.name.match(/\.(jpe?g|png|webp|gif)$/i);
                  const isVid = att.type === 'video' || att.name.match(/\.(mp4|mov|webm)$/i);
                  return (
                    <div 
                      key={att.id || idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2.5 shadow-xs"
                    >
                      {/* Media Preview */}
                      {isImg && (
                        <div 
                          onClick={() => setSelectedImage(att.dataUrl)}
                          className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900 cursor-pointer group"
                        >
                          <img 
                            src={att.dataUrl} 
                            alt={att.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                            <ExternalLink className="w-4 h-4" />
                            <span>{language === 'es' ? 'Ver en Grande' : 'Enlarge Photo'}</span>
                          </div>
                        </div>
                      )}

                      {isVid && (
                        <video 
                          src={att.dataUrl} 
                          controls 
                          className="w-full h-44 rounded-xl bg-black object-contain"
                        />
                      )}

                      {!isImg && !isVid && (
                        <div className="h-32 flex flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 gap-2">
                          <File className="w-8 h-8 text-[#0B3C5D] dark:text-blue-400" />
                          <span className="text-xs font-bold">{att.name}</span>
                        </div>
                      )}

                      {/* File Details & Direct Link */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                            {att.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {att.sizeFormatted || 'Cloud'}
                          </span>
                        </div>
                        <a
                          href={att.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0B3C5D]/10 hover:bg-[#0B3C5D]/20 text-[#0B3C5D] dark:bg-blue-500/15 dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{language === 'es' ? 'Abrir Archivo Original' : 'Open Full File'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Mr Handyworks LLC • Direct Service: <span className="font-bold text-slate-800 dark:text-slate-200">{BUSINESS_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => generateQuotePDF(booking, language)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B3C5D] hover:bg-[#07273D] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Descargar Orden en PDF' : 'Download Order PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox for Enlarge Photo */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Enlarged" 
              className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl" 
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
