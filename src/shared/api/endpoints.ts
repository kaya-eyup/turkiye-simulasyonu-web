import {
  categorySchema,
  itemSchema,
  itemListSchema,
  categoryListSchema,
} from "./schemas";
import type { Category, Item } from "./schemas";
import { getJson, HttpError } from "./client";
import {
  commentListSchema,
  commentSchema,
  searchResultSchema,
} from "./schemas";
import type { ItemComment, SearchResult } from "./schemas";
import { postJson, putJson } from "./client";
import { rebirthResultsSchema, rebirthVoteSchema } from "./schemas";
import type { RebirthResults, RebirthVote } from "./schemas";
import { getVoterId } from "../lib/voterId";

export async function fetchCommentsByItem(
  itemId: string,
  signal?: AbortSignal,
): Promise<ItemComment[]> {
  const encoded = encodeURIComponent(itemId);
  return getJson(`/comments?itemId=${encoded}`, commentListSchema, signal);
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

export async function fetchFeaturedItems(
  signal?: AbortSignal,
): Promise<Item[]> {
  return getJson("/items/featured", itemListSchema, signal);
}

export async function searchItems(
  { q, page }: { q: string; page: number },
  signal?: AbortSignal,
): Promise<SearchResult> {
  // Boş aramada sunucuya gitmeye gerek yok
  if (!q) {
    return { items: [], total: 0, totalPages: 0 };
  }

  // URLSearchParams kaçış işlemini kendisi yapar (boşluk, Türkçe harf, & işareti)
  const params = new URLSearchParams({ q, page: String(page) });
  return getJson(`/items/search?${params}`, searchResultSchema, signal);
}
export type NewComment = Pick<ItemComment, "itemId" | "author" | "body">;

export async function postComment(input: NewComment): Promise<ItemComment> {
  return postJson("/comments", input, commentSchema);
}

export const fetchCategories = async (signal?: AbortSignal) => {
  return getJson("/categories", categoryListSchema, signal);
};

// Kimlik sadece anketin uçlarına gider, her isteğe değil: gerekmeyen yerde
// tarayıcıyı tanımlayan bir değer göndermiyoruz.
// Giriş geldiğinde bu başlığın yerini Authorization alacak.
const voterHeader = () => ({ "X-Voter-Id": getVoterId() });

export async function fetchRebirthResults(
  signal?: AbortSignal,
): Promise<RebirthResults> {
  return getJson("/surveys/rebirth", rebirthResultsSchema, signal);
}

export async function fetchMyRebirthVote(
  signal?: AbortSignal,
): Promise<RebirthVote | null> {
  try {
    return await getJson(
      "/surveys/rebirth/my-vote",
      rebirthVoteSchema,
      signal,
      voterHeader(),
    );
  } catch (error) {
    // 404 = bu tarayıcı henüz oy vermedi; hata değil, bir durum
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function putMyRebirthVote(country: string): Promise<RebirthVote> {
  return putJson(
    "/surveys/rebirth/my-vote",
    { country },
    rebirthVoteSchema,
    voterHeader(),
  );
}
