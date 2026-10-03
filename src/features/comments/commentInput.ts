import { z } from "zod";
export const AUTHOR_MAX = 30;
export const BODY_MIN = 3;
export const BODY_MAX = 500;

export const commentInputSchema = z.object({
  author: z
    .string()
    .trim()
    .max(AUTHOR_MAX, `İsim en fazla ${AUTHOR_MAX} karakter olabilir`),
  body: z
    .string()
    .trim()
    .min(1, "Yorum boş olamaz")
    .min(BODY_MIN, `Yorum en az ${BODY_MIN} karakter olmalı`)
    .max(BODY_MAX, `Yorum en fazla ${BODY_MAX} karakter olabilir`),
});

export type CommentFormValues = z.infer<typeof commentInputSchema>;
