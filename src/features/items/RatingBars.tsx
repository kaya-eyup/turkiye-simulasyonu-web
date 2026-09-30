import { summarize } from "../../shared/lib/rating"; 
import type { Item } from "../../shared/api/schemas";

interface RatingBarsProps {
  distribution: Item["distribution"];
}

export function RatingBars({ distribution }: RatingBarsProps) {
  const { average, total, rows } = summarize(distribution);

  // Veri 1->5 sırasıyla geliyor. Ekranda 5->1 göstermek için kopyalayıp ters çeviriyoruz.
  const displayRows = [...rows].reverse();

  return (
    <div className="rating-bars-container">
      {/* 2. Kural: <h2> değer değil başlık olmalı, değerler metin olarak basılmalı */}
      <div className="rating-summary">
        <h2>Puan Dağılımı</h2>
        
        {average !== null ? (
          <>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '4px 0' }}>
              {average.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}
            </p>
            {/* 3. Kural: Sayı büyükse binlik ayracı koy (1.234) */}
            <p>{total.toLocaleString('tr-TR')} değerlendirme</p>
          </>
        ) : (
          <p>Henüz oy yok</p>
        )}
      </div>

      <div className="bars-list">
        {displayRows.map((row) => (
          <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* 2. Kural: Ekran okuyucular için aria-label */}
            <span aria-label={`${row.stars} yıldız`} style={{ minWidth: '40px' }}>
              {row.stars} ★
            </span>
            
            <div style={{ flex: 1, backgroundColor: '#eee', height: '8px', borderRadius: '4px' }}>
              <div 
                style={{ 
                  width: `${row.percent}%`, 
                  backgroundColor: '#f59e0b', 
                  height: '100%', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            
            {/* 1. Kural: Türkçe yüzde biçimlendirmesi (%45) */}
            <span style={{ minWidth: '45px', textAlign: 'right' }}>
              {(row.percent / 100).toLocaleString("tr-TR", { style: "percent", maximumFractionDigits: 0 })}
            </span>
            
          </div>
        ))}
      </div>
    </div>
  );
}