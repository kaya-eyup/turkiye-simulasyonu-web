import { useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import { slugSchema } from  "../../shared/api/schemas";
import { itemQueries } from '../../shared/api/queries';
import { toUserMessage } from '../../shared/api/client';
import { NotFoundPage } from '../../shared/ui/NotFoundPage'; 
import { CategoryLink } from './CategoryLink';
import { RatingBars } from './RatingBars';

function ItemView({ id }: { id: string }) {
  const { data: item, isPending, isError, error, refetch } = useQuery(
    itemQueries.detail(id)
  );

  if (isPending) return <p>Yükleniyor...</p>;

  if (isError) {
    return (
      <div className="error-container">
        <p>{toUserMessage(error)}</p>
        <button onClick={() => refetch()}>Tekrar dene</button>
      </div>
    );
  }

  if (!item) return <NotFoundPage />;

  return (
    <article className="item-detail-container">
      <header>
        <div style={{ fontSize: '4rem' }}>{item.emoji}</div>
        <h1>{item.name}</h1>
        {/* Bağımlı bileşeni çağırıyoruz */}
        <CategoryLink categoryId={item.categoryId} />
      </header>
      
      <p className="item-summary">{item.summary}</p>
      
      <section className="item-ratings">
        {/* Adım 0.3'te yazdığımız bileşen */}
        <RatingBars distribution={item.distribution} />
      </section>
    </article>
  );
}

export function ItemPage() {
  const { id } = useParams<{ id: string }>();
  
  // URL parametresini sınırda doğrula (Boundary Validation)
  const parsed = slugSchema.safeParse(id);

  if (!parsed.success) {
    return <NotFoundPage />;
  }

  // Tipli ve güvenli ID'yi View bileşenine ver
  return <ItemView id={parsed.data} />;
}