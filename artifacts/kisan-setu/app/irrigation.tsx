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

const METHODS = [
  {
    name: "Drip Irrigation",
    efficiency: "90-95%",
    bestFor: "Vegetables, Cotton, Orchards",
    waterSaving: "50-70% vs flood",
    cost: "₹45,000-80,000/acre",
    subsidy: "55-75% (Govt subsidy)",
    icon: "droplet" as const,
    color: "#0288D1",
    pros: ["Saves 50-70% water", "Reduces weed growth", "Suitable for hilly terrain", "Fertilizer can be applied with water"],
    cons: ["High initial cost", "Requires maintenance", "Clogging of drippers"],
    govtScheme: "PM Krishi Sinchai Yojana",
  },
  {
    name: "Sprinkler Irrigation",
    efficiency: "75-85%",
    bestFor: "Wheat, Groundnut, Vegetables",
    waterSaving: "30-50% vs flood",
    cost: "₹25,000-45,000/acre",
    subsidy: "50-75% (Govt subsidy)",
    icon: "cloud-drizzle" as const,
    color: "#2E7D32",
    pros: ["Uniform water distribution", "Good for sandy soils", "Can apply fertilizer", "Suitable for undulating land"],
    cons: ["Wind affects distribution", "Not suitable for clayey soils", "Evaporation losses"],
    govtScheme: "PM Krishi Sinchai Yojana",
  },
  {
    name: "Flood Irrigation",
    efficiency: "30-50%",
    bestFor: "Paddy, Sugarcane",
    waterSaving: "Baseline method",
    cost: "₹2,000-5,000/acre",
    subsidy: "Not subsidized",
    icon: "cloud-rain" as const,
    color: "#1565C0",
    pros: ["Low initial cost", "Simple operation", "Good for paddy fields", "Salt leaching"],
    cons: ["High water consumption", "Waterlogging risk", "Nutrient leaching", "Weed growth"],
    govtScheme: "No direct subsidy",
  },
  {
    name: "Furrow Irrigation",
    efficiency: "55-70%",
    bestFor: "Maize, Potato, Vegetables",
    waterSaving: "20-30% vs flood",
    cost: "₹3,000-8,000/acre",
    subsidy: "Limited schemes",
    icon: "minus" as const,
    color: "#6D4C41",
    pros: ["Better than flood for row crops", "Low cost", "Easy to implement", "Good aeration"],
    cons: ["Uneven distribution on slopes", "High labor for making furrows", "Soil crusting"],
    govtScheme: "State-level schemes",
  },
  {
    name: "Solar Pump Irrigation",
    efficiency: "85-95%",
    bestFor: "All crops — remote areas",
    waterSaving: "Depends on method used",
    cost: "₹1.5-4L/unit",
    subsidy: "90% PM KUSUM scheme",
    icon: "sun" as const,
    color: "#FF8F00",
    pros: ["Zero electricity cost", "Remote area solution", "90% PM KUSUM subsidy", "Low maintenance"],
    cons: ["High initial investment", "Dependent on sunshine", "Storage battery needed for 24hr"],
    govtScheme: "PM KUSUM Solar Pump",
  },
];

const SCHEDULES = [
  { crop: "Wheat", stage: "Germination", interval: "15-18 days", amount: "40-50 mm", optimal: "Morning 6-8 AM" },
  { crop: "Wheat", stage: "Tillering (CRI)", interval: "Immediately at 21 DAS", amount: "50-60 mm", optimal: "Evening 5-7 PM" },
  { crop: "Paddy", stage: "Transplanting", interval: "Daily till establishment", amount: "50-70 mm", optimal: "Any time" },
  { crop: "Cotton", stage: "Boll development", interval: "7-10 days", amount: "30-40 mm", optimal: "Morning 6-9 AM" },
  { crop: "Tomato", stage: "Flowering", interval: "3-4 days", amount: "20-25 mm", optimal: "Early morning" },
  { crop: "Maize", stage: "Tasseling", interval: "6-8 days", amount: "40-50 mm", optimal: "Morning" },
];

