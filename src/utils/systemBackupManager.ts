import { Booking, Service, PortfolioMedia, Review, AvailabilityDay, PaymentQR } from '../types';
import { supabase } from '../lib/supabase';

export interface SystemSnapshotPayload {
  version: string;
  backupId: string;
  slot: 'PRIMARY' | 'SECONDARY';
  dateKey: string; // YYYY-MM-DD
  timestamp: string;
  itemCounts: {
    bookings: number;
    services: number;
    portfolio: number;
    reviews: number;
    availability: number;
    qrMethods: number;
  };
  data: {
    bookings: Booking[];
    services?: Service[];
    portfolio?: PortfolioMedia[];
    reviews?: Review[];
    availability?: AvailabilityDay[];
    qrMethods?: PaymentQR[];
  };
}

export interface BackupExecutionResult {
  success: boolean;
  backupId: string;
  slot: 'PRIMARY' | 'SECONDARY';
  supabaseStorageUrl?: string;
  purgedOldCount: number;
  error?: string;
}

const BUCKET_NAME = 'booking-attachments';
const BACKUP_FOLDER = 'backups';
const RETENTION_DAYS = 15;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Format local date as YYYY-MM-DD
 */
function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 15-Day Auto-Purge: Clean up backups older than 15 days in Supabase Storage to avoid saturation
 */
export async function purgeExpiredBackups(): Promise<number> {
  if (!supabase) return 0;
  let purgedCount = 0;
  try {
    const { data: fileList, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(BACKUP_FOLDER);

    if (listError || !fileList) {
      console.warn('Could not list backups for auto-purge:', listError?.message);
      return 0;
    }

    const cutoffTime = Date.now() - RETENTION_MS;
    const filesToDelete: string[] = [];

    for (const file of fileList) {
      if (!file.name.endsWith('.json')) continue;
      
      // Determine file date from updated_at or filename (backup_YYYY-MM-DD_...)
      let fileTimestamp = file.updated_at ? new Date(file.updated_at).getTime() : 0;
      const match = file.name.match(/backup_(\d{4}-\d{2}-\d{2})/);
      if (match && match[1]) {
        const parsedDate = new Date(match[1]).getTime();
        if (!isNaN(parsedDate)) {
          fileTimestamp = parsedDate;
        }
      }

      if (fileTimestamp > 0 && fileTimestamp < cutoffTime) {
        filesToDelete.push(`${BACKUP_FOLDER}/${file.name}`);
      }
    }

    if (filesToDelete.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToDelete);

      if (!removeError) {
        purgedCount = filesToDelete.length;
        console.log(`🧹 Auto-purged ${purgedCount} backup(s) older than 15 days`);
      } else {
        console.warn('Error purging old backups:', removeError.message);
      }
    }
  } catch (err) {
    console.warn('Backup purge check warning:', err);
  }
  return purgedCount;
}

/**
 * Generate 2 daily system backups (PRIMARY and SECONDARY / ALTERNATIVE)
 * Stores in Supabase Storage and localStorage with 15-day automatic lifecycle.
 */
export async function createSystemBackup(
  systemState: {
    bookings: Booking[];
    services?: Service[];
    portfolio?: PortfolioMedia[];
    reviews?: Review[];
    availability?: AvailabilityDay[];
    qrMethods?: PaymentQR[];
  },
  forcedSlot?: 'PRIMARY' | 'SECONDARY'
): Promise<BackupExecutionResult> {
  const dateKey = getDateKey();
  
  // Decide slot: if forcedSlot not specified, check if PRIMARY already exists today
  let slot: 'PRIMARY' | 'SECONDARY' = forcedSlot || 'PRIMARY';
  if (!forcedSlot) {
    const todayPrimary = typeof localStorage !== 'undefined' 
      ? localStorage.getItem(`mr_handyworks_backup_${dateKey}_PRIMARY`) 
      : null;
    if (todayPrimary) {
      slot = 'SECONDARY';
    }
  }

  const backupId = `backup_${dateKey}_${slot.toLowerCase()}_${Date.now()}`;
  const payload: SystemSnapshotPayload = {
    version: '2.0.0',
    backupId,
    slot,
    dateKey,
    timestamp: new Date().toISOString(),
    itemCounts: {
      bookings: systemState.bookings.length,
      services: systemState.services?.length || 0,
      portfolio: systemState.portfolio?.length || 0,
      reviews: systemState.reviews?.length || 0,
      availability: systemState.availability?.length || 0,
      qrMethods: systemState.qrMethods?.length || 0
    },
    data: systemState
  };

  const jsonString = JSON.stringify(payload);

  // 1. Mirror in localStorage (slot-specific and latest)
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`mr_handyworks_backup_${slot}`, jsonString);
      localStorage.setItem(`mr_handyworks_backup_${dateKey}_${slot}`, jsonString);
      localStorage.setItem('mr_handyworks_backup_last_run', new Date().toISOString());
    }
  } catch (err) {
    console.warn('Local storage backup error:', err);
  }

  // 2. Upload to Supabase Storage in backups/ folder
  let supabaseStorageUrl: string | undefined = undefined;
  if (supabase) {
    try {
      const storagePath = `${BACKUP_FOLDER}/${backupId}.json`;
      const blob = new Blob([jsonString], { type: 'application/json' });
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, blob, {
          contentType: 'application/json',
          upsert: true
        });

      if (!uploadError) {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
        supabaseStorageUrl = data.publicUrl;
      } else {
        console.warn('Supabase storage backup notice:', uploadError.message);
      }
    } catch (err: any) {
      console.warn('Supabase backup transmission error:', err?.message);
    }
  }

  // 3. Trigger 15-day purge of old backups to prevent saturation
  const purgedOldCount = await purgeExpiredBackups();

  return {
    success: true,
    backupId,
    slot,
    supabaseStorageUrl,
    purgedOldCount
  };
}

