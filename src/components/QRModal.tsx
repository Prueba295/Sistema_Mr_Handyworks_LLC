import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentQR } from '../types';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
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
      <div className="w-52 h-52 bg-white p-3 rounded-2xl border-2 border-slate-900 dark:border-amber-400 shadow-lg flex flex-col items-center justify-center relative">
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
      <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B3C5D] to-[#154E74] text-white flex items-center justify-between">
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

        {/* Provider Tabs: Zelle, PayPal, Venmo, CashApp */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1.5">
          {qrMethods.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentProvider(item);
                setCopied(false);
              }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
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
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
          
          {/* Fee & Direct Payment Callout */}
          <div className="w-full max-w-sm p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-left flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-extrabold text-slate-900 dark:text-white block">
                {language === 'es' ? 'Pago a Mr Handyworks LLC' : 'Payment to Mr Handyworks LLC'}
              </span>
              {language === 'es' 
                ? 'Las consultas en sitio inician en $125. Puedes coordinar tu pago y comprobante directamente por SMS o llamada con nuestro equipo.'
                : 'On-site consultations start at $125. You can coordinate your payment and receipt directly via SMS or phone call with our team.'}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {t.qrModal.scanNotice}
          </p>

          {/* QR Code Container */}
          {getQRCodeSVG(currentProvider.provider)}

          {/* Copyable Account Box */}
          <div className="w-full max-w-sm bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="text-left overflow-hidden">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {currentProvider.provider} {language === 'es' ? 'Cuenta / Handle' : 'Account Handle'}
              </div>
              <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {currentProvider.accountInfo}
              </div>
            </div>

            <button
              onClick={() => handleCopy(currentProvider.accountInfo)}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.qrModal.copied : t.qrModal.copyAccount}</span>
            </button>
          </div>

          {/* Provider Specific Instructions */}
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
            {language === 'es' ? currentProvider.instructionsEs : currentProvider.instructionsEn}
          </p>

          <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
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
