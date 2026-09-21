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
            <div><strong>${isEs ? 'Estado Pago' : 'Payment Status'}:</strong> ${booking.paymentStatus}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${isEs ? 'Descripción del Servicio' : 'Service Description'}</th>
              <th>${isEs ? 'Tiempo Estimado' : 'Estimated Time'}</th>
              <th style="text-align: right;">${isEs ? 'Total Estimado' : 'Estimated Total'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${booking.serviceType}</strong>
                <div style="font-size: 12px; color: #475569; margin-top: 4px;">
                  ${booking.projectDetails}
                </div>
              </td>
              <td>${booking.estimatedHours}</td>
              <td style="text-align: right; font-weight: 600;">$${booking.estimatedPrice}.00</td>
            </tr>
            ${booking.depositAmount ? `
            <tr>
              <td colspan="2" style="text-align: right; color: #059669; font-weight: bold;">
                ${isEs ? 'Abono / Depósito Registrado' : 'Deposit Received'}:
              </td>
              <td style="text-align: right; color: #059669; font-weight: bold;">-$${booking.depositAmount}.00</td>
            </tr>
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">
                ${isEs ? 'Saldo Pendiente al Completar' : 'Balance Remaining Due upon Completion'}:
              </td>
              <td style="text-align: right; font-size: 16px; color: #0B3C5D;">
                $${booking.estimatedPrice - booking.depositAmount}.00
              </td>
            </tr>
            ` : `
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">
                ${isEs ? 'Total Estimado' : 'Total Estimated'}:
              </td>
              <td style="text-align: right; font-size: 16px; color: #0B3C5D;">
                $${booking.estimatedPrice}.00
              </td>
            </tr>
            `}
          </tbody>
        </table>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 12px;">
          <strong>${isEs ? 'Garantía de Calidad Mr Handyworks LLC:' : 'Mr Handyworks LLC Quality Guarantee:'}</strong>
          ${isEs 
            ? 'Todos los trabajos son ejecutados conforme a normas de seguridad residencial y con total garantía de mano de obra. Ante cualquier duda, comuníquese directamente al (574) 279-9355.'
            : 'All craftsmanship is executed following residential safety standards and guaranteed. If you have any questions, reach Brian directly at (574) 279-9355.'}
        </div>

        <div class="footer">
          <div>${BUSINESS_INFO.name} • Brian Cueva</div>
          <div>South Bend, IN • (574) 279-9355</div>
          <div>Page 1 of 1</div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
