import { supabase } from '../lib/supabase';

export type SyncMessage = {
  key: string;
  value: string | null;
};

const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('mr-handyworks-sync')
  : null;

const PUBLIC_STATE_KEYS = [
  'mr_handyworks_biz_info',
  'mr_handyworks_services',
  'mr_handyworks_portfolio',
  'mr_handyworks_reviews',
  'mr_handyworks_availability',
  'mr_handyworks_qr'
];

export const readSyncedValue = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeSyncedValue = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
  channel?.postMessage({ key, value } satisfies SyncMessage);

  const client = supabase;
  if (client && PUBLIC_STATE_KEYS.includes(key)) {
    void client.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      return client.from('app_state').upsert({
        key,
        value: JSON.parse(value),
        updated_at: new Date().toISOString()
      });
    });
  }
};

export const removeSyncedValue = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
  channel?.postMessage({ key, value: null } satisfies SyncMessage);
};

export const subscribeToSync = (listener: (message: SyncMessage) => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key) listener({ key: event.key, value: event.newValue });
  };
  const handleChannel = (event: MessageEvent<SyncMessage>) => listener(event.data);

  window.addEventListener('storage', handleStorage);
  channel?.addEventListener('message', handleChannel);

  let cloudChannel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
  if (supabase) {
    void supabase
      .from('app_state')
      .select('key,value')
      .in('key', PUBLIC_STATE_KEYS)
      .then(({ data }) => {
        data?.forEach(row => listener({ key: row.key, value: JSON.stringify(row.value) }));
      });

    cloudChannel = supabase
      .channel('mr-handyworks-public-state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, payload => {
        const row = (payload.new || payload.old) as { key?: string; value?: unknown };
        if (row.key && PUBLIC_STATE_KEYS.includes(row.key)) {
          listener({ key: row.key, value: payload.eventType === 'DELETE' ? null : JSON.stringify(row.value) });
        }
      })
      .subscribe();
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    channel?.removeEventListener('message', handleChannel);
    if (cloudChannel && supabase) void supabase.removeChannel(cloudChannel);
  };
};
