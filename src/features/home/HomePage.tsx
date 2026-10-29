import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { categoryQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";
import { SectionHeader } from "../../shared/ui/SectionHeader";
import { FeaturedSection } from "./FeaturedSection";
import flagUrl from "../../assets/tr-flag.svg";
import { SurveyTeaser } from "./SurveyTeaser";

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
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <img
            src={flagUrl}
            alt=""
            className="h-7 w-auto shrink-0 rounded-[3px] sm:h-12"
          />
          <h1 className="font-condensed text-4xl leading-none font-bold sm:text-7xl">
            Türkiye Simülasyonu
          </h1>
          <img
            src={flagUrl}
            alt=""
            className="h-7 w-auto shrink-0 rounded-[3px] sm:h-12"
          />
        </div>
        {/* Her cümle kendi satırında: "block" ile zorlanıyor, dar ekranda cümle içinde kendiliğinden kırılıyor */}
        <p className="mx-auto mt-4 max-w-[70ch] text-lg text-muted">
          <span className="block">
            Tebrikler! Türkiye simülasyonunu başarıyla tamamladınız.
          </span>
          <span className="block">
            Deneyimlerinizi iyileştirmek için geri bildirimlerinizi bekliyoruz.
          </span>
        </p>
      </header>

      <FeaturedSection />

      <section aria-labelledby="categories-heading" className="py-8 sm:py-10">
        <SectionHeader
          id="categories-heading"
          title="Kategoriler"
          description="Simülasyonun ana modülleri. Hiçbiri kapatılamaz."
        />

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
                {/* group: emoji, kartın tamamının üstüne gelindiğinde büyüsün */}
                <Link
                  to={`/kategori/${c.id}`}
                  className="group flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 py-7 text-center transition hover:border-ink"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-16 items-center justify-center rounded-full bg-track text-4xl transition-transform group-hover:scale-110"
                  >
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
      <SurveyTeaser />
    </div>
  );
}
