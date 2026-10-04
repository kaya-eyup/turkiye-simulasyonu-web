import { Link } from "react-router";
import type { Item } from "../../shared/api/schemas";
import { summarize } from "../../shared/lib/rating";
import { useDisplayedDistribution } from "../votes/useDisplayedDistribution";
// Sadece bu karta lazım olan alanları seçiyoruz
export type ItemCardData = Pick<
  Item,
  "id" | "name" | "emoji" | "summary" | "distribution"
>;

export function ItemCard({ item }: { item: ItemCardData }) {
  const distribution = useDisplayedDistribution(item);
  const { average, total } = summarize(distribution);

  return (
    <Link
      to={`/oge/${item.id}`}
      className="flex h-full flex-col gap-2 rounded-lg border border-line bg-surface p-4 hover:border-ink"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl">
          {item.emoji}
        </span>
        <h3>{item.name}</h3>
      </div>
      <p className="line-clamp-2 text-sm text-muted">{item.summary}</p>

      {/* mt-auto: kartlar aynı yükseklikteyken puan satırı hep en altta hizalanır */}
      <p className="mt-auto pt-2 text-sm">
        {average !== null ? (
          <>
            <span className="font-semibold text-tea">
              <span aria-hidden="true">★ </span>
              {average.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
            </span>{" "}
            <span className="text-muted">({total} oy)</span>
          </>
        ) : (
          <span className="text-muted">Henüz oy yok</span>
        )}
      </p>
    </Link>
  );
}
