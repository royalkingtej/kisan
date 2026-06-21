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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

interface MSPPrice {
  crop: string;
  msp: number;
  ap: number;
  ts: number;
  pn: number;
  up: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

const MSP_DATA: MSPPrice[] = [
  { crop: "Wheat", msp: 2275, ap: 2310, ts: 2290, pn: 2350, up: 2280, unit: "₹/qtl", trend: "up" },
  { crop: "Paddy", msp: 2300, ap: 2420, ts: 2380, pn: 2250, up: 2310, unit: "₹/qtl", trend: "up" },
  { crop: "Chili", msp: 5400, ap: 6200, ts: 5950, pn: 5100, up: 5300, unit: "₹/qtl", trend: "up" },
  { crop: "Maize", msp: 2090, ap: 2150, ts: 2120, pn: 2000, up: 2080, unit: "₹/qtl", trend: "stable" },
  { crop: "Cotton", msp: 7020, ap: 7200, ts: 7150, pn: 6900, up: 7050, unit: "₹/qtl", trend: "down" },
  { crop: "Soybean", msp: 4892, ap: 5100, ts: 5050, pn: 4800, up: 4900, unit: "₹/qtl", trend: "up" },
  { crop: "Groundnut", msp: 6783, ap: 7000, ts: 6900, pn: 6600, up: 6750, unit: "₹/qtl", trend: "stable" },
  { crop: "Mustard", msp: 5950, ap: 6100, ts: 5900, pn: 6200, up: 5980, unit: "₹/qtl", trend: "up" },
  { crop: "Sugarcane", msp: 340, ap: 370, ts: 355, pn: 345, up: 342, unit: "₹/qtl", trend: "stable" },
  { crop: "Sunflower", msp: 7280, ap: 7500, ts: 7400, pn: 7100, up: 7250, unit: "₹/qtl", trend: "down" },
];

const STATES = ["AP", "TS", "PB", "UP"];
const STATE_NAMES: Record<string, string> = {
  AP: "Andhra Pradesh",
  TS: "Telangana",
  PB: "Punjab",
  UP: "Uttar Pradesh",
};

const SEASONS = ["All", "Kharif", "Rabi", "Zaid"];
const KHARIF = ["Paddy", "Maize", "Cotton", "Soybean", "Groundnut", "Sunflower"];
const RABI = ["Wheat", "Mustard", "Chili"];
const ZAID = ["Sugarcane"];

export default function MarketScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [sortBy, setSortBy] = useState<"msp" | "crop">("crop");

  const filtered = MSP_DATA.filter((item) => {
    if (selectedSeason === "Kharif") return KHARIF.includes(item.crop);
    if (selectedSeason === "Rabi") return RABI.includes(item.crop);
    if (selectedSeason === "Zaid") return ZAID.includes(item.crop);
    return true;
  }).sort((a, b) =>
    sortBy === "msp" ? b.msp - a.msp : a.crop.localeCompare(b.crop)
  );

  const getBestState = (item: MSPPrice) => {
    const vals: Record<string, number> = { AP: item.ap, TS: item.ts, PB: item.pn, UP: item.up };
    return Object.entries(vals).sort((a, b) => b[1] - a[1])[0];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            paddingTop: isWeb ? 67 : insets.top + 12,
          },
        ]}
      >
        <Text style={styles.headerTitle}>{tr("stateMandi")}</Text>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
          onPress={() => setSortBy(sortBy === "msp" ? "crop" : "msp")}
        >
          <Feather name="sliders" size={14} color="#fff" />
          <Text style={styles.sortText}>{sortBy === "msp" ? "By MSP" : "A-Z"}</Text>
        </TouchableOpacity>
      </View>

      {/* Season filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterRow, { backgroundColor: colors.card }]}
        contentContainerStyle={styles.filterContent}
      >
        {SEASONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedSeason === s ? colors.primary : colors.muted,
              },
            ]}
            onPress={() => setSelectedSeason(s)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedSeason === s ? "#fff" : colors.mutedForeground },
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* State header */}
      <View style={[styles.stateHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.stateCol0, { color: colors.mutedForeground }]}>Crop</Text>
        <Text style={[styles.stateCol, { color: colors.mutedForeground }]}>MSP</Text>
        {STATES.map((s) => (
          <Text key={s} style={[styles.stateCol, { color: colors.mutedForeground }]}>{s}</Text>
        ))}
        <Text style={[styles.stateCol, { color: colors.mutedForeground }]}>Best</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isWeb ? 100 : 80 }}>
        {filtered.map((item) => {
          const [bestState, bestVal] = getBestState(item);
          return (
            <View
              key={item.crop}
              style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            >
              <View style={styles.cropCell}>
                <View style={[styles.trendDot, {
                  backgroundColor: item.trend === "up" ? colors.success : item.trend === "down" ? colors.error : colors.warning
                }]} />
                <Text style={[styles.cropName, { color: colors.foreground }]}>{item.crop}</Text>
              </View>
              <Text style={[styles.priceCell, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                {item.msp.toLocaleString()}
              </Text>
              {[item.ap, item.ts, item.pn, item.up].map((val, i) => (
                <Text key={i} style={[styles.priceCell, { color: colors.foreground }]}>
                  {val.toLocaleString()}
                </Text>
              ))}
              <View style={[styles.bestCell, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.bestText, { color: colors.primary }]}>{bestState}</Text>
                <Text style={[styles.bestVal, { color: colors.primary }]}>{bestVal.toLocaleString()}</Text>
              </View>
            </View>
          );
        })}

        {/* AI Advice */}
        <View style={[styles.adviceCard, { backgroundColor: colors.secondary + "15", borderColor: colors.secondary }]}>
          <Feather name="zap" size={16} color={colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.adviceTitle, { color: colors.secondary }]}>AI Arbitrage Alert</Text>
            <Text style={[styles.adviceText, { color: colors.foreground }]}>
              Best time to sell Wheat: Punjab markets offering 3.3% above MSP. Transport cost to Punjab from UP: ~₹180/qtl — net gain ₹75/qtl.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sortText: { color: "#fff", fontSize: 12, fontFamily: "Inter_500Medium" },
  filterRow: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
  },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  stateHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  stateCol0: { flex: 1.5, fontSize: 11, fontFamily: "Inter_600SemiBold" },
  stateCol: { flex: 1, fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    alignItems: "center",
  },
  cropCell: { flex: 1.5, flexDirection: "row", alignItems: "center", gap: 6 },
  trendDot: { width: 7, height: 7, borderRadius: 3.5 },
  cropName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  priceCell: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  bestCell: {
    flex: 1,
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 2,
  },
  bestText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  bestVal: { fontSize: 11, fontFamily: "Inter_700Bold" },
  adviceCard: {
    flexDirection: "row",
    margin: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    alignItems: "flex-start",
  },
  adviceTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  adviceText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
