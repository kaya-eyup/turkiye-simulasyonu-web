import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { surveyQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";
import { RebirthVoteForm } from "./RebirthVoteForm";
import { RebirthResults } from "./RebirthResults";

export function RebirthSurveyPage() {
  // null = bu tarayıcı henüz oy vermedi
  const myVote = useQuery(surveyQueries.myVote());
  const [editing, setEditing] = useState(false);

  return (
    <section
      aria-labelledby="survey-heading"
      className="rounded-2xl border border-line bg-surface px-4 py-8 sm:px-10 sm:py-10"
    >
      <header className="mb-8 text-center">
        <h1 id="survey-heading" className="text-3xl text-flag sm:text-5xl">
          Bir sonraki hayatında hangi ülkede doğmak isterdin?
        </h1>
        <p className="mt-2 text-lg text-muted">
          Simülasyonu yeniden başlatma hakkın olsaydı…
        </p>
      </header>

      {myVote.isPending && (
        <p className="text-center text-muted">Yükleniyor…</p>
      )}

      {myVote.isError && (
        <ErrorState
          message={toUserMessage(myVote.error)}
          onRetry={() => myVote.refetch()}
          isRetrying={myVote.isFetching}
        />
      )}

      {/* Sonuçlar oy vermeden gösterilmez: önce gören, çoğunluğa kayar */}
      {myVote.isSuccess &&
        (myVote.data === null || editing ? (
          <RebirthVoteForm
            initialCountry={myVote.data?.country ?? null}
            onVoted={() => setEditing(false)}
            onCancel={editing ? () => setEditing(false) : undefined}
          />
        ) : (
          <RebirthResults
            myCountry={myVote.data.country}
            onChangeVote={() => setEditing(true)}
          />
        ))}
    </section>
  );
}
