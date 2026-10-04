import { useMyVotes } from "./votesContext";

export function MyVotesBadge() {
  const votes = useMyVotes();
  const count = Object.keys(votes).length;

  if (count === 0) return null;

  return (
    <span className="hidden text-sm font-semibold text-tea lg:inline">
      Oylarım ({count})
    </span>
  );
}
