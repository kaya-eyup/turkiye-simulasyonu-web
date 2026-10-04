import { Link } from "react-router";

interface PaginationProps {
  page: number;
  totalPages: number;
  getHref: (page: number) => string;
}

export function Pagination({ page, totalPages, getHref }: PaginationProps) {
  // Tek sayfa veya sonuç yoksa sayfalama çizilmez
  if (totalPages <= 1) return null;

  // 1'den totalPages'a kadar sayı dizisi oluşturur (Örn: [1, 2, 3, 4, 5])
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

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

      {pages.map((p) =>
        p === page ? (
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
