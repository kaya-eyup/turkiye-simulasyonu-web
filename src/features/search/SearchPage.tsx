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
import { ItemCard } from "../items/ItemCard";
import { Pagination } from "./Pagination";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Tek Kaynak: State yok, doğrudan URL okunur
  const rawQ = searchParams.get(SEARCH_PARAMS.query) ?? "";
  const q = parseQuery(rawQ);
  const page = parsePage(searchParams.get(SEARCH_PARAMS.page));

  // 2. Debounce edilen değer artık kullanıcı girdisi değil, API'ye gidecek sorgudur
  const debouncedQ = useDebounce(q, 300);

  // 3. Effect yerine Event Handler: Sayfa sıfırlama vs. kullanıcı olayının (yazmanın) sonucudur
  function handleChange(value: string) {
    setSearchParams(
      (prev) => {
        if (value === "") {
          prev.delete(SEARCH_PARAMS.query);
        } else {
          prev.set(SEARCH_PARAMS.query, value);
        }
        prev.delete(SEARCH_PARAMS.page); // Arama değişince sayfayı 1'e döndür (sil)
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
  // 4. API'ye giden istekte debouncedQ (gecikmeli metin) kullanılır
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
    <div className="search-page-container">
      <div className="search-header">
        <input
          aria-label="Ara"
          type="text"
          value={rawQ}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Öğe ara (Örn: Çiğ Köfte)..."
          autoFocus
          maxLength={MAX_QUERY_LENGTH}
          className="search-input"
        />
      </div>

      <div className="search-results">
        {q === "" ? (
          <p>Aramak için yazmaya başla</p>
        ) : debouncedQ === "" ? (
          <p>Aranıyor…</p>
        ) : isPending ? (
          <p>Yükleniyor...</p>
        ) : isError ? (
          <ErrorState
            message={toUserMessage(error)}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : data.total === 0 ? (
          <p>Sonuç bulunamadı</p>
        ) : (
          <>
            <p className="results-count">{data.total} sonuç bulundu</p>
            <div
              className="item-grid"
              style={{
                opacity: isPlaceholderData ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {data.items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={data.totalPages}
              getHref={getHref}
            />
          </>
        )}
      </div>
    </div>
  );
}
