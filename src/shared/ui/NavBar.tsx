import { Link, NavLink } from "react-router";

export const NavBar = () => {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", color: "inherit" }}>
        🧿 Türkiye Simülasyonu
      </Link>
      
      <NavLink 
        to="/hakkinda" 
        style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal", color: isActive ? "red" : "blue" })}
      >
        Hakkında
      </NavLink>
    </nav>
  );
};