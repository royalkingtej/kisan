import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

const WAREHOUSES = [
  {
    name: "Punjab State Warehousing Corp",
    location: "Ludhiana, PB",
    distance: "12 km",
    capacity: "5000 MT",
    available: "1200 MT",
    pricePerDay: "₹2.5/qtl",
    type: "Government",
    certified: true,
    cold: false,
    rating: 4.5,
  },
  {
    name: "Central Warehousing Corp",
    location: "Amritsar, PB",
    distance: "45 km",
    capacity: "10000 MT",
    available: "3500 MT",
    pricePerDay: "₹3.0/qtl",
    type: "Government",
    certified: true,
    cold: false,
    rating: 4.7,
  },
  {
    name: "AgriFresh Cold Storage",
    location: "Patiala, PB",
    distance: "28 km",
    capacity: "2000 MT",
    available: "400 MT",
    pricePerDay: "₹8.5/qtl",
    type: "Private",
    certified: true,
    cold: true,
    rating: 4.8,
  },
  {
    name: "Village Cooperative Godown",
    location: "Raikot, PB",
    distance: "8 km",
    capacity: "500 MT",
    available: "200 MT",
    pricePerDay: "₹1.5/qtl",
    type: "Cooperative",
    certified: false,
    cold: false,
    rating: 4.0,
  },
  {
    name: "eNAM Linked Warehouse",
    location: "Bathinda, PB",
    distance: "65 km",
    capacity: "8000 MT",
    available: "2200 MT",
    pricePerDay: "₹2.8/qtl",
    type: "Government",
    certified: true,
    cold: false,
    rating: 4.6,
  },
];

const MY_STORAGE = [
  { warehouse: "Punjab State WC", crop: "Wheat", quantity: "15 qtl", since: "15 Jan 2026", expiry: "14 Apr 2026", daysLeft: 22 },
];

export default function WarehouseScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "Government", "Private", "Cooperative", "Cold Storage"];

  const filtered = WAREHOUSES.filter((w) => {
    if (filter === "All") return true;
    if (filter === "Cold Storage") return w.cold;
    return w.type === filter;
  });

  const typeColor = (type: string) => {
    if (type === "Government") return "#1565C0";
    if (type === "Private") return "#880E4F";
    return "#2E7D32";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#006064", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("warehouse")}</Text>
        <Feather name="map" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      {/* My Storage */}
      {MY_STORAGE.length > 0 && (
        <View style={[styles.myStorageCard, { backgroundColor: "#006064" }]}>
          <Text style={styles.myStorageTitle}>My Active Storage</Text>
          {MY_STORAGE.map((s) => (
            <View key={s.crop} style={[styles.storageItem, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <View>
                <Text style={styles.storageWarehouse}>{s.warehouse}</Text>
                <Text style={styles.storageCrop}>{s.crop} · {s.quantity}</Text>
              </View>
              <View style={[styles.expiryBadge, { backgroundColor: s.daysLeft <= 30 ? "#FF5252" : "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.expiryText}>{s.daysLeft}d left</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { backgroundColor: colors.card }]} contentContainerStyle={styles.filterContent}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, { backgroundColor: filter === f ? "#006064" : colors.muted }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, { color: filter === f ? "#fff" : colors.mutedForeground }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {filtered.map((w) => (
          <View key={w.name} style={[styles.warehouseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.whTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.whName, { color: colors.foreground }]}>{w.name}</Text>
                <View style={styles.whLocationRow}>
                  <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.whLocation, { color: colors.mutedForeground }]}>{w.location} · {w.distance}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <View style={[styles.typeBadge, { backgroundColor: typeColor(w.type) }]}>
                  <Text style={styles.typeBadgeText}>{w.type}</Text>
                </View>
                {w.cold && (
                  <View style={[styles.coldBadge, { backgroundColor: "#0288D1" }]}>
                    <Feather name="thermometer" size={10} color="#fff" />
                    <Text style={styles.coldText}>Cold</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.whStats}>
              <View style={[styles.whStat, { backgroundColor: colors.muted }]}>
                <Text style={[styles.whStatVal, { color: colors.primary }]}>{w.available}</Text>
                <Text style={[styles.whStatLabel, { color: colors.mutedForeground }]}>{tr("available")}</Text>
              </View>
              <View style={[styles.whStat, { backgroundColor: colors.muted }]}>
                <Text style={[styles.whStatVal, { color: colors.foreground }]}>{w.capacity}</Text>
                <Text style={[styles.whStatLabel, { color: colors.mutedForeground }]}>{tr("capacity")}</Text>
              </View>
              <View style={[styles.whStat, { backgroundColor: colors.muted }]}>
                <Text style={[styles.whStatVal, { color: colors.secondary }]}>{w.pricePerDay}</Text>
                <Text style={[styles.whStatLabel, { color: colors.mutedForeground }]}>{tr("pricePerDay")}</Text>
              </View>
            </View>

            <View style={styles.whFooter}>
              <View style={styles.ratingRow}>
                <Feather name="star" size={13} color="#FFB300" />
                <Text style={[styles.ratingText, { color: colors.foreground }]}>{w.rating}</Text>
                {w.certified && (
                  <View style={[styles.certBadge, { backgroundColor: colors.primary + "20" }]}>
                    <Feather name="check-circle" size={11} color={colors.primary} />
                    <Text style={[styles.certText, { color: colors.primary }]}>Certified</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={[styles.bookBtn, { backgroundColor: "#006064" }]}>
                <Text style={styles.bookBtnText}>{tr("bookStorage")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  myStorageCard: { padding: 16 },
  myStorageTitle: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 8, letterSpacing: 0.5 },
  storageItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 12 },
  storageWarehouse: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  storageCrop: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontFamily: "Inter_400Regular" },
  expiryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  expiryText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  filterRow: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  warehouseCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  whTop: { flexDirection: "row", marginBottom: 12, gap: 8 },
  whName: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 3 },
  whLocationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  whLocation: { fontSize: 12, fontFamily: "Inter_400Regular" },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  coldBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  coldText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  whStats: { flexDirection: "row", gap: 8, marginBottom: 12 },
  whStat: { flex: 1, alignItems: "center", padding: 8, borderRadius: 10 },
  whStatVal: { fontSize: 13, fontFamily: "Inter_700Bold", marginBottom: 2 },
  whStatLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  whFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  certBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  certText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  bookBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
