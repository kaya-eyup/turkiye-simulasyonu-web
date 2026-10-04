import { ItemCard, type ItemCardData } from "./ItemCard";

// Kategori ve arama sayfaları aynı ızgarayı kullanır: düzen tek yerden değişir
export function ItemGrid({ items }: { items: ItemCardData[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
