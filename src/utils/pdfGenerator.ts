import { Booking } from '../types';
import { BUSINESS_INFO } from '../data/initialData';

export const generateQuotePDF = (booking: Booking, language: 'es' | 'en' = 'en') => {
  const isEs = language === 'es';
  const basePrice = booking.estimatedPrice > 0 ? booking.estimatedPrice : 125;
  const totalPriceFormatted = `$${basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const depositFormatted = `$${(basePrice * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const bookingDate = new Date(booking.createdAt || Date.now());
  const year = bookingDate.getFullYear();
  const monthStr = String(bookingDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(bookingDate.getDate()).padStart(2, '0');
  const quoteNumber = `MHW-${year}-${monthStr}${dayStr}-${(booking.id || 'JOB').toString().replace(/[^A-Z0-9]/gi, '').slice(-4).toUpperCase() || 'JOB'}`;
  const projectSummary = booking.projectDetails || booking.serviceType || (isEs ? 'Servicio solicitado' : 'Service requested');
  const attachmentsText = booking.attachments && booking.attachments.length > 0
    ? `${booking.attachments.length} ${isEs ? 'archivo(s) adjunto(s)' : 'attachment(s)'}`
    : isEs ? 'Sin archivos adjuntos' : 'No attachments';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isEs ? 'es' : 'en'}">
      <head>
        <meta charset="utf-8" />
        <title>${isEs ? 'Orden de Trabajo' : 'Work Order'} - ${quoteNumber}</title>
        <style>
          @page { size: letter portrait; margin: 0; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 22px;
            font-family: Arial, Helvetica, sans-serif;
            background: #eef2f7;
            color: #0f172a;
          }
          .page {
            width: 8.5in;
            min-height: 11in;
            background: #ffffff;
            margin: 0 auto;
            border: 1px solid #dbe2ea;
            box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
            overflow: hidden;
          }
          .topbar {
            background: linear-gradient(135deg, #0b3c5d 0%, #123d5b 100%);
            color: white;
            padding: 18px 28px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: rgba(255,255,255,0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            letter-spacing: 0.08em;
            font-size: 18px;
          }
          .brand h1 {
            margin: 0;
            font-size: 29px;
            line-height: 1.05;
            letter-spacing: -0.04em;
          }
          .meta-box {
            text-align: right;
            font-size: 11px;
            opacity: 0.95;
            line-height: 1.5;
          }
          .content {
            padding: 24px 28px 20px;
          }
          .section-label {
            display: inline-block;
            background: #f5d77a;
            color: #0f172a;
            font-weight: 800;
            letter-spacing: 0.12em;
            font-size: 11px;
            padding: 7px 10px;
            border-radius: 999px;
            margin-bottom: 14px;
            text-transform: uppercase;
          }
          .grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 16px;
            margin-bottom: 18px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px 16px;
            background: #f8fafc;
          }
          .card h3 {
            margin: 0 0 10px;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #475569;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 8px;
            font-size: 12px;
          }
          .row strong { color: #0f172a; }
          .scope {
            border: 1px solid #dfe7f3;
            border-radius: 14px;
            padding: 16px;
            background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
            margin-bottom: 18px;
          }
          .scope-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            gap: 12px;
          }
          .scope-head h2 {
            margin: 0;
            font-size: 18px;
            color: #0f172a;
          }
          .price-pill {
            background: #e7f7ec;
            color: #166534;
            padding: 8px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
          }
          .scope p {
            margin: 0;
            font-size: 12.5px;
            line-height: 1.6;
            color: #334155;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 18px;
          }
          .mini {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 14px;
            background: #f8fafc;
          }
          .mini .label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            margin-bottom: 6px;
            font-weight: 800;
          }
          .mini .value {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
          }
          .terms {
            border-top: 2px solid #e2e8f0;
            padding-top: 16px;
            display: grid;
            grid-template-columns: 1.4fr 0.8fr;
            gap: 16px;
          }
          .terms ul {
            margin: 0;
            padding-left: 18px;
            font-size: 12px;
            color: #334155;
            line-height: 1.6;
          }
          .signature-box {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            background: #f8fafc;
          }
          .signature-line {
            border-bottom: 2px solid #0f172a;
            height: 38px;
            margin-top: 10px;
            margin-bottom: 6px;
          }
          .signature-box .small {
            font-size: 11px;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .footer {
            margin-top: 18px;
            background: #0b3c5d;
            color: white;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 11px;
            letter-spacing: 0.03em;
          }
          .chip {
            display: inline-block;
            background: rgba(245, 215, 122, 0.18);
            color: #f5d77a;
            border-radius: 999px;
            padding: 5px 7px;
            margin-right: 8px;
            font-weight: 800;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="topbar">
            <div class="brand">
              <div class="logo">MH</div>
              <div>
                <h1>${isEs ? 'Orden de Trabajo' : 'Work Order'}</h1>
              </div>
            </div>
            <div class="meta-box">
              <div><strong>${isEs ? 'Núm. de Orden' : 'Order #'}:</strong> ${quoteNumber}</div>
              <div>${isEs ? 'Emitida' : 'Issued'}: ${bookingDate.toLocaleDateString(isEs ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>

          <div class="content">
            <div class="section-label">${isEs ? 'Servicio solicitado' : 'Service request'}</div>
            <div class="grid">
              <div class="card">
                <h3>${isEs ? 'Cliente' : 'Client'}</h3>
                <div class="row"><span>${isEs ? 'Nombre' : 'Name'}</span><strong>${booking.clientName || 'Customer'}</strong></div>
                <div class="row"><span>${isEs ? 'Teléfono' : 'Phone'}</span><strong>${booking.clientPhone || 'Not provided'}</strong></div>
                <div class="row"><span>${isEs ? 'Dirección' : 'Address'}</span><strong>${booking.clientAddress || 'Address on file'}</strong></div>
              </div>
              <div class="card">
                <h3>${isEs ? 'Trabajo' : 'Project'}</h3>
                <div class="row"><span>${isEs ? 'Servicio' : 'Service'}</span><strong>${booking.serviceType || 'General service'}</strong></div>
                <div class="row"><span>${isEs ? 'Fecha' : 'Date'}</span><strong>${booking.scheduledDate || 'To be confirmed'}</strong></div>
                <div class="row"><span>${isEs ? 'Horario' : 'Time'}</span><strong>${booking.scheduledTimeSlot || 'To be confirmed'}</strong></div>
              </div>
            </div>

            <div class="scope">
              <div class="scope-head">
                <h2>${isEs ? 'Alcance del Trabajo' : 'Scope of Work'}</h2>
                <div class="price-pill">${isEs ? 'Estimado' : 'Estimate'}: ${totalPriceFormatted}</div>
              </div>
              <p>${projectSummary}</p>
            </div>

            <div class="summary-grid">
              <div class="mini">
                <span class="label">${isEs ? 'Depósito' : 'Deposit'}</span>
                <span class="value">${depositFormatted}</span>
              </div>
              <div class="mini">
                <span class="label">${isEs ? 'Pago Restante' : 'Remaining'}</span>
                <span class="value">${totalPriceFormatted}</span>
              </div>
              <div class="mini">
                <span class="label">${isEs ? 'Adjuntos' : 'Attachments'}</span>
                <span class="value">${attachmentsText}</span>
              </div>
            </div>

            <div class="terms">
              <div>
                <div class="section-label" style="margin-bottom: 12px;">${isEs ? 'Términos' : 'Terms'}</div>
                <ul>
                  <li>${isEs ? 'El trabajo se realizará según el alcance aprobado, condiciones del sitio y disponibilidad confirmada.' : 'Work will be completed according to the approved scope, site conditions, and confirmed availability.'}</li>
                  <li>${isEs ? 'Se requiere depósito para confirmar fecha y preparación del trabajo.' : 'A deposit is required to confirm the date and begin preparation.'}</li>
                  <li>${isEs ? 'Pagos aceptados: Zelle, Venmo, Cash App, Apple Pay, efectivo y tarjetas.' : 'Accepted payments: Zelle, Venmo, Cash App, Apple Pay, cash, and cards.'}</li>
                </ul>
              </div>
              <div class="signature-box">
                <div class="small">${isEs ? 'Firma del cliente' : 'Customer signature'}</div>
                <div class="signature-line"></div>
                <div class="small">${booking.clientName || (isEs ? 'Nombre del cliente' : 'Client name')}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <div><span class="chip">TEL</span>${BUSINESS_INFO.phone || '(574) 279-9355'}</div>
            <div><span class="chip">EMAIL</span>${BUSINESS_INFO.email || 'contact@mrhandyworks.com'}</div>
            <div>${isEs ? 'Documento generado' : 'Document generated'}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const previewUrl = URL.createObjectURL(blob);
  const popup = window.open(previewUrl, '_blank', 'noopener,noreferrer');

  if (popup) {
    popup.focus();
    setTimeout(() => URL.revokeObjectURL(previewUrl), 25000);
    return previewUrl;
  }

  const fallback = window.open('', '_blank', 'noopener,noreferrer');
  if (fallback) {
    fallback.document.write(htmlContent);
    fallback.document.close();
  }

  setTimeout(() => URL.revokeObjectURL(previewUrl), 25000);
  return previewUrl;
};
