// Safe localStorage wrapper that gracefully handles blocked storage, private browsing,
// and sandboxed iframes by falling back to in-memory storage.
const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Storage access blocked or restricted (e.g. sandboxed iframe SecurityError)
    }
    return memoryStore[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Storage access blocked or quota exceeded
    }
    memoryStore[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Storage access blocked
    }
    delete memoryStore[key];
  },

  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch {
      // Storage access blocked
    }
    Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
  },
};
