import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { slugSchema } from "../../shared/api/schemas";
import { itemQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { NotFoundPage } from "../../shared/ui/NotFoundPage";
import { CategoryLink } from "./CategoryLink";
import { RatingBars } from "./RatingBars";
import { ErrorState } from "../../shared/ui/ErrorState";

function ItemView({ id }: { id: string }) {
  const {
    data: item,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(itemQueries.detail(id));

  if (isPending) return <p>Yükleniyor...</p>;

  if (isError) {
    return (
      <ErrorState
        isRetrying={isFetching}
        message={toUserMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  if (!item) return <NotFoundPage />;

  return (
    <article className="item-detail-container">
      <header>
        <div style={{ fontSize: "4rem" }}>{item.emoji}</div>
        <h1>{item.name}</h1>
        <CategoryLink categoryId={item.categoryId} />
      </header>

      <p className="item-summary">{item.summary}</p>

      <section className="item-ratings">
        <RatingBars distribution={item.distribution} />
      </section>
    </article>
  );
}

export function ItemPage() {
  const { id } = useParams<{ id: string }>();

  const parsed = slugSchema.safeParse(id);

  if (!parsed.success) {
    return <NotFoundPage />;
  }

  return <ItemView id={parsed.data} />;
}
