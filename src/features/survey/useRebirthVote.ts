import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putMyRebirthVote } from "../../shared/api/endpoints";
import { surveyQueries } from "../../shared/api/queries";

export function useRebirthVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (country: string) => putMyRebirthVote(country),
    onSuccess: (vote) => {
      // Sunucunun cevabı zaten "benim oyum": aynı şeyi tekrar sormaya gerek yok
      queryClient.setQueryData(surveyQueries.myVote().queryKey, vote);
      // Dağılım değişti; sonuçlar sunucuda yeniden sayılsın.
      // Promise döndüğü için mutation, yeni sonuçlar gelene kadar "pending" kalır.
      return queryClient.invalidateQueries({
        queryKey: surveyQueries.results().queryKey,
      });
    },
  });
}
