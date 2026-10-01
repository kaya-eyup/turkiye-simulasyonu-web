import { Outlet } from "react-router";
import { NavBar } from "../shared/ui/NavBar";

export const RootLayout = () => {
  return (
    <div>
      <NavBar />
      {/* Ekran okuyucuların doğrudan içeriğe atlaması için main kullanıldı */}
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
};
