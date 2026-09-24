import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentQR } from '../types';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle,
  Phone,
  MessageSquare,
  Smartphone
} from 'lucide-react';

export const QRModal: React.FC = () => {
  const { 
    isQRModalOpen, 
    setIsQRModalOpen, 
    activeQRProvider, 
    qrMethods, 
    t, 
    language,
    showNotification 
  } = useApp();

  const [currentProvider, setCurrentProvider] = useState<PaymentQR>(() => {
    return activeQRProvider || qrMethods[0];
  });
  const [copied, setCopied] = useState<boolean>(false);

  if (!isQRModalOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showNotification(t.qrModal.copied);
    setTimeout(() => setCopied(false), 3000);
  };

  // Generate SVG QR Code dynamically with high contrast
  const getQRCodeSVG = (providerName: string) => {
    return (
      <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3 rounded-2xl border-2 border-slate-900 dark:border-amber-400 shadow-lg flex flex-col items-center justify-center relative">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
          {/* Stylized geometric QR matrix representation */}
          <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
          {/* Corners Finder Patterns */}
          <rect x="6" y="6" width="26" height="26" fill="#0B3C5D" rx="4" />
          <rect x="10" y="10" width="18" height="18" fill="#ffffff" rx="2" />
          <rect x="14" y="14" width="10" height="10" fill="#0B3C5D" rx="2" />

          <rect x="68" y="6" width="26" height="26" fill="#0B3C5D" rx="4" />
          <rect x="72" y="10" width="18" height="18" fill="#ffffff" rx="2" />
          <rect x="76" y="14" width="10" height="10" fill="#0B3C5D" rx="2" />

          <rect x="6" y="68" width="26" height="26" fill="#0B3C5D" rx="4" />
          <rect x="10" y="72" width="18" height="18" fill="#ffffff" rx="2" />
          <rect x="14" y="76" width="10" height="10" fill="#0B3C5D" rx="2" />

          {/* Data Modules Mockup */}
          <rect x="36" y="8" width="8" height="8" fill="#0B3C5D" />
          <rect x="48" y="8" width="12" height="8" fill="#0B3C5D" />
          <rect x="36" y="20" width="8" height="8" fill="#0B3C5D" />
          <rect x="48" y="20" width="8" height="8" fill="#0B3C5D" />
          <rect x="8" y="36" width="8" height="8" fill="#0B3C5D" />
          <rect x="20" y="36" width="8" height="8" fill="#0B3C5D" />
          <rect x="36" y="36" width="28" height="28" fill="#D97706" rx="4" />
          <rect x="42" y="42" width="16" height="16" fill="#ffffff" rx="3" />
          <rect x="70" y="36" width="8" height="8" fill="#0B3C5D" />
          <rect x="82" y="36" width="8" height="8" fill="#0B3C5D" />
          <rect x="70" y="48" width="16" height="8" fill="#0B3C5D" />
          <rect x="8" y="48" width="12" height="8" fill="#0B3C5D" />
          <rect x="24" y="48" width="8" height="8" fill="#0B3C5D" />
          <rect x="36" y="68" width="12" height="8" fill="#0B3C5D" />
          <rect x="52" y="68" width="8" height="8" fill="#0B3C5D" />
          <rect x="68" y="68" width="8" height="8" fill="#0B3C5D" />
          <rect x="80" y="68" width="10" height="10" fill="#0B3C5D" />
          <rect x="36" y="80" width="8" height="10" fill="#0B3C5D" />
          <rect x="48" y="80" width="16" height="10" fill="#0B3C5D" />
          <rect x="68" y="80" width="12" height="10" fill="#0B3C5D" />
        </svg>

        {/* Center Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0B3C5D] shadow-md flex items-center justify-center font-extrabold text-[10px] text-[#0B3C5D]">
            {providerName.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B3C5D] to-[#154E74] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-amber-300">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                {t.qrModal.title}
              </h3>
              <p className="text-xs text-amber-200">
                {t.qrModal.verifiedMerchant}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQRModalOpen(false)}
            aria-label="Close payment window"
            title="Close payment window"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Provider Tabs: Zelle, Venmo, CashApp, ApplePay */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1.5 shrink-0">
          {qrMethods.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentProvider(item);
                setCopied(false);
              }}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                currentProvider.id === item.id
                  ? 'bg-white dark:bg-slate-900 text-[#0B3C5D] dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.provider}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex flex-col items-center text-center space-y-4">
          
          {/* Anti-Fraud Warning Box - DO NOT SEARCH BY NAME */}
          <div className="w-full max-w-md p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-left flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              <span className="font-black text-amber-800 dark:text-amber-300 block uppercase tracking-wide text-[11px]">
                {language === 'es' ? '⚠️ NO BUSQUES POR NOMBRE O USUARIO' : '⚠️ DO NOT SEARCH BY NAME OR USERNAME'}
              </span>
              {language === 'es' 
                ? 'Existen muchas cuentas con nombres similares en Zelle, Venmo y Cash App. Para evitar enviar tu dinero a cuentas erróneas o duplicadas, usa únicamente el número de teléfono oficial registrado (574) 279-9355 y confirma la cuenta autorizada antes de enviar el pago.'
                : 'There are many accounts with similar names across Zelle, Venmo, and Cash App. To avoid sending money to wrong or duplicate accounts, use only the verified official phone number (574) 279-9355 and confirm the authorized account before sending payment.'}
            </div>
          </div>

          {/* QR Code Container */}
          {getQRCodeSVG(currentProvider.provider)}

          {/* Copyable Phone Box */}
          <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="text-left overflow-hidden">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {currentProvider.provider} • {language === 'es' ? 'Teléfono Oficial Registrado' : 'Official Registered Phone'}
              </div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-wide">
                {currentProvider.accountInfo}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ {language === 'es' ? 'Cuenta autorizada de Mr Handyworks LLC' : 'Authorized Mr Handyworks LLC account'}
              </div>
            </div>

            <button
              onClick={() => handleCopy(currentProvider.accountInfo)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.qrModal.copied : (language === 'es' ? 'Copiar Número' : 'Copy Phone')}</span>
            </button>
          </div>

          {/* Direct Call & SMS Quick Links */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            <a
              href="tel:5742799355"
              className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Llamar al (574) 279-9355' : 'Call (574) 279-9355'}</span>
            </a>
            <a
              href="sms:+15742799355"
              className="py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 hover:bg-blue-100 text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Enviar SMS Directo' : 'Send Direct SMS'}</span>
            </a>
          </div>

          {/* Provider Specific Instructions */}
          <div className="w-full max-w-md p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'es' ? currentProvider.instructionsEs : currentProvider.instructionsEn}
            </p>
          </div>

          <div className="w-full max-w-md pt-2">
            <button
              onClick={() => {
                showNotification(language === 'es' ? '¡Gracias! Verificaremos tu comprobante con el proyecto.' : 'Thank you! We will verify your deposit with the project.');
                setIsQRModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#0B3C5D] hover:bg-[#082a42] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors"
            >
              {t.qrModal.doneConfirm}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
