import { Link } from "react-router";

export const HomePage = () => {
  return (
    <div>
      <section>
        <h2>Kategoriler</h2>
        <ul>
          <li>
            <Link to="/kategori/yemek-kulturu">Yemek Kültürü</Link>
          </li>
          <li>
            <Link to="/kategori/sehir-ilce">Şehir/İlçe</Link>
          </li>
        </ul>
        {/* TODO(day35): db'den gelecek */}
      </section>

      <section>
        <h2>Haftanın Seçilmişleri</h2>
        <p>Yakında...</p>
      </section>
    </div>
  );
};
