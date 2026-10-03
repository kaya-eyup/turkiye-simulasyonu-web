import { categorySchema, itemSchema, itemListSchema } from "./schemas";
import type { Category, Item } from "./schemas";
import { getJson, HttpError } from "./client";
import { normalizeForSearch } from "../lib/normalize";
import { commentListSchema } from "./schemas";
export const PAGE_SIZE = 5;
export type SearchResult = { items: Item[]; total: number; totalPages: number };

export const fetchCommentsByItem = async (
  itemId: string,
  signal?: AbortSignal,
) => {
  const url = `/comments?itemId=${encodeURIComponent(itemId)}&_sort=-createdAt`;
  const data = await fetch(url, { signal });
  return commentListSchema.parse(data);
};

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

export async function fetchAllItems(signal?: AbortSignal): Promise<Item[]> {
  return getJson("/items", itemListSchema, signal);
}

export async function searchItems(
  { q, page }: { q: string; page: number },
  signal?: AbortSignal,
): Promise<SearchResult> {
  if (!q) {
    return { items: [], total: 0, totalPages: 0 };
  }

  const allItems = await fetchAllItems(signal);

  const normalizedQuery = normalizeForSearch(q);

  const filteredItems = allItems.filter(
    (item) =>
      normalizeForSearch(item.name).includes(normalizedQuery) ||
      normalizeForSearch(item.summary).includes(normalizedQuery),
  );

  const total = filteredItems.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total,
    totalPages,
  };
}
