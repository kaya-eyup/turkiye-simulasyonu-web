import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import type { ZodType } from "zod";
import { readStorage, writeStorage } from "../lib/storage";
export function useLocalStorage<T>(
  key: string,
  schema: ZodType<T>,
  getInitial: () => T, // sadece kayıt yoksa çağrılır
): [T, Dispatch<SetStateAction<T>>] {
  // Lazy initialization: Sadece ilk render'da çalışır, getInitial() ağır bir hesapsa performansı korur.
  const [value, setValue] = useState<T>(() => {
    const storedValue = readStorage(key, schema);
    return storedValue !== null ? storedValue : getInitial();
  });

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
