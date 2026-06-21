import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";
import { TranslationKey } from "@/constants/translations";

interface Feature {
  icon: keyof typeof Feather.glyphMap;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  color: string;
  route: string;
}

const FEATURES: Feature[] = [
  { icon: "trending-up", titleKey: "mspMarket", subtitleKey: "liveRates", color: "#2E7D32", route: "/market" },
  { icon: "camera", titleKey: "diseaseScan", subtitleKey: "identifyIssues", color: "#1565C0", route: "/disease-scan" },
  { icon: "truck", titleKey: "transport", subtitleKey: "bookLogistics", color: "#E65100", route: "/transport" },
  { icon: "shield", titleKey: "govtSchemes", subtitleKey: "subsidiesPlans", color: "#1A237E", route: "/schemes" },
  { icon: "bar-chart-2", titleKey: "profitCalc", subtitleKey: "trackEarnings", color: "#4A148C", route: "/calculator" },
  { icon: "shopping-bag", titleKey: "inputStore", subtitleKey: "buySeeds", color: "#BF360C", route: "/marketplace" },
  { icon: "archive", titleKey: "warehouse", subtitleKey: "storageSolutions", color: "#006064", route: "/warehouse" },
  { icon: "sun", titleKey: "cropIQ", subtitleKey: "smartTips", color: "#33691E", route: "/crop-intel" },
];

export function FeatureGrid() {
  const colors = useColors();
  const { tr } = useAppContext();

  return (
    <View style={styles.grid}>
      {FEATURES.map((feat) => (
        <TouchableOpacity
          key={feat.route}
          style={[styles.card, { backgroundColor: feat.color }]}
          onPress={() => router.push(feat.route as any)}
          activeOpacity={0.85}
        >
          <View style={styles.iconWrapper}>
            <Feather name={feat.icon} size={28} color="rgba(255,255,255,0.9)" />
            <Feather name={feat.icon} size={60} color="rgba(255,255,255,0.07)" style={styles.bgIcon} />
          </View>
          <Text style={styles.title}>{tr(feat.titleKey)}</Text>
          <Text style={styles.subtitle}>{tr(feat.subtitleKey)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
    minHeight: 110,
    justifyContent: "flex-end",
  },
  iconWrapper: {
    marginBottom: 8,
  },
  bgIcon: {
    position: "absolute",
    right: -8,
    top: -16,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
});
