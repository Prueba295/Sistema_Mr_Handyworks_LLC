-- Mr Handyworks public data and booking backend.
-- Run this migration in the Supabase SQL editor before deploying the frontend.

create table if not exists public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_requests (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into storage.buckets (id, name, public, file_size_limit)
values ('booking-attachments', 'booking-attachments', true, 41943040)
on conflict (id) do update set public = true, file_size_limit = 41943040;

create index if not exists booking_requests_created_at_idx
  on public.booking_requests (created_at desc);

alter table public.app_state enable row level security;
alter table public.booking_requests enable row level security;

-- Public visitors need published site data, but only authenticated staff can edit it.
drop policy if exists "Public can read app state" on public.app_state;
create policy "Public can read app state"
  on public.app_state for select
  to anon, authenticated
  using (key in (
    'mr_handyworks_biz_info',
    'mr_handyworks_services',
    'mr_handyworks_portfolio',
    'mr_handyworks_reviews',
    'mr_handyworks_availability',
    'mr_handyworks_qr'
  ));

drop policy if exists "Authenticated staff can write app state" on public.app_state;
create policy "Authenticated staff can write app state"
  on public.app_state for all
  to authenticated
  using (true)
  with check (true);

-- Anyone may submit a booking request. Only signed-in staff can read or manage it.
drop policy if exists "Public can submit booking requests" on public.booking_requests;
create policy "Public can submit booking requests"
  on public.booking_requests for insert
  to anon, authenticated
  with check (jsonb_typeof(payload) = 'object');

drop policy if exists "Authenticated staff can read booking requests" on public.booking_requests;
create policy "Authenticated staff can read booking requests"
  on public.booking_requests for select
  to authenticated
  using (true);

drop policy if exists "Authenticated staff can update booking requests" on public.booking_requests;
create policy "Authenticated staff can update booking requests"
  on public.booking_requests for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated staff can delete booking requests" on public.booking_requests;
create policy "Authenticated staff can delete booking requests"
  on public.booking_requests for delete
  to authenticated
  using (true);

drop policy if exists "Public can view booking attachments" on storage.objects;
create policy "Public can view booking attachments"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'booking-attachments');

drop policy if exists "Public can upload booking attachments" on storage.objects;
create policy "Public can upload booking attachments"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'booking-attachments');

drop policy if exists "Authenticated staff can delete booking attachments" on storage.objects;
create policy "Authenticated staff can delete booking attachments"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'booking-attachments');

-- Required for Supabase Realtime subscriptions.
alter table public.app_state replica identity full;
alter table public.booking_requests replica identity full;

-- Enable once per project; harmless if already enabled.
do $$
begin
  alter publication supabase_realtime add table public.app_state;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.booking_requests;
exception
  when duplicate_object then null;
end $$;
