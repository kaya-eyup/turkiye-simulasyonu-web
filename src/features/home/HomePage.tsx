import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { categoryQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";

export function HomePage() {
  const {
    data: categories,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(categoryQueries.list());

  return (
    <div className="home-page">
      <h1>Türkiye Simülasyonu</h1>
      <p>Hoş geldin! Bir kategori seçerek başla:</p>

      <section
        aria-labelledby="categories-heading"
        style={{ marginTop: "2rem" }}
      >
        <h2 id="categories-heading">Kategoriler</h2>

        {isPending && <p>Kategoriler yükleniyor…</p>}

        {isError && (
          <ErrorState
            message={toUserMessage(error)}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        )}

        {!isPending && !isError && categories.length === 0 && (
          <p>Henüz kategori yok.</p>
        )}

        {!isPending && !isError && categories.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/kategori/${c.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem 1.5rem",
                    border: "1px solid var(--color-accent)",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                    {c.emoji}
                  </span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Adım 6 için bekleyen Haftanın Seçilmişleri bölümü */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Haftanın Seçilmişleri</h2>
        <p>Çok yakında...</p>
      </section>
    </div>
  );
}
