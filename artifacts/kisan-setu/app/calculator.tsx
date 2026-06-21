import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

interface CostItem {
  label: string;
  key: string;
  placeholder: string;
  icon: keyof typeof Feather.glyphMap;
}

const COST_ITEMS: CostItem[] = [
  { label: "Land Area (Acres)", key: "acres", placeholder: "e.g. 5", icon: "map" },
  { label: "Seed Cost (₹)", key: "seeds", placeholder: "e.g. 5000", icon: "feather" },
  { label: "Fertilizer Cost (₹)", key: "fertilizer", placeholder: "e.g. 8000", icon: "droplet" },
  { label: "Labour Wages (₹)", key: "labour", placeholder: "e.g. 12000", icon: "users" },
  { label: "Irrigation Cost (₹)", key: "irrigation", placeholder: "e.g. 3000", icon: "cloud-rain" },
  { label: "Pesticide Cost (₹)", key: "pesticide", placeholder: "e.g. 4000", icon: "shield" },
  { label: "Warehouse Cost (₹)", key: "warehouse", placeholder: "e.g. 2000", icon: "archive" },
  { label: "Transport Cost (₹)", key: "transport", placeholder: "e.g. 2000", icon: "truck" },
  { label: "Expected Yield (qtl)", key: "yield", placeholder: "e.g. 50", icon: "trending-up" },
  { label: "Market Price (₹/qtl)", key: "price", placeholder: "e.g. 2275", icon: "bar-chart-2" },
];

export default function CalculatorScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    totalCost: number;
    revenue: number;
    transport: number;
    profit: number;
    roi: number;
  } | null>(null);

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const calculate = () => {
    const get = (key: string) => parseFloat(values[key] || "0") || 0;
    const totalCost =
      get("seeds") + get("fertilizer") + get("labour") +
      get("irrigation") + get("pesticide") + get("warehouse");
    const transport = get("transport");
    const revenue = get("yield") * get("price");
    const profit = revenue - totalCost - transport;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    setResult({ totalCost, revenue, transport, profit, roi });
  };

  const reset = () => {
    setValues({});
    setResult(null);
  };

  const fmt = (n: number) => "₹" + Math.abs(n).toLocaleString("en-IN");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: "#4A148C", paddingTop: isWeb ? 67 : insets.top + 12 },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("profitCalc")}</Text>
        <TouchableOpacity onPress={reset}>
          <Feather name="refresh-ccw" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Cost Inputs</Text>
          {COST_ITEMS.map((item) => (
            <View key={item.key} style={styles.inputRow}>
              <View style={[styles.inputIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={item.icon} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
                  placeholder={item.placeholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  value={values[item.key] || ""}
                  onChangeText={(v) => setValue(item.key, v)}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.calcBtn, { backgroundColor: "#4A148C" }]}
          onPress={calculate}
        >
          <Feather name="zap" size={18} color="#fff" />
          <Text style={styles.calcBtnText}>Calculate Profit</Text>
        </TouchableOpacity>

        {result && (
          <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.resultTitle, { color: colors.foreground }]}>Profit Analysis</Text>
            <View style={[styles.resultRow, { backgroundColor: colors.muted }]}>
              <Feather name="minus-circle" size={16} color={colors.error} />
              <Text style={[styles.resultLabel, { color: colors.foreground }]}>{tr("totalCost")}</Text>
              <Text style={[styles.resultVal, { color: colors.error }]}>{fmt(result.totalCost)}</Text>
            </View>
            <View style={[styles.resultRow, { backgroundColor: colors.muted }]}>
              <Feather name="plus-circle" size={16} color={colors.success} />
              <Text style={[styles.resultLabel, { color: colors.foreground }]}>{tr("expectedRevenue")}</Text>
              <Text style={[styles.resultVal, { color: colors.success }]}>{fmt(result.revenue)}</Text>
            </View>
            <View style={[styles.resultRow, { backgroundColor: colors.muted }]}>
              <Feather name="truck" size={16} color={colors.warning} />
              <Text style={[styles.resultLabel, { color: colors.foreground }]}>Transport</Text>
              <Text style={[styles.resultVal, { color: colors.warning }]}>- {fmt(result.transport)}</Text>
            </View>
            <View
              style={[
                styles.netProfitRow,
                { backgroundColor: result.profit >= 0 ? colors.primary : colors.destructive },
              ]}
            >
              <Feather name={result.profit >= 0 ? "trending-up" : "trending-down"} size={20} color="#fff" />
              <View>
                <Text style={styles.netLabel}>{tr("netProfit")}</Text>
                <Text style={styles.netValue}>{result.profit >= 0 ? "+" : ""}{fmt(result.profit)}</Text>
              </View>
              <View style={styles.roiBadge}>
                <Text style={styles.roiText}>ROI {result.roi.toFixed(1)}%</Text>
              </View>
            </View>
            {result.profit > 0 && (
              <View style={[styles.tipBox, { backgroundColor: colors.primary + "10", borderColor: colors.primary }]}>
                <Feather name="info" size={14} color={colors.primary} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>
                  Good profit margin! Consider selling in Punjab mandis for an additional ₹75/qtl premium over MSP.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  inputRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 14 },
  inputIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 20 },
  inputLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  calcBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  calcBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    padding: 16,
    gap: 8,
  },
  resultTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  resultLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  resultVal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  netProfitRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 4,
  },
  netLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_400Regular" },
  netValue: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold" },
  roiBadge: {
    marginLeft: "auto",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roiText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  tipBox: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "flex-start",
    marginTop: 4,
  },
  tipText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