const WATER_TIPS = [
  { icon: "droplet" as const, title: "Soil Moisture Check", tip: "Push a 6-inch screwdriver into soil. If it goes easily → enough moisture. If resistant → time to irrigate.", color: "#0288D1" },
  { icon: "clock" as const, title: "Best Irrigation Time", tip: "Irrigate in early morning (5-8 AM) or evening (5-8 PM) to reduce evaporation losses by 20-30%.", color: "#2E7D32" },
  { icon: "sun" as const, title: "Avoid Midday Irrigation", tip: "Never irrigate between 10 AM–3 PM in summer. Evaporation losses can reach 40% during peak heat.", color: "#FF8F00" },
  { icon: "thermometer" as const, title: "Temperature Guide", tip: "Paddy: Standing water 5-7 cm. Cotton: Irrigate when tensiometer reads 60-80 cB. Wheat: CRI stage is critical.", color: "#C62828" },
];

export default function IrrigationScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [tab, setTab] = useState<"methods" | "schedule" | "tips">("methods");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#00838F", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{tr("irrigation")}</Text>
          <Text style={styles.headerSub}>{tr("irrigationSubtitle")}</Text>
        </View>
        <Feather name="droplet" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      {/* Water Savings Banner */}
      <View style={[styles.savingsBanner, { backgroundColor: "#00838F" }]}>
        <View style={styles.savingsStat}>
          <Text style={styles.savingsVal}>40-70%</Text>
          <Text style={styles.savingsLabel}>Water Saved</Text>
        </View>
        <View style={[styles.savingsDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.savingsStat}>
          <Text style={styles.savingsVal}>90%</Text>
          <Text style={styles.savingsLabel}>PM KUSUM Subsidy</Text>
        </View>
        <View style={[styles.savingsDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.savingsStat}>
          <Text style={styles.savingsVal}>30%</Text>
          <Text style={styles.savingsLabel}>Cost Reduction</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["methods", "schedule", "tips"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && { borderBottomColor: "#00838F", borderBottomWidth: 2 }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? "#00838F" : colors.mutedForeground }]}>
              {t === "methods" ? "Methods" : t === "schedule" ? "Schedule" : "Tips"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {/* METHODS TAB */}
        {tab === "methods" && METHODS.map((method) => (
          <TouchableOpacity
            key={method.name}
            style={[styles.methodCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: method.color, borderLeftWidth: 4 }]}
            onPress={() => setExpanded(expanded === method.name ? null : method.name)}
            activeOpacity={0.9}
          >
            <View style={styles.methodTop}>
              <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                <Feather name={method.icon} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodName, { color: colors.foreground }]}>{method.name}</Text>
                <Text style={[styles.methodBestFor, { color: colors.mutedForeground }]}>Best for: {method.bestFor}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <View style={[styles.effBadge, { backgroundColor: method.color }]}>
                  <Text style={styles.effText}>{method.efficiency}</Text>
                </View>
                <Feather name={expanded === method.name ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
              </View>
            </View>

            <View style={styles.methodStats}>
              <View style={[styles.mStat, { backgroundColor: "#0288D115" }]}>
                <Feather name="droplet" size={11} color="#0288D1" />
                <Text style={[styles.mStatText, { color: "#0288D1" }]}>{method.waterSaving}</Text>
              </View>
              <View style={[styles.mStat, { backgroundColor: "#FF8F0015" }]}>
                <Feather name="tag" size={11} color="#FF8F00" />
                <Text style={[styles.mStatText, { color: "#FF8F00" }]}>{method.cost}</Text>
              </View>
              <View style={[styles.mStat, { backgroundColor: colors.primary + "15" }]}>
                <Feather name="shield" size={11} color={colors.primary} />
                <Text style={[styles.mStatText, { color: colors.primary }]}>{method.subsidy}</Text>
              </View>
            </View>

            {expanded === method.name && (
              <View style={styles.methodExpanded}>
                <View style={styles.prosCons}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.prosConsTitle, { color: "#2E7D32" }]}>✓ Pros</Text>
                    {method.pros.map((p) => (
                      <Text key={p} style={[styles.prosConsText, { color: colors.foreground }]}>• {p}</Text>
                    ))}
                  </View>
                  <View style={[styles.prosConsDivider, { backgroundColor: colors.border }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.prosConsTitle, { color: "#C62828" }]}>✗ Cons</Text>
                    {method.cons.map((c) => (
                      <Text key={c} style={[styles.prosConsText, { color: colors.foreground }]}>• {c}</Text>
                    ))}
                  </View>
                </View>
                <View style={[styles.schemeBox, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}>
                  <Feather name="award" size={14} color={colors.primary} />
                  <Text style={[styles.schemeText, { color: colors.primary }]}>Scheme: {method.govtScheme}</Text>
                </View>
                <TouchableOpacity style={[styles.applyBtn, { backgroundColor: method.color }]}>
                  <Text style={styles.applyBtnText}>Apply for Subsidy</Text>
                  <Feather name="external-link" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <>
            <View style={[styles.scheduleNote, { backgroundColor: "#00838F20", borderColor: "#00838F" }]}>
              <Feather name="info" size={14} color="#00838F" />
              <Text style={[styles.scheduleNoteText, { color: colors.foreground }]}>
                Critical irrigation windows. Missing these stages can reduce yield by 20-40%.
              </Text>
            </View>
            {SCHEDULES.map((s, i) => (
              <View key={i} style={[styles.scheduleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.scheduleTop}>
                  <View style={[styles.cropChip, { backgroundColor: colors.primary }]}>
                    <Text style={styles.cropChipText}>{s.crop}</Text>
                  </View>
                  <Text style={[styles.stageText, { color: colors.foreground }]}>{s.stage}</Text>
                </View>
                <View style={styles.scheduleStats}>
                  <View style={[styles.sStat, { backgroundColor: colors.muted }]}>
                    <Feather name="calendar" size={12} color={colors.primary} />
                    <Text style={[styles.sStatLabel, { color: colors.mutedForeground }]}>Interval</Text>
                    <Text style={[styles.sStatVal, { color: colors.foreground }]}>{s.interval}</Text>
                  </View>
                  <View style={[styles.sStat, { backgroundColor: colors.muted }]}>
                    <Feather name="droplet" size={12} color="#0288D1" />
                    <Text style={[styles.sStatLabel, { color: colors.mutedForeground }]}>Amount</Text>
                    <Text style={[styles.sStatVal, { color: colors.foreground }]}>{s.amount}</Text>
                  </View>
                  <View style={[styles.sStat, { backgroundColor: colors.muted }]}>
                    <Feather name="clock" size={12} color="#FF8F00" />
                    <Text style={[styles.sStatLabel, { color: colors.mutedForeground }]}>Optimal</Text>
                    <Text style={[styles.sStatVal, { color: colors.foreground }]}>{s.optimal}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* TIPS TAB */}
        {tab === "tips" && WATER_TIPS.map((tip) => (
          <View key={tip.title} style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: tip.color, borderLeftWidth: 4 }]}>
            <View style={[styles.tipIconCircle, { backgroundColor: tip.color + "20" }]}>
              <Feather name={tip.icon} size={20} color={tip.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: tip.color }]}>{tip.title}</Text>
              <Text style={[styles.tipText, { color: colors.foreground }]}>{tip.tip}</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  savingsBanner: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  savingsStat: { flex: 1, alignItems: "center" },
  savingsVal: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold" },
  savingsLabel: { color: "rgba(255,255,255,0.75)", fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  savingsDivider: { width: 1, marginHorizontal: 8 },
  tabBar: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  methodCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  methodTop: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  methodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  methodName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 3 },
  methodBestFor: { fontSize: 11, fontFamily: "Inter_400Regular" },
  effBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  effText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  methodStats: { flexDirection: "row", gap: 6 },
  mStat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 6, paddingVertical: 6, borderRadius: 8 },
  mStatText: { fontSize: 9, fontFamily: "Inter_500Medium", flex: 1 },
  methodExpanded: { marginTop: 12, gap: 10 },
  prosCons: { flexDirection: "row", gap: 10 },
  prosConsDivider: { width: 1 },
  prosConsTitle: { fontSize: 12, fontFamily: "Inter_700Bold", marginBottom: 6 },
  prosConsText: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 18 },
  schemeBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10, borderWidth: 1 },
  schemeText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  applyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 10 },
  applyBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scheduleNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  scheduleNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  scheduleCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  scheduleTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  cropChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  cropChipText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  stageText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  scheduleStats: { flexDirection: "row", gap: 8 },
  sStat: { flex: 1, alignItems: "center", padding: 10, borderRadius: 10, gap: 3 },
  sStatLabel: { fontSize: 9, fontFamily: "Inter_400Regular" },
  sStatVal: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  tipCard: { flexDirection: "row", alignItems: "flex-start", borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12, gap: 12 },
  tipIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  tipTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 6 },
  tipText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
});
