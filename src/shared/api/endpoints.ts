import { categorySchema, itemSchema, itemListSchema } from "./schemas";
import type { Category, Item } from "./schemas";
import { getJson, HttpError } from "./client";
import { normalizeForSearch } from "../lib/normalize";
import { commentListSchema, commentSchema } from "./schemas";
import type { ItemComment } from "./schemas";
import { postJson } from "./client";
export const PAGE_SIZE = 5;
export type SearchResult = { items: Item[]; total: number; totalPages: number };

export async function fetchCommentsByItem(
  itemId: string,
  signal?: AbortSignal,
): Promise<ItemComment[]> {
  const encoded = encodeURIComponent(itemId);
  return getJson(
    `/comments?itemId=${encoded}&_sort=-createdAt`,
    commentListSchema,
    signal,
  );
}

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
export type NewComment = Pick<ItemComment, "itemId" | "author" | "body">;

export async function postComment(input: NewComment): Promise<ItemComment> {
  return postJson(
    "/comments",
    { ...input, createdAt: new Date().toISOString() },
    commentSchema,
  );
}
