import { supabase } from '../lib/supabase';

export interface AlertSettings {
  enabled: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  enabled: false,
  pushEnabled: false,
  soundEnabled: true
};

const ALERT_SETTINGS_KEY = 'mr_handyworks_alert_settings';

export function readAlertSettings(): AlertSettings {
  try {
    const saved = localStorage.getItem(ALERT_SETTINGS_KEY);
    return saved ? { ...DEFAULT_ALERT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_ALERT_SETTINGS;
  } catch {
    return DEFAULT_ALERT_SETTINGS;
  }
}

export function writeAlertSettings(settings: AlertSettings): void {
  localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(settings));
}

export async function enableSecurePushAlerts(): Promise<{ ok: boolean; message: string }> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return { ok: false, message: 'Este dispositivo no admite notificaciones push seguras.' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, message: 'El permiso de notificaciones fue rechazado.' };
  }

  const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true });
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;

  if (!session || !supabase) {
    return { ok: false, message: 'Inicia sesión como administrador para registrar este dispositivo.' };
  }

  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: session.user.id,
    endpoint: subscription.endpoint,
    subscription: subscription.toJSON(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'endpoint' });

  if (error) return { ok: false, message: 'No se pudo registrar el dispositivo de forma segura.' };
  return { ok: true, message: 'Alertas de reservas activadas en este dispositivo.' };
}

export async function disableSecurePushAlerts(): Promise<void> {
  if (!supabase) return;
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) return;
  await supabase.from('push_subscriptions').delete().eq('user_id', session.user.id);
}
