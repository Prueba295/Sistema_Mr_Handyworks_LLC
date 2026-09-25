import { Booking, BookingAttachment } from '../types';

/**
 * MR HANDYWORKS LLC - LIVE REAL-TIME NOTIFICATION DISPATCHER
 * Directly connects customer bookings to the verified service team phone: (574) 279-9355
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

  const clientName = cleanText(booking.clientName, 'Customer');
  const clientPhone = cleanText(booking.clientPhone, 'Not available');
  const clientEmail = cleanText(booking.clientEmail, 'Not available');
  const clientAddress = cleanText(booking.clientAddress, 'On file');
  const zipCode = cleanText(booking.zipCode, '46637');
  const serviceType = cleanText(booking.serviceType, 'General Handyman Service');
  const projectDetails = cleanText(booking.projectDetails, 'No additional project notes provided');
  
  const attachments = booking.attachments || [];
  const attachmentsCount = attachments.length || (booking.photoUrl ? 1 : 0);
  
  let attachmentsList = '• None provided';
  if (attachments.length > 0) {
    attachmentsList = attachments.map((a, idx) => {
      const type = (a.type || 'file').toUpperCase();
      const fileName = cleanText(a.name, `Attachment-${idx + 1}`);
      const sizeStr = a.sizeFormatted ? ` (${a.sizeFormatted})` : '';

      let linkUrl = '';
      if (a.dataUrl && a.dataUrl.startsWith('http')) {
        linkUrl = a.dataUrl;
      } else {
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
        linkUrl = `https://jonkbrwdzhpsghsmjhbz.supabase.co/storage/v1/object/public/booking-attachments/${booking.id}/${a.id || `att-${idx + 1}`}-${safeName}`;
      }

      return `• [${type}] ${fileName}${sizeStr}\n  View: ${linkUrl}`;
    }).join('\n\n');
  } else if (booking.photoUrl) {
    const photoLink = booking.photoUrl.startsWith('http')
      ? booking.photoUrl
      : `https://jonkbrwdzhpsghsmjhbz.supabase.co/storage/v1/object/public/booking-attachments/${booking.id}/project-photo.jpg`;
    attachmentsList = `• [IMAGE] Project Reference Photo\n  View: ${photoLink}`;
  }

  const portalBase = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('localhost'))
    ? window.location.origin
    : 'https://sistema-mr-handyworks-llc.vercel.app';

  return `MR HANDYWORKS LLC - NEW SERVICE REQUEST

Order #: ${booking.id}
Customer: ${clientName}
Phone: ${clientPhone}
Email: ${clientEmail}
Address: ${clientAddress} (ZIP: ${zipCode})

Service: ${serviceType}
Requested Date: ${cleanText(booking.scheduledDate, 'To be coordinated')}
Time Window: ${cleanText(booking.scheduledTimeSlot, 'To be coordinated')}

Scope of Work:
${projectDetails}

Attachments (${attachmentsCount}):
${attachmentsList}

Public View & Files:
${portalBase}/#view-order=${booking.id}

Admin Portal:
${portalBase}/#admin`;
}

/**
 * Build Email Dispatch URL to automatically send the complete Work Order and
 * attachments links to the admin email: Mrhandyworks25@gmail.com and contact@mrhandyworks.com
 */
export function buildAdminEmailDispatchUrl(
  booking: Booking, 
  adminEmail: string = 'Mrhandyworks25@gmail.com'
): string {
  const subject = encodeURIComponent(`[Work Order #${booking.id}] New Booking: ${booking.serviceType} - ${booking.clientName}`);
  const bodyText = formatOwnerDispatchMessage(booking);
  const body = encodeURIComponent(bodyText);
  return `mailto:${adminEmail}?cc=contact@mrhandyworks.com&subject=${subject}&body=${body}`;
}

/**
 * Automatically trigger email dispatch to admin
 */
export function triggerAdminEmailDispatch(
  booking: Booking, 
  adminEmail: string = 'Mrhandyworks25@gmail.com'
): string {
  const mailUrl = buildAdminEmailDispatchUrl(booking, adminEmail);
  if (typeof window !== 'undefined') {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = mailUrl;
      document.body.appendChild(iframe);
      setTimeout(() => {
        try { document.body.removeChild(iframe); } catch {}
      }, 3000);
    } catch {
      // safe fallback
    }
  }
  return mailUrl;
}

/**
 * Build SMS link directly addressed to the service team
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
 * Trigger the owner SMS dispatch immediately after booking confirmation to avoid
 * popup-blocking and to work on both mobile and desktop browsers when a default
 * SMS client is installed.
 */
export function triggerOwnerSMSDispatch(booking: Booking, ownerPhoneRaw: string = '15742799355'): string {
  const smsUrl = buildOwnerSMSNotificationUrl(booking, ownerPhoneRaw);
  const runtimeWindow = typeof window !== 'undefined'
    ? window
    : (typeof globalThis !== 'undefined' ? (globalThis as any) : undefined);

  if (!runtimeWindow || !runtimeWindow.location) {
    return smsUrl;
  }

  try {
    runtimeWindow.location.href = smsUrl;
  } catch {
    try {
      runtimeWindow.open?.(smsUrl, '_self');
    } catch {
      // Graceful fallback when the browser blocks the SMS scheme.
    }
  }

  return smsUrl;
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
