import { useVotesDispatch } from "./votesContext";
import type { Stars } from "./votesReducer";

type VoteButtonsProps = {
  itemId: string;
  current: Stars | undefined;
};

const STARS: Stars[] = [1, 2, 3, 4, 5];

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
                current === stars ? "var(--color-primary)" : "transparent",
              color: current === stars ? "white" : "inherit",
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
          style={{ marginTop: "12px", fontSize: "0.9rem", color: "red" }}
        >
          Oyumu geri al
        </button>
      )}
    </div>
  );
}
