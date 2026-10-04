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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        {/* Sol: plaka logo; site adı sadece geniş ekranda */}
        <Link
          to="/"
          aria-label="Türkiye Simülasyonu, anasayfa"
          className="flex items-center gap-3"
        >
          <PlateLogo />
          <span className="hidden font-condensed text-lg font-semibold sm:inline">
            Türkiye Simülasyonu
          </span>
        </Link>

        {/* Sağ: Hakkında, oylarım, tema */}
        <div className="ml-auto flex items-center gap-4">
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

        {/* Arama: telefonda ikinci satırda tam genişlik, geniş ekranda ortada */}
        {!onSearchPage && (
          <Form
            action="/ara"
            role="search"
            className="order-last flex w-full gap-2 sm:order-none sm:w-auto sm:flex-1 sm:justify-center"
          >
            <input
              type="search"
              name={SEARCH_PARAMS.query}
              aria-label="Ara"
              required
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Neyi merak ediyorsun?"
              className="h-9 w-full min-w-0 rounded-md border border-line bg-surface px-3 text-sm placeholder:text-muted sm:max-w-xs"
            />
            <button type="submit" className="btn">
              Ara
            </button>
          </Form>
        )}
      </div>
    </nav>
  );
}
