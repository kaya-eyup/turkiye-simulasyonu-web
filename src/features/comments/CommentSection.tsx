import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
interface CommentSectionProps {
  itemId: string;
}

export function CommentSection({ itemId }: CommentSectionProps) {
  return (
    <section aria-labelledby="comments-heading" style={{ marginTop: "3rem" }}>
      <h2 id="comments-heading">Yorumlar</h2>
      <CommentForm itemId={itemId} />
      <CommentList itemId={itemId} />
    </section>
  );
}
