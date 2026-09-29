import { categorySchema, itemSchema } from './schemas';
import type { Category, Item } from './schemas';

import { getJson, HttpError } from './client';
import { z } from 'zod';

export async function fetchCategory(slug: string, signal?: AbortSignal): Promise<Category | null> {
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

export async function fetchItemsByCategory(slug: string, signal?: AbortSignal): Promise<Item[]> {
  const encodedSlug = encodeURIComponent(slug);
  const itemsArraySchema = z.array(itemSchema);
  return await getJson(`/items?categoryId=${encodedSlug}`, itemsArraySchema, signal);
}

export async function fetchItem(slug: string, signal?: AbortSignal): Promise<Item | null> {
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