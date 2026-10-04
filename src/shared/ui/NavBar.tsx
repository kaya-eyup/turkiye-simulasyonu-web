import { Link, NavLink, Form, useMatch } from "react-router";
import {
  SEARCH_PARAMS,
  MAX_QUERY_LENGTH,
} from "../../features/search/searchParams";
import { ThemeToggle } from "../../features/theme/ThemeToggle";
import { MyVotesBadge } from "../../features/votes/MyVotesBadge";
import { PlateLogo } from "./PlateLogo";

export function NavBar() {
  // Şu anda /ara sayfasında mıyız? (URL eşleşmiyorsa null döner)
  const onSearchPage = useMatch("/ara") !== null;

  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-page">
      {/* Geniş ekranda 3 sütun: [1fr | auto | 1fr]. Yan sütunlar eşit genişlikte olduğu için
          ortadaki arama, logo ve sağ grubun genişliğinden bağımsız olarak tam ortada durur.
          Telefonda 2 sütun: üst satırda logo ve sağ grup, alt satırda tam genişlik arama. */}
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-3 sm:grid-cols-[1fr_auto_1fr]">
        {/* Sol: plaka logo; site adı sadece geniş ekranda */}
        <Link
          to="/"
          aria-label="Türkiye Simülasyonu, anasayfa"
          className="flex items-center gap-3 justify-self-start"
        >
          <PlateLogo />
          <span className="hidden font-condensed text-lg font-semibold lg:inline">
            Türkiye Simülasyonu
          </span>
        </Link>

        {/* Orta: arama. DOM sırası geniş ekrandaki görsel sırayla aynı: Tab da soldan sağa gider */}
        {!onSearchPage && (
          <Form
            action="/ara"
            role="search"
            className="col-span-2 row-start-2 flex gap-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-72 lg:w-80"
          >
            <input
              type="search"
              name={SEARCH_PARAMS.query}
              aria-label="Ara"
              required
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Neyi merak ediyorsun?"
              className="h-9 w-full min-w-0 rounded-md border border-line bg-surface px-3 text-sm placeholder:text-muted"
            />
            <button type="submit" className="btn">
              Ara
            </button>
          </Form>
        )}

        {/* Sağ: oylarım, Hakkında, tema */}
        <div className="col-start-2 row-start-1 flex items-center gap-4 justify-self-end sm:col-start-3">
          <MyVotesBadge />
          <NavLink
            to="/hakkinda"
            className={({ isActive }) =>
              isActive
                ? "font-semibold underline underline-offset-4"
                : "hover:underline hover:underline-offset-4"
            }
          >
            Hakkında
          </NavLink>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
