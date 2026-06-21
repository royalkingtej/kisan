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

const LISTINGS = [
  {
    id: "1",
    area: "5.5 Acres",
    location: "Ludhiana, Punjab",
    district: "Ludhiana",
    type: "Sale",
    price: "₹28L/acre",
    water: "Canal + Borewell",
    soil: "Loamy",
    verified: true,
    contact: "+91 98765 43210",
    docs: true,
    color: "#2E7D32",
  },
  {
    id: "2",
    area: "12 Acres",
    location: "Guntur, Andhra Pradesh",
    district: "Guntur",
    type: "Lease",
    price: "₹18K/acre/year",
    water: "Canal Irrigation",
    soil: "Black Cotton",
    verified: true,
    contact: "+91 91234 56789",
    docs: false,
    color: "#1565C0",
  },
  {
    id: "3",
    area: "3 Acres",
    location: "Nashik, Maharashtra",
    district: "Nashik",
    type: "Sale",
    price: "₹35L/acre",
    water: "Drip Irrigation",
    soil: "Red Laterite",
    verified: true,
    contact: "+91 87654 32100",
    docs: true,
    color: "#BF360C",
  },
  {
    id: "4",
    area: "8 Acres",
    location: "Madurai, Tamil Nadu",
    district: "Madurai",
    type: "Lease",
    price: "₹14K/acre/year",
    water: "Borewell",
    soil: "Sandy Loam",
    verified: false,
    contact: "+91 76543 21098",
    docs: false,
    color: "#880E4F",
  },
];

export default function LandMarketScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = typeFilter === "All" ? LISTINGS : LISTINGS.filter((l) => l.type === typeFilter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#01579B", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Land Marketplace</Text>
        <TouchableOpacity style={[styles.listBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Feather name="plus" size={14} color="#fff" />
          <Text style={styles.listBtnText}>{tr("listProperty")}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.filterRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {["All", "Sale", "Lease"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filter, typeFilter === f && { borderBottomColor: "#01579B", borderBottomWidth: 2 }]}
            onPress={() => setTypeFilter(f)}
          >
            <Text style={[styles.filterText, { color: typeFilter === f ? "#01579B" : colors.mutedForeground }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {filtered.map((listing) => (
          <View key={listing.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.cardHeader, { backgroundColor: listing.color }]}>
              <View>
                <Text style={styles.area}>{listing.area}</Text>
                <View style={styles.locationRow}>
                  <Feather name="map-pin" size={12} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.location}>{listing.location}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={[styles.typeBadge, { backgroundColor: listing.type === "Sale" ? "#FF8F00" : "#0288D1" }]}>
                  <Text style={styles.typeBadgeText}>{listing.type}</Text>
                </View>
                <Text style={styles.price}>{listing.price}</Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={[styles.detail, { backgroundColor: colors.muted }]}>
                <Feather name="droplet" size={13} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.foreground }]}>{listing.water}</Text>
              </View>
              <View style={[styles.detail, { backgroundColor: colors.muted }]}>
                <Feather name="layers" size={13} color={colors.secondary} />
                <Text style={[styles.detailText, { color: colors.foreground }]}>{listing.soil} Soil</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <View style={styles.badges}>
                {listing.verified && (
                  <View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
                    <Feather name="check-circle" size={11} color={colors.primary} />
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{tr("verified")}</Text>
                  </View>
                )}
                {listing.docs && (
                  <View style={[styles.badge, { backgroundColor: "#1565C020" }]}>
                    <Feather name="file-text" size={11} color="#1565C0" />
                    <Text style={[styles.badgeText, { color: "#1565C0" }]}>Clear Title</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: "#01579B" }]}>
                <Feather name="phone" size={13} color="#fff" />
                <Text style={styles.contactBtnText}>{tr("contactSeller")}</Text>
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
  listBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  listBtnText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  filterRow: { flexDirection: "row", borderBottomWidth: 1 },
  filter: { flex: 1, paddingVertical: 12, alignItems: "center" },
  filterText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  cardHeader: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  area: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular" },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  typeBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  price: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  details: { flexDirection: "row", gap: 8, padding: 14 },
  detail: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6, padding: 10, borderRadius: 10 },
  detailText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingBottom: 14 },
  badges: { flexDirection: "row", gap: 6 },
  badge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  contactBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  contactBtnText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
