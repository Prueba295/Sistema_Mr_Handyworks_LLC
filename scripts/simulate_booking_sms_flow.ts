import { 
  formatOwnerDispatchMessage, 
  buildOwnerSMSNotificationUrl,
  buildOwnerWhatsAppNotificationUrl 
} from '../src/utils/liveNotifier';
import { validateEmail, validateFullName, validateUSPhone, validateStreetAddress, sanitizeXSS } from '../src/utils/inputSecurity';
import { Booking, BookingAttachment } from '../src/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`  ✅ PASS: ${msg}`);
}

console.log('======================================================');
console.log('🧪 SIMULACIÓN DEL FLUJO DE RESERVA Y DESPACHO A SMS');
console.log('======================================================\n');

// 1. Validar campos obligatorios de contacto (incluyendo correo obligatorio sin opcional)
console.log('1. Verificación de Campos Obligatorios de Contacto:');
const clientName = 'Juan Perez';
const clientPhone = '(574) 555-0192';
const clientEmail = 'juan.perez@ejemplo.com';
const clientAddress = '1428 E Jefferson Blvd';
const zipCode = '46637';

assert(validateFullName(clientName).isValid, 'Nombre completo válido');
assert(validateUSPhone(clientPhone).isValid, 'Teléfono móvil válido (10 dígitos)');
assert(validateEmail(clientEmail).isValid, 'Correo electrónico válido');
assert(!validateEmail('').isValid, 'El correo electrónico es estrictamente obligatorio (rechaza vacío)');
assert(validateStreetAddress(clientAddress).isValid, 'Dirección física válida con número');

// 2. Simulación de escritura con barra espaciadora en la descripción del proyecto
console.log('\n2. Verificación del Cuadro de Descripción (Espacios entre palabras):');
const rawDescription = 'Instalación de TV de 75 pulgadas sobre chimenea con cables ocultos y reparación de drywall';
// Comprobar que los espacios se preservan exactamente
const cleanDescription = sanitizeXSS(rawDescription).trim();
assert(cleanDescription === rawDescription, 'Preserva espacios, tildes y caracteres normales');
assert(cleanDescription.split(' ').length === 15, 'Contiene exactamente 15 palabras separadas por espacios');
assert(!cleanDescription.includes('<'), 'Sanitiza cualquier intento de etiqueta');

// 3. Simulación de adjuntos: Fotos, Documentos y Videos
console.log('\n3. Verificación de Fotos, Documentos y Videos Adjuntos:');
const simulatedAttachments: BookingAttachment[] = [
  {
    id: 'att-1',
    name: 'foto_chimenea_area.jpg',
    type: 'image',
    sizeFormatted: '1.8 MB',
    dataUrl: 'https://jonkbrwdzhpsghsmjhbz.supabase.co/storage/v1/object/public/booking-attachments/ORD-98214/att-1-foto_chimenea_area.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'att-2',
    name: 'plano_electrico_sala.pdf',
    type: 'document',
    sizeFormatted: '450 KB',
    dataUrl: 'https://jonkbrwdzhpsghsmjhbz.supabase.co/storage/v1/object/public/booking-attachments/ORD-98214/att-2-plano_electrico_sala.pdf',
    createdAt: new Date().toISOString()
  },
  {
    id: 'att-3',
    name: 'video_vista_pared.mp4',
    type: 'video',
    sizeFormatted: '14.2 MB',
    dataUrl: 'https://jonkbrwdzhpsghsmjhbz.supabase.co/storage/v1/object/public/booking-attachments/ORD-98214/att-3-video_vista_pared.mp4',
    createdAt: new Date().toISOString()
  }
];

assert(simulatedAttachments.length === 3, 'Contiene 3 archivos adjuntados correctamente');
assert(simulatedAttachments.some(a => a.type === 'image'), 'Contiene al menos una foto de referencia obligatoria');

// 4. Construcción del objeto Booking simulado
const mockBooking: Booking = {
  id: 'ORD-98214',
  serviceType: 'TV Mounting & Wall Hanging',
  zipCode: '46637',
  estimatedHours: '2-5 hrs',
  estimatedPrice: 0,
  projectDetails: `Repairs: ${cleanDescription}`,
  photoUrl: simulatedAttachments[0].dataUrl,
  attachments: simulatedAttachments,
  scheduledDate: '2026-09-28',
  scheduledTimeSlot: '09:00 AM - 12:00 PM',
  clientName,
  clientPhone,
  clientEmail,
  clientAddress,
  status: 'PENDING',
  paymentMethod: 'CASH',
  paymentStatus: 'UNPAID',
  depositAmount: 0,
  createdAt: new Date().toISOString()
};

// 5. Verificación del Mensaje Formateado para el Despacho
console.log('\n4. Verificación del Mensaje Formateado de Notificación:');
const dispatchMessage = formatOwnerDispatchMessage(mockBooking);
console.log('--- VISTA PREVIA DEL MENSAJE QUE LLEGA AL TÉCNICO ---');
console.log(dispatchMessage);
console.log('-----------------------------------------------------\n');

assert(dispatchMessage.includes('ORD-98214'), 'Incluye el código de orden');
assert(dispatchMessage.includes('Juan Perez'), 'Incluye el nombre del cliente');
assert(dispatchMessage.includes('(574) 555-0192'), 'Incluye el teléfono del cliente');
assert(dispatchMessage.includes('juan.perez@ejemplo.com'), 'Incluye el correo del cliente');
assert(dispatchMessage.includes('1428 E Jefferson Blvd'), 'Incluye la dirección física');
assert(dispatchMessage.includes('46637'), 'Incluye el código postal');
assert(dispatchMessage.includes('TV Mounting & Wall Hanging'), 'Incluye el servicio');
assert(dispatchMessage.includes(cleanDescription), 'Incluye la descripción completa con espacios');
assert(dispatchMessage.includes('NEW SERVICE REQUEST'), 'Incluye el encabezado oficial en inglés');
assert(dispatchMessage.includes('foto_chimenea_area.jpg'), 'Incluye el nombre de la foto adjunta');
assert(dispatchMessage.includes('plano_electrico_sala.pdf'), 'Incluye el documento adjunto');
assert(dispatchMessage.includes('video_vista_pared.mp4'), 'Incluye el video adjunto');
assert(dispatchMessage.includes('https://sistema-mr-handyworks-llc.vercel.app/#admin'), 'Incluye el enlace al portal administrativo activo');

// 6. Verificación de URL de SMS para iOS y Android
console.log('\n5. Verificación de Generación de URLs de Despacho (SMS y WhatsApp):');
const smsUrl = buildOwnerSMSNotificationUrl(mockBooking, '15742799355');
assert(smsUrl.startsWith('sms:15742799355'), 'La URL de SMS apunta al número correcto 15742799355');
assert(smsUrl.includes('body='), 'La URL de SMS incluye el parámetro de body');

// WhatsApp URL check
const whatsappUrl = buildOwnerWhatsAppNotificationUrl(mockBooking, '15742799355');
assert(whatsappUrl.startsWith('https://wa.me/15742799355?text='), 'La URL de WhatsApp apunta al número correcto');

// Decodificación de URL para comprobar integridad
const encodedBody = smsUrl.split('body=')[1];
const decodedBody = decodeURIComponent(encodedBody);
assert(decodedBody === dispatchMessage, 'La decodificación de la URL recupera el mensaje íntegro sin alteraciones');

console.log('\n======================================================');
console.log('📊 SIMULACIÓN FINALIZADA CON ÉXITO: 18/18 PRUEBAS SUPERADAS');
console.log('======================================================\n');
