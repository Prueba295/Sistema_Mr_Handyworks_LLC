import { Booking } from '../types';
import { supabase } from '../lib/supabase';

export async function prepareRemoteBooking(booking: Booking): Promise<Booking> {
  if (!supabase || !booking.attachments?.length) return booking;
  const client = supabase;

  const remoteAttachments = await Promise.all(booking.attachments.map(async attachment => {
    const safeName = (attachment.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '-');
    const storagePath = `${booking.id}/${attachment.id || 'att'}-${safeName}`;

    // If already http/https, keep it
    if (attachment.dataUrl.startsWith('http')) {
      return attachment;
    }

    // Attempt bucket upload if available
    if (attachment.dataUrl.startsWith('data:')) {
      try {
        const blob = await fetch(attachment.dataUrl).then(response => response.blob());
        const { data: uploadData, error } = await client.storage
          .from('booking-attachments')
          .upload(storagePath, blob, {
            contentType: attachment.mimeType || blob.type || 'application/octet-stream',
            upsert: true
          });

        if (!error && uploadData) {
          const { data } = client.storage.from('booking-attachments').getPublicUrl(storagePath);
          if (data?.publicUrl) {
            return { ...attachment, dataUrl: data.publicUrl };
          }
        }
      } catch {
        // Fallback gracefully to preserve original dataUrl
      }
    }

    // ALWAYS preserve the valid dataUrl so the image is never lost or replaced with a 404
    return attachment;
  }));

  const firstImage = remoteAttachments.find(attachment => attachment.type === 'image' || attachment.dataUrl.startsWith('data:image'));
  return {
    ...booking,
    attachments: remoteAttachments,
    photoUrl: firstImage?.dataUrl || booking.photoUrl
  };
}

export async function ensureAuthenticatedSession(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) return true;
    const auth = await supabase.auth.signInWithPassword({
      email: 'Mrhandyworks25@gmail.com',
      password: 'MrHandyworks2026!'
    });
    return Boolean(auth.data?.session);
  } catch (err) {
    console.warn('ensureAuthenticatedSession notice:', err);
    return false;
  }
}

export async function createCloudBooking(booking: Booking): Promise<void> {
  if (!supabase) return;
  const remoteBooking = await prepareRemoteBooking(booking);
  const { error } = await supabase.from('booking_requests').insert({
    id: remoteBooking.id,
    payload: remoteBooking,
    created_at: booking.createdAt,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
}

export async function loadCloudBookings(): Promise<Booking[]> {
  if (!supabase) return [];
  try {
    await ensureAuthenticatedSession();
    const { data, error } = await supabase
      .from('booking_requests')
      .select('payload')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('loadCloudBookings warning:', error.message);
      return [];
    }

    return (data || [])
      .map(row => row.payload as Booking)
      .filter((b): b is Booking => Boolean(b && b.id));
  } catch (err) {
    console.warn('loadCloudBookings error:', err);
    return [];
  }
}

export async function updateCloudBooking(booking: Booking): Promise<void> {
  if (!supabase || !booking?.id) return;
  try {
    await ensureAuthenticatedSession();
    const { error } = await supabase
      .from('booking_requests')
      .update({ payload: booking, updated_at: new Date().toISOString() })
      .eq('id', booking.id);
    if (error) console.warn('updateCloudBooking warning:', error.message);
  } catch (err) {
    console.warn('updateCloudBooking error:', err);
  }
}

export async function deleteCloudBooking(id: string): Promise<void> {
  if (!supabase || !id) return;
  try {
    await ensureAuthenticatedSession();
    const { error } = await supabase.from('booking_requests').delete().eq('id', id);
    if (error) console.warn('deleteCloudBooking warning:', error.message);
  } catch (err) {
    console.warn('deleteCloudBooking error:', err);
  }
}
