import { useMyVotes } from "./votesContext";

export function MyVotesBadge() {
  const votes = useMyVotes();
  const count = Object.keys(votes).length;

  if (count === 0) return null;

  return (
    <span className="text-sm font-semibold text-tea">Oylarım ({count})</span>
  );
}
