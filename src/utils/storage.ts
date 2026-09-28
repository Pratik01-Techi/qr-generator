import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '../types';

const HISTORY_KEY = '@qr_generator_history_v1';
const MAX_HISTORY_ITEMS = 20;

/** Load saved QR history from device storage (newest first). */
export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupted storage should not crash the app; start fresh instead.
    return [];
  }
}

/** Persist a new history entry, keeping only the most recent items. */
export async function saveHistoryItem(item: HistoryItem): Promise<void> {
  const existing = await loadHistory();
  const filtered = existing.filter(
    (entry) => !(entry.payload === item.payload && entry.type === item.type)
  );
  const next = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

/** Remove a single history record by id. */
export async function removeHistoryItem(id: string): Promise<HistoryItem[]> {
  const existing = await loadHistory();
  const next = existing.filter((entry) => entry.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

/** Clear all saved history entries. */
export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
