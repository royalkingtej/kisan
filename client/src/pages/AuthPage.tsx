import React, { useState } from "react";

interface AuthPageProps {
  onLogin: (user: any) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDemoOtp(data.demoOtp);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("kisan_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #1a4d2e 0%, #2d7a45 50%, #1a4d2e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420,
        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🌾</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a4d2e", margin: 0 }}>Kisan AI</h1>
          <p style={{ color: "#666", marginTop: 6, fontSize: 14 }}>Smart Farming Assistant for Indian Farmers</p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendOtp}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>
              Mobile Number
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <div style={{
                padding: "12px 14px", background: "#f5f5f5", borderRadius: 10,
                border: "1.5px solid #ddd", fontSize: 14, color: "#333", whiteSpace: "nowrap",
              }}>🇮🇳 +91</div>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                style={{
                  flex: 1, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #ddd",
                  fontSize: 14, outline: "none", fontFamily: "inherit",
                }}
                required
              />
            </div>
            {error && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading || phone.length < 10}
              style={{
                width: "100%", padding: "14px", background: phone.length >= 10 ? "#2d7a45" : "#ccc",
                color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: phone.length >= 10 ? "pointer" : "not-allowed", transition: "all 0.2s",
              }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <div style={{ background: "#f0faf4", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #b7e4c7" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#2d7a45" }}>
                📱 OTP sent to <strong>+91 {phone}</strong>
              </p>
              {demoOtp && (
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#666" }}>
                  Demo OTP: <strong style={{ color: "#2d7a45", fontSize: 16, letterSpacing: 2 }}>{demoOtp}</strong>
                </p>
              )}
            </div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "1.5px solid #ddd",
                fontSize: 22, textAlign: "center", letterSpacing: 10, outline: "none",
                fontFamily: "monospace", marginBottom: 20, boxSizing: "border-box",
              }}
              required
            />
            {error && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              style={{
                width: "100%", padding: "14px", background: otp.length === 6 ? "#2d7a45" : "#ccc",
                color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: otp.length === 6 ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("phone"); setOtp(""); setError(""); setDemoOtp(""); }}
              style={{ width: "100%", padding: "10px", background: "none", border: "none", color: "#666", marginTop: 10, cursor: "pointer", fontSize: 13 }}
            >
              ← Change Number
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 24, marginBottom: 0 }}>
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
