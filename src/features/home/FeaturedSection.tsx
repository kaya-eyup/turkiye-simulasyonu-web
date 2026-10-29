import { useQuery } from "@tanstack/react-query";
import { itemQueries } from "../../shared/api/queries";
import { toUserMessage } from "../../shared/api/client";
import { ErrorState } from "../../shared/ui/ErrorState";
import { SectionHeader } from "../../shared/ui/SectionHeader";
import { ItemGrid } from "../items/ItemGrid";

export function FeaturedSection() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(
    itemQueries.featured(),
  );

  return (
    <section aria-labelledby="featured-heading" className="py-8 sm:py-10">
      <SectionHeader
        id="featured-heading"
        title="Haftanın Seçilmişleri"
        description="Bu hafta en çok konuşulanlara göz atın ve yorumlayın."
      />

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