/**
 * Load latest backup snapshot for a given slot (PRIMARY or SECONDARY)
 */
export async function loadBackupSnapshot(slot: 'PRIMARY' | 'SECONDARY'): Promise<SystemSnapshotPayload | null> {
  // First check Supabase Storage for newest snapshot for this slot
  if (supabase) {
    try {
      const { data: fileList, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(BACKUP_FOLDER, {
          sortBy: { column: 'name', order: 'desc' }
        });

      if (!error && fileList && fileList.length > 0) {
        const match = fileList.find(f => f.name.includes(`_${slot.toLowerCase()}_`));
        if (match) {
          const { data: blob, error: downloadError } = await supabase.storage
            .from(BUCKET_NAME)
            .download(`${BACKUP_FOLDER}/${match.name}`);

          if (!downloadError && blob) {
            const text = await blob.text();
            const parsed = JSON.parse(text) as SystemSnapshotPayload;
            if (parsed && parsed.data && Array.isArray(parsed.data.bookings)) {
              return parsed;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Supabase load for ${slot} backup warning:`, err);
    }
  }

  // Fallback to local storage mirror
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(`mr_handyworks_backup_${slot}`);
      if (saved) {
        const parsed = JSON.parse(saved) as SystemSnapshotPayload;
        if (parsed && parsed.data && Array.isArray(parsed.data.bookings)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`LocalStorage load for ${slot} backup warning:`, err);
    }
  }

  return null;
}

/**
 * Automatic Failover Engine:
 * In case the live system or Supabase has an error or fails validation:
 * 1. Tries primary live operation.
 * 2. If it fails, automatically uses Copia 1 (PRIMARY BACKUP).
 * 3. If Copia 1 fails or is corrupt, automatically runs the alternative (SECONDARY BACKUP).
 */
export async function executeWithFailover<T>(
  primaryAction: () => Promise<T>,
  validate: (result: T) => boolean,
  extractor: (snapshot: SystemSnapshotPayload) => T,
  fallbackValue: T
): Promise<{ result: T; source: 'LIVE' | 'BACKUP_PRIMARY' | 'BACKUP_SECONDARY' | 'FALLBACK'; errorNotice?: string }> {
  try {
    const live = await primaryAction();
    if (validate(live)) {
      return { result: live, source: 'LIVE' };
    }
    throw new Error('Live data validation check returned false');
  } catch (primaryError: any) {
    const primaryMsg = primaryError?.message || 'Primary database unreachable';
    console.warn('🚨 Live system error detected. Initiating automatic failover to PRIMARY BACKUP:', primaryMsg);

    // Failover Step 1: Try Copia 1 (PRIMARY)
    try {
      const primaryBackup = await loadBackupSnapshot('PRIMARY');
      if (primaryBackup) {
        const extracted = extractor(primaryBackup);
        if (validate(extracted)) {
          console.log('✅ Automatic recovery successful: Running on PRIMARY BACKUP (Copia 1)');
          return {
            result: extracted,
            source: 'BACKUP_PRIMARY',
            errorNotice: `Live system error: ${primaryMsg}. Recovered from Primary Backup.`
          };
        }
      }
      throw new Error('Primary backup unavailable or incomplete');
    } catch (secError: any) {
      console.warn('⚠️ Primary backup failed. Initiating ALTERNATIVE (SECONDARY BACKUP - Copia 2):', secError?.message);

      // Failover Step 2: Run alternative (SECONDARY)
      try {
        const secondaryBackup = await loadBackupSnapshot('SECONDARY');
        if (secondaryBackup) {
          const extracted = extractor(secondaryBackup);
          if (validate(extracted)) {
            console.log('✅ Automatic recovery successful: Running on ALTERNATIVE (SECONDARY BACKUP - Copia 2)');
            return {
              result: extracted,
              source: 'BACKUP_SECONDARY',
              errorNotice: `System failover active: running on Secondary Backup (Copia 2).`
            };
          }
        }
      } catch (altError: any) {
        console.error('All backup failover attempts exhausted:', altError?.message);
      }
    }
  }

  return {
    result: fallbackValue,
    source: 'FALLBACK',
    errorNotice: 'System using safe fallback data.'
  };
}
