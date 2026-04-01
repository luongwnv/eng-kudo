import { loadSync, save } from "@/core/storage/chromeStorage";

type Listener<T> = (state: T, prev: T) => void;
type SetStateArg<T> = Partial<T> | ((state: T) => Partial<T>);

export interface Store<T> {
  getState: () => T;
  setState: (partial: SetStateArg<T>) => void;
  subscribe: (listener: Listener<T>) => () => void;
  destroy: () => void;
}

interface StoreOptions<T> {
  name: string;
  initialState: T;
  persist?: boolean;
}

export function createStore<T extends object>(
  options: StoreOptions<T>,
): Store<T> {
  // Hydrate synchronously from localStorage so getState() is correct immediately
  const saved = options.persist ? loadSync<T>(options.name) : null;
  let state = saved ? { ...options.initialState, ...saved } : { ...options.initialState };

  const listeners = new Set<Listener<T>>();
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function getState(): T {
    return state;
  }

  function setState(partial: SetStateArg<T>): void {
    const prev = { ...state };
    const next = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...next };
    listeners.forEach((fn) => fn(state, prev));

    if (options.persist) {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        save(options.name, state);
      }, 200);
    }
  }

  function subscribe(listener: Listener<T>): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function destroy(): void {
    listeners.clear();
    if (saveTimer) clearTimeout(saveTimer);
  }

  return { getState, setState, subscribe, destroy };
}
