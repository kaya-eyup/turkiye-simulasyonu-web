import { Link, useRouteError } from "react-router";

export function RouteErrorPage() {
  const error = useRouteError();

  // Geliştirme modundaysak hatayı konsola yazdır, log kirliliği prod'da olmasın.
  if (import.meta.env.DEV) {
    console.error("Route Error:", error);
  }

  return (
    // Kendi boşluğu var: kök seviyede RootLayout'un <main>'i olmadan da çizilebiliyor
    <div role="alert" className="mx-auto max-w-xl px-4 py-16">
      <h1>Bir şeyler ters gitti</h1>
      <p className="mt-2 mb-6 text-muted">
        Bu sayfa beklenmedik bir hatayla karşılaştı.
      </p>

      {/* Sadece geliştirme modunda detayları göster */}
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="mb-6 overflow-x-auto rounded-lg border border-danger p-4 text-sm text-danger">
          {error.message}
        </pre>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn"
          onClick={() => window.location.reload()}
        >
          Sayfayı yenile
        </button>
        <Link to="/" className="btn">
          Anasayfaya dön
        </Link>
      </div>
    </div>
  );
}
