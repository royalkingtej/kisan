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

const SEASONS = [
  {
    name: "Kharif 2026",
    months: "Jun - Oct",
    icon: "sun" as const,
    color: "#E65100",
    crops: [
      { name: "Paddy", yield: "45-50 qtl/acre", roi: "High", water: "High", market: "₹2,300/qtl" },
      { name: "Maize", yield: "25-30 qtl/acre", roi: "Medium", water: "Medium", market: "₹2,090/qtl" },
      { name: "Cotton", yield: "12-15 qtl/acre", roi: "High", water: "Medium", market: "₹7,020/qtl" },
      { name: "Soybean", yield: "15-18 qtl/acre", roi: "Medium", water: "Low", market: "₹4,892/qtl" },
    ],
  },
  {
    name: "Rabi 2025-26",
    months: "Nov - Mar",
    icon: "cloud-snow" as const,
    color: "#1565C0",
    crops: [
      { name: "Wheat", yield: "22-28 qtl/acre", roi: "High", water: "Medium", market: "₹2,275/qtl" },
      { name: "Mustard", yield: "8-10 qtl/acre", roi: "High", water: "Low", market: "₹5,950/qtl" },
      { name: "Chili", yield: "15-20 qtl/acre", roi: "Very High", water: "Medium", market: "₹5,400/qtl" },
      { name: "Gram", yield: "10-12 qtl/acre", roi: "Medium", water: "Low", market: "₹5,440/qtl" },
    ],
  },
  {
    name: "Zaid 2026",
    months: "Mar - Jun",
    icon: "thermometer" as const,
    color: "#2E7D32",
    crops: [
      { name: "Watermelon", yield: "150-180 qtl/acre", roi: "High", water: "Medium", market: "₹400/qtl" },
      { name: "Cucumber", yield: "80-100 qtl/acre", roi: "Medium", water: "High", market: "₹600/qtl" },
      { name: "Mung Bean", yield: "6-8 qtl/acre", roi: "Medium", water: "Low", market: "₹7,755/qtl" },
    ],
  },
];

const IRRIGATION_SCHEDULE = [
  { crop: "Wheat", stage: "Vegetative", interval: "12-15 days", amount: "40-50 mm", method: "Furrow" },
  { crop: "Paddy", stage: "Tillering", interval: "3-5 days", amount: "50-60 mm", method: "Flood" },
  { crop: "Cotton", stage: "Boll Formation", interval: "7-10 days", amount: "30-40 mm", method: "Drip" },
];

const roiColor = (roi: string): string => {
  if (roi === "Very High") return "#1B5E20";
  if (roi === "High") return "#2E7D32";
  if (roi === "Medium") return "#FF8F00";
  return "#757575";
};

