import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Sayfa Bulunamadı</h1>
      <Link to="/">Ana Sayfaya Dön</Link>
    </div>
  );
};
