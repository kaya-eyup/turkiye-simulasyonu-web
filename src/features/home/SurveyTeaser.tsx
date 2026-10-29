import { Link } from "react-router";
import { ALL_COUNTRIES, flagEmoji } from "../survey/countries";

const MOSAIC_COLUMNS = 10;
const MOSAIC_COUNT = 100;

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  // Fisher-Yates: her eleman eşit olasılıkla her konuma gidiyor.
  // sort(() => Math.random() - 0.5) daha kısa ama yanlı: karşılaştırma tutarsız
  // olduğu için bazı sıralar diğerlerinden sık çıkıyor.
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

// Modül yüklenirken bir kez hesaplanıyor: render saf kalıyor ve mozaik
// her çizimde yeniden karışmıyor. Sayfa yenilenince yeni bir sıra çıkıyor.
const MOSAIC_FLAGS = shuffled(ALL_COUNTRIES)
  .slice(0, MOSAIC_COUNT)
  .map((country) => country.code);

export function SurveyTeaser() {
  return (
    <section aria-labelledby="survey-teaser-heading" className="mt-12">
      {/* Bütün kart tek bir bağlantı: tıklanacak yer aramak gerekmesin */}
      <Link
        to="/anket"
        className="group flex flex-col items-center gap-6 rounded-xl border border-line bg-surface px-6 py-8 text-center transition hover:border-ink sm:flex-row sm:gap-10 sm:px-10 sm:py-10 sm:text-left"
      >
        {/* Mozaik süs: 249 ülkeden 100'ü. Ekran okuyucu için bilgi taşımıyor */}
        <span aria-hidden="true" className="relative shrink-0">
          <span
            style={{ gridTemplateColumns: `repeat(${MOSAIC_COLUMNS}, 1fr)` }}
            className="grid gap-px text-sm leading-none transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:text-base"
          >
            {MOSAIC_FLAGS.map((code) => (
              <span key={code}>{flagEmoji(code)}</span>
            ))}
          </span>

          {/* Dünya mozaiğin ortasında; arkasındaki disk olmasa bayrakların içinde kaybolurdu */}
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full bg-surface text-4xl leading-none ring-1 ring-line">
              🌍
            </span>
          </span>
        </span>

        <div className="flex-1">
          <h2 id="survey-teaser-heading">
            Bir sonraki hayatında nerede doğmak istersin?
          </h2>
          <span className="mt-1 block text-muted">
            Simülasyonu yeniden başlatma hakkın olsaydı… Oyunu ver, sonuçları
            gör.
          </span>
        </div>

        <span className="btn btn-primary shrink-0">Ankete katıl</span>
      </Link>
    </section>
  );
}
