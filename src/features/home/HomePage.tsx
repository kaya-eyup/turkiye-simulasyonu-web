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
        <h2 id="categories-heading" className="mb-4">
          Kategoriler
        </h2>

        {isPending && <p className="text-muted">Kategoriler yükleniyor…</p>}

        {isError && (
          <ErrorState
            message={toUserMessage(error)}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        )}

        {!isPending && !isError && categories.length === 0 && (
          <p className="text-muted">Henüz kategori yok.</p>
        )}

        {!isPending && !isError && categories.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/kategori/${c.id}`}
                  className="flex h-full flex-col gap-3 rounded-lg border border-line bg-surface p-4 hover:border-ink"
                >
                  <span aria-hidden="true" className="text-3xl">
                    {c.emoji}
                  </span>
                  <span className="font-condensed text-xl leading-tight font-semibold">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
