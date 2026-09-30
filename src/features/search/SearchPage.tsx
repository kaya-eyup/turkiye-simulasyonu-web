import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { itemQueries } from '../../shared/api/queries';
import { parseQuery, parsePage, SEARCH_PARAMS, MAX_QUERY_LENGTH } from './searchParams';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { ErrorState } from '../../shared/ui/ErrorState';
import { toUserMessage } from '../../shared/api/client'; 
import { ItemCard } from '../items/ItemCard';

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
    setSearchParams((prev) => {
      if (value === "") {
        prev.delete(SEARCH_PARAMS.query);
      } else {
        prev.set(SEARCH_PARAMS.query, value);
      }
      prev.delete(SEARCH_PARAMS.page); // Arama değişince sayfayı 1'e döndür (sil)
      return prev;
    }, { replace: true });
  }

  // 4. API'ye giden istekte debouncedQ (gecikmeli metin) kullanılır
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(
    itemQueries.search({ q: debouncedQ, page })
  );

  return (
    <div className="search-page-container">
      <div className="search-header">
        {/* Hocanın tuzağı: Input q'ya değil rawQ'ya bağlanır. Yoksa yazılan boşluklar anında silinir. */}
        <input
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
        {/* Boş arama kontrolü "q" ile yapılır. Kutu boşaltıldığında 300ms beklemeden "yazmaya başla" der. */}
        {q === "" ? (
          <p>Aramak için yazmaya başla</p>
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
            <div className="item-grid">
              {data.items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}