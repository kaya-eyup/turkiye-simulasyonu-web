import { Outlet } from "react-router";
import { NavBar } from "../shared/ui/NavBar";
import { API_BASE_URL } from "../shared/api/client";

export function RootLayout() {
  return (
    <div className="layout">
      <NavBar />

      {!API_BASE_URL && (
        <aside
          role="note"
          style={{
            backgroundColor: "var(--color-track)",
            padding: "0.75rem 1rem",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          Demo sürüm: veri sunucusu henüz bağlı değil. Kategoriler, puanlar ve
          yorumlar backend ile birlikte gelecek.
        </aside>
      )}

      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
