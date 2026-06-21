import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import ChatPage from "./pages/ChatPage";
import TransportPage from "./pages/TransportPage";
import ProfilePage from "./pages/ProfilePage";
import MarketplacePage from "./pages/MarketplacePage";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("kisan_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        fetch(`/api/auth/user/${parsed.id}`)
          .then((r) => r.json())
          .then((u) => { if (!u.error) { setUser(u); localStorage.setItem("kisan_user", JSON.stringify(u)); } })
          .catch(() => {});
      } catch {}
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a4d2e" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🌾</div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>Kisan AI</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/disease" element={<DiseaseDetectionPage user={user} />} />
          <Route path="/chat" element={<ChatPage user={user} />} />
          <Route path="/market" element={<MarketplacePage user={user} />} />
          <Route path="/transport" element={<TransportPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} onUpdate={(u) => { setUser(u); }} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
