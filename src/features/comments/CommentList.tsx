import { useQuery } from "@tanstack/react-query";
import { commentQueries } from "../../shared/api/queries";
import { ErrorState } from "../../shared/ui/ErrorState";
import { toUserMessage } from "../../shared/api/client";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

interface CommentListProps {
  itemId: string;
}

export function CommentList({ itemId }: CommentListProps) {
  const {
    data: comments,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(commentQueries.byItem(itemId));

  if (isPending) return <p className="text-muted">Yorumlar yükleniyor…</p>;
  if (isError) {
    return (
      <ErrorState
        message={toUserMessage(error)}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }
  if (comments.length === 0)
    return <p className="text-muted">Henüz yorum yok. İlk yorumu sen yaz.</p>;

  return (
    // divide-y: öğelerin arasına çizgi; ilkinin üstüne ve sonuncunun altına koymaz
    <ul className="divide-y divide-line">
      {comments.map((c) => (
        <li key={c.id} className="py-4">
          <div className="mb-1 flex items-baseline justify-between gap-4">
            <strong className="font-semibold">{c.author}</strong>
            <time
              dateTime={c.createdAt}
              className="shrink-0 text-sm text-muted"
            >
              {dateFormatter.format(new Date(c.createdAt))}
            </time>
          </div>
          {/* Satır sonları korunur; boşluksuz uzun metin sayfayı yana taşırmaz */}
          <p className="wrap-anywhere whitespace-pre-line">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
