import React, { useState, useEffect } from "react";

interface ProfilePageProps {
  user: any;
  onUpdate: (user: any) => void;
}

const CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Tomato", "Potato", "Onion", "Maize", "Soybean", "Groundnut"];
const FARM_SIZES = ["< 1 Acre", "1-5 Acres", "5-10 Acres", "10-25 Acres", "> 25 Acres"];
const STATES = ["Andhra Pradesh","Bihar","Gujarat","Haryana","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"];

export default function ProfilePage({ user, onUpdate }: ProfilePageProps) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    farmSize: user?.farmSize || "",
    cropTypes: user?.cropTypes || "",
  });
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    user?.cropTypes ? user.cropTypes.split(",").map((c: string) => c.trim()) : []
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function toggleCrop(crop: string) {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    const cropTypes = selectedCrops.join(", ");
    try {
      const res = await fetch(`/api/auth/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cropTypes }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error);
      localStorage.setItem("kisan_user", JSON.stringify(updated));
      onUpdate(updated);
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("kisan_user");
      window.location.reload();
    }
  }

  const avatarLetter = (form.name || user?.phone || "K")[0].toUpperCase();

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{
        background: "linear-gradient(135deg, #1a4d2e, #2d7a45)",
        borderRadius: 20, padding: "28px 24px", textAlign: "center", color: "white", marginBottom: 24,
        position: "relative",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
          margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, fontWeight: 800, border: "3px solid rgba(255,255,255,0.4)",
        }}>{avatarLetter}</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{form.name || "Kisan User"}</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.8, fontSize: 13 }}>📞 {user?.phone}</p>
        {form.location && <p style={{ margin: "4px 0 0", opacity: 0.8, fontSize: 13 }}>📍 {form.location}</p>}
        <button onClick={() => setEditMode(!editMode)} style={{
          position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)",
          border: "none", borderRadius: 20, color: "white", padding: "6px 14px",
          fontSize: 13, cursor: "pointer", fontWeight: 600,
        }}>{editMode ? "Cancel" : "✏️ Edit"}</button>
      </div>

      {saved && (
        <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#1a4d2e", fontWeight: 600, fontSize: 14, textAlign: "center" }}>
          ✅ Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#333", marginBottom: 16, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
            👤 Personal Information
          </div>
          {[
            { label: "Full Name", key: "name", placeholder: "Your full name", type: "text" },
            { label: "Email", key: "email", placeholder: "your@email.com", type: "email" },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#666", fontWeight: 600, display: "block", marginBottom: 5 }}>{label}</label>
              {editMode ? (
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd",
                    fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
              ) : (
                <div style={{ padding: "11px 14px", background: "#f8f8f8", borderRadius: 10, fontSize: 14, color: (form as any)[key] ? "#333" : "#aaa" }}>
                  {(form as any)[key] || `Not set`}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#333", marginBottom: 16, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
            🌾 Farm Details
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600, display: "block", marginBottom: 5 }}>State / Location</label>
            {editMode ? (
              <select
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd",
                  fontSize: 14, outline: "none", background: "white", fontFamily: "inherit",
                }}
              >
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <div style={{ padding: "11px 14px", background: "#f8f8f8", borderRadius: 10, fontSize: 14, color: form.location ? "#333" : "#aaa" }}>
                {form.location || "Not set"}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600, display: "block", marginBottom: 5 }}>Farm Size</label>
            {editMode ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {FARM_SIZES.map((s) => (
                  <button
                    key={s} type="button"
                    onClick={() => setForm((f) => ({ ...f, farmSize: s }))}
                    style={{
                      padding: "7px 14px", borderRadius: 20, border: "1.5px solid",
                      borderColor: form.farmSize === s ? "#1a4d2e" : "#ddd",
                      background: form.farmSize === s ? "#1a4d2e" : "white",
                      color: form.farmSize === s ? "white" : "#555",
                      fontSize: 13, cursor: "pointer", fontWeight: 600,
                    }}
                  >{s}</button>
                ))}
              </div>
            ) : (
              <div style={{ padding: "11px 14px", background: "#f8f8f8", borderRadius: 10, fontSize: 14, color: form.farmSize ? "#333" : "#aaa" }}>
                {form.farmSize || "Not set"}
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600, display: "block", marginBottom: 8 }}>Crops You Grow</label>
            {editMode ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CROPS.map((crop) => (
                  <button
                    key={crop} type="button"
                    onClick={() => toggleCrop(crop)}
                    style={{
                      padding: "7px 14px", borderRadius: 20, border: "1.5px solid",
                      borderColor: selectedCrops.includes(crop) ? "#1a4d2e" : "#ddd",
                      background: selectedCrops.includes(crop) ? "#e8f5e9" : "white",
                      color: selectedCrops.includes(crop) ? "#1a4d2e" : "#555",
                      fontSize: 13, cursor: "pointer", fontWeight: 600,
                    }}
                  >{selectedCrops.includes(crop) ? "✓ " : ""}{crop}</button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedCrops.length > 0 ? selectedCrops.map((c) => (
                  <span key={c} style={{ background: "#e8f5e9", color: "#1a4d2e", borderRadius: 20, padding: "5px 12px", fontSize: 13, fontWeight: 600 }}>🌿 {c}</span>
                )) : <span style={{ color: "#aaa", fontSize: 14 }}>No crops set</span>}
              </div>
            )}
          </div>
        </div>

        {editMode && (
          <button type="submit" disabled={saving} style={{
            width: "100%", padding: "15px", borderRadius: 14, border: "none",
            background: saving ? "#ccc" : "#1a4d2e", color: "white",
            fontWeight: 800, fontSize: 16, cursor: saving ? "not-allowed" : "pointer",
            marginBottom: 12, boxShadow: "0 4px 12px rgba(26,77,46,0.3)",
          }}>
            {saving ? "Saving..." : "💾 Save Profile"}
          </button>
        )}
      </form>

      <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#333", marginBottom: 14 }}>App Info</div>
        {[
          { label: "App Version", value: "Kisan AI v1.0" },
          { label: "Member Since", value: new Date(user?.createdAt || Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ fontSize: 14, color: "#666" }}>{label}</span>
            <span style={{ fontSize: 14, color: "#333", fontWeight: 600 }}>{value}</span>
          </div>
        ))}
        <button onClick={handleLogout} style={{
          width: "100%", marginTop: 14, padding: "12px", borderRadius: 12,
          border: "1.5px solid #f44336", background: "white", color: "#f44336",
          fontWeight: 700, cursor: "pointer", fontSize: 14,
        }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
