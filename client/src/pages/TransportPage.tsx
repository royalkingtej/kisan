import React, { useState, useEffect, useRef } from "react";

interface Listing {
  id: number;
  type: string;
  vehicleName: string;
  capacity: string;
  pricePerKm: number;
  phone: string;
  fromLocation: string;
  toLocation: string;
  lat: number;
  lng: number;
  available: boolean;
}

const VEHICLE_ICONS: Record<string, string> = {
  truck: "🚚",
  tractor: "🚜",
  van: "🚐",
  pickup: "🛻",
};

const INDIAN_CITIES = [
  { name: "Mumbai", lat: 19.076, lng: 72.877 },
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898 },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Patna", lat: 25.5941, lng: 85.1376 },
  { name: "Amritsar", lat: 31.634, lng: 74.8723 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
];

function MapView({ listings, selected, onSelect, userLocation }: {
  listings: Listing[];
  selected: number | null;
  onSelect: (id: number) => void;
  userLocation: { lat: number; lng: number; name: string } | null;
}) {
  const mapRef = useRef<any>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (mapInstance.current) return;
    import("leaflet").then((L) => {
      const map = L.default.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
      });
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapInstance.current = map;

      if (userLocation) {
        const userIcon = L.default.divIcon({
          className: "",
          html: `<div style="background:#2563eb;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.default.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`📍 You are here: ${userLocation.name}`);
        map.setView([userLocation.lat, userLocation.lng], 7);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    import("leaflet").then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      listings.forEach((listing) => {
        if (!listing.lat || !listing.lng) return;
        const icon = L.default.divIcon({
          className: "",
          html: `<div style="background:${listing.available ? "#1a4d2e" : "#aaa"};color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;${selected === listing.id ? "outline:3px solid #ff9800;" : ""}">
            ${VEHICLE_ICONS[listing.type] || "🚗"}
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        const marker = L.default.marker([listing.lat, listing.lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="min-width:160px">
              <strong>${listing.vehicleName}</strong><br/>
              📍 ${listing.fromLocation} → ${listing.toLocation}<br/>
              💰 ₹${listing.pricePerKm}/km<br/>
              📦 ${listing.capacity}<br/>
              ${listing.available ? "✅ Available" : "❌ Not Available"}
            </div>
          `);
        marker.on("click", () => onSelect(listing.id));
        if (selected === listing.id) marker.openPopup();
        markersRef.current.push(marker);
      });
    });
  }, [listings, selected]);

  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;
    mapInstance.current.setView([userLocation.lat, userLocation.lng], 7);
  }, [userLocation]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: 14, overflow: "hidden" }} />;
}

export default function TransportPage({ user }: { user: any }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "truck", vehicleName: "", capacity: "", pricePerKm: "",
    phone: user?.phone || "", fromLocation: "", toLocation: "",
  });

  useEffect(() => {
    fetchListings();
    const saved = localStorage.getItem("kisan_location");
    if (saved) setUserLocation(JSON.parse(saved));
    else detectLocation();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      const res = await fetch("/api/transport");
      setListings(await res.json());
    } catch {}
    setLoading(false);
  }

  function detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: "Your Location" };
          setUserLocation(loc);
          localStorage.setItem("kisan_location", JSON.stringify(loc));
        },
        () => {}
      );
    }
  }

  function selectCity(city: typeof INDIAN_CITIES[0]) {
    const loc = { lat: city.lat, lng: city.lng, name: city.name };
    setUserLocation(loc);
    localStorage.setItem("kisan_location", JSON.stringify(loc));
    setShowLocationPicker(false);
    setLocationSearch("");
  }

  async function submitListing(e: React.FormEvent) {
    e.preventDefault();
    const city = INDIAN_CITIES.find((c) => c.name.toLowerCase() === form.fromLocation.toLowerCase()) || INDIAN_CITIES[0];
    const res = await fetch("/api/transport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pricePerKm: parseFloat(form.pricePerKm) || 0, lat: city.lat, lng: city.lng, userId: user?.id }),
    });
    if (res.ok) {
      setShowForm(false);
      fetchListings();
    }
  }

  const filtered = filter === "all" ? listings : listings.filter((l) => l.type === filter);
  const selectedListing = listings.find((l) => l.id === selected);
  const filteredCities = INDIAN_CITIES.filter((c) => c.name.toLowerCase().includes(locationSearch.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "12px 16px", background: "white", borderBottom: "1px solid #eee", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>🚚 Transport Services</div>
          <button onClick={() => setShowForm(!showForm)} style={{
            padding: "7px 14px", borderRadius: 20, border: "none", background: "#1a4d2e",
            color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>+ List Vehicle</button>
        </div>

        <button
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px",
            borderRadius: 10, border: "1.5px solid #ddd", background: "#f8f8f8", cursor: "pointer",
            fontSize: 13, color: "#333", marginBottom: 10, textAlign: "left",
          }}
        >
          <span>📍</span>
          <span style={{ flex: 1 }}>{userLocation ? userLocation.name : "Select your location"}</span>
          <span style={{ color: "#888" }}>▾</span>
        </button>

        {showLocationPicker && (
          <div style={{
            background: "white", border: "1.5px solid #ddd", borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 10, marginBottom: 10,
            maxHeight: 200, overflowY: "auto", zIndex: 200,
          }}>
            <input
              placeholder="Search city..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #eee", fontSize: 13, marginBottom: 8, boxSizing: "border-box" }}
              autoFocus
            />
            <div style={{ cursor: "pointer", padding: "7px 8px", borderRadius: 8, fontSize: 13, color: "#2563eb", fontWeight: 600, marginBottom: 4 }}
              onClick={detectLocation}
            >📡 Detect my location</div>
            {filteredCities.map((city) => (
              <div key={city.name} onClick={() => selectCity(city)} style={{
                padding: "7px 8px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                background: userLocation?.name === city.name ? "#e8f5e9" : "transparent",
                color: userLocation?.name === city.name ? "#1a4d2e" : "#333",
                fontWeight: userLocation?.name === city.name ? 700 : 400,
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = userLocation?.name === city.name ? "#e8f5e9" : "transparent")}
              >{city.name}</div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {[["all", "All"], ["truck", "🚚 Truck"], ["tractor", "🚜 Tractor"], ["van", "🚐 Van"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
              borderColor: filter === v ? "#1a4d2e" : "#ddd",
              background: filter === v ? "#1a4d2e" : "white",
              color: filter === v ? "white" : "#555",
              fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={{ padding: 16, background: "#f0faf4", borderBottom: "1px solid #c8e6c9", flexShrink: 0 }}>
          <form onSubmit={submitListing} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a4d2e" }}>List Your Vehicle</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, background: "white" }}>
                <option value="truck">🚚 Truck</option>
                <option value="tractor">🚜 Tractor</option>
                <option value="van">🚐 Van</option>
              </select>
              <input placeholder="Vehicle Name" value={form.vehicleName} onChange={(e) => setForm((f) => ({ ...f, vehicleName: e.target.value }))} required
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
              <input placeholder="Capacity (e.g. 2 Tonnes)" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
              <input placeholder="Price per KM (₹)" type="number" value={form.pricePerKm} onChange={(e) => setForm((f) => ({ ...f, pricePerKm: e.target.value }))}
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
              <input placeholder="From City" value={form.fromLocation} onChange={(e) => setForm((f) => ({ ...f, fromLocation: e.target.value }))}
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
              <input placeholder="To City" value={form.toLocation} onChange={(e) => setForm((f) => ({ ...f, toLocation: e.target.value }))}
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
              <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required
                style={{ padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, gridColumn: "span 2" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button type="submit" style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "#1a4d2e", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>List Vehicle</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ height: 220, padding: "0 12px 8px", flexShrink: 0 }}>
        <MapView listings={filtered} selected={selected} onSelect={setSelected} userLocation={userLocation} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 30, color: "#888" }}>Loading vehicles...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "#888" }}>No vehicles found</div>
        ) : (
          filtered.map((listing) => (
            <div key={listing.id} onClick={() => setSelected(selected === listing.id ? null : listing.id)}
              style={{
                background: "white", borderRadius: 14, padding: "14px", marginBottom: 10,
                boxShadow: selected === listing.id ? "0 4px 16px rgba(26,77,46,0.2)" : "0 1px 6px rgba(0,0,0,0.07)",
                border: selected === listing.id ? "2px solid #1a4d2e" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: listing.available ? "#e8f5e9" : "#f5f5f5",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                  }}>
                    {VEHICLE_ICONS[listing.type] || "🚗"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{listing.vehicleName}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      {listing.fromLocation} → {listing.toLocation}
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: listing.available ? "#e8f5e9" : "#f5f5f5",
                  color: listing.available ? "#1a4d2e" : "#888",
                }}>{listing.available ? "Available" : "Busy"}</div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                {listing.capacity && <span style={{ fontSize: 12, color: "#555", background: "#f5f5f5", padding: "4px 10px", borderRadius: 20 }}>📦 {listing.capacity}</span>}
                {listing.pricePerKm && <span style={{ fontSize: 12, color: "#555", background: "#f5f5f5", padding: "4px 10px", borderRadius: 20 }}>💰 ₹{listing.pricePerKm}/km</span>}
              </div>
              {selected === listing.id && listing.available && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                  <a href={`tel:${listing.phone}`} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "11px", borderRadius: 10, background: "#1a4d2e", color: "white",
                    fontWeight: 700, fontSize: 14, textDecoration: "none",
                  }}>📞 Call {listing.phone}</a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        .leaflet-container { font-family: inherit; }
      `}</style>
    </div>
  );
}
