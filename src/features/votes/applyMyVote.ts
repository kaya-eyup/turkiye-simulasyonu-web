import type { Item } from "../../shared/api/schemas";
import type { Stars } from "./votesReducer";

export function applyMyVote(
  distribution: Item["distribution"],
  myVote: Stars | undefined,
): Item["distribution"] {
  // Oyu yoksa orijinal diziyi (referansıyla birlikte) dön ki gereksiz render olmasın
  if (myVote === undefined) return distribution;

  const newDistribution = distribution.map((count, index) =>
    index === myVote - 1 ? count + 1 : count,
  );

  return newDistribution as Item["distribution"];
}
