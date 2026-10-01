import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 1. Belirtilen süre (delay) kadar bekle ve değeri güncelle
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Kapatma (Cleanup) Fonksiyonu
    // Kullanıcı 'delay' süresi dolmadan yeni bir tuşa basarsa,
    // önceki effect temizlenir ve bu clearTimeout çalışarak eski sayacı öldürür.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
