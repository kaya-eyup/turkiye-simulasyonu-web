import { Outlet } from "react-router";
import { NavBar } from "../shared/ui/NavBar";
import { API_BASE_URL } from "../shared/api/client";

export function RootLayout() {
  return (
    <div>
      <NavBar />

      {!API_BASE_URL && (
        <aside
          role="note"
          className="border-b border-line bg-track px-4 py-2 text-center text-sm text-muted"
        >
          Demo sürüm: veri sunucusu henüz bağlı değil. Kategoriler, puanlar ve
          yorumlar backend ile birlikte gelecek.
        </aside>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
