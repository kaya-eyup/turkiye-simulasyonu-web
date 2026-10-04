import { useQuery } from "@tanstack/react-query";
import { categoryQueries } from "../../shared/api/queries";
import { Link } from "react-router";

const pill = "inline-flex rounded-full border border-line px-3 py-0.5 text-sm";

export function CategoryLink({ categoryId }: { categoryId: string }) {
  const {
    data: category,
    isPending,
    isError,
  } = useQuery(categoryQueries.detail(categoryId));

  // Veri gelmediyse, yükleniyorsa veya hata varsa sadece ID'yi metin olarak göster
  if (isPending || isError || !category) {
    return <span className={`${pill} text-muted`}>{categoryId}</span>;
  }

  return (
    <Link
      to={`/kategori/${category.id}`}
      className={`${pill} hover:border-ink`}
    >
      <span aria-hidden="true" className="mr-1.5">
        {category.emoji}
      </span>
      {category.name}
    </Link>
  );
}
