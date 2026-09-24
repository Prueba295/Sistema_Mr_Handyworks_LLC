import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'null',
  'Content-Type': 'application/json'
};

Deno.serve(async request => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  if (request.headers.get('x-alert-secret') !== Deno.env.get('BOOKING_ALERT_SECRET')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const event = await request.json();
  const booking = event.record?.payload;
  if (!booking || event.table !== 'booking_requests') {
    return new Response(JSON.stringify({ error: 'Unsupported event' }), { status: 400, headers: corsHeaders });
  }

  webpush.setVapidDetails(
    `mailto:${Deno.env.get('ALERT_CONTACT_EMAIL')}`,
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!
  );

  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const { data: subscriptions, error } = await adminClient
    .from('push_subscriptions')
    .select('endpoint, subscription');

  if (error) return new Response(JSON.stringify({ error: 'Subscription lookup failed' }), { status: 500, headers: corsHeaders });

  const message = JSON.stringify({
    type: 'NEW_BOOKING',
    bookingId: booking.id,
    clientName: booking.clientName
  });

  const results = await Promise.allSettled((subscriptions || []).map(row =>
    webpush.sendNotification(row.subscription, message)
  ));

  const expired = (subscriptions || []).filter((_, index) => results[index].status === 'rejected');
  if (expired.length > 0) {
    await adminClient.from('push_subscriptions').delete().in('endpoint', expired.map(row => row.endpoint));
  }

  return new Response(JSON.stringify({ delivered: results.length - expired.length }), { status: 200, headers: corsHeaders });
});
