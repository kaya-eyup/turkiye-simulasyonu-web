import { flagEmoji, TURKIYE } from "./countries";
import { formatCount, formatPercent, type Slice } from "./groupResults";

// Çizim ölçüleri (viewBox birimleri). Ekrandaki boyutu CSS belirler; SVG ölçeklenir.
const SIZE = 384; // halka + bayraklar için kenar payı (bayraklar yatayda daha geniş)
const CENTER = SIZE / 2;
const RADIUS = 124;
const STROKE = 52;
const ACTIVE_STROKE = 64;
const FLAG_RADIUS = RADIUS + STROKE / 2 + 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2; // dilimler arasında yüzey renginde boşluk
const MIN_PERCENT_FOR_FLAG = 3; // daha ince dilimlerin bayrakları birbirine biner

type Arc = { slice: Slice; length: number; start: number };

// Her dilim, kendinden öncekilerin toplam uzunluğu kadar ileriden başlar.
// Bileşenin dışında: render sırasında bir değişkeni biriktirerek değiştirmek React'in kuralına aykırı.
function layoutArcs(slices: Slice[], total: number): Arc[] {
  const arcs: Arc[] = [];
  let start = 0;
  for (const slice of slices) {
    const length = (slice.count / total) * CIRCUMFERENCE;
    arcs.push({ slice, length, start });
    start += length;
  }
  return arcs;
}

type DonutChartProps = {
  slices: Slice[];
  total: number;
  activeKey: string | null;
  onActiveChange: (key: string | null) => void;
};

export function DonutChart({
  slices,
  total,
  activeKey,
  onActiveChange,
}: DonutChartProps) {
  // Oy almamış satır (ör. 0 oylu Türkiye) listede görünür ama halkada yer kaplamaz
  const drawn = slices.filter((s) => s.count > 0);
  const single = drawn.length === 1;
  const active = slices.find((s) => s.key === activeKey) ?? null;

  const arcs = layoutArcs(drawn, total);

  return (
    // Ekran okuyucu için asıl bilgi yandaki liste; grafik onun görsel hâli
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      // Yazılar fare olaylarını yutmasın: üzerine gelme dilimlerde çalışsın
      className="mx-auto block w-full max-w-[560px] select-none [&_text]:pointer-events-none"
    >
      {/* -90°: çizim saat 12'den başlasın (SVG'de varsayılan başlangıç saat 3) */}
      <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
        {arcs.map(({ slice, length, start }) => (
          <circle
            key={slice.key}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={slice.color}
            strokeWidth={slice.key === activeKey ? ACTIVE_STROKE : STROKE}
            // Kesikli çizgi hilesi: "dilim uzunluğu kadar çiz, sonra çemberin geri kalanı kadar boşluk"
            strokeDasharray={`${single ? length : Math.max(length - GAP, 0.5)} ${CIRCUMFERENCE}`}
            strokeDashoffset={-start}
            className="animate-slice-grow cursor-pointer transition-[stroke-width] duration-150 motion-reduce:animate-none"
            // Fare: üzerine gelince göster. Dokunmatik: dokununca aç/kapat (hover yok)
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") onActiveChange(slice.key);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") onActiveChange(null);
            }}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse")
                onActiveChange(slice.key === activeKey ? null : slice.key);
            }}
          />
        ))}
      </g>

      {/* Bayraklar dilimin ortasının hizasında, halkanın dışında */}
      {arcs.map(({ slice, length, start }) => {
        // Türkiye istisna: sitenin esprisi o; komşuları (5. ülke ve Diğer) ondan büyük olduğu için çakışmaz
        if (slice.percent < MIN_PERCENT_FOR_FLAG && slice.code !== TURKIYE)
          return null;
        const angle = ((start + length / 2) / CIRCUMFERENCE) * 2 * Math.PI;
        // rotate(-90) burada yok: açıyı saat 12'den başlatmak için sinüs/kosinüs yer değiştiriyor
        const x = CENTER + FLAG_RADIUS * Math.sin(angle);
        const y = CENTER - FLAG_RADIUS * Math.cos(angle);
        return (
          <text
            key={slice.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[22px]"
          >
            {slice.code ? flagEmoji(slice.code) : "🌍"}
          </text>
        );
      })}

      {/* Orta alan: varsayılan toplam; bir dilim seçilince o ülke */}
      {active ? (
        <>
          <text
            x={CENTER}
            y={CENTER - 26}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[40px]"
          >
            {active.code ? flagEmoji(active.code) : "🌍"}
          </text>
          <text
            x={CENTER}
            y={CENTER + 12}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink font-condensed text-[22px] font-semibold"
          >
            {active.name}
          </text>
          <text
            x={CENTER}
            y={CENTER + 38}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted text-[15px] tabular-nums"
          >
            {formatCount(active.count)} oy · {formatPercent(active.percent)}
          </text>
        </>
      ) : (
        <>
          <text
            x={CENTER}
            y={CENTER - 8}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink font-condensed text-[56px] font-bold tabular-nums"
          >
            {formatCount(total)}
          </text>
          <text
            x={CENTER}
            y={CENTER + 30}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted text-[16px]"
          >
            oy verildi
          </text>
        </>
      )}
    </svg>
  );
}
