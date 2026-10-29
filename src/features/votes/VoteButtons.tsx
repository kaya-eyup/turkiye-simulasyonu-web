import { toUserMessage } from "../../shared/api/client";
import { STARS } from "../../shared/api/schemas";
import { useMyItemVote } from "./useMyItemVote";

export function VoteButtons({ itemId }: { itemId: string }) {
  const { current, isLoading, vote, isVoting, voteError } =
    useMyItemVote(itemId);

  // Oy bilinmeden düğmeler açılmaz: hangisinin seçili olduğu görünmeden
  // tıklanırsa kullanıcı var olan oyunu farkında olmadan değiştirebilir
  const disabled = isLoading || isVoting;

  return (
    <div role="group" aria-label="Puanın">
      <h2 className="mb-3 text-xl">Senin puanın</h2>
      <p className="mb-3 text-sm text-muted">
        {isLoading
          ? "Oyun okunuyor…"
          : current
            ? `Oyun: ${current} ★`
            : "Henüz oy vermedin."}
      </p>

      <div className="flex flex-wrap gap-2">
        {STARS.map((stars) => (
          <button
            key={stars}
            type="button"
            disabled={disabled}
            aria-pressed={current === stars}
            onClick={() => vote(stars)}
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
          disabled={disabled}
          onClick={() => vote(null)}
          className="mt-4 cursor-pointer text-sm text-danger underline-offset-4 hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-60"
        >
          Oyumu geri al
        </button>
      )}

      {isVoting && <p className="mt-3 text-sm text-muted">Gönderiliyor…</p>}

      {voteError && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {toUserMessage(voteError)}
        </p>
      )}
    </div>
  );
}
