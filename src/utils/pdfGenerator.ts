import { Booking } from '../types';
import { BUSINESS_INFO } from '../data/initialData';

export const generateQuotePDF = (booking: Booking, language: 'es' | 'en' = 'en') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const isEs = language === 'es';

  // Format Quote Number: e.g. MHW-2026-0924-JKF01
  const bookingDate = new Date(booking.createdAt || Date.now());
  const year = bookingDate.getFullYear();
  const monthStr = String(bookingDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(bookingDate.getDate()).padStart(2, '0');
  
  const clientInitials = (booking.clientName || 'CUS')
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 3) || 'CUS';
  
  const shortId = (booking.id || '01').replace(/\D/g, '').slice(-2) || '01';
  const quoteNumber = `MHW-${year}-${monthStr}${dayStr}-${clientInitials}${shortId}`;

  // Formatted date string
  const formattedDate = bookingDate.toLocaleDateString(isEs ? 'es-ES' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Location string
  const clientAddress = booking.clientAddress || '16350 Chickory Court';
  const locationCityZip = `${booking.zipCode ? `South Bend / Granger, IN ${booking.zipCode}` : 'Granger, IN 46530'}`;

  // Calculate pricing & line items
  const basePrice = booking.estimatedPrice > 0 ? booking.estimatedPrice : 125;
  const isEstimated = booking.estimatedPrice > 0;
  const totalPriceFormatted = `$${basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const depositFormatted = `$${(basePrice * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Parse project details or generate structured scope items matching the Proposal style
  interface ScopeItem {
    num: number;
    title: string;
    description: string;
    labor: string;
  }

  const scopeItems: ScopeItem[] = [];
  const rawDetails = (booking.projectDetails || '').trim();

  // If client wrote multiple numbered items or multiline tasks, split them
  const detailLines = rawDetails
    .split(/\n+/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (detailLines.length > 1) {
    detailLines.forEach((line, idx) => {
      const cleanLine = line.replace(/^\d+[\.\)\-]\s*/, '').replace(/^[•\-\*]\s*/, '');
      const parts = cleanLine.split(/:\s*/);
      const title = parts.length > 1 ? parts[0] : (idx === 0 ? booking.serviceType : `Scope Task #${idx + 1}`);
      const desc = parts.length > 1 ? parts.slice(1).join(': ') : cleanLine;
      scopeItems.push({
        num: idx + 1,
        title,
        description: desc,
        labor: idx === 0 ? (isEstimated ? `$${(basePrice * 0.6).toFixed(2)}` : 'Diagnostic') : (isEstimated ? `$${(basePrice * 0.4 / (detailLines.length - 1)).toFixed(2)}` : 'Included')
      });
    });
  } else {
    // Single scope item
    scopeItems.push({
      num: 1,
      title: booking.serviceType || (isEs ? 'Servicio General de Reparación e Instalación' : 'Primary Installation & Repair Scope'),
      description: rawDetails || (isEs
        ? 'Inspección técnica en sitio, retiro y reemplazo o montaje especializado, anclaje reforzado de seguridad, ajuste y verificación operativa.'
        : 'On-site technical evaluation, removal and replacement or precision mounting, reinforced structural anchoring, alignment, and full operational testing.'),
      labor: totalPriceFormatted
    });

    // Add standard supporting line items for a comprehensive proposal look
    scopeItems.push({
      num: 2,
      title: isEs ? 'Preparación del Sitio y Protección de Superficies' : 'Site Preparation & Surface Protection',
      description: isEs
        ? 'Acondicionamiento seguro del área de trabajo, verificación de conexiones y circuitos existentes, y limpieza de residuos al finalizar.'
        : 'Preparation of work areas, verification of existing power/structural framing, surface protection, and cleanup of service debris.',
      labor: isEs ? 'Incluido' : 'Included'
    });

    if (booking.attachments && booking.attachments.length > 0) {
      scopeItems.push({
        num: 3,
        title: isEs ? 'Inspección Visual y Documentación de Proyecto' : 'Visual Verification & Reference Documentation',
        description: isEs
          ? `Verificación de ${booking.attachments.length} archivo(s) fotográfico(s) y planos suministrados por el cliente para análisis previo.`
          : `Review and site matching for ${booking.attachments.length} client reference photo(s) and project documentation.`,
        labor: isEs ? 'Incluido' : 'Included'
      });
    }
  }

  // Base URL for assets
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const logoUrl = `${baseUrl}/logo_handyworks.jpeg`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isEs ? 'es' : 'en'}">
      <head>
        <meta charset="utf-8" />
        <title>${isEs ? 'Propuesta de Servicio' : 'Proposal'} - ${quoteNumber} - Mr Handyworks LLC</title>
        <base href="${baseUrl}/" />
        <style>
          @page {
            size: letter portrait;
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0F172A;
            background: #E2E8F0;
            margin: 0;
            padding: 24px 0;
            font-size: 13px;
            line-height: 1.45;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .sheet {
            background: #FFFFFF;
            width: 8.5in;
            min-height: 11in;
            margin: 0 auto 30px auto;
            padding: 44px 50px 30px 50px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          /* Header Block */
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }
          .brand-left {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          .brand-logo-box {
            width: 100px;
            height: 100px;
            background: #07101E;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          .brand-logo-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .brand-texts {
            display: flex;
            flex-direction: column;
          }
          .company-name {
            font-size: 21px;
            font-weight: 900;
            color: #07273D;
            letter-spacing: 0.5px;
            margin: 0;
          }
          .doc-type-title {
            font-size: 34px;
            font-weight: 950;
            color: #07273D;
            line-height: 1;
            margin: 4px 0 0 0;
            letter-spacing: -0.5px;
          }
          .gold-underline {
            width: 140px;
            height: 3.5px;
            background: #E69D00;
            margin: 6px 0 10px 0;
          }
          .tagline {
            font-size: 11px;
            font-weight: 900;
            color: #07273D;
            letter-spacing: 0.5px;
          }
          .sub-badge {
            font-size: 11px;
            color: #64748B;
            font-weight: 500;
            margin-top: 1px;
          }

          /* Metadata Table on Right */
          .meta-table-box {
            border-left: 2.5px solid #E69D00;
            padding-left: 16px;
            min-width: 250px;
          }
          .meta-table {
            border-collapse: collapse;
            font-size: 12px;
          }
          .meta-table td {
            padding: 3px 0;
          }
          .meta-label {
            font-weight: 800;
            color: #07273D;
            padding-right: 14px;
            white-space: nowrap;
          }
          .meta-value {
            color: #334155;
            font-weight: 500;
          }

          /* Location Row */
          .location-row {
            display: flex;
            align-items: center;
            margin-bottom: 22px;
          }
          .loc-badge {
            width: 44px;
            height: 44px;
            background: #07273D;
            border-radius: 8px;
            color: #FFFFFF;
            font-weight: 900;
            font-size: 12.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 14px;
            flex-shrink: 0;
            letter-spacing: 0.5px;
          }
          .loc-content {
            display: flex;
            flex-direction: column;
          }
          .loc-heading {
            font-size: 12.5px;
            font-weight: 900;
            color: #07273D;
            letter-spacing: 0.5px;
          }
          .loc-address {
            font-size: 13.5px;
            font-weight: 700;
            color: #1E293B;
            margin-top: 1px;
          }
          .loc-sub {
            font-size: 11px;
            color: #64748B;
            margin-top: 1px;
          }

          /* Scope of Work Table */
          .scope-container {
            margin-bottom: 20px;
          }
          .scope-banner {
            background: #07273D;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 1px;
            padding: 10px 16px;
            border-radius: 8px 8px 0 0;
            text-transform: uppercase;
          }
          .scope-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #CBD5E1;
            border-top: none;
          }
          .scope-table th {
            background: #0B3C5D;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 9px 12px;
            border-right: 1px solid rgba(255,255,255,0.2);
          }
          .scope-table th:last-child {
            border-right: none;
          }
          .scope-table td {
            padding: 12px 14px;
            border-bottom: 1px solid #E2E8F0;
            border-right: 1px solid #E2E8F0;
            vertical-align: top;
          }
          .scope-table td:last-child {
            border-right: none;
          }
          .scope-table tr:nth-child(even) {
            background: #F8FAFC;
          }
          .col-num {
            width: 44px;
            text-align: center;
            font-weight: 800;
            color: #334155;
          }
          .col-desc {
            line-height: 1.4;
          }
          .col-desc strong {
            display: block;
            font-size: 13px;
            font-weight: 800;
            color: #07273D;
            margin-bottom: 3px;
          }
          .col-desc div {
            font-size: 11.5px;
            color: #475569;
          }
          .col-labor {
            width: 115px;
            text-align: right;
            font-weight: 800;
            font-size: 14px;
            color: #0F172A;
            white-space: nowrap;
          }

          /* Total Labor Price Block */
          .total-price-row {
            display: flex;
            justify-content: flex-end;
            margin-top: -1px;
          }
          .total-price-box {
            background: #07273D;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            gap: 28px;
            padding: 11px 22px;
            border-radius: 0 0 6px 6px;
          }
          .total-label {
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .total-amount {
            font-size: 17px;
            font-weight: 900;
            letter-spacing: -0.5px;
          }

          /* Disclaimers & Page 1 Footer Notes */
          .page1-notes {
            margin-top: 14px;
            font-size: 11px;
            color: #64748B;
            font-style: italic;
            line-height: 1.5;
          }

          /* 4-Card Grid on Page 2 */
          .cards-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          .info-card {
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: #FFFFFF;
          }
          .info-card-header {
            background: #07273D;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 8px 12px;
          }
          .info-card-body {
            padding: 12px 14px;
            font-size: 10.5px;
            color: #334155;
            background: #F8FAFC;
            flex-grow: 1;
          }
          .info-card-body ul {
            margin: 0;
            padding-left: 14px;
            list-style-type: disc;
          }
          .info-card-body li {
            margin-bottom: 6px;
            line-height: 1.4;
          }
          .info-card-body li:last-child {
            margin-bottom: 0;
          }

          /* Approval Section on Page 2 */
          .approval-section {
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 16px;
          }
          .approval-banner {
            background: #07273D;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 8px 14px;
          }
          .approval-body {
            padding: 14px 16px 20px 16px;
            background: #FFFFFF;
            font-size: 11px;
            color: #334155;
          }
          .approval-text {
            margin-bottom: 8px;
            font-weight: 500;
          }
          .approval-scope-badge {
            font-weight: 800;
            color: #07273D;
            margin-bottom: 24px;
          }
          .signature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 36px;
            row-gap: 26px;
          }
          .sig-line-box {
            border-top: 1.5px solid #07273D;
            padding-top: 5px;
          }
          .sig-label {
            font-size: 10.5px;
            font-weight: 600;
            color: #475569;
          }

          /* Bottom Full Navy Banner */
          .bottom-navy-banner {
            background: #07273D;
            color: #FFFFFF;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            margin: 16px -50px -30px -50px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .bottom-navy-banner span.amber-tag {
            color: #E69D00;
            margin-right: 6px;
          }
          .bottom-navy-banner a {
            color: #FFFFFF;
            text-decoration: none;
          }

          /* Print / Screen controls */
          .no-print-bar {
            max-width: 8.5in;
            margin: 0 auto 16px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #07273D;
            padding: 12px 20px;
            border-radius: 10px;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .btn-print {
            background: #E69D00;
            color: #07273D;
            font-weight: 900;
            border: none;
            padding: 10px 22px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.2s;
          }
          .btn-print:hover {
            background: #F59E0B;
            transform: translateY(-1px);
          }
          .btn-close {
            background: transparent;
            color: #CBD5E1;
            border: 1px solid #475569;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
          }
          .btn-close:hover {
            color: white;
            border-color: white;
          }

          @media print {
            body {
              background: transparent;
              padding: 0;
              margin: 0;
            }
            .no-print-bar {
              display: none !important;
            }
            .sheet {
              width: 100% !important;
              min-height: 10.5in !important;
              margin: 0 !important;
              padding: 36px 40px 24px 40px !important;
              box-shadow: none !important;
              page-break-after: always;
              break-after: page;
            }
            .sheet:last-child {
              page-break-after: avoid;
              break-after: avoid;
            }
            .bottom-navy-banner {
              margin: 16px -40px -24px -40px !important;
            }
          }
        </style>
      </head>
      <body>

        <!-- Screen Action Bar -->
        <div class="no-print-bar">
          <div style="font-weight: 800; font-size: 14px;">
            📄 Mr. Handyworks LLC • ${isEs ? 'Propuesta Oficial de Proyecto' : 'Official Project Proposal'} (${quoteNumber})
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-print" onclick="window.print()">
              🖨️ ${isEs ? 'Imprimir o Guardar como PDF' : 'Print or Save as PDF'}
            </button>
            <button class="btn-close" onclick="window.close()">
              ✕ ${isEs ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>

        <!-- ================= PAGE 1: SCOPE OF WORK ================= -->
        <div class="sheet">
          <div>
            <!-- Top Header Row -->
            <div class="header-row">
              <div class="brand-left">
                <div class="brand-logo-box">
                  <img src="${logoUrl}" alt="Mr Handyworks LLC Logo" />
                </div>
                <div class="brand-texts">
                  <h1 class="company-name">MR. HANDYWORKS LLC</h1>
                  <div class="doc-type-title">${isEs ? 'PROPUESTA' : 'PROPOSAL'}</div>
                  <div class="gold-underline"></div>
                  <div class="tagline">${isEs ? 'CALIDAD EN EL TRABAJO. SERVICIO CONFIABLE.' : 'QUALITY WORK. RELIABLE SERVICE.'}</div>
                  <div class="sub-badge">${isEs ? 'Asegurado y Afianzado • Insured &amp; Bonded' : 'Insured &amp; Bonded'}</div>
                </div>
              </div>

              <!-- Metadata Table -->
              <div class="meta-table-box">
                <table class="meta-table">
                  <tr>
                    <td class="meta-label">${isEs ? 'Cotización #:' : 'Quote #:'}</td>
                    <td class="meta-value font-mono"><strong>${quoteNumber}</strong></td>
                  </tr>
                  <tr>
                    <td class="meta-label">${isEs ? 'Fecha:' : 'Date:'}</td>
                    <td class="meta-value">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td class="meta-label">${isEs ? 'Proyecto:' : 'Project:'}</td>
                    <td class="meta-value">${booking.serviceType || 'Home Installation & Maintenance'}</td>
                  </tr>
                  <tr>
                    <td class="meta-label">${isEs ? 'Cliente:' : 'Customer:'}</td>
                    <td class="meta-value"><strong>${booking.clientName}</strong></td>
                  </tr>
                  <tr>
                    <td class="meta-label">${isEs ? 'Teléfono:' : 'Phone:'}</td>
                    <td class="meta-value">${booking.clientPhone}</td>
                  </tr>
                  <tr>
                    <td class="meta-label">${isEs ? 'Correo:' : 'Email:'}</td>
                    <td class="meta-value">${booking.clientEmail}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Project Location Row -->
            <div class="location-row">
              <div class="loc-badge">LOC</div>
              <div class="loc-content">
                <div class="loc-heading">${isEs ? 'UBICACIÓN DEL PROYECTO' : 'PROJECT LOCATION'}</div>
                <div class="loc-address">${clientAddress}, ${locationCityZip}</div>
                <div class="loc-sub">
                  ${isEs
                    ? 'Propuesta de solo mano de obra basada en las condiciones visibles observadas y especificadas.'
                    : 'Labor-only proposal based on visible conditions observed during the walkthrough.'}
                </div>
              </div>
            </div>

            <!-- Scope of Work Section -->
            <div class="scope-container">
              <div class="scope-banner">${isEs ? 'ALCANCE DEL TRABAJO' : 'SCOPE OF WORK'}</div>
              <table class="scope-table">
                <thead>
                  <tr>
                    <th class="col-num">#</th>
                    <th style="text-align: left;">${isEs ? 'DESCRIPCIÓN DEL TRABAJO' : 'DESCRIPTION OF WORK'}</th>
                    <th class="col-labor">${isEs ? 'MANO DE OBRA' : 'LABOR'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${scopeItems.map(item => `
                    <tr>
                      <td class="col-num">${item.num}</td>
                      <td class="col-desc">
                        <strong>${item.title}</strong>
                        <div>${item.description}</div>
                      </td>
                      <td class="col-labor">${item.labor}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Total Labor Block -->
              <div class="total-price-row">
                <div class="total-price-box">
                  <span class="total-label">${isEs ? 'PRECIO TOTAL DE MANO DE OBRA' : 'TOTAL LABOR PRICE'}</span>
                  <span class="total-amount">${totalPriceFormatted}</span>
                </div>
              </div>
            </div>

            <!-- Page 1 Disclaimers -->
            <div class="page1-notes">
              <div>* ${isEs ? 'Los materiales no están incluidos en el monto total de mano de obra anterior.' : 'Materials are not included in the total above.'}</div>
              <div>* ${isEs ? 'Esta propuesta continúa en la página 2 con términos de pago, condiciones, exclusiones y aprobación formal.' : 'This proposal continues on page 2 with payment terms, conditions, exclusions and approval.'}</div>
            </div>
          </div>

          <!-- Page 1 Bottom Navy Banner -->
          <div class="bottom-navy-banner">
            <div><span class="amber-tag">TEL</span>${BUSINESS_INFO.phone}</div>
            <div><span class="amber-tag">EMAIL</span>${BUSINESS_INFO.email}</div>
            <div>${isEs ? 'PÁGINA 1 DE 2' : 'PAGE 1 OF 2'}</div>
          </div>
        </div>

        <!-- ================= PAGE 2: TERMS, CONDITIONS & APPROVAL ================= -->
        <div class="sheet">
          <div>
            <!-- Page 2 Header -->
            <div class="header-row" style="margin-bottom: 14px;">
              <div class="brand-left">
                <div class="brand-logo-box">
                  <img src="${logoUrl}" alt="Mr Handyworks LLC Logo" />
                </div>
                <div class="brand-texts">
                  <h1 class="company-name">MR. HANDYWORKS LLC</h1>
                  <div class="doc-type-title" style="font-size: 26px;">${isEs ? 'TÉRMINOS DEL PROYECTO Y APROBACIÓN' : 'PROJECT TERMS & APPROVAL'}</div>
                  <div class="gold-underline" style="margin-bottom: 6px;"></div>
                  <div class="tagline">${isEs ? 'CALIDAD EN EL TRABAJO. SERVICIO CONFIABLE. | ASEGURADO Y AFIANZADO' : 'QUALITY WORK. RELIABLE SERVICE. | INSURED & BONDED'}</div>
                </div>
              </div>

              <!-- Compact Meta on Page 2 -->
              <div style="text-align: right; font-size: 11px; color: #475569;">
                <div class="font-mono" style="font-weight: 800; color: #07273D;">${quoteNumber}</div>
                <div>${formattedDate}</div>
                <div style="font-weight: 700; color: #1E293B; margin-top: 2px;">${booking.clientName}</div>
              </div>
            </div>

            <div style="border-bottom: 1.5px solid #CBD5E1; margin-bottom: 16px;"></div>

            <!-- 4-Card Terms & Conditions Grid -->
            <div class="cards-grid">
              <!-- Card 1: Site Conditions -->
              <div class="info-card">
                <div class="info-card-header">${isEs ? 'CONDICIONES DEL CLIENTE Y SITIO' : 'CUSTOMER / SITE CONDITIONS'}</div>
                <div class="info-card-body">
                  <ul>
                    <li>${isEs ? 'El cliente proporcionará acceso despejado, seguro y continuo a todas las áreas de trabajo listadas.' : 'Customer will provide clear and safe access to all listed work areas.'}</li>
                    <li>${isEs ? 'El cableado existente, cajas eléctricas, interruptores y circuitos se asumen funcionales y reutilizables.' : 'Existing wiring, electrical boxes, recessed housings, switches and circuits are assumed functional and reusable unless otherwise stated.'}</li>
                    <li>${isEs ? 'La configuración de dispositivos inteligentes requiere cobertura Wi-Fi compatible en el sitio y cuenta activa.' : 'Smart device operation requires compatible Wi-Fi coverage at fixture locations and an active customer account/app.'}</li>
                    <li>${isEs ? 'El interruptor de pared o circuito principal debe permanecer accesible para pruebas y operación segura.' : 'The applicable wall switch must remain accessible for testing and remote smart operation.'}</li>
                    <li>${isEs ? 'Se incluye la limpieza básica y retiro de residuos de las áreas intervenidas al concluir el trabajo.' : 'Basic cleanup of the listed work areas is included upon completion.'}</li>
                  </ul>
                </div>
              </div>

              <!-- Card 2: Labor-Only / Materials -->
              <div class="info-card">
                <div class="info-card-header">${isEs ? 'SOLO MANO DE OBRA / MATERIALES' : 'LABOR-ONLY / MATERIALS'}</div>
                <div class="info-card-body">
                  <ul>
                    <li>${isEs ? `El total de la propuesta cubre exclusivamente la mano de obra profesional especializada.` : `The proposal total covers labor only.`}</li>
                    <li>${isEs ? 'A solicitud del cliente, Mr Handyworks LLC puede adquirir materiales aprobados; el cliente reembolsa su costo contra entrega o a más tardar al finalizar.' : 'At the customer request, Mr Handyworks LLC will purchase approved materials. Customer reimburses material cost upon receipt and no later than project completion.'}</li>
                    <li>${isEs ? 'Los materiales incluyen accesorios, soportes, controles, anclajes, selladores, pintura, imprimación y masillas.' : 'Materials include fixtures, controls, plates, brackets, bulbs, connectors, primer, paint, caulk and fillers.'}</li>
                    <li>${isEs ? 'Los productos seleccionados por el cliente deben ser compatibles con los sistemas y áreas de instalación existentes.' : 'Customer-selected products must be compatible with existing systems and installation locations.'}</li>
                  </ul>
                </div>
              </div>

              <!-- Card 3: Notes & Exclusions -->
              <div class="info-card">
                <div class="info-card-header">${isEs ? 'NOTAS Y EXCLUSIONES' : 'NOTES & EXCLUSIONS'}</div>
                <div class="info-card-body">
                  <ul>
                    <li>${isEs ? 'El precio está limitado a las condiciones visibles y al alcance específico detallado en esta propuesta.' : 'Pricing is limited to visible conditions and the specific work listed in this proposal.'}</li>
                    <li>${isEs ? 'Se excluye cableado, cajas o tuberías ocultas con daños preexistentes detrás de muros.' : 'Hidden or damaged wiring, boxes, conduit, recessed housings, switches and circuits are excluded.'}</li>
                    <li>${isEs ? 'Se excluye reemplazo de madera podrida estructural, reparación de siding o remediación de humedad profunda.' : 'Rotten-wood replacement, siding repair, water-damage remediation and structural repairs are excluded.'}</li>
                    <li>${isEs ? 'Se excluye alquiler de maquinaria pesada, permisos municipales y modificaciones estructurales mayores.' : 'Lift rental, permits, major access modifications and work outside the stated scope are excluded.'}</li>
                    <li>${isEs ? 'Cualquier trabajo adicional imprevisto requiere aprobación escrita mediante orden de cambio.' : 'Additional work requires approval and a written change order or separate quote.'}</li>
                  </ul>
                </div>
              </div>

              <!-- Card 4: Payment Terms -->
              <div class="info-card">
                <div class="info-card-header">${isEs ? 'TÉRMINOS DE PAGO' : 'PAYMENT TERMS'}</div>
                <div class="info-card-body">
                  <ul>
                    <li>${isEs ? `Se requiere un depósito del 50% (${depositFormatted}) o tarifa de consulta ($125) para agendar e iniciar el trabajo.` : `A 50% deposit of ${depositFormatted} (or on-site consultation fee) is required to schedule and begin the work.`}</li>
                    <li>${isEs ? `El saldo restante (${depositFormatted}) se cancela inmediatamente al completar el trabajo y verificación.` : `The remaining balance of ${depositFormatted} is due immediately upon completion.`}</li>
                    <li>${isEs ? 'Pagos aceptados: Zelle, Venmo, Cash App y Apple Pay enviados únicamente al teléfono oficial (574) 279-9355 (no buscar por nombres para evitar cuentas duplicadas), Efectivo y Tarjetas (+3.5%).' : 'Accepted payments: Zelle, Venmo, Cash App, and Apple Pay sent strictly to official phone (574) 279-9355 (do not search by names to prevent duplicate accounts), cash, and cards (+3.5%).'}</li>
                    <li>${isEs ? 'Esta propuesta tiene una validez de 14 días a partir de la fecha de emisión.' : 'This proposal is valid for 14 days from the date shown.'}</li>
                    <li>${isEs ? 'La ejecución y horarios están sujetos a condiciones climáticas y de seguridad en el sitio.' : 'Work and scheduling are subject to safe weather and site conditions.'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Approval Section -->
            <div class="approval-section">
              <div class="approval-banner">${isEs ? 'APROBACIÓN Y CONFORMIDAD' : 'APPROVAL'}</div>
              <div class="approval-body">
                <div class="approval-text">
                  ${isEs
                    ? 'Al firmar a continuación, el cliente acepta el alcance completo listado, precio de mano de obra, condiciones, exclusiones y términos de pago.'
                    : 'By signing below, the customer accepts the complete listed scope, labor price, conditions, exclusions and payment terms.'}
                </div>
                <div class="approval-scope-badge">
                  ${isEs ? 'Alcance seleccionado: Propuesta Completa' : 'Selected scope: Complete proposal'}
                </div>

                <!-- Signature Lines Grid -->
                <div class="signature-grid">
                  <div class="sig-line-box">
                    <div class="sig-label">${isEs ? 'Firma del cliente' : 'Customer signature'}</div>
                  </div>
                  <div class="sig-line-box">
                    <div class="sig-label">${isEs ? 'Nombre en letra de imprenta' : 'Printed name'} (${booking.clientName})</div>
                  </div>
                  <div class="sig-line-box">
                    <div class="sig-label">${isEs ? 'Representante de Mr Handyworks LLC (Brian Cueva)' : 'Mr Handyworks LLC representative'}</div>
                  </div>
                  <div class="sig-line-box">
                    <div class="sig-label">${isEs ? 'Fecha de aprobación' : 'Date'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Page 2 Bottom Navy Banner -->
          <div class="bottom-navy-banner">
            <div><span class="amber-tag">TEL</span>${BUSINESS_INFO.phone}</div>
            <div><span class="amber-tag">EMAIL</span>${BUSINESS_INFO.email}</div>
            <div>${isEs ? 'PÁGINA 2 DE 2' : 'PAGE 2 OF 2'}</div>
          </div>
        </div>

      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
