import type { Item } from "../../shared/api/schemas";
import { applyMyVote } from "./applyMyVote";
import { useMyVotes } from "./votesContext";

export function useDisplayedDistribution(
  item: Pick<Item, "id" | "distribution">,
): Item["distribution"] {
  const myVote = useMyVotes()[item.id];
  return applyMyVote(item.distribution, myVote);
}
