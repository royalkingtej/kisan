import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  user: any;
}

const NAV = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/disease", icon: "🔬", label: "Disease" },
  { path: "/chat", icon: "💬", label: "Chat" },
  { path: "/transport", icon: "🚚", label: "Transport" },
  { path: "/profile", icon: "👤", label: "Profile" },
];

export default function Layout({ children, user }: LayoutProps) {
  const location = useLocation();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f7f5" }}>
      <header style={{
        background: "#1a4d2e", color: "white", padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 100, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🌾</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Kisan AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, opacity: 0.85 }}>{user?.location || "India"}</span>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#2d7a45",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, border: "2px solid rgba(255,255,255,0.3)",
          }}>
            {user?.name?.[0]?.toUpperCase() || "K"}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>

      <nav style={{
        background: "white", borderTop: "1px solid #e8e8e8", display: "flex",
        justifyContent: "space-around", padding: "8px 0 12px",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.08)", flexShrink: 0, zIndex: 100,
      }}>
        {NAV.map(({ path, icon, label }) => {
          const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px" }}
            >
              <span style={{ fontSize: 22, filter: active ? "none" : "grayscale(60%)" }}>{icon}</span>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? "#1a4d2e" : "#888" }}>{label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#1a4d2e" }} />}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