export default function CropIntelScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [tab, setTab] = useState<"recommend" | "irrigation" | "yield">("recommend");

  const season = SEASONS[selectedSeason];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#33691E", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("cropIQ")}</Text>
        <Feather name="cpu" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      {/* Tab */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["recommend", "irrigation", "yield"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && { borderBottomColor: "#33691E", borderBottomWidth: 2 }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? "#33691E" : colors.mutedForeground }]}>
              {t === "recommend" ? "Crops" : t === "irrigation" ? "Irrigation" : "Yield"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {tab === "recommend" && (
          <>
            {/* Season Selector */}
            <View style={styles.seasonRow}>
              {SEASONS.map((s, i) => (
                <TouchableOpacity
                  key={s.name}
                  style={[styles.seasonCard, {
                    backgroundColor: selectedSeason === i ? s.color : colors.card,
                    borderColor: selectedSeason === i ? s.color : colors.border,
                  }]}
                  onPress={() => setSelectedSeason(i)}
                >
                  <Feather name={s.icon} size={20} color={selectedSeason === i ? "#fff" : colors.mutedForeground} />
                  <Text style={[styles.seasonName, { color: selectedSeason === i ? "#fff" : colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.seasonMonths, { color: selectedSeason === i ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>{s.months}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* AI Recommendation Banner */}
            <View style={[styles.aiBanner, { backgroundColor: season.color }]}>
              <Feather name="zap" size={18} color="#fff" />
              <View>
                <Text style={styles.aiBannerTitle}>AI Recommendation for Punjab</Text>
                <Text style={styles.aiBannerSub}>Based on your soil, weather & market data</Text>
              </View>
            </View>

            {/* Crop Cards */}
            {season.crops.map((crop, i) => (
              <View key={crop.name} style={[styles.cropCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: season.color, borderLeftWidth: i === 0 ? 4 : 1 }]}>
                {i === 0 && (
                  <View style={[styles.recommendedBadge, { backgroundColor: season.color }]}>
                    <Feather name="star" size={10} color="#fff" />
                    <Text style={styles.recommendedText}>Recommended #1</Text>
                  </View>
                )}
                <View style={styles.cropTop}>
                  <Text style={[styles.cropName, { color: colors.foreground }]}>{crop.name}</Text>
                  <View style={[styles.roiBadge, { backgroundColor: roiColor(crop.roi) }]}>
                    <Text style={styles.roiText}>{crop.roi} ROI</Text>
                  </View>
                </View>
                <View style={styles.cropStats}>
                  <View style={[styles.cropStat, { backgroundColor: colors.muted }]}>
                    <Feather name="trending-up" size={12} color={colors.primary} />
                    <Text style={[styles.cropStatLabel, { color: colors.mutedForeground }]}>Yield</Text>
                    <Text style={[styles.cropStatVal, { color: colors.foreground }]}>{crop.yield}</Text>
                  </View>
                  <View style={[styles.cropStat, { backgroundColor: colors.muted }]}>
                    <Feather name="droplet" size={12} color="#0288D1" />
                    <Text style={[styles.cropStatLabel, { color: colors.mutedForeground }]}>Water</Text>
                    <Text style={[styles.cropStatVal, { color: colors.foreground }]}>{crop.water}</Text>
                  </View>
                  <View style={[styles.cropStat, { backgroundColor: colors.muted }]}>
                    <Feather name="tag" size={12} color={colors.secondary} />
                    <Text style={[styles.cropStatLabel, { color: colors.mutedForeground }]}>MSP</Text>
                    <Text style={[styles.cropStatVal, { color: colors.foreground }]}>{crop.market}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {tab === "irrigation" && (
          <>
            <View style={[styles.aiBanner, { backgroundColor: "#006064" }]}>
              <Feather name="droplet" size={18} color="#fff" />
              <View>
                <Text style={styles.aiBannerTitle}>Smart Irrigation Schedule</Text>
                <Text style={styles.aiBannerSub}>Weather-optimized irrigation timing</Text>
              </View>
            </View>

            {IRRIGATION_SCHEDULE.map((item) => (
              <View key={item.crop} style={[styles.irrigCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.irrigTop}>
                  <Text style={[styles.irrigCrop, { color: colors.foreground }]}>{item.crop}</Text>
                  <View style={[styles.stageBadge, { backgroundColor: "#006064" }]}>
                    <Text style={styles.stageText}>{item.stage}</Text>
                  </View>
                </View>
                <View style={styles.irrigStats}>
                  <View style={[styles.irrigStat, { backgroundColor: colors.muted }]}>
                    <Feather name="calendar" size={14} color={colors.primary} />
                    <Text style={[styles.irrigStatLabel, { color: colors.mutedForeground }]}>Interval</Text>
                    <Text style={[styles.irrigStatVal, { color: colors.foreground }]}>{item.interval}</Text>
                  </View>
                  <View style={[styles.irrigStat, { backgroundColor: colors.muted }]}>
                    <Feather name="droplet" size={14} color="#0288D1" />
                    <Text style={[styles.irrigStatLabel, { color: colors.mutedForeground }]}>Amount</Text>
                    <Text style={[styles.irrigStatVal, { color: colors.foreground }]}>{item.amount}</Text>
                  </View>
                  <View style={[styles.irrigStat, { backgroundColor: colors.muted }]}>
                    <Feather name="settings" size={14} color={colors.secondary} />
                    <Text style={[styles.irrigStatLabel, { color: colors.mutedForeground }]}>Method</Text>
                    <Text style={[styles.irrigStatVal, { color: colors.foreground }]}>{item.method}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={[styles.conserveCard, { backgroundColor: "#E0F2F1", borderColor: "#006064" }]}>
              <Feather name="info" size={16} color="#006064" />
              <View style={{ flex: 1 }}>
                <Text style={styles.conserveTitle}>Water Conservation Tip</Text>
                <Text style={styles.conserveText}>
                  Use mulching to reduce evaporation by 30-40%. Drip irrigation can save up to 50% water vs flood irrigation for cotton and vegetables.
                </Text>
              </View>
            </View>
          </>
        )}

        {tab === "yield" && (
          <>
            <View style={[styles.aiBanner, { backgroundColor: "#4A148C" }]}>
              <Feather name="cpu" size={18} color="#fff" />
              <View>
                <Text style={styles.aiBannerTitle}>AI Yield Prediction Model</Text>
                <Text style={styles.aiBannerSub}>Based on historical + current data</Text>
              </View>
            </View>

            {[
              { crop: "Wheat (12 acres)", expected: "264-336 qtl", optimistic: "360 qtl", revenue: "₹5.9L - ₹7.7L", confidence: 87 },
              { crop: "Paddy (3 acres)", expected: "135-150 qtl", optimistic: "165 qtl", revenue: "₹3.1L - ₹3.45L", confidence: 82 },
              { crop: "Tomato (2 acres)", expected: "160-200 qtl", optimistic: "240 qtl", revenue: "₹80K - ₹1L", confidence: 71 },
            ].map((pred) => (
              <View key={pred.crop} style={[styles.yieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.yieldCrop, { color: colors.foreground }]}>{pred.crop}</Text>
                <View style={styles.yieldStats}>
                  <View>
                    <Text style={[styles.yieldLabel, { color: colors.mutedForeground }]}>Expected Yield</Text>
                    <Text style={[styles.yieldVal, { color: colors.primary }]}>{pred.expected}</Text>
                  </View>
                  <View>
                    <Text style={[styles.yieldLabel, { color: colors.mutedForeground }]}>Revenue Range</Text>
                    <Text style={[styles.yieldVal, { color: colors.foreground }]}>{pred.revenue}</Text>
                  </View>
                </View>
                <View style={styles.confidenceRow}>
                  <Text style={[styles.confLabel, { color: colors.mutedForeground }]}>Model Confidence</Text>
                  <View style={[styles.confBar, { backgroundColor: colors.muted }]}>
                    <View style={[styles.confFill, { width: `${pred.confidence}%` as any, backgroundColor: "#4A148C" }]} />
                  </View>
                  <Text style={[styles.confPct, { color: "#4A148C" }]}>{pred.confidence}%</Text>
                </View>
              </View>
            ))}
          </>
        )}
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
  tabBar: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  seasonRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  seasonCard: { flex: 1, alignItems: "center", padding: 10, borderRadius: 12, borderWidth: 1.5, gap: 4 },
  seasonName: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  seasonMonths: { fontSize: 9, fontFamily: "Inter_400Regular" },
  aiBanner: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, gap: 10, marginBottom: 12 },
  aiBannerTitle: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  aiBannerSub: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: "Inter_400Regular" },
  cropCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  recommendedBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-start", marginBottom: 8 },
  recommendedText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  cropTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cropName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  roiBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  roiText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  cropStats: { flexDirection: "row", gap: 8 },
  cropStat: { flex: 1, alignItems: "center", padding: 8, borderRadius: 10, gap: 3 },
  cropStatLabel: { fontSize: 9, fontFamily: "Inter_400Regular" },
  cropStatVal: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  irrigCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  irrigTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  irrigCrop: { fontSize: 15, fontFamily: "Inter_700Bold" },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  stageText: { color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  irrigStats: { flexDirection: "row", gap: 8 },
  irrigStat: { flex: 1, alignItems: "center", padding: 10, borderRadius: 10, gap: 4 },
  irrigStatLabel: { fontSize: 9, fontFamily: "Inter_400Regular" },
  irrigStatVal: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  conserveCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start", marginTop: 4 },
  conserveTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#006064", marginBottom: 4 },
  conserveText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#004D40", lineHeight: 18 },
  yieldCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10, gap: 12 },
  yieldCrop: { fontSize: 15, fontFamily: "Inter_700Bold" },
  yieldStats: { flexDirection: "row", justifyContent: "space-between" },
  yieldLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 3 },
  yieldVal: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  confidenceRow: { gap: 6 },
  confLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  confBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  confFill: { height: "100%", borderRadius: 3 },
  confPct: { fontSize: 12, fontFamily: "Inter_700Bold" },
});
