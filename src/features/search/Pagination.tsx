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
    <nav
      aria-label="Sayfalama"
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginTop: "1rem",
      }}
    >
      {/* Önceki Butonu: 1. sayfadaysak Link değil Span olur (disabled mantığı) */}
      {page > 1 ? (
        <Link to={getHref(page - 1)}>Önceki</Link>
      ) : (
        <span style={{ color: "#999", cursor: "not-allowed" }}>Önceki</span>
      )}

      {/* Sayfa Numaraları */}
      {pages.map((p) => {
        const isCurrentPage = p === page;

        return isCurrentPage ? (
          // Bulunduğumuz sayfa: Link değil, kalın font ve ekran okuyucu için aria-current="page"
          <span
            key={p}
            aria-current="page"
            style={{ fontWeight: "bold", padding: "0 4px" }}
          >
            {p}
          </span>
        ) : (
          <Link key={p} to={getHref(p)} style={{ padding: "0 4px" }}>
            {p}
          </Link>
        );
      })}

      {/* Sonraki Butonu: Son sayfadaysak Link değil Span olur */}
      {page < totalPages ? (
        <Link to={getHref(page + 1)}>Sonraki</Link>
      ) : (
        <span style={{ color: "#999", cursor: "not-allowed" }}>Sonraki</span>
      )}
    </nav>
  );
}
