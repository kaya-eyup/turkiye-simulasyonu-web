import { useId, useState, type SubmitEvent } from "react";
import { toUserMessage } from "../../shared/api/client";
import {
  ALL_COUNTRIES,
  POPULAR_COUNTRIES,
  flagEmoji,
  shortCountryName,
} from "./countries";
import { useRebirthVote } from "./useRebirthVote";

type RebirthVoteFormProps = {
  initialCountry: string | null; // oy değiştirilirken mevcut oy seçili gelir
  onVoted: () => void;
  onCancel?: () => void; // sadece oy değiştirirken var
};

export function RebirthVoteForm({
  initialCountry,
  onVoted,
  onCancel,
}: RebirthVoteFormProps) {
  // Tek kaynak: çip de liste de aynı değeri okur ve yazar
  const [selected, setSelected] = useState(initialCountry ?? "");
  const [showMissing, setShowMissing] = useState(false);
  const vote = useRebirthVote();
  const id = useId();

  function choose(code: string) {
    setSelected(code);
    setShowMissing(false);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    // Düğme kapatılmıyor: basınca neyin eksik olduğunu söylemek, sessiz bir gri düğmeden iyidir
    if (!selected) {
      setShowMissing(true);
      return;
    }
    vote.mutate(selected, { onSuccess: onVoted });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-4xl">
      <fieldset>
        <legend className="sr-only">Popüler ülkeler</legend>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {POPULAR_COUNTRIES.map((code) => (
            <li key={code}>
              <button
                type="button"
                aria-pressed={selected === code}
                onClick={() => choose(code)}
                // Seçili görünüm aria-pressed'den: ekran okuyucunun duyduğuyla gözün gördüğü ayrışamaz
                className="btn h-12 w-full justify-start gap-3 text-base aria-pressed:border-flag aria-pressed:ring-1 aria-pressed:ring-flag"
              >
                <span aria-hidden="true" className="text-2xl leading-none">
                  {flagEmoji(code)}
                </span>
                <span className="truncate">{shortCountryName(code)}</span>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-country`} className="sr-only">
          Tüm ülkeler
        </label>
        <select
          id={`${id}-country`}
          value={selected}
          onChange={(e) => choose(e.target.value)}
          aria-invalid={showMissing}
          aria-describedby={showMissing ? `${id}-missing` : undefined}
          className="h-12 min-w-0 flex-1 cursor-pointer rounded-md border border-line bg-page px-3 text-base aria-[invalid=true]:border-danger"
        >
          <option value="">
            Listede yok mu? {ALL_COUNTRIES.length} ülkenin hepsi burada
          </option>
          {ALL_COUNTRIES.map(({ code, name }) => (
            <option key={code} value={code}>
              {flagEmoji(code)} {name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={vote.isPending}
          className="btn btn-primary h-12 px-8 text-base"
        >
          {vote.isPending ? "Gönderiliyor…" : "Onayla"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn h-12">
            Vazgeç
          </button>
        )}
      </div>

      {showMissing && (
        <p
          id={`${id}-missing`}
          role="alert"
          className="mt-2 text-sm text-danger"
        >
          Önce bir ülke seç.
        </p>
      )}
      {vote.isError && (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">
          {toUserMessage(vote.error)}
        </p>
      )}
    </form>
  );
}
