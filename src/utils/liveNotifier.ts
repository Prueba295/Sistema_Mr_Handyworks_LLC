import { Booking, BookingAttachment } from '../types';

/**
 * MR HANDYWORKS LLC - LIVE REAL-TIME NOTIFICATION DISPATCHER
 * Directly connects customer bookings to owner Brian Cueva's phone: (574) 279-9355
 */

export interface LiveNotificationPayload {
  orderId: string;
  timestamp: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  serviceType: string;
  scheduledDate: string;
  scheduledSlot: string;
  consultationFee: string;
  notes: string;
  attachmentsCount: number;
  attachmentsManifest: Array<{
    name: string;
    type: string;
    sizeFormatted: string;
  }>;
}

/**
 * Format complete, unambiguous dispatch text for owner's phone via SMS
 * Prevents any mix-ups between customers or attached files.
 */
export function formatOwnerDispatchMessage(booking: Booking): string {
  const cleanText = (value: string | undefined, fallback: string): string => {
    const normalized = (value || '').replace(/\s+/g, ' ').trim();
    return normalized || fallback;
  };

  const clientName = cleanText(booking.clientName, 'Cliente');
  const clientPhone = cleanText(booking.clientPhone, 'No disponible');
  const clientEmail = cleanText(booking.clientEmail, 'No disponible');
  const clientAddress = cleanText(booking.clientAddress, 'En registro');
  const zipCode = cleanText(booking.zipCode, '46637');
  const serviceType = cleanText(booking.serviceType, 'Servicio General');
  const projectDetails = cleanText(booking.projectDetails, 'Sin notas adicionales');
  
  const attachments = booking.attachments || [];
  const attachmentsCount = attachments.length || (booking.photoUrl ? 1 : 0);
  
  let attachmentsList = '- Ninguno';
  if (attachments.length > 0) {
    attachmentsList = attachments.map((a) => {
      const type = (a.type || 'archivo').toUpperCase();
      const urlInfo = a.dataUrl && a.dataUrl.startsWith('http') ? `\n  Link: ${a.dataUrl}` : '';
      return `• [${type}] ${cleanText(a.name, 'Archivo')} (${a.sizeFormatted || 'adjunto'})${urlInfo}`;
    }).join('\n');
  } else if (booking.photoUrl) {
    attachmentsList = `• [FOTO] Foto del área ${booking.photoUrl.startsWith('http') ? `\n  Link: ${booking.photoUrl}` : '(en portal)'}`;
  }

  return `MR HANDYWORKS LLC - NUEVA SOLICITUD DE SERVICIO

Orden: #${booking.id}
Cliente: ${clientName}
Teléfono: ${clientPhone}
Email: ${clientEmail}
Dirección: ${clientAddress} (ZIP: ${zipCode})
Servicio: ${serviceType}
Fecha solicitada: ${cleanText(booking.scheduledDate, 'Por coordinar')}
Horario: ${cleanText(booking.scheduledTimeSlot, 'Por coordinar')}

Descripción del Trabajo:
${projectDetails}

Fotos y Documentos (${attachmentsCount}):
${attachmentsList}

Ver orden y fotos en el portal:
https://mr-handyworks-llc.com/#admin`;
}

/**
 * Build SMS link directly addressed to owner Brian Cueva
 * Automatically adapts separator for iOS (&body=) vs Android/Desktop (?body=)
 */
export function buildOwnerSMSNotificationUrl(booking: Booking, ownerPhoneRaw: string = '15742799355'): string {
  const cleanPhone = ownerPhoneRaw.replace(/\D/g, '');
  const message = formatOwnerDispatchMessage(booking);
  const encoded = encodeURIComponent(message);
  
  const isIOS = typeof navigator !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
  
  return isIOS ? `sms:${cleanPhone}&body=${encoded}` : `sms:${cleanPhone}?body=${encoded}`;
}

/**
 * Build WhatsApp link for direct instant messaging to owner
 */
export function buildOwnerWhatsAppNotificationUrl(booking: Booking, ownerPhoneRaw: string = '15742799355'): string {
  const cleanPhone = ownerPhoneRaw.replace(/\D/g, '');
  const message = formatOwnerDispatchMessage(booking);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Synthesize a clean, pleasant notification chime using Web Audio API
 * Runs without external MP3 files or network requests.
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // First tone (E5 ~ 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second tone (G#5 ~ 830.61 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.12);
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);

    // Third high harmonic tone (B5 ~ 987.77 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(987.77, now + 0.24);
    gain3.gain.setValueAtTime(0.22, now + 0.24);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 0.65);
  } catch (err) {
    // Graceful fallback if audio context blocked by browser autoplay policy
    console.warn('Audio chime notice:', err);
  }
}

/**
 * Trigger browser native notification if permitted
 */
export function triggerDesktopNotification(booking: Booking): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('🚨 New Booking Confirmed - Mr Handyworks LLC', {
      body: `${booking.clientName} booked ${booking.serviceType} for ${booking.scheduledDate}. Fee: $125.00.`,
      icon: '/logo_handyworks.jpeg'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('🚨 New Booking Confirmed - Mr Handyworks LLC', {
          body: `${booking.clientName} booked ${booking.serviceType} for ${booking.scheduledDate}. Fee: $125.00.`,
          icon: '/logo_handyworks.jpeg'
        });
      }
    });
  }
}

/**
 * Dispatch webhook payload for real-time external SMS API gateways
 * (e.g., Twilio, Make, Zapier, n8n)
 */
export async function dispatchBookingWebhook(
  booking: Booking, 
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const url = webhookUrl || (typeof window !== 'undefined' ? localStorage.getItem('mr_handyworks_webhook_url') : null);
  if (!url) {
    return { success: false, error: 'No external webhook configured' };
  }

  const payload: LiveNotificationPayload = {
    orderId: booking.id,
    timestamp: booking.createdAt,
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    clientEmail: booking.clientEmail,
    clientAddress: booking.clientAddress || '',
    serviceType: booking.serviceType,
    scheduledDate: booking.scheduledDate,
    scheduledSlot: booking.scheduledTimeSlot,
    consultationFee: '$125.00',
    notes: booking.projectDetails,
    attachmentsCount: booking.attachments?.length || 0,
    attachmentsManifest: (booking.attachments || []).map(a => ({
      name: a.name,
      type: a.type,
      sizeFormatted: a.sizeFormatted
    }))
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { success: res.ok };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Webhook transmission failed' };
  }
}
