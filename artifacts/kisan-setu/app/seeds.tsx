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

const CATEGORIES = ["All", "Kharif", "Rabi", "Vegetables", "Horticulture"];

const SEEDS = [
  {
    name: "HD-3086 Wheat",
    variety: "High-yielding semi-dwarf",
    season: "Rabi",
    certBody: "ICAR-IIWBR",
    certNo: "NSC/WH/2024/001",
    yield: "22-28 qtl/acre",
    duration: "110-120 days",
    features: ["Rust resistant", "Heat tolerant", "High protein content"],
    price: "₹350/kg",
    availability: "High",
    color: "#F57F17",
    category: "Rabi",
  },
  {
    name: "IR-64 Paddy",
    variety: "Indica type",
    season: "Kharif",
    certBody: "ICAR-NRRI",
    certNo: "NSC/PR/2024/028",
    yield: "45-55 qtl/acre",
    duration: "125-130 days",
    features: ["Blast resistant", "High milling recovery", "Fine grain"],
    price: "₹220/kg",
    availability: "High",
    color: "#2E7D32",
    category: "Kharif",
  },
  {
    name: "MECH-162 Bt Cotton",
    variety: "Bt transgenic hybrid",
    season: "Kharif",
    certBody: "GEAC Approved",
    certNo: "GEAC/BT/2024/162",
    yield: "12-18 qtl/acre",
    duration: "170-180 days",
    features: ["Bollworm resistant", "High fiber length", "GEAC certified"],
    price: "₹950/packet",
    availability: "Medium",
    color: "#37474F",
    category: "Kharif",
  },
  {
    name: "NRC-86 Soybean",
    variety: "Determinate type",
    season: "Kharif",
    certBody: "ICAR-IISR",
    certNo: "NSC/SB/2024/086",
    yield: "15-20 qtl/acre",
    duration: "90-95 days",
    features: ["Yellow mosaic resistant", "High protein", "Early maturity"],
    price: "₹180/kg",
    availability: "High",
    color: "#558B2F",
    category: "Kharif",
  },
  {
    name: "Pusa Sarson-27 Mustard",
    variety: "Indian yellow sarson",
    season: "Rabi",
    certBody: "ICAR-DRMR",
    certNo: "NSC/MS/2024/027",
    yield: "8-12 qtl/acre",
    duration: "115-130 days",
    features: ["White rust tolerant", "High oil content (42%)", "Short duration"],
    price: "₹280/kg",
    availability: "High",
    color: "#F9A825",
    category: "Rabi",
  },
  {
    name: "Pusa Ruby Tomato",
    variety: "Determinate hybrid",
    season: "Rabi/Kharif",
    certBody: "ICAR-IARI",
    certNo: "NSC/TM/2024/012",
    yield: "150-200 qtl/acre",
    duration: "65-70 days",
    features: ["Leaf curl tolerant", "High lycopene", "Good shelf life"],
    price: "₹1,200/100g",
    availability: "Medium",
    color: "#C62828",
    category: "Vegetables",
  },
  {
    name: "Pusa Ageti Pea",
    variety: "Garden pea",
    season: "Rabi",
    certBody: "ICAR-IARI",
    certNo: "NSC/PE/2024/008",
    yield: "40-50 qtl/acre (pods)",
    duration: "55-60 days",
    features: ["Early maturity", "Powdery mildew resistant", "High sugar content"],
    price: "₹150/kg",
    availability: "High",
    color: "#1B5E20",
    category: "Vegetables",
  },
  {
    name: "CO-7 Sugarcane",
    variety: "Mid-late maturing variety",
    season: "Kharif",
    certBody: "ICAR-SBI",
    certNo: "NSC/SC/2024/007",
    yield: "400-500 qtl/acre",
    duration: "12 months",
    features: ["High sucrose (20%)", "Drought tolerant", "Red rot resistant"],
    price: "₹45/set (3 buds)",
    availability: "Low",
    color: "#006064",
    category: "Horticulture",
  },
];

const GOV_AGENCIES = [
  { name: "National Seeds Corporation (NSC)", short: "NSC", color: "#1B5E20", url: "nscindia.com" },
  { name: "State Farms Corporation of India (SFCI)", short: "SFCI", color: "#1565C0", url: "sfci.nic.in" },
  { name: "ICAR Research Institutes", short: "ICAR", color: "#4A148C", url: "icar.org.in" },
  { name: "Central Seed Testing Station", short: "CSTS", color: "#E65100", url: "seednet.gov.in" },
];

