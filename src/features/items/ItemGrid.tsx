import { ItemCard, type ItemCardData } from "./ItemCard";

// Düzen seçenekleri tek yerde: kategori/arama 3'lü, ana sayfadaki seçilmişler 5'li
const layouts = {
  default: "sm:grid-cols-2 lg:grid-cols-3",
  featured: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
} as const;

export function ItemGrid({
  items,
  layout = "default",
}: {
  items: ItemCardData[];
  layout?: keyof typeof layouts;
}) {
  return (
    <ul className={`grid gap-3 ${layouts[layout]}`}>
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
