import { createContext, useContext, type Dispatch } from "react";
import type { MyVotes, VoteAction } from "./votesReducer";

export const VotesStateContext = createContext<MyVotes | null>(null);
export const VotesDispatchContext = createContext<Dispatch<VoteAction> | null>(
  null,
);

export function useMyVotes(): MyVotes {
  const value = useContext(VotesStateContext);
  if (value === null) {
    throw new Error("useMyVotes, VotesProvider içinde kullanılmalı");
  }
  return value;
}

export function useVotesDispatch(): Dispatch<VoteAction> {
  const value = useContext(VotesDispatchContext);
  if (value === null) {
    throw new Error("useVotesDispatch, VotesProvider içinde kullanılmalı");
  }
  return value;
}
