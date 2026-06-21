import React from "react";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  user: any;
}

const FEATURES = [
  { icon: "🔬", title: "Disease Detection", desc: "AI-powered crop disease analysis from photos", path: "/disease", color: "#e8f5e9", border: "#a5d6a7" },
  { icon: "🛒", title: "Kisan Mandi", desc: "Buy & sell crops directly — no middlemen", path: "/market", color: "#fff8e1", border: "#ffe082" },
  { icon: "🚚", title: "Transport", desc: "Find vehicles & transport for your harvest", path: "/transport", color: "#fff3e0", border: "#ffcc80" },
  { icon: "💬", title: "AI Chatbot", desc: "Expert advice on farming & crop care", path: "/chat", color: "#e3f2fd", border: "#90caf9" },
];

const TIPS = [
  { emoji: "💧", text: "Water crops early morning to reduce evaporation" },
  { emoji: "🌱", text: "Rotate crops each season to improve soil health" },
  { emoji: "🐛", text: "Use neem oil spray as natural pesticide" },
  { emoji: "🌤️", text: "Monitor weather forecasts for timely irrigation" },
];

export default function HomePage({ user }: HomePageProps) {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ padding: "20px 16px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{
        background: "linear-gradient(135deg, #1a4d2e, #2d7a45)",
        borderRadius: 16, padding: "20px", color: "white", marginBottom: 24,
        boxShadow: "0 4px 15px rgba(26,77,46,0.3)",
      }}>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 13 }}>{greeting} 🌞</p>
        <h2 style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 800 }}>
          {user?.name || "Kisan User"}
        </h2>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 13 }}>
          📍 {user?.location || "India"} {user?.farmSize ? `• ${user.farmSize}` : ""}
        </p>
        {user?.cropTypes && (
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {user.cropTypes.split(",").map((c: string, i: number) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.2)", borderRadius: 20,
                padding: "3px 10px", fontSize: 12,
              }}>🌿 {c.trim()}</span>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 14 }}>Quick Actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {FEATURES.map((f) => (
          <button
            key={f.path}
            onClick={() => navigate(f.path)}
            style={{
              background: f.color, border: `1.5px solid ${f.border}`, borderRadius: 14,
              padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "transform 0.15s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a", marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{f.desc}</div>
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 14 }}>Farming Tips</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TIPS.map((tip, i) => (
          <div key={i} style={{
            background: "white", borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}>
            <span style={{ fontSize: 22 }}>{tip.emoji}</span>
            <span style={{ fontSize: 13, color: "#444", lineHeight: 1.4 }}>{tip.text}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20, background: "#fff8e1", borderRadius: 14, padding: "16px",
        border: "1px solid #ffe082", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 28 }}>🌡️</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>Today's Advisory</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
            Monsoon season — check for fungal diseases. Spray preventive fungicide.
          </div>
        </div>
      </div>
    </div>
  );
}
