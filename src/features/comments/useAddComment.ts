import { postComment } from "../../shared/api/endpoints";
import type { NewComment } from "../../shared/api/endpoints";
import { commentQueries } from "../../shared/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddComment(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<NewComment, "itemId">) =>
      postComment({ ...input, itemId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: commentQueries.all() }),
  });
}
