import { queryOptions } from "@tanstack/react-query";
import {
  searchItems,
  fetchItem,
  fetchItemsByCategory,
  fetchCommentsByItem,
  fetchCategories,
  fetchCategory,
  fetchFeaturedItems,
  fetchMyItemVotes,
  fetchMyRebirthVote,
  fetchRebirthResults,
} from "./endpoints";
// 1. Kategoriler için Query Key Factory
export const categoryQueries = {
  all: () => ["categories"] as const,
  list: () =>
    queryOptions({
      queryKey: [...categoryQueries.all(), "list"] as const,
      queryFn: ({ signal }) => fetchCategories(signal),
    }),
  detail: (slug: string) =>
    queryOptions({
      // Anahtar: ["categories", "detail", "yemek-kulturu"]
      queryKey: [...categoryQueries.all(), "detail", slug] as const,
      queryFn: ({ signal }) => fetchCategory(slug, signal),
    }),
};

// 2. Öğeler için Query Key Factory (Hiyerarşik Yapı)
export const itemQueries = {
  all: () => ["items"] as const,

  // Anahtar: ["items", "detail", "kebap"]
  detail: (id: string) =>
    queryOptions({
      queryKey: [...itemQueries.all(), "detail", id] as const,
      queryFn: ({ signal }) => fetchItem(id, signal),
    }),

  // Anahtar: ["items", "byCategory", "yemek-kulturu"]
  byCategory: (categoryId: string) =>
    queryOptions({
      queryKey: [...itemQueries.all(), "byCategory", categoryId] as const,
      queryFn: ({ signal }) => fetchItemsByCategory(categoryId, signal),
    }),
  // Anahtar: ["items", "featured"]
  featured: () =>
    queryOptions({
      queryKey: [...itemQueries.all(), "featured"] as const,
      queryFn: ({ signal }) => fetchFeaturedItems(signal),
    }),
  search: (params: { q: string; page: number }) =>
    queryOptions({
      queryKey: [...itemQueries.all(), "search", params] as const,
      queryFn: ({ signal }) => searchItems(params, signal),
    }),
};

export const commentQueries = {
  all: () => ["comments"] as const,
  byItem: (itemId: string) =>
    queryOptions({
      queryKey: [...commentQueries.all(), "byItem", itemId] as const,
      queryFn: ({ signal }) => fetchCommentsByItem(itemId, signal),
    }),
};

export const surveyQueries = {
  all: () => ["surveys", "rebirth"] as const,
  // Anahtar: ["surveys", "rebirth", "results"]
  results: () =>
    queryOptions({
      queryKey: [...surveyQueries.all(), "results"] as const,
      queryFn: ({ signal }) => fetchRebirthResults(signal),
    }),
  // Anahtar: ["surveys", "rebirth", "myVote"]; null = henüz oy yok
  myVote: () =>
    queryOptions({
      queryKey: [...surveyQueries.all(), "myVote"] as const,
      queryFn: ({ signal }) => fetchMyRebirthVote(signal),
    }),
};

export const itemVoteQueries = {
  all: () => ["itemVotes"] as const,
  // Anahtar: ["itemVotes", "mine"]. NavBar hep ekranda olduğu için bu sorgu
  // her sayfada canlı; öğe sayfası ve rozet aynı önbellekten okuyor.
  mine: () =>
    queryOptions({
      queryKey: [...itemVoteQueries.all(), "mine"] as const,
      queryFn: ({ signal }) => fetchMyItemVotes(signal),
    }),
};
