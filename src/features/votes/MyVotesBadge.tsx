import { useMyVotes } from "./votesContext";

export function MyVotesBadge() {
  const votes = useMyVotes();
  const count = Object.keys(votes).length;

  if (count === 0) return null;

  return (
    <span
      style={{
        fontSize: "0.9rem",
        fontWeight: "bold",
        color: "var(--color-primary)",
      }}
    >
      Oylarım ({count})
    </span>
  );
}
