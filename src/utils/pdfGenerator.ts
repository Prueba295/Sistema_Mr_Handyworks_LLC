import { Booking } from '../types';
import { BUSINESS_INFO } from '../data/initialData';

export const generateQuotePDF = (booking: Booking, language: 'es' | 'en' = 'en') => {
  const isEs = language === 'es';
  const bookingDate = new Date(booking.createdAt || Date.now());
  const year = bookingDate.getFullYear();
  const monthStr = String(bookingDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(bookingDate.getDate()).padStart(2, '0');
  const cleanId = (booking.id || 'JOB').toString().replace(/[^A-Z0-9]/gi, '').slice(-4).toUpperCase() || 'JOB';
  const quoteNumber = `MHW-${year}-${monthStr}${dayStr}-${cleanId}`;
  
  const clientName = booking.clientName?.trim() || (isEs ? 'Cliente' : 'Customer');
  const clientPhone = booking.clientPhone?.trim() || '(574) 279-9355';
  const clientEmail = booking.clientEmail?.trim() || 'N/A';
  const clientAddress = booking.clientAddress?.trim() || (isEs ? 'Dirección en registro' : 'Address on file');
  const zipCode = booking.zipCode?.trim() || '';
  const fullAddress = zipCode ? `${clientAddress} (ZIP: ${zipCode})` : clientAddress;

  const serviceType = booking.serviceType?.trim() || (isEs ? 'Reparación y Servicio Residencial' : 'Residential Repair & Service');
  const scheduledDate = booking.scheduledDate?.trim() || (isEs ? 'Por confirmar en sitio' : 'To be confirmed on-site');
  const scheduledTime = booking.scheduledTimeSlot?.trim() || (isEs ? 'Franja horaria preferente' : 'Preferred arrival window');

  const projectDetails = booking.projectDetails?.trim() || (isEs 
    ? 'Servicio residencial solicitado según especificaciones del cliente. El alcance detallado de mano de obra y materiales será verificado en sitio.'
    : 'Residential service requested as per customer specifications. Detailed labor scope and materials will be verified on-site.');

  const attachmentsCount = booking.attachments ? booking.attachments.length : 0;
  const attachmentsSummary = attachmentsCount > 0
    ? `${attachmentsCount} ${isEs ? 'archivo(s) adjunto(s) para revisión técnica' : 'media attachment(s) for technician review'}`
    : (isEs ? 'Sin fotos o archivos adjuntos' : 'No photos or files attached');

  const htmlContent = `<!DOCTYPE html>
<html lang="${isEs ? 'es' : 'en'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${isEs ? 'Orden de Trabajo' : 'Work Order'} - ${quoteNumber}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0f172a;
      color: #0f172a;
    }

    /* Print Action Bar (Hidden during print) */
    .print-actions {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 12px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .actions-inner {
      max-width: 8.5in;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .actions-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge-mh {
      background: #f59e0b;
      color: #0f172a;
      font-size: 11px;
      font-weight: 900;
      padding: 4px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .actions-title {
      color: #f8fafc;
      font-size: 13px;
      font-weight: 700;
    }
    .actions-right {
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-print {
      background: #0284c7;
      color: #ffffff;
    }
    .btn-print:hover {
      background: #0369a1;
    }
    .btn-close {
      background: #334155;
      color: #e2e8f0;
    }
    .btn-close:hover {
      background: #475569;
    }

    /* Page Canvas */
    .canvas-wrapper {
      padding: 24px 0 48px;
      display: flex;
      justify-content: center;
    }

    /* Exact 8.5in x 11in Single Page Sheet */
    .page-sheet {
      width: 8.5in;
      height: 11in;
      max-height: 11in;
      background: #ffffff;
      margin: 0 auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #0b3c5d 0%, #154e74 100%);
      color: #ffffff;
      padding: 22px 32px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #f59e0b;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-container {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(245, 158, 11, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
      color: #ffffff;
      letter-spacing: 0.05em;
    }
    .header-text h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
    .header-text p {
      margin: 3px 0 0;
      font-size: 11px;
      color: #cbd5e1;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .header-meta {
      text-align: right;
    }
    .meta-tag {
      display: inline-block;
      background: rgba(245, 158, 11, 0.2);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.4);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .order-number {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      font-family: monospace;
      letter-spacing: 0.04em;
    }
    .order-date {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 3px;
    }

    /* Main Body */
    .body-content {
      padding: 18px 32px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
    }

    /* Section Banner */
    .section-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #0b3c5d;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 999px;
      align-self: flex-start;
    }

    /* 2-Column Grid (Client & Schedule) */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
    }
    .card-title {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      color: #0b3c5d;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      font-size: 11px;
      margin-bottom: 5px;
      line-height: 1.35;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      color: #64748b;
      font-weight: 600;
      flex-shrink: 0;
    }
    .detail-val {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
      word-break: break-word;
    }

    /* Scope of Work */
    .scope-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px 16px;
      position: relative;
    }
    .scope-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .scope-title {
      font-size: 12px;
      font-weight: 900;
      color: #0b3c5d;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .consultation-badge {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 800;
    }
    .scope-text {
      margin: 0;
      font-size: 11.5px;
      line-height: 1.5;
      color: #334155;
    }

    /* 3-Column Real Status Row (NO FAKE DEPOSITS) */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 12px;
      text-align: left;
    }
    .metric-label {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
      display: block;
    }
    .metric-val {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      display: block;
      margin-bottom: 2px;
    }
    .metric-sub {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.25;
      display: block;
    }

    /* Terms & Signature Row */
    .terms-signature-grid {
      display: grid;
      grid-template-columns: 1.35fr 0.85fr;
      gap: 14px;
      align-items: stretch;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
    .terms-card {
      background: #fafafa;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
    }
    .terms-title {
      font-size: 10px;
      font-weight: 900;
      color: #0b3c5d;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }
    .terms-list {
      margin: 0;
      padding-left: 14px;
      font-size: 9.5px;
      color: #475569;
      line-height: 1.45;
    }
    .terms-list li {
      margin-bottom: 4px;
    }
    .terms-list li:last-child {
      margin-bottom: 0;
    }

    .signature-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .sig-line {
      border-bottom: 1.5px solid #0f172a;
      margin: 18px 0 6px;
    }
    .sig-name {
      font-size: 10px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
    }
    .sig-date {
      font-size: 9px;
      color: #64748b;
    }

    /* Footer */
    .footer {
      background: #0b3c5d;
      color: #ffffff;
      padding: 12px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      letter-spacing: 0.02em;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .footer-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer-tag {
      background: rgba(245, 158, 11, 0.25);
      color: #fcd34d;
      font-weight: 900;
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .footer-right {
      color: #cbd5e1;
      font-weight: 600;
      font-size: 9.5px;
    }

    /* Print Specific Overrides */
    @media print {
      body {
        background: #ffffff !important;
      }
      .print-actions {
        display: none !important;
      }
      .canvas-wrapper {
        padding: 0 !important;
        margin: 0 !important;
      }
      .page-sheet {
        width: 8.5in !important;
        height: 11in !important;
        max-height: 11in !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>

  <!-- Floating Print & Download Toolbar -->
  <div class="print-actions">
    <div class="actions-inner">
      <div class="actions-left">
        <span class="badge-mh">MR HANDYWORKS LLC</span>
        <span class="actions-title">${isEs ? 'Comprobante Oficial de Solicitud de Servicio' : 'Official Service Request Summary'}</span>
      </div>
      <div class="actions-right">
        <button onclick="window.print()" class="btn btn-print">
          🖨️ ${isEs ? 'Imprimir / Guardar en PDF' : 'Print / Save as PDF'}
        </button>
        <button onclick="window.close()" class="btn btn-close">
          ✕ ${isEs ? 'Cerrar' : 'Close'}
        </button>
      </div>
    </div>
  </div>

  <div class="canvas-wrapper">
    <div class="page-sheet">
      
      <!-- Top Header -->
      <div class="header">
        <div class="header-brand">
          <div class="logo-container">MH</div>
          <div class="header-text">
            <h1>${isEs ? 'Orden de Solicitud de Servicio' : 'Service Request Work Order'}</h1>
            <p>Mr Handyworks LLC • South Bend, IN • (574) 279-9355</p>
          </div>
        </div>
        <div class="header-meta">
          <span class="meta-tag">${isEs ? 'Documento Oficial' : 'Official Document'}</span>
          <div class="order-number">${quoteNumber}</div>
          <div class="order-date">${isEs ? 'Emitida' : 'Issued'}: ${bookingDate.toLocaleDateString(isEs ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      <!-- Main Body Container -->
      <div class="body-content">
        
        <div class="section-pill">
          ✓ ${isEs ? 'Detalles de la Solicitud Registrada' : 'Registered Request Details'}
        </div>

        <!-- 2-Column Info Grid -->
        <div class="info-grid">
          
          <!-- Client Card -->
          <div class="card">
            <div class="card-title">
              <span>${isEs ? 'Datos del Cliente' : 'Client Information'}</span>
              <span>👤</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Nombre Completo' : 'Full Name'}:</span>
              <span class="detail-val">${clientName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Teléfono Móvil' : 'Mobile Phone'}:</span>
              <span class="detail-val">${clientPhone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Correo' : 'Email'}:</span>
              <span class="detail-val">${clientEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Dirección' : 'Address'}:</span>
              <span class="detail-val">${fullAddress}</span>
            </div>
          </div>

          <!-- Schedule & Service Card -->
          <div class="card">
            <div class="card-title">
              <span>${isEs ? 'Cita y Servicio' : 'Service & Schedule'}</span>
              <span>📅</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Servicio Requerido' : 'Service Scope'}:</span>
              <span class="detail-val">${serviceType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Fecha Solicitada' : 'Requested Date'}:</span>
              <span class="detail-val">${scheduledDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Franja Horaria' : 'Time Window'}:</span>
              <span class="detail-val">${scheduledTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isEs ? 'Estado de Cita' : 'Booking Status'}:</span>
              <span class="detail-val" style="color: #0284c7;">${isEs ? 'Pendiente Confirmación' : 'Pending Confirmation'}</span>
            </div>
          </div>

        </div>

        <!-- Scope of Work & Problem Description -->
        <div class="scope-box">
          <div class="scope-header">
            <span class="scope-title">${isEs ? 'Descripción del Trabajo / Problema' : 'Project Scope & Problem Description'}</span>
            <span class="consultation-badge">${isEs ? 'Consulta en Sitio: Inicia en $125' : 'On-Site Consultation: Starts at $125'}</span>
          </div>
          <p class="scope-text">${projectDetails}</p>
        </div>

        <!-- Truthful Financial & Document Status (NO INVENTED DEPOSITS) -->
        <div class="metrics-row">
          
          <div class="metric-card">
            <span class="metric-label">${isEs ? 'Tarifa de Consulta' : 'On-Site Diagnostic'}</span>
            <span class="metric-val" style="color: #0b3c5d;">${isEs ? 'Inicia en $125.00' : 'Starts at $125.00'}</span>
            <span class="metric-sub">${isEs ? 'Inspección técnica y evaluación en sitio' : 'Technical diagnostic & scope evaluation'}</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">${isEs ? 'Cobro en Línea Hoy' : 'Online Charge Today'}</span>
            <span class="metric-val" style="color: #16a34a;">$0.00</span>
            <span class="metric-sub">${isEs ? 'Sin cobro automático previo ni depósito' : 'No online transfer or advance deposit'}</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">${isEs ? 'Archivos Adjuntos' : 'Attached Files'}</span>
            <span class="metric-val" style="color: #0284c7;">${attachmentsCount} ${isEs ? 'archivo(s)' : 'file(s)'}</span>
            <span class="metric-sub">${attachmentsSummary}</span>
          </div>

        </div>

        <!-- Service Terms & Customer Signature -->
        <div class="terms-signature-grid">
          
          <div class="terms-card">
            <div class="terms-title">${isEs ? 'Términos y Condiciones de Servicio' : 'Terms & Coordination Policies'}</div>
            <ul class="terms-list">
              <li>${isEs ? 'Las consultas en sitio inician en $125. El costo final de mano de obra y materiales se evalúa y presupuesta en sitio antes de comenzar trabajos adicionales.' : 'On-site consultations start at $125. Final project labor and materials are evaluated on-site and confirmed with customer before executing additional work.'}</li>
              <li>${isEs ? 'No se ha realizado ningún cobro por adelantado en el sistema web. Todo pago se coordina directamente con el equipo de Mr Handyworks al confirmar la cita o al completar el trabajo.' : 'No advance payment has been charged online. All payments are coordinated directly with the Mr Handyworks Team upon schedule confirmation or project completion.'}</li>
              <li>${isEs ? 'Métodos aceptados: Zelle, Venmo, Cash App y Apple Pay coordinados al teléfono oficial (574) 279-9355 (no buscar por nombres para evitar cuentas similares), Efectivo, Cheque y Tarjetas (+3.5%).' : 'Accepted payments: Zelle, Venmo, Cash App, and Apple Pay coordinated strictly to official phone (574) 279-9355 (do not search by names to avoid duplicate accounts), Cash, Check, and Cards (+3.5%).'}</li>
              <li>${isEs ? 'Agradecemos notificar con al menos 24 horas de cortesía en caso de requerir reprogramación.' : 'Please provide 24-hour advance notice for any schedule changes or cancellations.'}</li>
            </ul>
          </div>

          <div class="signature-card">
            <div>
              <div class="sig-title">${isEs ? 'Conformidad del Cliente' : 'Customer Acknowledgement'}</div>
              <div class="sig-line"></div>
              <div class="sig-name">${clientName}</div>
            </div>
            <div class="sig-date">${isEs ? 'Fecha de Solicitud' : 'Date'}: ${bookingDate.toLocaleDateString(isEs ? 'es-ES' : 'en-US')}</div>
          </div>

        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-left">
          <div class="footer-item"><span class="footer-tag">TEL</span>${BUSINESS_INFO.phone || '(574) 279-9355'}</div>
          <div class="footer-item"><span class="footer-tag">EMAIL</span>${BUSINESS_INFO.email || 'Mrhandyworks25@gmail.com'}</div>
          <div class="footer-item"><span class="footer-tag">ÁREA</span>South Bend & Michiana</div>
        </div>
        <div class="footer-right">
          Mr Handyworks LLC • Licensed & Insured #NX-IN-99421
        </div>
      </div>

    </div>
  </div>

</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const previewUrl = URL.createObjectURL(blob);
  const popup = window.open(previewUrl, '_blank', 'noopener,noreferrer');

  if (popup) {
    popup.focus();
    setTimeout(() => URL.revokeObjectURL(previewUrl), 30000);
    return previewUrl;
  }

  const fallback = window.open('', '_blank', 'noopener,noreferrer');
  if (fallback) {
    fallback.document.write(htmlContent);
    fallback.document.close();
  }

  setTimeout(() => URL.revokeObjectURL(previewUrl), 30000);
  return previewUrl;
};
