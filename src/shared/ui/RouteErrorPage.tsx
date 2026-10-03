import { Link, useRouteError } from "react-router";

export function RouteErrorPage() {
  const error = useRouteError();

  // Geliştirme modundaysak hatayı konsola yazdır, log kirliliği prod'da olmasın.
  if (import.meta.env.DEV) {
    console.error("Route Error:", error);
  }

  return (
    <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Bir şeyler ters gitti</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        Bu sayfa beklenmedik bir hatayla karşılaştı.
      </p>

      {/* Sadece geliştirme modunda detayları göster */}
      {import.meta.env.DEV && error instanceof Error && (
        <pre
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            textAlign: "left",
            overflowX: "auto",
          }}
        >
          {error.message}
        </pre>
      )}

      <div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}
        >
          Sayfayı yenile
        </button>
        <Link
          to="/"
          style={{ padding: "0.5rem 1rem", textDecoration: "underline" }}
        >
          Anasayfaya dön
        </Link>
      </div>
    </div>
  );
}
