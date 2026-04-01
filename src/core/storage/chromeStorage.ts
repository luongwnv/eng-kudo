const isExtension = typeof chrome !== "undefined" && !!chrome?.storage?.local;

/** Synchronous load from localStorage (for initial hydration) */
export function loadSync<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

/** Async load - uses chrome.storage in extension, localStorage otherwise */
export async function load<T>(key: string): Promise<T | null> {
  if (isExtension) {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T) ?? null;
  }
  return loadSync<T>(key);
}

export async function save<T>(key: string, value: T): Promise<void> {
  // Always save to localStorage (sync access on next load)
  localStorage.setItem(key, JSON.stringify(value));
  // Also save to chrome.storage if in extension
  if (isExtension) {
    await chrome.storage.local.set({ [key]: value });
  }
}

export async function remove(key: string): Promise<void> {
  localStorage.removeItem(key);
  if (isExtension) {
    await chrome.storage.local.remove(key);
  }
}
