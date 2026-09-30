import type { Item } from "../api/schemas";


export type RatingSummary = {
  total: number;
  average: number | null;
  percents: number[];
};

export function summarize(distribution: Item["distribution"]): RatingSummary {
  // 1. Toplam oy sayısını bul
  const total = distribution.reduce((sum, count) => sum + count, 0);

  // 2. Uç durum (Edge Case): Hiç oy yoksa sıfıra bölünme (NaN) hatasını önle
  if (total === 0) {
    return {
      total: 0,
      average: null,
      percents: [0, 0, 0, 0, 0],
    };
  }

  // 3. Ortalamayı hesapla: (1*oy + 2*oy + 3*oy + 4*oy + 5*oy) / toplam
  // index 0 = 1 yıldız, index 1 = 2 yıldız olduğu için (index + 1) ile çarpıyoruz.
  const weightedSum = distribution.reduce(
    (sum, count, index) => sum + count * (index + 1),
    0
  );
  const average = weightedSum / total;

  // 4. Her bir yıldızın yüzdelik dilimini hesapla
  // Sayıyı yuvarlamıyoruz, çünkü veriyi hazırlamak iş mantığıdır, ekranda yuvarlayıp göstermek UI'ın (sunumun) işidir.
  const percents = distribution.map((count) => (count / total) * 100);

  return {
    total,
    average,
    percents,
  };
}