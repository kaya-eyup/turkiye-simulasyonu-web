import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <div className="py-12">
      <p className="font-condensed text-6xl font-bold text-muted">404</p>
      <h1 className="mt-2">Bu konum simülasyonda bulunamadı.</h1>
      <p className="mt-2 text-muted">
        Aradığın sayfa ya taşındı ya da hiç var olmadı.
      </p>
      <Link to="/" className="btn mt-6">
        Anasayfaya dön
      </Link>
    </div>
  );
};
