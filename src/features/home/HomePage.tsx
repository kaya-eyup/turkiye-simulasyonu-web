import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { categoryQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";
import flagUrl from "../../assets/tr-flag.svg";

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
    <div>
      <header className="mb-12 flex items-start gap-4 sm:gap-6">
        {/* Bayrak süs: yanındaki başlık "Türkiye" diyor, ekran okuyucu tekrar etmesin */}
        <img
          src={flagUrl}
          alt=""
          className="mt-1.5 h-10 w-auto rounded-[3px] sm:mt-2 sm:h-14"
        />
        <div>
          <h1 className="font-condensed text-5xl leading-none font-bold sm:text-7xl">
            Türkiye Simülasyonu
          </h1>
          <p className="mt-3 max-w-[38ch] text-lg text-muted">
            Tebrikler, Türkiye simülasyonunu tamamladınız. Geri bildiriminizi
            bekliyoruz.
          </p>
        </div>
      </header>
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
    </div>
  );
}
