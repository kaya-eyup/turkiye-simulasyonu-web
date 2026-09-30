import { Link } from "react-router";
import type { Item } from "../../shared/api/schemas";
import { summarize } from "../../shared/lib/rating";

// Sadece bu karta lazım olan alanları seçiyoruz
export type ItemCardData = Pick<
  Item,
  "id" | "name" | "emoji" | "summary" | "distribution"
>;

export function ItemCard({ item }: { item: ItemCardData }) {
  const { average, total } = summarize(item.distribution);

  return (
    <Link to={`/oge/${item.id}`} className="item-card">
      <div className="item-card-header">
        <span className="emoji">{item.emoji}</span>
        <h3>{item.name}</h3>
      </div>
      <p className="summary">{item.summary}</p>

      <div className="item-card-footer">
        {average !== null ? (
          <span>
            {average.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} ★ (
            {total})
          </span>
        ) : (
          <span>Henüz oy yok</span>
        )}
      </div>
    </Link>
  );
}
