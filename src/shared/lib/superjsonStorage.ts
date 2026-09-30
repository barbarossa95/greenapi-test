import superjson from 'superjson';
import type {PersistStorage} from 'zustand/middleware';

// localStorage через superjson: сохраняет Map, Set, Date
export const createSuperjsonStorage = <T>(): PersistStorage<T> => ({
  getItem: (name) => {
    const str = localStorage.getItem(name);

    if (!str) return null;

    return superjson.parse(str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
});
