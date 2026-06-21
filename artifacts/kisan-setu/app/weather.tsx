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

const HOURLY = [
  { time: "Now", temp: 28, icon: "cloud", rain: 10 },
  { time: "3PM", temp: 31, icon: "sun", rain: 5 },
  { time: "6PM", temp: 29, icon: "cloud", rain: 20 },
  { time: "9PM", temp: 25, icon: "cloud-drizzle", rain: 40 },
  { time: "12AM", temp: 22, icon: "cloud-rain", rain: 65 },
  { time: "3AM", temp: 20, icon: "cloud-rain", rain: 70 },
  { time: "6AM", temp: 19, icon: "cloud", rain: 30 },
];

const FORECAST = [
  { day: "Today", high: 31, low: 19, icon: "cloud", rain: 20, desc: "Partly Cloudy" },
  { day: "Tomorrow", high: 27, low: 18, icon: "cloud-rain", rain: 75, desc: "Heavy Rain" },
  { day: "Wed", high: 25, low: 17, icon: "cloud-drizzle", rain: 55, desc: "Drizzle" },
  { day: "Thu", high: 30, low: 19, icon: "sun", rain: 5, desc: "Sunny" },
  { day: "Fri", high: 32, low: 21, icon: "sun", rain: 0, desc: "Clear Sky" },
  { day: "Sat", high: 29, low: 18, icon: "cloud", rain: 25, desc: "Cloudy" },
  { day: "Sun", high: 26, low: 17, icon: "cloud-rain", rain: 60, desc: "Rainy" },
];

const ADVICE = [
  { icon: "droplet", title: "Irrigation", text: "Delay irrigation by 2 days. Heavy rain expected tomorrow (75% probability).", color: "#0288D1" },
  { icon: "wind", title: "Spraying", text: "Avoid pesticide application today. Wind speed 12 km/h, chemical drift likely.", color: "#FF8F00" },
  { icon: "sun", title: "Harvesting", text: "Good 3-day window for wheat harvest starting Thursday. No rain forecast.", color: "#2E7D32" },
  { icon: "alert-triangle", title: "Storm Warning", text: "Strong winds (35-40 km/h) expected Sunday evening. Secure loose materials.", color: "#C62828" },
];

export default function WeatherScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={{ paddingTop: isWeb ? 67 : insets.top + 12, paddingHorizontal: 16, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.mainWeather}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>Rural, Punjab · Live</Text>
          </View>
          <Text style={styles.bigTemp}>28°C</Text>
          <Text style={styles.condition}>Partly Cloudy</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="droplet" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>65% {tr("humidity")}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="wind" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>12 km/h {tr("wind")}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="cloud-drizzle" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>10% {tr("rainfall")}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hourly */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyRow}>
            {HOURLY.map((h) => (
              <View key={h.time} style={[styles.hourlyItem, { backgroundColor: colors.muted }]}>
                <Text style={[styles.hourlyTime, { color: colors.mutedForeground }]}>{h.time}</Text>
                <Feather name={h.icon as any} size={18} color={colors.primary} />
                <Text style={[styles.hourlyTemp, { color: colors.foreground }]}>{h.temp}°</Text>
                <Text style={[styles.hourlyRain, { color: colors.info }]}>{h.rain}%</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 7-day forecast */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{tr("forecast")}</Text>
          {FORECAST.map((f) => (
            <View key={f.day} style={[styles.forecastRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.forecastDay, { color: colors.foreground }]}>{f.day}</Text>
              <Feather name={f.icon as any} size={18} color={colors.primary} />
              <Text style={[styles.forecastDesc, { color: colors.mutedForeground }]}>{f.desc}</Text>
              <View style={styles.forecastRight}>
                <View style={[styles.rainBadge, { backgroundColor: colors.info + "20" }]}>
                  <Feather name="cloud-drizzle" size={10} color={colors.info} />
                  <Text style={[styles.rainText, { color: colors.info }]}>{f.rain}%</Text>
                </View>
                <Text style={[styles.tempRange, { color: colors.foreground }]}>
                  {f.high}° / {f.low}°
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Farm advice */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Farm Advice</Text>
          {ADVICE.map((a) => (
            <View key={a.title} style={[styles.adviceItem, { borderLeftColor: a.color, backgroundColor: a.color + "10" }]}>
              <View style={[styles.adviceIconCircle, { backgroundColor: a.color + "20" }]}>
                <Feather name={a.icon as any} size={16} color={a.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.adviceTitle, { color: a.color }]}>{a.title}</Text>
                <Text style={[styles.adviceText, { color: colors.foreground }]}>{a.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { marginBottom: 12 },
  mainWeather: { alignItems: "center", paddingBottom: 20 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  locationText: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_400Regular" },
  bigTemp: { fontSize: 72, fontFamily: "Inter_700Bold", color: "#fff" },
  condition: { fontSize: 16, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular", marginBottom: 16 },
  statsRow: { flexDirection: "row", gap: 20 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  statText: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_400Regular" },
  scroll: { borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1 },
  section: { marginHorizontal: 12, marginTop: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  hourlyRow: { gap: 8 },
  hourlyItem: { alignItems: "center", padding: 10, borderRadius: 12, width: 64, gap: 4 },
  hourlyTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  hourlyTemp: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  hourlyRain: { fontSize: 10, fontFamily: "Inter_400Regular" },
  forecastRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  forecastDay: { width: 60, fontSize: 13, fontFamily: "Inter_500Medium" },
  forecastDesc: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  forecastRight: { alignItems: "flex-end", gap: 4 },
  rainBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  rainText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  tempRange: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  adviceItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    gap: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  adviceIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  adviceTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  adviceText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
