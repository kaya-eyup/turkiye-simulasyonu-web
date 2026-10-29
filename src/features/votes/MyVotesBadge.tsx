import { useQuery } from "@tanstack/react-query";
import { itemVoteQueries } from "../../shared/api/queries";

export function MyVotesBadge() {
  // Sunucu hata verirse ya da henüz gelmediyse rozet görünmez: sayı yanlış görünmesindense hiç görünmesin
  const { data } = useQuery(itemVoteQueries.mine());
  const count = data?.length ?? 0;

  if (count === 0) return null;

  return (
    <span className="hidden text-sm font-semibold text-tea lg:inline">
      Oylarım ({count})
    </span>
  );
}
