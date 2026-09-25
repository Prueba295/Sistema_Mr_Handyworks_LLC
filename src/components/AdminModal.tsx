import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { BookingStatus, Booking } from '../types';
import { 
  X, 
  Lock, 
  Calendar, 
  ClipboardList, 
  Image as ImageIcon, 
  Star, 
  QrCode, 
  LogOut, 
  Phone, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const { 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    adminUser, 
    adminLogin, 
    adminLogout, 
    bookings, 
    updateBookingStatus, 
    availability, 
    toggleDateBlock, 
    addAvailabilitySlot, 
    portfolio, 
    addPortfolioItem, 
    reviews, 
    moderateReview, 
    qrMethods, 
    updateQRMethod,
    language, 
    t,
    showNotification 
  } = useApp();

  // Tab state
  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'SCHEDULE' | 'PORTFOLIO' | 'REVIEWS' | 'QR_SETTINGS'>('BOOKINGS');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // New slot form state
  const [newSlotDate, setNewSlotDate] = useState('2026-09-23');
  const [newSlotTime, setNewSlotTime] = useState('08:00 AM - 10:30 AM');

  // Filter for bookings
  const [bookingFilter, setBookingFilter] = useState<string>('ALL');

  if (!isAdminModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await adminLogin(passwordInput);
    if (success) {
      setPasswordInput('');
      setLoginError('');
      showNotification(language === 'es' ? 'Sesión activa.' : 'Admin session active.');
    } else {
      setLoginError(language === 'es' ? 'Contraseña incorrecta.' : 'Incorrect password.');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'ALL') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative max-w-5xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B3C5D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {t.admin.loginTitle}
              </h3>
              <p className="text-xs text-amber-200">
                {adminUser.isAuthenticated ? 'Private admin session' : 'Private operations portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminUser.isAuthenticated && (
              <button
                onClick={adminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.admin.logoutBtn}</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              aria-label="Close admin portal"
              title="Close admin portal"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!adminUser.isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.admin.loginSubtitle}
              </h4>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={t.admin.passwordLabel}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#07273d] dark:bg-blue-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                {t.admin.loginBtn}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div>
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-x-auto px-4 scrollbar-none">
              <button
                onClick={() => setActiveTab('BOOKINGS')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'BOOKINGS'
                    ? 'border-[#0B3C5D] text-[#0B3C5D] dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>{t.admin.tabs.bookings} ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('SCHEDULE')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'SCHEDULE'
                    ? 'border-[#0B3C5D] text-[#0B3C5D] dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{t.admin.tabs.calendar}</span>
              </button>

              <button
                onClick={() => setActiveTab('REVIEWS')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'REVIEWS'
                    ? 'border-[#0B3C5D] text-[#0B3C5D] dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>{t.admin.tabs.reviews} ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('PORTFOLIO')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'PORTFOLIO'
                    ? 'border-[#0B3C5D] text-[#0B3C5D] dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>{t.admin.tabs.portfolio}</span>
              </button>

              <button
                onClick={() => setActiveTab('QR_SETTINGS')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'QR_SETTINGS'
                    ? 'border-[#0B3C5D] text-[#0B3C5D] dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>{t.admin.tabs.payments}</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
              
              {/* TAB 1: INBOUND BOOKINGS */}
              {activeTab === 'BOOKINGS' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {language === 'es' ? 'Gestión de Solicitudes y Citas' : 'Inbound Work Orders & Bookings'}
                    </h4>

                    {/* Filter status */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                      {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(st => (
                        <button
                          key={st}
                          onClick={() => setBookingFilter(st)}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            bookingFilter === st
                              ? 'bg-[#0B3C5D] text-white dark:bg-blue-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredBookings.map((b) => (
                      <div 
                        key={b.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-[#0B3C5D] dark:text-amber-400">
                              {b.id}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              b.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600' :
                              b.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' :
                              b.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {b.status}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="font-extrabold text-base text-slate-900 dark:text-white">
                            {b.clientName} • <span className="font-medium text-slate-500 text-xs">{b.clientAddress} (Zip: {b.zipCode})</span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            <strong>{b.serviceType}</strong>: {b.projectDetails} ({b.estimatedHours})
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span>📅 {b.scheduledDate} ({b.scheduledTimeSlot})</span>
                            <span className="text-blue-600 font-bold">💵 Consulta Fija: $125.00</span>
                            <span className="text-slate-600 dark:text-slate-300">Método: {b.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                          {/* Call Client */}
                          <a
                            href={`tel:${b.clientPhone}`}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#0B3C5D] hover:text-white transition-colors"
                            title="Llamar al cliente"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Print / Save Quote PDF */}
                          <button
                            onClick={() => generateQuotePDF(b, language)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#0B3C5D] hover:text-white transition-colors cursor-pointer"
                            title="Generar PDF Orden de Trabajo"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Status Select */}
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SCHEDULE & BLOCKS */}
              {activeTab === 'SCHEDULE' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                      {language === 'es' ? 'Gestión de Días y Bloqueos de Agenda' : 'Master Calendar & Days Status'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      {language === 'es' ? 'Haz clic en cualquier día para bloquear o habilitar reservas.' : 'Click any date to block or open bookings.'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {availability.map(day => (
                        <div
                          key={day.date}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            day.isBlocked
                              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {day.date}
                          </div>
                          <div className={`text-[11px] font-extrabold my-1 ${day.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                            {day.isBlocked ? 'BLOQUEADO' : `${day.slots.length} SLOTS`}
                          </div>
                          <button
                            onClick={() => toggleDateBlock(day.date)}
                            className="mt-1 text-[10px] font-bold px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {day.isBlocked ? 'Desbloquear' : 'Bloquear'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Slot form */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                      {language === 'es' ? 'Añadir Nuevo Bloque Horario' : 'Add New Time Slot'}
                    </h5>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="date"
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                      <input
                        type="text"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        placeholder="Ej: 08:00 AM - 10:30 AM"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                      <button
                        onClick={() => {
                          addAvailabilitySlot(newSlotDate, newSlotTime);
                          showNotification(language === 'es' ? 'Bloque horario añadido.' : 'Slot added.');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0B3C5D] text-white text-xs font-bold hover:bg-[#07273d] transition-colors"
                      >
                        {language === 'es' ? '+ Añadir Slot' : '+ Add Slot'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REVIEWS MODERATION */}
              {activeTab === 'REVIEWS' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {language === 'es' ? 'Moderación de Reseñas de Clientes' : 'Client Reviews Moderation'}
                  </h4>

                  <div className="space-y-3">
                    {reviews.map(rev => (
                      <div 
                        key={rev.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.authorName}</span>
                            <span className="text-xs text-amber-500 font-bold">★ {rev.rating}</span>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              rev.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                            }`}>
                              {rev.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                            "{rev.commentEs}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rev.status !== 'APPROVED' ? (
                            <button
                              onClick={() => moderateReview(rev.id, 'APPROVED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                            >
                              Aprobar
                            </button>
                          ) : (
                            <button
                              onClick={() => moderateReview(rev.id, 'PENDING')}
                              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold"
                            >
                              Pausar
                            </button>
                          )}
                          <button
                            onClick={() => moderateReview(rev.id, 'REJECTED')}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PORTFOLIO */}
              {activeTab === 'PORTFOLIO' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {language === 'es' ? 'Proyectos Multimedia del Portafolio' : 'Portfolio Media Items'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolio.map(p => (
                      <div key={p.id} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                        <img src={p.url} alt="Portfolio" className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <span className="text-[10px] font-bold text-amber-500 uppercase">{p.category}</span>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{p.titleEn}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: QR MERCHANT SETTINGS */}
              {activeTab === 'QR_SETTINGS' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {language === 'es' ? 'Configuración de Métodos de Cobro' : 'Payment Methods Configuration'}
                  </h4>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                    <strong>{language === 'es' ? '⚠️ Regla de Seguridad Antifraude:' : '⚠️ Anti-Fraud Security Rule:'}</strong>{' '}
                    {language === 'es'
                      ? 'No configure nombres de usuario ni @handles en Zelle, Venmo ni Cash App para evitar que los clientes envíen dinero a cuentas similares fraudulentas. Utilice siempre el número telefónico oficial registrado.'
                      : 'Do not use usernames or @handles for Zelle, Venmo, or Cash App to prevent clients from sending money to duplicate similar accounts. Always use the registered official phone number.'}
                  </div>

                  <div className="space-y-4">
                    {qrMethods.map(method => (
                      <div key={method.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">{method.provider}</span>
                          <span className="text-xs text-slate-400">ID: {method.id}</span>
                        </div>
                        <input
                          type="text"
                          defaultValue={method.accountInfo}
                          onBlur={(e) => {
                            updateQRMethod(method.id, e.target.value);
                            showNotification(`${method.provider} ${language === 'es' ? 'actualizado' : 'updated'}`);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
