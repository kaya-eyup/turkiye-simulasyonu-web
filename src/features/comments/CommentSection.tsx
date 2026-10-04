import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
interface CommentSectionProps {
  itemId: string;
}

export function CommentSection({ itemId }: CommentSectionProps) {
  return (
    <section aria-labelledby="comments-heading" className="mt-12">
      <h2 id="comments-heading" className="mb-4">
        Yorumlar
      </h2>
      <CommentForm itemId={itemId} />
      <CommentList itemId={itemId} />
    </section>
  );
}
