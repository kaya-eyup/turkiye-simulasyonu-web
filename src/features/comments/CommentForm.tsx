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
      style={{
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div>
        <label
          htmlFor={`${id}-author`}
          style={{ display: "block", marginBottom: "0.25rem" }}
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
          style={{ width: "100%", padding: "0.5rem" }}
        />
        {authorError && (
          <p
            id={`${id}-author-error`}
            style={{
              color: "var(--color-danger)",
              margin: "0.25rem 0 0 0",
              fontSize: "0.875rem",
            }}
          >
            {authorError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${id}-body`}
          style={{ display: "block", marginBottom: "0.25rem" }}
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
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.25rem",
            fontSize: "0.875rem",
          }}
        >
          {bodyError ? (
            <p
              id={`${id}-body-error`}
              style={{ color: "var(--color-danger)", margin: 0 }}
            >
              {bodyError}
            </p>
          ) : (
            <span /> /* Boş bırakıldığında flex hizalamasını bozmamak için */
          )}
          <span style={{ color: "var(--color-muted)" }}>
            {values.body.length}/{BODY_MAX}
          </span>
        </div>
      </div>

      {addComment.isError && (
        <p style={{ color: "var(--color-danger)", fontWeight: "bold" }}>
          {toUserMessage(addComment.error)}
        </p>
      )}

      <button
        type="submit"
        disabled={addComment.isPending}
        style={{ alignSelf: "flex-start", padding: "0.5rem 1rem" }}
      >
        {addComment.isPending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
