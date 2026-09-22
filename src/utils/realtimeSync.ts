export type SyncMessage = {
  key: string;
  value: string | null;
};

const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('mr-handyworks-sync')
  : null;

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

  return () => {
    window.removeEventListener('storage', handleStorage);
    channel?.removeEventListener('message', handleChannel);
  };
};
