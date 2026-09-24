self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    return;
  }

  if (payload.type !== 'NEW_BOOKING') return;

  const title = 'Mr Handyworks - New Booking';
  const options = {
    body: `${payload.clientName || 'A client'} submitted a new booking request.`,
    icon: '/logo_handyworks.jpeg',
    badge: '/logo_handyworks.jpeg',
    tag: `booking-${payload.bookingId || 'new'}`,
    renotify: false,
    data: { url: '/#/admin' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/#/admin', self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    const existing = clientList.find(client => 'focus' in client);
    if (existing) {
      existing.navigate(target);
      return existing.focus();
    }
    return clients.openWindow(target);
  }));
});
