import { useQuery } from "@tanstack/react-query";
import { commentQueries } from "../../shared/api/queries";
import { fetchCommentsByItem } from "../../shared/api/endpoints";
import { ErrorState } from "../../shared/ui/ErrorState";

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
  } = useQuery({
    queryKey: commentQueries.byItem(itemId),
    queryFn: ({ signal }) => fetchCommentsByItem(itemId, signal),
  });

  if (isPending) return <p>Yorumlar yükleniyor…</p>;
  if (isError) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }
  if (comments.length === 0) return <p>Henüz yorum yok. İlk yorumu sen yaz.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {comments.map((c) => (
        <li
          key={c.id}
          style={{
            marginBottom: "1.5rem",
            borderBottom: "1px solid #eee",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <strong>{c.author}</strong>
            <time
              dateTime={c.createdAt}
              style={{ color: "gray", fontSize: "0.9rem" }}
            >
              {dateFormatter.format(new Date(c.createdAt))}
            </time>
          </div>
          <p className="comment-body" style={{ margin: 0 }}>
            {c.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
