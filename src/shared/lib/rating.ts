import type { Item } from "../api/schemas";

export type RatingRow = { stars: number; count: number; percent: number };

export type RatingSummary = {
  total: number;
  average: number | null;
  rows: RatingRow[]; // 1★ → 5★ sırasıyla
};

export function summarize(distribution: Item["distribution"]): RatingSummary {
  const total = distribution.reduce((sum, count) => sum + count, 0);

  // Uç durum: Hiç oy yoksa
  if (total === 0) {
    return {
      total: 0,
      average: null,
      rows: distribution.map((_count, index) => ({
        stars: index + 1,
        count: 0,
        percent: 0,
      })),
    };
  }

  // Ortalamayı hesapla
  const weightedSum = distribution.reduce(
    (sum, count, index) => sum + count * (index + 1),
    0,
  );
  const average = weightedSum / total;

  // Tüm veriyi tek bir satır nesnesinde (row) topla
  const rows = distribution.map((count, index) => ({
    stars: index + 1,
    count,
    percent: (count / total) * 100,
  }));

  return {
    total,
    average,
    rows,
  };
}
