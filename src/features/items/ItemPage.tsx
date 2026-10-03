import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { slugSchema, type Item } from "../../shared/api/schemas";
import { itemQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { NotFoundPage } from "../../shared/ui/NotFoundPage";
import { CategoryLink } from "./CategoryLink";
import { RatingBars } from "./RatingBars";
import { ErrorState } from "../../shared/ui/ErrorState";
import { useDisplayedDistribution } from "../votes/useDisplayedDistribution";
import { useMyVotes } from "../votes/votesContext";
import { VoteButtons } from "../votes/VoteButtons";
import { CommentSection } from "../comments/CommentSection";

function ItemDetail({ item }: { item: Item }) {
  // Erken return yok, item kesinlikle var. Hook'lar güvenle koşulsuz çağrılır.
  const distribution = useDisplayedDistribution(item);
  const myVote = useMyVotes()[item.id];

  return (
    <article className="item-detail-container">
      <header>
        <div style={{ fontSize: "4rem" }}>{item.emoji}</div>
        <h1>{item.name}</h1>
        <CategoryLink categoryId={item.categoryId} />
      </header>

      <p className="item-summary">{item.summary}</p>

      <section className="item-ratings">
        <RatingBars distribution={distribution} />
        <VoteButtons itemId={item.id} current={myVote} />
      </section>
      <CommentSection itemId={item.id} />
    </article>
  );
}

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

  return <ItemDetail item={item} />;
}

export function ItemPage() {
  const { id } = useParams<{ id: string }>();

  const parsed = slugSchema.safeParse(id);

  if (!parsed.success) {
    return <NotFoundPage />;
  }

  return <ItemView id={parsed.data} />;
}
