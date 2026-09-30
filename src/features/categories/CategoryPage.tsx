import { useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import { slugSchema } from '../../shared/api/schemas';
import { categoryQueries, itemQueries } from '../../shared/api/queries';
import { NotFoundPage } from '../../shared/ui/NotFoundPage';
import { ItemCard } from '../items/ItemCard'; 
import { summarize } from '../../shared/lib/rating';
import { toUserMessage } from '../../shared/api/client';
function CategoryView({ slug }: { slug: string }) {
  // 1. İki sorgudan da isError, error, refetch ve isFetching durumlarını alıyoruz
  const { 
    data: category, 
    isPending: isCatPending, 
    isError: isCatError, 
    error: catError, 
    refetch: refetchCat, 
    isFetching: isCatFetching 
  } = useQuery(categoryQueries.detail(slug));

  const { 
    data: items, 
    isPending: isItemsPending, 
    isError: isItemsError, 
    error: itemsError, 
    refetch: refetchItems, 
    isFetching: isItemsFetching 
  } = useQuery(itemQueries.byCategory(slug));

  // 2. Yükleniyor durumu
  if (isCatPending || isItemsPending) return <p>Yükleniyor...</p>;

  // 3. EKSİK OLAN HATA DALI (isPending'den sonra, !category'den önce)
  if (isCatError || isItemsError) {
    // Hangi sorgu hata verdiyse onun mesajını göster
    const err = catError || itemsError; 
    const isFetching = isCatFetching || isItemsFetching;

    return (
      <div className="error-container">
        <p>{toUserMessage(err)}</p>
        <button 
          onClick={() => { refetchCat(); refetchItems(); }} 
          disabled={isFetching}
        >
          {isFetching ? 'Yükleniyor...' : 'Tekrar dene'}
        </button>
      </div>
    );
  }

  // 4. Veri yoksa (404)
  if (!category) return <NotFoundPage />;

  // Hocanın sorusu: items || [] silindiğinde TypeScript items tipini daraltıyor mu?
  // Aşağıdaki satırı bu şekilde yaz, hata verip vermediğine bak.
  const sortedItems = [...items].sort((a, b) => {
    const avgA = summarize(a.distribution).average;
    const avgB = summarize(b.distribution).average;

    if (avgA === null && avgB === null) return 0;
    if (avgA === null) return 1;
    if (avgB === null) return -1;
    return avgB - avgA;
  });

  return (
    <div className="category-page">
      <header>
        <h1>{category.emoji} {category.name}</h1>
      </header>
      
      <div className="item-grid">
        {sortedItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // URL parametresini Zod ile sınırda doğrula
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return <NotFoundPage />;

  return <CategoryView slug={parsed.data} />;
}