import type { ZodType } from "zod";

export function readStorage<T>(key: string, schema: ZodType<T>): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      localStorage.removeItem(key);
      return null;
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      localStorage.removeItem(key);
      return null;
    }

    return result.data;
  } catch {
    // localStorage erişimi engelliyse
    return null;
  }
}
export function writeStorage(key: string, value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[storage] "${key}" anahtarı yazılamadı:`, error);
    }
    return false;
  }
}
