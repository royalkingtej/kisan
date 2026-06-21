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
  { icon: "trending-up",  titleKey: "mspMarket",   subtitleKey: "liveRates",        color: "#2E7D32", route: "/market" },
  { icon: "camera",       titleKey: "diseaseScan",  subtitleKey: "identifyIssues",   color: "#1565C0", route: "/disease-scan" },
  { icon: "feather",      titleKey: "seeds",        subtitleKey: "seedsSubtitle",    color: "#33691E", route: "/seeds" },
  { icon: "droplet",      titleKey: "irrigation",   subtitleKey: "irrigationSubtitle", color: "#00838F", route: "/irrigation" },
  { icon: "sun",          titleKey: "seasonal",     subtitleKey: "seasonalSubtitle", color: "#E65100", route: "/crop-intel" },
  { icon: "shield",       titleKey: "govtSchemes",  subtitleKey: "subsidiesPlans",   color: "#1A237E", route: "/schemes" },
  { icon: "bar-chart-2",  titleKey: "profitCalc",   subtitleKey: "trackEarnings",    color: "#4A148C", route: "/calculator" },
  { icon: "shopping-bag", titleKey: "inputStore",   subtitleKey: "buySeeds",         color: "#BF360C", route: "/marketplace" },
  { icon: "archive",      titleKey: "warehouse",    subtitleKey: "storageSolutions", color: "#006064", route: "/warehouse" },
  { icon: "truck",        titleKey: "transport",    subtitleKey: "bookLogistics",    color: "#BF360C", route: "/transport" },
  { icon: "users",        titleKey: "forum",        subtitleKey: "recentActivity",   color: "#880E4F", route: "/community" },
  { icon: "map",          titleKey: "landMarket",   subtitleKey: "landSubtitle",     color: "#01579B", route: "/land-market" },
];

export function FeatureGrid() {
  const colors = useColors();
  const { tr } = useAppContext();

  return (
    <View>
      <View style={[styles.sectionHeader]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Access</Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>All farming services</Text>
      </View>
      <View style={styles.grid}>
        {FEATURES.map((feat) => (
          <TouchableOpacity
            key={feat.route}
            style={[styles.card, { backgroundColor: feat.color }]}
            onPress={() => router.push(feat.route as any)}
            activeOpacity={0.85}
          >
            <Feather name={feat.icon} size={60} color="rgba(255,255,255,0.08)" style={styles.bgIcon} />
            <View style={styles.iconWrapper}>
              <Feather name={feat.icon} size={26} color="rgba(255,255,255,0.95)" />
            </View>
            <Text style={styles.title} numberOfLines={1}>{tr(feat.titleKey)}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{tr(feat.subtitleKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    overflow: "hidden",
    minHeight: 100,
    justifyContent: "flex-end",
    position: "relative",
  },
  bgIcon: {
    position: "absolute",
    right: -6,
    top: -8,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
});
