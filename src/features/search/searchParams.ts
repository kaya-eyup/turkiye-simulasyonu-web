// URL'deki parametre adları tek yerde: "sayfa" iki dosyada farklı yazılırsa sessizce kopar
export const SEARCH_PARAMS = { query: "q", page: "sayfa" } as const;
export const DEFAULT_PAGE = 1;
export const MAX_QUERY_LENGTH = 100;

export function parseQuery(raw: string | null): string {
  if (raw === null) return "";

  const trimmed = raw.trim();
  // String prototipindeki slice, bitiş indeksi dizinin uzunluğundan büyükse
  // hata fırlatmaz, dizinin sonuna kadar olan kısmı döner. Güvenlidir.
  return trimmed.slice(0, MAX_QUERY_LENGTH);
}

export function parsePage(raw: string | null): number {
  // Number(null) ve Number("") 0 döner.
  // NaN veya ondalıklı sayılar isInteger'dan geçemez.
  const num = Number(raw);

  if (Number.isInteger(num) && num > 0) {
    return num;
  }

  return DEFAULT_PAGE;
}
