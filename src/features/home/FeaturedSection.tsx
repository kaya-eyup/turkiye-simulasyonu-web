import { useQuery } from "@tanstack/react-query";
import { itemQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";
import { ItemGrid } from "../items/ItemGrid";

export function FeaturedSection() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(
    itemQueries.featured(),
  );

  return (
    <section aria-labelledby="featured-heading" className="mb-10">
      <h2 id="featured-heading">Haftanın Seçilmişleri</h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        Bu hafta en çok konuşulanlara göz atın ve yorumlayın.
      </p>

      {isPending && <p className="text-muted">Yükleniyor…</p>}

      {isError && (
        <ErrorState
          message={toUserMessage(error)}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}

      {!isPending && !isError && data.length === 0 && (
        <p className="text-muted">Henüz gösterilecek öğe yok.</p>
      )}

      {!isPending && !isError && data.length > 0 && (
        <ItemGrid items={data} layout="featured" />
      )}
    </section>
  );
}
