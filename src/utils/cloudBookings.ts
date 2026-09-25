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
