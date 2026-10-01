import { Link, NavLink, Form, useMatch } from "react-router";
import {
  SEARCH_PARAMS,
  MAX_QUERY_LENGTH,
} from "../../features/search/searchParams";
import { ThemeToggle } from "../../features/theme/ThemeToggle";
import { MyVotesBadge } from "../../features/votes/MyVotesBadge";
export function NavBar() {
  // Şu anda /ara sayfasında mıyız? (URL eşleşmiyorsa null döner)
  const onSearchPage = useMatch("/ara") !== null;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Sol: Logo / Anasayfa */}
      <Link
        to="/"
        style={{
          fontWeight: "bold",
          fontSize: "1.2rem",
          textDecoration: "none",
        }}
      >
        🧿 Türkiye Simülasyonu
      </Link>
      {/* Orta: Arama Formu (Sadece arama sayfasında değilsek görünür) */}
      {!onSearchPage && (
        <Form
          action="/ara"
          role="search"
          style={{ display: "flex", gap: "8px" }}
        >
          <input
            type="search"
            name={SEARCH_PARAMS.query}
            aria-label="Ara"
            required
            maxLength={MAX_QUERY_LENGTH}
            placeholder="Neyi merak ediyorsun?"
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
            }}
          />
          <button type="submit">Ara</button>
        </Form>
      )}
      {/* Sağ: Hakkında & Tema butonu*/}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <NavLink to="/hakkinda">Hakkında</NavLink>
        <ThemeToggle />
        <MyVotesBadge />
      </div>{" "}
    </nav>
  );
}
