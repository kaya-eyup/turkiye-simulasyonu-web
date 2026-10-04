import { useSearchParams, Navigate } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { itemQueries } from "../../shared/api/queries";
import {
  parseQuery,
  parsePage,
  SEARCH_PARAMS,
  MAX_QUERY_LENGTH,
} from "./searchParams";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { ErrorState } from "../../shared/ui/ErrorState";
import { toUserMessage } from "../../shared/api/client";
import { ItemGrid } from "../items/ItemGrid";
import { Pagination } from "./Pagination";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawQ = searchParams.get(SEARCH_PARAMS.query) ?? "";
  const q = parseQuery(rawQ);
  const page = parsePage(searchParams.get(SEARCH_PARAMS.page));

  // Gecikme URL'ye değil sorguya uygulanıyor: input URL'yi anında günceller (geri tuşu ve yenileme tutarlı kalır), sunucuya giden istek ise yazma bitince gider.
  const debouncedQ = useDebounce(q, 300);

  function handleChange(value: string) {
    setSearchParams(
      (prev) => {
        if (value === "") {
          prev.delete(SEARCH_PARAMS.query);
        } else {
          prev.set(SEARCH_PARAMS.query, value);
        }
        // Yeni aramada sayfa 1'e dön. Kural olay yöneticisinde, çünkü "kullanıcı yazdı" bir olay; effect'te olsaydı URL'den gelen her değişimde (geri tuşu dahil) sayfa sıfırlanırdı.
        prev.delete(SEARCH_PARAMS.page);
        return prev;
      },
      { replace: true },
    );
  }
  function getHref(targetPage: number) {
    const params = new URLSearchParams(searchParams);
    if (targetPage <= 1) {
      params.delete(SEARCH_PARAMS.page);
    } else {
      params.set(SEARCH_PARAMS.page, targetPage.toString());
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "?";
  }
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    ...itemQueries.search({ q: debouncedQ, page }),
    placeholderData: keepPreviousData,
  });
  if (
    !isPlaceholderData &&
    data &&
    data.totalPages > 0 &&
    page > data.totalPages
  ) {
    return <Navigate to={getHref(data.totalPages)} replace />;
  }
  return (
    <div>
      <input
        aria-label="Ara"
        type="text"
        value={rawQ}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Öğe ara (Örn: Çiğ Köfte)…"
        autoFocus
        maxLength={MAX_QUERY_LENGTH}
        className="mb-6 h-12 w-full rounded-md border border-line bg-surface px-4 text-lg placeholder:text-muted"
      />

      {q === "" ? (
        <p className="text-muted">Aramak için yazmaya başla.</p>
      ) : debouncedQ === "" ? (
        <p className="text-muted">Aranıyor…</p>
      ) : isPending ? (
        <p className="text-muted">Yükleniyor…</p>
      ) : isError ? (
        <ErrorState
          message={toUserMessage(error)}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : data.total === 0 ? (
        <p className="text-muted">Sonuç bulunamadı.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted">{data.total} sonuç bulundu</p>
          {/* Yeni sayfa gelirken eski sonuçlar soluk kalır; aria-busy ekran okuyucuya "güncelleniyor" der */}
          <div
            aria-busy={isPlaceholderData}
            className={
              isPlaceholderData
                ? "opacity-50 transition-opacity"
                : "transition-opacity"
            }
          >
            <ItemGrid items={data.items} />
          </div>
          <Pagination
            page={page}
            totalPages={data.totalPages}
            getHref={getHref}
          />
        </>
      )}
    </div>
  );
}
