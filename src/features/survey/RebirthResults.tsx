import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { surveyQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";
import { countryName, flagEmoji } from "./countries";
import { DonutChart } from "./DonutChart";
import {
  TOP_COUNT,
  formatCount,
  formatPercent,
  groupResults,
  type Slice,
} from "./groupResults";

type RebirthResultsProps = {
  myCountry: string;
  onChangeVote: () => void;
};

export function RebirthResults({
  myCountry,
  onChangeVote,
}: RebirthResultsProps) {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(
    surveyQueries.results(),
  );
  // Halka ile liste aynı seçimi paylaşır: birinin üzerine gelmek ikisini de vurgular
  const [activeKey, setActiveKey] = useState<string | null>(null);

  if (isPending) {
    return <p className="text-center text-muted">Oylar sayılıyor…</p>;
  }

  if (isError) {
    return (
      <ErrorState
        message={toUserMessage(error)}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const slices = groupResults(data, myCountry);
  const topCount = Math.min(TOP_COUNT, data.results.length);
  const maxCount = Math.max(...slices.map((s) => s.count), 1);

  return (
    <div>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <DonutChart
          slices={slices}
          total={data.total}
          activeKey={activeKey}
          onActiveChange={setActiveKey}
        />

        <div>
          <h2 className="mb-1">En çok oy alan {topCount} ülke</h2>
          <p className="mb-4 text-sm text-muted">
            Toplam {formatCount(data.total)} oy
          </p>
          <ol>
            {slices.map((slice, index) => (
              <ResultRow
                key={slice.key}
                slice={slice}
                maxCount={maxCount}
                isActive={slice.key === activeKey}
                // İlk 5'ten sonraki satırlar (Türkiye, Diğer) çizgiyle ayrılır
                startsExtras={index === topCount}
                onActiveChange={setActiveKey}
              />
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 text-center sm:flex-row sm:text-left">
        <p className="text-muted">
          Oyun alındı:{" "}
          <span className="font-semibold text-ink">
            {flagEmoji(myCountry)} {countryName(myCountry)}
          </span>
          . Başvurun bir sonraki hayatında değerlendirilecek.
        </p>
        <button type="button" onClick={onChangeVote} className="btn shrink-0">
          Oyumu değiştir
        </button>
      </div>
    </div>
  );
}

type ResultRowProps = {
  slice: Slice;
  maxCount: number;
  isActive: boolean;
  startsExtras: boolean;
  onActiveChange: (key: string | null) => void;
};

function ResultRow({
  slice,
  maxCount,
  isActive,
  startsExtras,
  onActiveChange,
}: ResultRowProps) {
  return (
    <li
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onActiveChange(slice.key);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onActiveChange(null);
      }}
      className={`grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-md px-2 py-2 ${
        isActive ? "bg-track" : ""
      } ${startsExtras ? "mt-2 rounded-t-none border-t border-dashed border-line pt-3" : ""}`}
    >
      <span aria-hidden="true" className="text-center text-2xl leading-none">
        {slice.code ? flagEmoji(slice.code) : "🌍"}
      </span>

      <span className="flex min-w-0 items-center gap-2">
        {slice.rank !== null && (
          <span className="text-sm text-muted tabular-nums">{slice.rank}.</span>
        )}
        <span className="truncate font-medium">{slice.name}</span>
        {slice.isMine && (
          <span className="shrink-0 rounded bg-tea px-1.5 py-0.5 text-xs font-semibold text-on-tea">
            senin oyun
          </span>
        )}
      </span>

      <span className="text-right font-semibold tabular-nums">
        {formatPercent(slice.percent)}
      </span>

      {/* İkinci satır: çubuk + oy sayısı. Çubuk süs, sayı zaten yazıyor */}
      <span
        aria-hidden="true"
        className="col-start-2 h-1.5 overflow-hidden rounded-full bg-track"
      >
        <span
          className="block h-full rounded-full"
          // Genişlik ve renk çalışma anında: Tailwind sınıfı olamaz
          style={{
            width: `${(slice.count / maxCount) * 100}%`,
            background: slice.color,
          }}
        />
      </span>
      <span className="text-right text-sm text-muted tabular-nums">
        {formatCount(slice.count)} oy
      </span>
    </li>
  );
}
