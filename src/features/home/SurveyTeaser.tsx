import { Link } from "react-router";
import { flagEmoji } from "../survey/countries";

const TEASER_FLAGS = ["JP", "CA", "CH", "NO", "TR"] as const;

export function SurveyTeaser() {
  return (
    <section aria-labelledby="survey-teaser-heading" className="mt-12">
      {/* Bütün kart tek bir bağlantı: tıklanacak yer aramak gerekmesin */}
      <Link
        to="/anket"
        className="group flex flex-col items-center gap-5 rounded-xl border border-line bg-surface px-6 py-8 text-center transition hover:border-ink sm:flex-row sm:text-left"
      >
        <span
          aria-hidden="true"
          className="flex shrink-0 gap-1 text-3xl transition-transform group-hover:scale-110"
        >
          {TEASER_FLAGS.map((code) => (
            <span key={code}>{flagEmoji(code)}</span>
          ))}
        </span>
        <div className="flex-1">
          <h2 id="survey-teaser-heading">
            Bir sonraki hayatında nerede doğardın?
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
