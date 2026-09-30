import { categorySchema, itemSchema, itemListSchema } from "./schemas";
import type { Category, Item } from "./schemas";
import { getJson, HttpError } from "./client";
import { normalizeForSearch } from "../lib/normalize";

export const PAGE_SIZE = 5;
export type SearchResult = { items: Item[]; total: number; totalPages: number };

export async function fetchCategory(
  slug: string,
  signal?: AbortSignal,
): Promise<Category | null> {
  const encodedSlug = encodeURIComponent(slug);
  try {
    return await getJson(`/categories/${encodedSlug}`, categorySchema, signal);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchItemsByCategory(
  slug: string,
  signal?: AbortSignal,
): Promise<Item[]> {
  const encodedSlug = encodeURIComponent(slug);
  // Artık her çağrıda şema oluşturmuyoruz, sabiti kullanıyoruz
  return await getJson(
    `/items?categoryId=${encodedSlug}`,
    itemListSchema,
    signal,
  );
}

export async function fetchItem(
  slug: string,
  signal?: AbortSignal,
): Promise<Item | null> {
  const encodedSlug = encodeURIComponent(slug);
  try {
    return await getJson(`/items/${encodedSlug}`, itemSchema, signal);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Mevcut fetch fonksiyonlarına uygun bir fetchAllItems yazıyoruz
export async function fetchAllItems(signal?: AbortSignal): Promise<Item[]> {
  return getJson("/items", itemListSchema, signal);
}

// Adapter: sunucu gelince içi değişir, imzası değişmez
export async function searchItems(
  { q, page }: { q: string; page: number }, 
  signal?: AbortSignal
): Promise<SearchResult> {
  // Arama metni yoksa ağa çıkmadan boş dön
  if (!q) {
    return { items: [], total: 0, totalPages: 0 };
  }

  // Tüm veriyi çek (Ekim'deki gerçek backend'de bu mantık SQL'e kayacak)
  const allItems = await fetchAllItems(signal);
  
  const normalizedQuery = normalizeForSearch(q);
  
  // İsim veya özette eşleşme ara
  const filteredItems = allItems.filter(item => 
    normalizeForSearch(item.name).includes(normalizedQuery) ||
    normalizeForSearch(item.summary).includes(normalizedQuery)
  );

  const total = filteredItems.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // İstenen sayfayı slice ile kes ((page - 1) * 5'ten, page * 5'e kadar)
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total,
    totalPages
  };
}