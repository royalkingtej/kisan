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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";
import { WeatherCard } from "@/components/WeatherCard";
import { FeatureGrid } from "@/components/FeatureGrid";

const GREETING_TIMES = [
  { start: 0, end: 12, key: "goodMorning" as const },
  { start: 12, end: 17, key: "goodAfternoon" as const },
  { start: 17, end: 24, key: "goodEvening" as const },
];

function getGreeting() {
  const hour = new Date().getHours();
  return GREETING_TIMES.find((g) => hour >= g.start && hour < g.end)?.key ?? "hello";
}

export default function HomeScreen() {
  const colors = useColors();
  const { tr, user, notifications } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            paddingTop: isWeb ? 67 : insets.top + 12,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.appIconCircle, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="feather" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.appName}>KisanSetu</Text>
            <Text style={styles.greeting}>
              {tr(getGreeting())}, {user.name.split(" ")[0]}!
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="bell" size={20} color="#fff" />
            {notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={[styles.avatarCircle, { backgroundColor: colors.secondary }]}>
            <Text style={styles.avatarText}>
              {user.name.split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
        </View>
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <Text style={[styles.searchText, { color: colors.mutedForeground }]}>
          {tr("search")}...
        </Text>
        <View style={[styles.qrBtn, { backgroundColor: colors.primary }]}>
          <Feather name="maximize" size={14} color="#fff" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 100 : 80 }}
      >
        {/* Weather Card */}
        <View style={styles.section}>
          <WeatherCard />
        </View>

        {/* Feature Grid */}
        <FeatureGrid />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  appIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  greeting: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF5252",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  qrBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  section: {
    marginBottom: 4,
  },
});
