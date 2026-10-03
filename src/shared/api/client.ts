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
  const response = await fetch(path, init);

  if (!response.ok) {
    throw new Error("Sunucuyla iletişim kurarken bir hata oluştu.");
  }

  const data = await response.json();
  return schema.parse(data);
}

export function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
) {
  return request(path, schema, { signal });
}

// Hata mesajlarını kullanıcı diline çeviren yardımcı (önceki günlerden)
export function toUserMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Bilinmeyen bir hata oluştu.";
}
