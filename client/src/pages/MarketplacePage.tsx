import React, { useState, useEffect, useRef } from "react";

interface Listing {
  id: number;
  user_id: number;
  crop_name: string;
  category: string;
  quantity: string;
  unit: string;
  price: number;
  location: string;
  description: string;
  image_data: string;
  phone: string;
  available: boolean;
  created_at: string;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: "🛒" },
  { id: "grain", label: "Grains", icon: "🌾" },
  { id: "vegetable", label: "Vegetables", icon: "🥦" },
  { id: "fruit", label: "Fruits", icon: "🍎" },
  { id: "pulse", label: "Pulses", icon: "🫘" },
  { id: "spice", label: "Spices", icon: "🌶️" },
  { id: "oilseed", label: "Oilseeds", icon: "🌻" },
];

const CROP_SUGGESTIONS: Record<string, string[]> = {
  grain: ["Wheat", "Rice", "Maize", "Barley", "Jowar", "Bajra"],
  vegetable: ["Tomato", "Onion", "Potato", "Brinjal", "Cabbage", "Cauliflower", "Carrot", "Spinach"],
  fruit: ["Mango", "Banana", "Guava", "Pomegranate", "Grapes", "Papaya", "Orange"],
  pulse: ["Chana", "Moong Dal", "Urad Dal", "Toor Dal", "Masoor Dal", "Rajma"],
  spice: ["Turmeric", "Chilli", "Coriander", "Cumin", "Fenugreek", "Ginger", "Garlic"],
  oilseed: ["Groundnut", "Soybean", "Mustard", "Sunflower", "Sesame", "Linseed"],
};

