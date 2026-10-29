import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMyItemVote, putMyItemVote } from "../../shared/api/endpoints";
import { itemQueries, itemVoteQueries } from "../../shared/api/queries";
import type { Stars } from "../../shared/api/schemas";

export function useMyItemVote(itemId: string) {
  const queryClient = useQueryClient();
  const myVotes = useQuery(itemVoteQueries.mine());

  const mutation = useMutation({
    // null = "oyumu geri al"; iki uç, tek mutation
    mutationFn: async (stars: Stars | null) => {
      if (stars === null) {
        await deleteMyItemVote(itemId);
        return;
      }

      // PUT'un cevabını (oyun son hâli) kullanmıyoruz: ankette cevap önbellekteki
      // değerin tamamıydı, burada ise listedeki tek bir satır. Listeyi elle
      // güncellemek yerine sunucudan okuyoruz; dağılım için zaten istek atılıyor.
      await putMyItemVote(itemId, stars);
    },

    onSuccess: () => {
      // İki şey birden değişti: benim oyum ve öğenin dağılımı. İkisi de sunucudan
      // yeniden okunuyor; dağılımı istemcide tahmin etmiyoruz, çünkü bu arada
      // başkasının oyu da girmiş olabilir.
      // Promise döndüğü için mutation yeni sayılar gelene kadar "pending" kalır:
      // düğmeler o sürede kapalı, ekranda eski sayıyla yeni oy bir an yan yana görünmez.
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: itemVoteQueries.all() }),
        queryClient.invalidateQueries({ queryKey: itemQueries.all() }),
      ]);
    },
  });

  return {
    // undefined: bu öğeye oy verilmemiş
    current: myVotes.data?.find((vote) => vote.itemId === itemId)?.stars,
    isLoading: myVotes.isPending,
    vote: mutation.mutate,
    isVoting: mutation.isPending,
    voteError: mutation.error,
  };
}
