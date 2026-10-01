import { summarize } from "../../shared/lib/rating";
import type { Item } from "../../shared/api/schemas";

interface RatingBarsProps {
  distribution: Item["distribution"];
}

export function RatingBars({ distribution }: RatingBarsProps) {
  const { average, total, rows } = summarize(distribution);

  const displayRows = [...rows].reverse();

  return (
    <div className="rating-bars-container">
      <div className="rating-summary">
        <h2>Puan Dağılımı</h2>

        {average !== null ? (
          <>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", margin: "4px 0" }}
            >
              {average.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
            </p>
            <p>{total.toLocaleString("tr-TR")} değerlendirme</p>
          </>
        ) : (
          <p>Henüz oy yok</p>
        )}
      </div>

      <div className="bars-list">
        {displayRows.map((row) => (
          <div
            key={row.stars}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span
              aria-label={`${row.stars} yıldız`}
              style={{ minWidth: "40px" }}
            >
              {row.stars} ★
            </span>

            <div
              style={{
                flex: 1,
                backgroundColor: "var(--color-track)",
                height: "8px",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  width: `${row.percent}%`,
                  backgroundColor: "var(--color-accent)",
                  height: "100%",
                  borderRadius: "4px",
                }}
              />
            </div>

            <span style={{ minWidth: "45px", textAlign: "right" }}>
              {(row.percent / 100).toLocaleString("tr-TR", {
                style: "percent",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
