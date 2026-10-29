import { Outlet } from "react-router";
import { NavBar } from "../shared/ui/NavBar";
import { Footer } from "../shared/ui/Footer";
import { API_BASE_URL } from "../shared/api/client";

export function RootLayout() {
  return (
    // Sayfa kısa olsa da footer ekranın altında: main kalan yüksekliği doldurur
    <div className="flex min-h-dvh flex-col">
      <NavBar />

      {/* Sadece değişkenin tanımlı olmadığı derlemelerde (önizlemeler) görünür */}
      {!API_BASE_URL && (
        <aside
          role="note"
          className="border-b border-line bg-track px-4 py-2 text-center text-sm text-muted"
        >
          Önizleme sürümü: Bu derleme veri sunucusuna bağlı değil. Canlı site:{" "}
          <a
            href="https://turkiyesimulasyonu.eyupkaya.com"
            className="underline underline-offset-4"
          >
            turkiyesimulasyonu.eyupkaya.com
          </a>
        </aside>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
