import { Link } from "react-router";

interface PaginationProps {
  page: number;
  totalPages: number;
  getHref: (page: number) => string;
}

// Çok sayfalı aramada bütün numaraları çizmek yerine bir pencere:
// 1 … 48 49 [50] 51 52 … 100
// 1224 öğede "a" araması ~100 sayfa eder; hepsini basmak hem çirkin hem gereksiz.
function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  const AROUND = 2; // bulunduğun sayfanın iki yanı

  // Set: ilk/son sayfa pencereyle çakışınca tekrarı kendisi eler
  const shown = new Set<number>([1, totalPages]);

  for (let p = page - AROUND; p <= page + AROUND; p++) {
    if (p >= 1 && p <= totalPages) shown.add(p);
  }

  const sorted = [...shown].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  let previous: number | undefined;

  for (const current of sorted) {
    // İki komşu numara arasındaki fark 1'den büyükse arada atlanan sayfalar var
    if (previous !== undefined && current - previous > 1) result.push("gap");
    result.push(current);
    previous = current;
  }

  return result;
}

export function Pagination({ page, totalPages, getHref }: PaginationProps) {
  // Tek sayfa veya sonuç yoksa sayfalama çizilmez
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav aria-label="Sayfalama" className="mt-6 flex flex-wrap gap-2">
      {/* Önceki: 1. sayfadaysak Link değil span (gidecek yer yok) */}
      {page > 1 ? (
        <Link to={getHref(page - 1)} className="btn">
          Önceki
        </Link>
      ) : (
        <span className="btn cursor-not-allowed opacity-50">Önceki</span>
      )}

      {pages.map((p, index) =>
        p === "gap" ? (
          // Atlanan sayfalar; ekran okuyucuya "üç nokta" diye okutmanın faydası yok
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="flex min-w-9 items-center justify-center text-muted"
          >
            …
          </span>
        ) : p === page ? (
          // Bulunduğumuz sayfa: Link değil; ekran okuyucu için aria-current="page"
          <span
            key={p}
            aria-current="page"
            className="btn min-w-9 border-ink bg-ink text-page"
          >
            {p}
          </span>
        ) : (
          <Link key={p} to={getHref(p)} className="btn min-w-9">
            {p}
          </Link>
        ),
      )}

      {/* Sonraki: son sayfadaysak Link değil span */}
      {page < totalPages ? (
        <Link to={getHref(page + 1)} className="btn">
          Sonraki
        </Link>
      ) : (
        <span className="btn cursor-not-allowed opacity-50">Sonraki</span>
      )}
    </nav>
  );
}
