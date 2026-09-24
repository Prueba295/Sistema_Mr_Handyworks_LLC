import assert from 'node:assert/strict';
import { buildOwnerSMSNotificationUrl, formatOwnerDispatchMessage, triggerOwnerSMSDispatch } from '../src/utils/liveNotifier';
import type { Booking } from '../src/types';

(globalThis as any).window = globalThis;
const locationTracker: { href?: string } = {};
const originalLocation = (globalThis as any).location;
let currentHref = 'https://example.com/';
Object.defineProperty(globalThis, 'location', {
  configurable: true,
  get: () => ({
    get href() { return currentHref; },
    set href(value: string) {
      currentHref = value;
      locationTracker.href = value;
    },
    assign: (url: string) => { currentHref = url; locationTracker.href = url; },
    replace: (url: string) => { currentHref = url; locationTracker.href = url; }
  })
});

const booking: Booking = {
  id: 'ORD-TEST-101',
  serviceType: 'TV Mounting & In-Wall Cable Concealment',
  zipCode: '46637',
  estimatedHours: '2 - 5 Hours',
  estimatedPrice: 125,
  projectDetails: 'Install 75 inch TV with concealed cable routing and drywall touch-up',
  photoUrl: 'https://example.com/photo.jpg',
  attachments: [{
    id: 'att-1',
    name: 'photo.jpg',
    type: 'image',
    sizeFormatted: '1.9 MB',
    dataUrl: 'https://example.com/photo.jpg',
    createdAt: '2026-09-20T15:00:00.000Z'
  }],
  scheduledDate: '2026-09-23',
  scheduledTimeSlot: '09:00 AM - 12:00 PM',
  clientName: 'Juan Perez',
  clientPhone: '(574) 555-0192',
  clientEmail: 'juan.perez@example.com',
  clientAddress: '1428 E Jefferson Blvd',
  status: 'PENDING',
  paymentMethod: 'CASH',
  paymentStatus: 'UNPAID',
  depositAmount: 0,
  createdAt: '2026-09-20T15:00:00.000Z'
};

const message = formatOwnerDispatchMessage(booking);
assert(message.includes('Juan Perez'));
assert(message.includes('TV Mounting & In-Wall Cable Concealment'));
assert(message.includes('photo.jpg'));

const smsUrl = buildOwnerSMSNotificationUrl(booking, '15742799355');
assert(smsUrl.startsWith('sms:15742799355'));
assert(smsUrl.includes('body='));

triggerOwnerSMSDispatch(booking, '15742799355');
assert(locationTracker.href && locationTracker.href.startsWith('sms:15742799355'));

Object.defineProperty(globalThis, 'location', {
  configurable: true,
  value: originalLocation
});

console.log('✅ booking SMS dispatch flow validated');