export default function SeedsScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = selectedCategory === "All" ? SEEDS : SEEDS.filter((s) => s.category === selectedCategory);

  const availColor = (avail: string) => {
    if (avail === "High") return colors.success ?? "#2E7D32";
    if (avail === "Medium") return colors.warning ?? "#FF8F00";
    return colors.error ?? "#C62828";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#33691E", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{tr("seeds")}</Text>
          <Text style={styles.headerSub}>{tr("seedsSubtitle")}</Text>
        </View>
        <Feather name="award" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      {/* Certifying bodies strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.agencyStrip, { backgroundColor: colors.card }]} contentContainerStyle={styles.agencyContent}>
        {GOV_AGENCIES.map((ag) => (
          <View key={ag.short} style={[styles.agencyChip, { backgroundColor: ag.color }]}>
            <Feather name="shield" size={11} color="#fff" />
            <Text style={styles.agencyShort}>{ag.short}</Text>
          </View>
        ))}
        <Text style={[styles.agencyNote, { color: colors.mutedForeground }]}>Certifying Bodies</Text>
      </ScrollView>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { backgroundColor: colors.card }]} contentContainerStyle={styles.filterContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, { backgroundColor: selectedCategory === cat ? "#33691E" : colors.muted }]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, { color: selectedCategory === cat ? "#fff" : colors.mutedForeground }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {filtered.map((seed) => (
          <TouchableOpacity
            key={seed.name}
            style={[styles.seedCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: seed.color, borderLeftWidth: 4 }]}
            onPress={() => setExpanded(expanded === seed.name ? null : seed.name)}
            activeOpacity={0.9}
          >
            <View style={styles.seedTop}>
              <View style={[styles.seasonBadge, { backgroundColor: seed.color }]}>
                <Text style={styles.seasonBadgeText}>{seed.season}</Text>
              </View>
              <View style={[styles.certBadge, { backgroundColor: colors.primary + "15" }]}>
                <Feather name="check-circle" size={11} color={colors.primary} />
                <Text style={[styles.certBadgeText, { color: colors.primary }]}>{seed.certBody}</Text>
              </View>
              <Feather name={expanded === seed.name ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
            </View>

            <Text style={[styles.seedName, { color: colors.foreground }]}>{seed.name}</Text>
            <Text style={[styles.seedVariety, { color: colors.mutedForeground }]}>{seed.variety}</Text>

            <View style={styles.seedStats}>
              <View style={[styles.seedStat, { backgroundColor: seed.color + "15" }]}>
                <Feather name="trending-up" size={12} color={seed.color} />
                <Text style={[styles.seedStatText, { color: seed.color }]}>{seed.yield}</Text>
              </View>
              <View style={[styles.seedStat, { backgroundColor: colors.muted }]}>
                <Feather name="calendar" size={12} color={colors.mutedForeground} />
                <Text style={[styles.seedStatText, { color: colors.mutedForeground }]}>{seed.duration}</Text>
              </View>
              <View style={[styles.seedStat, { backgroundColor: "#FF8F0015" }]}>
                <Feather name="tag" size={12} color="#FF8F00" />
                <Text style={[styles.seedStatText, { color: "#FF8F00" }]}>{seed.price}</Text>
              </View>
            </View>

            {expanded === seed.name && (
              <View style={styles.expandedSection}>
                <View style={[styles.certBox, { backgroundColor: "#1B5E2010", borderColor: "#1B5E2040" }]}>
                  <Feather name="award" size={16} color="#1B5E20" />
                  <View>
                    <Text style={[styles.certBoxTitle, { color: "#1B5E20" }]}>Certification No.</Text>
                    <Text style={[styles.certBoxNo, { color: colors.foreground }]}>{seed.certNo}</Text>
                  </View>
                </View>

                <Text style={[styles.expandLabel, { color: colors.mutedForeground }]}>KEY FEATURES</Text>
                {seed.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check-circle" size={13} color={seed.color} />
                    <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
                  </View>
                ))}

                <View style={[styles.availBadge, { backgroundColor: availColor(seed.availability) + "20" }]}>
                  <View style={[styles.availDot, { backgroundColor: availColor(seed.availability) }]} />
                  <Text style={[styles.availText, { color: availColor(seed.availability) }]}>
                    Availability: {seed.availability}
                  </Text>
                </View>

                <TouchableOpacity style={[styles.orderBtn, { backgroundColor: seed.color }]}>
                  <Feather name="shopping-bag" size={16} color="#fff" />
                  <Text style={styles.orderBtnText}>Order Certified Seeds</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Government portals */}
        <View style={[styles.portalsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.portalsTitle, { color: colors.foreground }]}>Official Seed Portals</Text>
          {GOV_AGENCIES.map((ag, idx) => (
            <View key={ag.name} style={[styles.portalRow, { borderBottomColor: colors.border, borderBottomWidth: idx < GOV_AGENCIES.length - 1 ? 0.5 : 0 }]}>
              <View style={[styles.portalBadge, { backgroundColor: ag.color }]}>
                <Text style={styles.portalBadgeText}>{ag.short}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.portalName, { color: colors.foreground }]}>{ag.name}</Text>
                <Text style={[styles.portalUrl, { color: colors.primary }]}>{ag.url}</Text>
              </View>
              <Feather name="external-link" size={14} color={colors.mutedForeground} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  agencyStrip: { maxHeight: 44 },
  agencyContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, alignItems: "center" },
  agencyChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  agencyShort: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  agencyNote: { fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: 4 },
  filterRow: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  seedCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  seedTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  seasonBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  seasonBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  certBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, flex: 1 },
  certBadgeText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  seedName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2 },
  seedVariety: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 10 },
  seedStats: { flexDirection: "row", gap: 6 },
  seedStat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 6, paddingVertical: 6, borderRadius: 8 },
  seedStatText: { fontSize: 10, fontFamily: "Inter_500Medium", flex: 1 },
  expandedSection: { marginTop: 12, gap: 10 },
  certBox: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, borderWidth: 1 },
  certBoxTitle: { fontSize: 10, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  certBoxNo: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  expandLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  availBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignSelf: "flex-start" },
  availDot: { width: 7, height: 7, borderRadius: 3.5 },
  availText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  orderBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 12 },
  orderBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  portalsCard: { borderRadius: 16, borderWidth: 1, padding: 14 },
  portalsTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  portalRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 },
  portalBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  portalBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  portalName: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 2 },
  portalUrl: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
