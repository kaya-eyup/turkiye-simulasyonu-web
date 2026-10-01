import { useReducer, useEffect, type ReactNode } from "react";
import { readStorage, writeStorage } from "../../shared/lib/storage";
import { votesReducer, VOTES_STORAGE_KEY, myVotesSchema } from "./votesReducer";
import { VotesStateContext, VotesDispatchContext } from "./votesContext";

export function VotesProvider({ children }: { children: ReactNode }) {
  const [votes, dispatch] = useReducer(
    votesReducer,
    null as unknown, // initial argument (initializer olduğu için dikkate alınmaz)
    () => readStorage(VOTES_STORAGE_KEY, myVotesSchema) ?? {},
  );

  // State her değiştiğinde (referansı değiştiğinde) kayda yazılır
  useEffect(() => {
    writeStorage(VOTES_STORAGE_KEY, votes);
  }, [votes]);

  // useMemo'ya gerek yok çünkü 'votes' zaten referans eşitliği kurallarıyla
  // sadece gerçekten değiştiğinde yeni nesne oluyor. 'dispatch' ise hep sabit.
  return (
    <VotesStateContext value={votes}>
      <VotesDispatchContext value={dispatch}>{children}</VotesDispatchContext>
    </VotesStateContext>
  );
}
