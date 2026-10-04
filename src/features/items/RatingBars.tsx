import { summarize } from "../../shared/lib/rating";
import type { Item } from "../../shared/api/schemas";

interface RatingBarsProps {
  distribution: Item["distribution"];
}

export function RatingBars({ distribution }: RatingBarsProps) {
  const { average, total, rows } = summarize(distribution);

  const displayRows = [...rows].reverse();

  return (
    <div>
      <h2 className="mb-3 text-xl">Puan Dağılımı</h2>

      {average !== null ? (
        <p className="mb-4 flex items-baseline gap-2">
          <span className="font-condensed text-5xl leading-none font-bold">
            {average.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
          </span>
          <span className="text-muted">
            {total.toLocaleString("tr-TR")} değerlendirme
          </span>
        </p>
      ) : (
        <p className="mb-4 text-muted">Henüz oy yok</p>
      )}

      <ul className="space-y-1.5">
        {displayRows.map((row) => (
          <li key={row.stars} className="flex items-center gap-3 text-sm">
            <span aria-label={`${row.stars} yıldız`} className="w-8 shrink-0">
              {row.stars} ★
            </span>

            {/* Çubuk süs: yüzde zaten yanında yazıyor */}
            <div
              aria-hidden="true"
              className="h-2 flex-1 rounded-full bg-track"
            >
              {/* Genişlik çalışma anında hesaplanıyor: Tailwind sınıfı olamaz, satır içi stil kalır */}
              <div
                className="h-full rounded-full bg-tea"
                style={{ width: `${row.percent}%` }}
              />
            </div>

            <span className="w-10 shrink-0 text-right text-muted tabular-nums">
              {(row.percent / 100).toLocaleString("tr-TR", {
                style: "percent",
                maximumFractionDigits: 0,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
