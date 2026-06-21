import React from "react";
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

const SERVICES = [
  {
    category: "Crop Intelligence",
    items: [
      { icon: "sun" as const, label: "Crop Recommendations", sub: "Kharif / Rabi / Zaid", color: "#33691E", route: "/crop-intel" },
      { icon: "camera" as const, label: "Disease Scanner", sub: "AI-powered detection", color: "#1565C0", route: "/disease-scan" },
      { icon: "droplet" as const, label: "Smart Irrigation", sub: "Water optimization", color: "#00838F", route: "/crop-intel" },
    ],
  },
  {
    category: "Market & Finance",
    items: [
      { icon: "trending-up" as const, label: "MSP Prices", sub: "Live mandi rates", color: "#2E7D32", route: "/market" },
      { icon: "bar-chart-2" as const, label: "Profit Calculator", sub: "Detailed analysis", color: "#4A148C", route: "/calculator" },
      { icon: "credit-card" as const, label: "Land Marketplace", sub: "Buy / Sell / Lease", color: "#01579B", route: "/land-market" },
    ],
  },
  {
    category: "Logistics",
    items: [
      { icon: "truck" as const, label: "Transport Booking", sub: "Fleet & routing", color: "#E65100", route: "/transport" },
      { icon: "archive" as const, label: "Warehouse Finder", sub: "Cold storage & godowns", color: "#006064", route: "/warehouse" },
    ],
  },
  {
    category: "Government & Community",
    items: [
      { icon: "shield" as const, label: "Govt Schemes", sub: "PM-KISAN, Fasal Bima +", color: "#1A237E", route: "/schemes" },
      { icon: "shopping-bag" as const, label: "Input Marketplace", sub: "Seeds, fertilizers, tools", color: "#BF360C", route: "/marketplace" },
      { icon: "users" as const, label: "Farmer Community", sub: "Forums & expert Q&A", color: "#880E4F", route: "/community" },
    ],
  },
];

export default function ServicesScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, paddingTop: isWeb ? 67 : insets.top + 12 },
        ]}
      >
        <Text style={styles.headerTitle}>{tr("services")}</Text>
        <Text style={styles.headerSub}>All KisanSetu services</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 100 : 80, paddingTop: 12 }}
      >
        {SERVICES.map((section) => (
          <View key={section.category} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
              {section.category.toUpperCase()}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.item,
                    idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                    <Feather name={item.icon} size={18} color="#fff" />
                  </View>
                  <View style={styles.itemText}>
                    <Text style={[styles.itemLabel, { color: colors.foreground }]}>{item.label}</Text>
                    <Text style={[styles.itemSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              ))}
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
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: { flex: 1 },
  itemLabel: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 2 },
  itemSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
