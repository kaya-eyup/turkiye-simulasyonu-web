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
    <div role="group" aria-label="Puanın">
      <h2 className="mb-3 text-xl">Senin puanın</h2>
      <p className="mb-3 text-sm text-muted">
        {current ? `Oyun: ${current} ★` : "Henüz oy vermedin."}
      </p>

      <div className="flex flex-wrap gap-2">
        {STARS.map((stars) => (
          <button
            key={stars}
            type="button"
            aria-pressed={current === stars}
            onClick={() => dispatch({ type: "voted", itemId, stars })}
            // Görünüş aria-pressed'den türüyor: ekran okuyucunun duyduğuyla gözün gördüğü ayrışamaz
            className="btn min-w-12 aria-pressed:border-tea aria-pressed:bg-tea aria-pressed:text-on-tea"
          >
            {stars} ★
          </button>
        ))}
      </div>

      {current && (
        <button
          type="button"
          onClick={() => dispatch({ type: "vote_removed", itemId })}
          className="mt-4 cursor-pointer text-sm text-danger underline-offset-4 hover:underline"
        >
          Oyumu geri al
        </button>
      )}
    </div>
  );
}
