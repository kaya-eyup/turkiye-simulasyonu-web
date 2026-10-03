import { z } from "zod";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

// Dışarıdan doğrudan çağrılmayan, ortak fetch mantığını tutan yardımcı fonksiyon
async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) {
    throw new Error("VITE_API_URL environment variable is not defined.");
  }
  const response = await fetch(`${baseUrl}${path}`, init);

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `HTTP Error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  // Zod, gelen veri şemaya uymazsa ZodError fırlatır.
  return schema.parse(data);
}

export function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
) {
  return request(path, schema, { signal });
}

// Hata mesajlarını kullanıcı diline çeviren yardımcı
export function toUserMessage(err: unknown): string {
  if (err instanceof HttpError) {
    if (err.status === 404) return "Aradığınız içerik bulunamadı.";
    if (err.status >= 500)
      return "Sunucuda bir hata oluştu, lütfen daha sonra tekrar deneyin.";
    return `Beklenmeyen bir hata oluştu (Kod: ${err.status}).`;
  }
  if (err instanceof z.ZodError) {
    return "Sunucudan gelen veri yapısı hatalı. Lütfen daha sonra tekrar deneyin.";
  }
  if (err instanceof TypeError) {
    return "Sunucuya ulaşılamadı. Bağlantını kontrol et.";
  }
  return "Bilinmeyen bir hata oluştu.";
}

export function postJson<T>(path: string, body: unknown, schema: z.ZodType<T>) {
  return request(path, schema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
