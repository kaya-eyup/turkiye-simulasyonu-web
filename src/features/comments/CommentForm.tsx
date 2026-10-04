import { useId, useRef, useState, type SubmitEvent } from "react";
import { z } from "zod";
import { toUserMessage } from "../../shared/api/client";
import {
  AUTHOR_MAX,
  BODY_MAX,
  commentInputSchema,
  type CommentFormValues,
} from "./commentInput";
import { useAddComment } from "./useAddComment";

type Field = keyof CommentFormValues;

const EMPTY: CommentFormValues = { author: "", body: "" };
// İki alanın ortak görünüşü; hatalıyken kenarlık aria-invalid'den kırmızıya döner
const fieldClass =
  "w-full rounded-md border border-line bg-page px-3 py-2 aria-[invalid=true]:border-danger";
const UNTOUCHED: Record<Field, boolean> = { author: false, body: false };

export function CommentForm({ itemId }: { itemId: string }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState(UNTOUCHED);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const addComment = useAddComment(itemId);

  const authorRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  const result = commentInputSchema.safeParse(values);
  const fieldErrors = result.success
    ? {}
    : z.flattenError(result.error).fieldErrors;

  function errorFor(field: Field): string | undefined {
    if (touched[field] || submitAttempted) {
      return fieldErrors[field]?.[0];
    }
    return undefined;
  }

  function handleChange(field: Field, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: Field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!result.success) {
      if (fieldErrors.author) authorRef.current?.focus();
      else if (fieldErrors.body) bodyRef.current?.focus();
      return;
    }

    addComment.mutate(
      {
        author: result.data.author || "anonim",
        body: result.data.body,
      },
      {
        onSuccess: () => {
          setValues(EMPTY);
          setTouched(UNTOUCHED);
          setSubmitAttempted(false);
        },
      },
    );
  }

  const authorError = errorFor("author");
  const bodyError = errorFor("body");

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-8 flex flex-col gap-4 rounded-lg border border-line bg-surface p-5"
    >
      <div>
        <label
          htmlFor={`${id}-author`}
          className="mb-1 block text-sm font-medium"
        >
          İsim (isteğe bağlı)
        </label>
        <input
          id={`${id}-author`}
          ref={authorRef}
          value={values.author}
          onChange={(e) => handleChange("author", e.target.value)}
          onBlur={() => handleBlur("author")}
          maxLength={AUTHOR_MAX}
          aria-invalid={authorError !== undefined}
          aria-describedby={authorError ? `${id}-author-error` : undefined}
          className={fieldClass}
        />
        {authorError && (
          <p id={`${id}-author-error`} className="mt-1 text-sm text-danger">
            {authorError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${id}-body`}
          className="mb-1 block text-sm font-medium"
        >
          Yorum
        </label>
        <textarea
          id={`${id}-body`}
          ref={bodyRef}
          value={values.body}
          onChange={(e) => handleChange("body", e.target.value)}
          onBlur={() => handleBlur("body")}
          maxLength={BODY_MAX}
          aria-invalid={bodyError !== undefined}
          aria-describedby={bodyError ? `${id}-body-error` : undefined}
          rows={4}
          className={`${fieldClass} resize-y`}
        />
        <div className="mt-1 flex gap-4 text-sm">
          {bodyError && (
            <p id={`${id}-body-error`} className="text-danger">
              {bodyError}
            </p>
          )}
          {/* ml-auto: hata olsa da olmasa da sayaç hep sağda */}
          <span className="ml-auto text-muted tabular-nums">
            {values.body.length}/{BODY_MAX}
          </span>
        </div>
      </div>

      {addComment.isError && (
        <p role="alert" className="text-sm font-medium text-danger">
          {toUserMessage(addComment.error)}
        </p>
      )}

      <button
        type="submit"
        disabled={addComment.isPending}
        className="btn btn-primary self-start"
      >
        {addComment.isPending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
