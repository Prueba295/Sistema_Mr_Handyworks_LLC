import { Booking } from '../types';
import { BUSINESS_INFO } from '../data/initialData';

export const generateQuotePDF = (booking: Booking, language: 'es' | 'en') => {
  // Create an elegant printable window or download document
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const isEs = language === 'es';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mr Handyworks LLC - ${isEs ? 'Presupuesto de Servicio' : 'Work Order & Estimate'} #${booking.id}</title>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0F172A;
            background: #FFFFFF;
            margin: 0;
            padding: 32px;
            font-size: 14px;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0B3C5D;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 26px;
            font-weight: 800;
            color: #0B3C5D;
            margin: 0;
          }
          .brand-sub {
            font-size: 13px;
            color: #64748B;
            margin-top: 4px;
          }
          .doc-badge {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            padding: 12px 16px;
            border-radius: 8px;
            text-align: right;
          }
          .doc-title {
            font-size: 18px;
            font-weight: 700;
            color: #0B3C5D;
            margin: 0 0 4px 0;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
          }
          .box {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 16px;
          }
          .box-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748B;
            margin-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th {
            background: #0B3C5D;
            color: white;
            text-align: left;
            padding: 10px 14px;
            font-size: 12px;
            text-transform: uppercase;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #E2E8F0;
          }
          .total-row {
            font-weight: 700;
            background: #F1F5F9;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E2E8F0;
            font-size: 12px;
            color: #64748B;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; text-align: right;">
          <button onclick="window.print()" style="background: #0B3C5D; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">
            🖨️ ${isEs ? 'Imprimir o Guardar PDF' : 'Print or Save PDF'}
          </button>
        </div>

        <div class="header">
          <div>
            <h1 class="brand-title">${BUSINESS_INFO.name}</h1>
            <div class="brand-sub">${isEs ? 'Propietario' : 'Owner'}: ${BUSINESS_INFO.owner}</div>
            <div class="brand-sub">${isEs ? 'Teléfono' : 'Phone'}: ${BUSINESS_INFO.phone}</div>
            <div class="brand-sub">${isEs ? 'Ubicación' : 'Area'}: ${BUSINESS_INFO.location} (St. Joseph County)</div>
            <div class="brand-sub">${isEs ? 'Calificación' : 'Rating'}: 5.0 ⭐ Top Pro Thumbtack • ${isEs ? 'Asegurado' : 'Insured'}</div>
          </div>
          <div class="doc-badge">
            <h2 class="doc-title">${isEs ? 'ORDEN DE TRABAJO & PRESUPUESTO' : 'WORK ORDER & ESTIMATE'}</h2>
            <div><strong>${isEs ? 'Ref' : 'Ref #'}:</strong> ${booking.id}</div>
            <div><strong>${isEs ? 'Fecha' : 'Date'}:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</div>
            <div><strong>${isEs ? 'Estado' : 'Status'}:</strong> ${booking.status}</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <div class="box-title">${isEs ? 'DATOS DEL CLIENTE' : 'CLIENT DETAILS'}</div>
            <div><strong>${booking.clientName}</strong></div>
            <div>${booking.clientPhone}</div>
            <div>${booking.clientEmail}</div>
            <div>${booking.clientAddress || (isEs ? 'Área de servicio' : 'Service area')}, Zip: ${booking.zipCode}</div>
          </div>
          <div class="box">
            <div class="box-title">${isEs ? 'PROGRAMACIÓN DEL SERVICIO' : 'SCHEDULED SERVICE'}</div>
            <div><strong>${isEs ? 'Fecha Prevista' : 'Scheduled Date'}:</strong> ${booking.scheduledDate}</div>
            <div><strong>${isEs ? 'Horario' : 'Time Slot'}:</strong> ${booking.scheduledTimeSlot}</div>
            <div><strong>${isEs ? 'Método de Pago' : 'Payment Method'}:</strong> ${booking.paymentMethod}</div>
            <div><strong>${isEs ? 'Estado en Agenda' : 'Calendar Status'}:</strong> ${
              booking.status === 'CONFIRMED'
                ? (isEs ? 'CONFIRMADA' : 'CONFIRMED')
                : (isEs ? 'SOLICITADA (Coordinación vía Llamada / WhatsApp)' : 'REQUESTED (Coordination via Call / WhatsApp)')
            }</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${isEs ? 'Concepto del Servicio' : 'Service Item'}</th>
              <th>${isEs ? 'Alcance / Tiempo' : 'Scope / Time'}</th>
              <th style="text-align: right;">${isEs ? 'Tarifa Referencial' : 'Reference Fee'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${booking.serviceType}</strong>
                <div style="font-size: 12px; color: #475569; margin-top: 4px;">
                  ${booking.projectDetails}
                </div>
                <div style="font-size: 11px; color: #0284c7; margin-top: 4px;">
                  ${isEs ? '• Tarifa fija de Consulta y Diagnóstico en sitio: $125. La mano de obra final varía según horas y alcance de la instalación.' : '• Fixed On-site Consultation & Diagnostic Fee: $125. Final labor varies by hours and installation scope.'}
                </div>
              </td>
              <td>${booking.estimatedHours}</td>
              <td style="text-align: right; font-weight: 600;">$125.00</td>
            </tr>
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">
                ${isEs ? 'Tarifa Fija de Consulta en Sitio' : 'Fixed On-Site Consultation Fee'}:
              </td>
              <td style="text-align: right; font-size: 15px; color: #0B3C5D; font-weight: bold;">
                $125.00
              </td>
            </tr>
          </tbody>
        </table>

        ${booking.attachments && booking.attachments.length > 0 ? `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 12px;">
            <strong style="color: #0B3C5D;">${isEs ? 'Archivos Adjuntados por el Cliente (' + booking.attachments.length + '):' : 'Client Attachments (' + booking.attachments.length + '):'}</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #475569;">
              ${booking.attachments.map(att => `<li>${att.name} <span style="color: #94A3B8;">(${att.type.toUpperCase()}, ${att.sizeFormatted})</span></li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: #1E40AF;">
          <strong>${isEs ? 'Coordinación y Confirmación:' : 'Booking Coordination & Confirmation:'}</strong>
          ${isEs
            ? 'La confirmación del horario y detalles técnicos se coordinan directamente mediante llamada telefónica o WhatsApp oficial de servicio.'
            : 'Schedule confirmation and project details are coordinated directly via official service phone call or WhatsApp.'}
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 12px;">
          <strong>${isEs ? 'Métodos de Pago Aceptados:' : 'Accepted Payment Methods:'}</strong>
          <div>
            ${isEs
              ? '• Zelle, Venmo (@Brian-Cueva-Handyworks), Cash App ($MrHandyworks), Apple Pay (Sin recargo)<br>• Tarjetas de Débito o Crédito (+3.5% de comisión por el sistema)<br>• Cash (Efectivo) o Check (Cheque) aceptados para saldo final al completar el trabajo.'
              : '• Zelle, Venmo (@Brian-Cueva-Handyworks), Cash App ($MrHandyworks), Apple Pay (0% fee)<br>• Debit or Credit Cards (+3.5% processing fee)<br>• Cash or Check accepted for remaining balance upon project completion.'}
          </div>
        </div>

        <div class="footer">
          <div>${BUSINESS_INFO.name} • Official Work Order</div>
          <div>South Bend, IN • Licensed &amp; Insured</div>
          <div>Page 1 of 1</div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
