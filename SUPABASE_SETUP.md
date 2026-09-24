# Supabase deployment

The frontend now supports Supabase for shared state, bookings, attachments, authentication, and Realtime updates.

## 1. Create the project

1. Create a project at Supabase.
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. In **Authentication > Users**, create the staff user with the same email used by the admin recovery email field. Set a strong password.
4. Copy the project URL and anon key from **Project Settings > API**.

Disable public sign-ups in **Authentication > Providers > Email** after creating the staff user. The RLS policies treat authenticated users as staff.

Never put a Supabase service-role key in this frontend.

## 2. Configure the frontend

Copy `.env.example` to the environment used by the deployment and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

The Vite build embeds these public values. This is expected for the anon key; access is controlled by Supabase RLS policies.

## 3. Run and deploy

```bash
npm install
npm run lint
npm run build
```

Deploy the generated `dist/` directory as a Vite static site. Configure SPA fallback so every route serves `index.html`.

## 4. What is synchronized

- Public business information, services, portfolio, reviews, availability, and payment display settings use `app_state` and Supabase Realtime.
- Public booking requests are inserted into `booking_requests`.
- Staff bookings are loaded and updated through Supabase Realtime after Supabase Auth login.
- Booking attachments are uploaded to the `booking-attachments` Storage bucket and the booking stores their public URLs.
- Alert preferences are controlled from the Admin Alerts tab. Device subscriptions are stored per authenticated user in `push_subscriptions`.
- Without Supabase environment variables, the app intentionally falls back to browser-local storage for local development only.

## 6. Closed-browser phone alerts

The browser can receive alerts while closed only after deploying `supabase/functions/send-booking-alert/index.ts` and configuring a Supabase Database Webhook for `booking_requests` inserts. Set these Edge Function secrets: `BOOKING_ALERT_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `ALERT_CONTACT_EMAIL`, and the standard Supabase service-role variables. Never put those secrets in Vercel or frontend code. The function accepts only the configured webhook secret and only emits the allowlisted `NEW_BOOKING` event.

## 5. Production checks

Before going live, verify the staff account, RLS policies, Storage policies, SMS provider/webhook, email domain, backups, and the booking flow from a separate phone and browser. Review whether booking attachment URLs should be private and replaced with signed URLs for your privacy requirements. Do not use the local fallback as the production data store.
