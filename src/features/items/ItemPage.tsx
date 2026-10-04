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
    <article>
      <header className="mb-8">
        <div aria-hidden="true" className="mb-2 text-6xl">
          {item.emoji}
        </div>
        <h1 className="text-5xl">{item.name}</h1>
        <div className="mt-3">
          <CategoryLink categoryId={item.categoryId} />
        </div>
        <p className="mt-4 max-w-prose text-lg text-muted">{item.summary}</p>
      </header>

      {/* Geniş ekranda dağılım solda, oy düğmeleri sağda; telefonda alt alta */}
      <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
        <section className="rounded-lg border border-line bg-surface p-5">
          <RatingBars distribution={distribution} />
        </section>
        <section className="rounded-lg border border-line bg-surface p-5">
          <VoteButtons itemId={item.id} current={myVote} />
        </section>
      </div>

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

  if (isPending) return <p>Yükleniyor…</p>;

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