const UNITS = ["kg", "quintal", "tonne", "dozen", "piece", "bag (50kg)", "litre"];

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  grain: { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  vegetable: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  fruit: { bg: "#fce4ec", text: "#c62828", border: "#f48fb1" },
  pulse: { bg: "#ede7f6", text: "#4527a0", border: "#b39ddb" },
  spice: { bg: "#fbe9e7", text: "#bf360c", border: "#ffab91" },
  oilseed: { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MarketplacePage({ user }: { user: any }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myListings, setMyListings] = useState(false);
  const [myItems, setMyItems] = useState<Listing[]>([]);
  const [form, setForm] = useState({
    cropName: "", category: "vegetable", quantity: "", unit: "kg",
    price: "", location: user?.location || "", description: "", phone: user?.phone || "", imageData: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchListings(); }, [category, locationFilter]);
  useEffect(() => { if (myListings && user?.id) fetchMyListings(); }, [myListings]);

  async function fetchListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (locationFilter) params.set("location", locationFilter);
      const res = await fetch(`/api/market?${params}`);
      setListings(await res.json());
    } catch {}
    setLoading(false);
  }

  async function fetchMyListings() {
    if (!user?.id) return;
    const res = await fetch(`/api/market/my/${user.id}`);
    setMyItems(await res.json());
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setForm((f) => ({ ...f, imageData: dataUrl.split(",")[1] }));
    };
    reader.readAsDataURL(file);
  }

  async function submitListing(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setShowForm(false);
      setForm({ cropName: "", category: "vegetable", quantity: "", unit: "kg", price: "", location: user?.location || "", description: "", phone: user?.phone || "", imageData: "" });
      setImagePreview("");
      fetchListings();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      alert("Failed to list: " + err.message);
    }
    setSubmitting(false);
  }

  async function toggleAvailability(id: number, current: boolean) {
    await fetch(`/api/market/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !current }),
    });
    fetchMyListings();
  }

  async function deleteListing(id: number) {
    if (!confirm("Remove this listing?")) return;
    await fetch(`/api/market/${id}`, { method: "DELETE" });
    fetchMyListings();
    fetchListings();
  }

  const catInfo = CAT_COLORS[form.category] || CAT_COLORS.vegetable;
  const cropOptions = CROP_SUGGESTIONS[form.category] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f5f7f5" }}>
      {/* Header bar */}
      <div style={{ background: "white", borderBottom: "1px solid #eee", flexShrink: 0 }}>
        <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>
            {myListings ? "📋 My Listings" : "🛒 Mandi"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setMyListings(!myListings); if (!myListings && user?.id) fetchMyListings(); }} style={{
              padding: "7px 13px", borderRadius: 20, border: "1.5px solid #ddd",
              background: myListings ? "#1a4d2e" : "white", color: myListings ? "white" : "#555",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>{myListings ? "← Browse" : "My Items"}</button>
            <button onClick={() => setShowForm(true)} style={{
              padding: "7px 14px", borderRadius: 20, border: "none", background: "#ff8f00",
              color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>+ Sell</button>
          </div>
        </div>

        {!myListings && (
          <>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" }}>
              {CATEGORIES.map(({ id, label, icon }) => (
                <button key={id} onClick={() => setCategory(id)} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 13px", borderRadius: 20, border: "1.5px solid",
                  borderColor: category === id ? "#1a4d2e" : "#ddd",
                  background: category === id ? "#1a4d2e" : "white",
                  color: category === id ? "white" : "#555",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  <span>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
            <div style={{ padding: "10px 16px 12px" }}>
              <input
                placeholder="🔍 Filter by location (e.g. Pune, Maharashtra)"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 22, border: "1.5px solid #e0e0e0",
                  fontSize: 13, background: "#f8f8f8", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Sell Form Modal */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{
            background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 600,
            maxHeight: "92vh", overflowY: "auto", padding: "20px 20px 32px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#1a1a1a" }}>List Your Produce</div>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
            </div>

            <form onSubmit={submitListing} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Category */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 8 }}>Category</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CATEGORIES.filter(c => c.id !== "all").map(({ id, label, icon }) => (
                    <button key={id} type="button" onClick={() => { setForm(f => ({ ...f, category: id, cropName: "" })); }}
                      style={{
                        padding: "7px 13px", borderRadius: 20, border: "1.5px solid",
                        borderColor: form.category === id ? "#1a4d2e" : "#ddd",
                        background: form.category === id ? "#e8f5e9" : "white",
                        color: form.category === id ? "#1a4d2e" : "#555",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>{icon} {label}</button>
                  ))}
                </div>
              </div>

              {/* Crop Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Crop / Produce Name *</label>
                <input
                  placeholder="e.g. Tomato, Wheat, Mango..."
                  value={form.cropName}
                  onChange={(e) => setForm(f => ({ ...f, cropName: e.target.value }))}
                  required
                  list="crop-suggestions"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
                <datalist id="crop-suggestions">
                  {cropOptions.map(c => <option key={c} value={c} />)}
                </datalist>
                {cropOptions.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {cropOptions.slice(0, 5).map(c => (
                      <button key={c} type="button" onClick={() => setForm(f => ({ ...f, cropName: c }))}
                        style={{
                          padding: "4px 10px", borderRadius: 14, border: `1px solid ${catInfo.border}`,
                          background: form.cropName === c ? catInfo.bg : "white",
                          color: catInfo.text, fontSize: 12, cursor: "pointer",
                        }}>{c}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity & Unit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Quantity</label>
                  <input
                    placeholder="e.g. 500"
                    value={form.quantity}
                    onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                    type="number" min="0"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Unit</label>
                  <select value={form.unit} onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, background: "white", boxSizing: "border-box" }}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Price per {form.unit} (₹) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#666" }}>₹</span>
                  <input
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                    type="number" min="0" step="0.01" required
                    style={{ width: "100%", padding: "11px 14px 11px 30px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Your Location</label>
                <input
                  placeholder="Village, District, State"
                  value={form.location}
                  onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Contact Number</label>
                <input
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Description (optional)</label>
                <textarea
                  placeholder="Quality details, harvest date, delivery availability..."
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              {/* Photo */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Photo (optional)</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: "2px dashed #ddd", borderRadius: 12, padding: imagePreview ? 6 : 20,
                    textAlign: "center", cursor: "pointer", background: "#fafafa",
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                      <div style={{ fontSize: 13, color: "#888" }}>Tap to add a photo of your produce</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
              </div>

              <button type="submit" disabled={submitting} style={{
                padding: "15px", borderRadius: 14, border: "none",
                background: submitting ? "#ccc" : "#ff8f00", color: "white",
                fontWeight: 800, fontSize: 16, cursor: submitting ? "not-allowed" : "pointer",
                marginTop: 4, boxShadow: "0 4px 12px rgba(255,143,0,0.35)",
              }}>
                {submitting ? "Listing..." : "🛒 List for Sale"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success toast */}
      {submitted && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: "#1a4d2e", color: "white", borderRadius: 30,
          padding: "10px 22px", fontSize: 14, fontWeight: 700, zIndex: 600,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>✅ Listed successfully!</div>
      )}

      {/* Listings */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 20px" }}>
        {myListings ? (
          <>
            {myItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>📦</div>
                <div style={{ fontWeight: 700, color: "#333", fontSize: 15 }}>No listings yet</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>Tap "+ Sell" to list your produce</div>
              </div>
            ) : myItems.map(item => (
              <div key={item.id} style={{
                background: "white", borderRadius: 16, marginBottom: 12,
                overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>{item.crop_name}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.location} • {timeAgo(item.created_at)}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#ff8f00" }}>₹{item.price}/{item.unit}</div>
                  </div>
                  {item.quantity && (
                    <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
                      📦 {item.quantity} {item.unit} available
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => toggleAvailability(item.id, item.available)} style={{
                      flex: 1, padding: "9px", borderRadius: 10, border: "1.5px solid",
                      borderColor: item.available ? "#a5d6a7" : "#ddd",
                      background: item.available ? "#e8f5e9" : "#f5f5f5",
                      color: item.available ? "#1a4d2e" : "#888",
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>{item.available ? "✅ Available" : "❌ Sold Out"}</button>
                    <button onClick={() => deleteListing(item.id)} style={{
                      padding: "9px 16px", borderRadius: 10, border: "1.5px solid #ffcdd2",
                      background: "#fff5f5", color: "#c62828", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>🗑 Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>Loading produce...
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>🌾</div>
                <div style={{ fontWeight: 700, color: "#333", fontSize: 15 }}>No produce listed yet</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>Be the first to sell your crops!</div>
                <button onClick={() => setShowForm(true)} style={{
                  marginTop: 16, padding: "11px 24px", borderRadius: 12, border: "none",
                  background: "#ff8f00", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14,
                }}>+ List Produce</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {listings.map(item => {
                  const colors = CAT_COLORS[item.category] || CAT_COLORS.vegetable;
                  return (
                    <div key={item.id} style={{
                      background: "white", borderRadius: 16,
                      overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                      display: "flex", flexDirection: "column",
                    }}>
                      {item.image_data ? (
                        <img
                          src={`data:image/jpeg;base64,${item.image_data}`}
                          alt={item.crop_name}
                          style={{ width: "100%", height: 100, objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{
                          height: 80, display: "flex", alignItems: "center", justifyContent: "center",
                          background: colors.bg, fontSize: 36,
                        }}>
                          {CATEGORIES.find(c => c.id === item.category)?.icon || "🌿"}
                        </div>
                      )}
                      <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>
                          {item.crop_name}
                        </div>
                        <div style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: 10,
                          background: colors.bg, color: colors.text,
                          fontSize: 10, fontWeight: 700, marginBottom: 6, alignSelf: "flex-start",
                        }}>{item.category}</div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#ff8f00", marginBottom: 4 }}>
                          ₹{item.price}<span style={{ fontSize: 11, fontWeight: 400, color: "#888" }}>/{item.unit}</span>
                        </div>
                        {item.quantity && (
                          <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
                            {item.quantity} {item.unit}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>
                          📍 {item.location}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: 11, color: "#555", marginBottom: 8, lineHeight: 1.4 }}>
                            {item.description.slice(0, 60)}{item.description.length > 60 ? "..." : ""}
                          </div>
                        )}
                        <a href={`tel:${item.phone}`} style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "9px", borderRadius: 10, background: "#1a4d2e", color: "white",
                          fontWeight: 700, fontSize: 12, textDecoration: "none", marginTop: "auto",
                        }}>📞 Contact</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
