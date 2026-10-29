import type { RebirthResults } from "../../shared/api/schemas";
import { countryName, TURKIYE } from "./countries";

export const TOP_COUNT = 5;

// Sırayla dağıtılan renkler; Türkiye ve "Diğer" bu sıraya girmez
const SERIES_COLORS = [
  "var(--color-series-1)",
  "var(--color-series-2)",
  "var(--color-series-3)",
  "var(--color-series-4)",
  "var(--color-series-5)",
] as const;

export type Slice = {
  key: string;
  code: string | null; // null = "Diğer"
  name: string;
  count: number;
  percent: number;
  color: string;
  rank: number | null; // sadece ilk 5'in dışında kalan Türkiye için
  isMine: boolean;
};

// Sunucunun sıralı listesi → ilk 5 + Türkiye (hep) + Diğer.
// Saf fonksiyon: aynı girdiye hep aynı çıktı; React'e ve ağa dokunmuyor.
export function groupResults(
  { total, results }: RebirthResults,
  myCountry: string | null,
): Slice[] {
  const percentOf = (count: number) =>
    total === 0 ? 0 : (count / total) * 100;

  const top = results.slice(0, TOP_COUNT);
  let colorIndex = 0;

  const slices: Slice[] = top.map(({ country, count }) => ({
    key: country,
    code: country,
    name: countryName(country),
    count,
    percent: percentOf(count),
    // Türkiye ilk 5'teyse de bayrak kırmızısı; sıradaki renk ondan sonrakine kalır
    color:
      country === TURKIYE ? "var(--color-flag)" : SERIES_COLORS[colorIndex++]!,
    rank: null,
    isMine: country === myCountry,
  }));

  // Türkiye ilk 5'te değilse kendi sırasıyla ayrı satır; hiç oy almadıysa 0 ile
  if (!top.some((r) => r.country === TURKIYE)) {
    const index = results.findIndex((r) => r.country === TURKIYE);
    const count = index === -1 ? 0 : results[index]!.count;
    slices.push({
      key: TURKIYE,
      code: TURKIYE,
      name: countryName(TURKIYE),
      count,
      percent: percentOf(count),
      color: "var(--color-flag)",
      rank: index === -1 ? null : index + 1,
      isMine: myCountry === TURKIYE,
    });
  }

  const rest = results.slice(TOP_COUNT).filter((r) => r.country !== TURKIYE);

  if (rest.length > 0) {
    const count = rest.reduce((sum, r) => sum + r.count, 0);
    slices.push({
      key: "other",
      code: null,
      name: `Diğer ${rest.length} ülke`,
      count,
      percent: percentOf(count),
      color: "var(--color-series-other)",
      rank: null,
      // Oyum "Diğer"in içindeyse o satır işaretlenir
      isMine: rest.some((r) => r.country === myCountry),
    });
  }

  return slices;
}

// Türkçe biçim: "1.284" ve "%26" (yüzde işareti önde)
export function formatCount(count: number): string {
  return count.toLocaleString("tr-TR");
}

export function formatPercent(percent: number): string {
  return (percent / 100).toLocaleString("tr-TR", {
    style: "percent",
    // %1'in altındaki pay "%0" görünmesin
    maximumFractionDigits: percent > 0 && percent < 1 ? 1 : 0,
  });
}
