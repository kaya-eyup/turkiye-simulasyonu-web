import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { slugSchema } from "../../shared/api/schemas";
import { categoryQueries, itemQueries } from "../../shared/api/queries";
import { NotFoundPage } from "../../shared/ui/NotFoundPage";
import { ItemGrid } from "../items/ItemGrid";
import { summarize } from "../../shared/lib/rating";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";

function CategoryView({ slug }: { slug: string }) {
  const {
    data: category,
    isPending: isCatPending,
    isError: isCatError,
    error: catError,
    refetch: refetchCat,
    isFetching: isCatFetching,
  } = useQuery(categoryQueries.detail(slug));

  const {
    data: items,
    isPending: isItemsPending,
    isError: isItemsError,
    error: itemsError,
    refetch: refetchItems,
    isFetching: isItemsFetching,
  } = useQuery(itemQueries.byCategory(slug));

  if (isCatPending || isItemsPending)
    return <p className="text-muted">Yükleniyor…</p>;

  if (isCatError || isItemsError) {
    const error = catError || itemsError;
    const isFetching = isCatFetching || isItemsFetching;

    return (
      <ErrorState
        isRetrying={isFetching}
        message={toUserMessage(error)}
        onRetry={() => {
          refetchCat();
          refetchItems();
        }}
      />
    );
  }

  if (!category) return <NotFoundPage />;

  const sortedItems = [...items].sort((a, b) => {
    const avgA = summarize(a.distribution).average;
    const avgB = summarize(b.distribution).average;

    if (avgA === null && avgB === null) return 0;
    if (avgA === null) return 1;
    if (avgB === null) return -1;
    return avgB - avgA;
  });

  return (
    <div>
      <header className="mb-6">
        <h1>
          <span aria-hidden="true">{category.emoji}</span> {category.name}
        </h1>
        <p className="mt-1 text-muted">{items.length} öğe</p>
      </header>

      {sortedItems.length === 0 ? (
        <p className="text-muted">Bu kategoride henüz öğe yok.</p>
      ) : (
        <ItemGrid items={sortedItems} />
      )}
    </div>
  );
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return <NotFoundPage />;

  return <CategoryView slug={parsed.data} />;
}
