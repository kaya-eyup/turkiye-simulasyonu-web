import { z } from 'zod';

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const categorySchema = z.object({
  id: slugSchema,
  name: z.string(),
  emoji: z.string(),
  order: z.number().int(),
});

export type Category = z.infer<typeof categorySchema>;

// distribution alanı: 5 elemanlı tuple (1, 2, 3, 4, 5 yıldız sayıları)
const voteCount = z.number().int().nonnegative();

export const itemSchema = z.object({
  id: slugSchema,
  categoryId: slugSchema,
  name: z.string(),
  emoji: z.string(),
  summary: z.string(),
  distribution: z.tuple([voteCount, voteCount, voteCount, voteCount, voteCount]),
  createdAt: z.string().datetime(), // ISO 8601 tarihi
});

export type Item = z.infer<typeof itemSchema>;

// ItemCard bileşeninin ihtiyaç duyduğu türetilmiş tip.
export type ItemCardProps = Pick<Item, 'id' | 'name' | 'emoji' | 'summary' | 'distribution'>;