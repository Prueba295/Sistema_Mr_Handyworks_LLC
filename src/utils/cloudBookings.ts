import { Booking } from '../types';
import { supabase } from '../lib/supabase';

export async function prepareRemoteBooking(booking: Booking): Promise<Booking> {
  if (!supabase || !booking.attachments?.length) return booking;
  const client = supabase;

  const remoteAttachments = await Promise.all(booking.attachments.map(async attachment => {
    const safeName = (attachment.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '-');
    const storagePath = `${booking.id}/${attachment.id || 'att'}-${safeName}`;
    const fallbackPublicUrl = `https://jonkbrwdzhpsghsmjhbz.supabase.co/storage/v1/object/public/booking-attachments/${storagePath}`;

    if (!attachment.dataUrl.startsWith('data:')) {
      return {
        ...attachment,
        dataUrl: attachment.dataUrl.startsWith('http') ? attachment.dataUrl : fallbackPublicUrl
      };
    }

    try {
      const blob = await fetch(attachment.dataUrl).then(response => response.blob());
      const { error } = await client.storage
        .from('booking-attachments')
        .upload(storagePath, blob, {
          contentType: attachment.mimeType || blob.type || 'application/octet-stream',
          upsert: true
        });

      if (error) {
        console.warn('Storage upload notice, falling back to public storage URL:', error.message);
      }
      const { data } = client.storage.from('booking-attachments').getPublicUrl(storagePath);
      return { ...attachment, dataUrl: data.publicUrl || fallbackPublicUrl };
    } catch (err) {
      console.warn('Storage processing error, using deterministic public URL:', err);
      return { ...attachment, dataUrl: fallbackPublicUrl };
    }
  }));

  const firstImage = remoteAttachments.find(attachment => attachment.type === 'image');
  return {
    ...booking,
    attachments: remoteAttachments,
    photoUrl: firstImage?.dataUrl || booking.photoUrl
  };
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
  const { data, error } = await supabase
    .from('booking_requests')
    .select('payload')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => row.payload as Booking);
}

export async function updateCloudBooking(booking: Booking): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('booking_requests')
    .update({ payload: booking, updated_at: new Date().toISOString() })
    .eq('id', booking.id);
  if (error) throw error;
}

export async function deleteCloudBooking(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('booking_requests').delete().eq('id', id);
  if (error) throw error;
}
