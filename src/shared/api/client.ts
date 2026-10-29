import { z } from "zod";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}
export const API_BASE_URL = import.meta.env.VITE_API_URL;
// Dışarıdan doğrudan çağrılmayan, ortak fetch mantığını tutan yardımcı fonksiyon

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ConfigError("VITE_API_URL tanımlı değil.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);

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
  headers?: Record<string, string>,
) {
  return request(path, schema, { signal, headers });
}

// Hata mesajlarını kullanıcı diline çeviren yardımcı
export function toUserMessage(err: unknown): string {
  if (err instanceof ConfigError) {
    return "Bu sürümde veri sunucusu bağlı değil.";
  }
  if (err instanceof HttpError) {
    if (err.status === 404) return "Aradığınız içerik bulunamadı.";
    if (err.status === 400)
      return "Gönderdiğin bilgilerde bir sorun var, alanları kontrol et.";
    if (err.status === 429)
      return "Çok fazla istek gönderdin, biraz bekleyip tekrar dene.";
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

// Gövdeli isteklerin ortak kalıbı: POST ve PUT yalnızca metot adında ayrışıyor
function sendJson<T>(
  method: "POST" | "PUT",
  path: string,
  body: unknown,
  schema: z.ZodType<T>,
  headers?: Record<string, string>,
) {
  return request(path, schema, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

export function postJson<T>(path: string, body: unknown, schema: z.ZodType<T>) {
  return sendJson("POST", path, body, schema);
}

export function putJson<T>(
  path: string,
  body: unknown,
  schema: z.ZodType<T>,
  headers?: Record<string, string>,
) {
  return sendJson("PUT", path, body, schema, headers);
}
