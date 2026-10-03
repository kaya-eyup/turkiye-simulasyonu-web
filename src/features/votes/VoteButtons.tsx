import { useVotesDispatch } from "./votesContext";
import { STARS } from "./votesReducer";
import type { Stars } from "./votesReducer";

type VoteButtonsProps = {
  itemId: string;
  current: Stars | undefined;
};

export function VoteButtons({ itemId, current }: VoteButtonsProps) {
  const dispatch = useVotesDispatch();

  return (
    <div role="group" aria-label="Puanın" style={{ marginTop: "1.5rem" }}>
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        {current ? `Senin oyun: ${current}★` : "Henüz oy vermedin"}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {STARS.map((stars) => (
          <button
            key={stars}
            type="button"
            aria-pressed={current === stars}
            onClick={() => dispatch({ type: "voted", itemId, stars })}
            style={{
              backgroundColor:
                current === stars ? "var(--color-accent)" : "transparent",
              color: current === stars ? "var(--color-on-accent)" : "inherit",
            }}
          >
            {stars}★
          </button>
        ))}
      </div>

      {current && (
        <button
          type="button"
          onClick={() => dispatch({ type: "vote_removed", itemId })}
          style={{
            marginTop: "12px",
            fontSize: "0.9rem",
            color: "var(--color-danger)",
          }}
        >
          Oyumu geri al
        </button>
      )}
    </div>
  );
}
