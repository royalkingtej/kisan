import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  wind: number;
  advice: string;
  icon: string;
}

const weatherData: WeatherData = {
  temp: 28,
  condition: "Partly Cloudy",
  location: "Rural, Punjab",
  humidity: 65,
  wind: 12,
  advice: "Good conditions for irrigation today. Low rain probability.",
  icon: "cloud",
};

export function WeatherCard() {
  const colors = useColors();
  const { tr } = useAppContext();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.primary }]}
      onPress={() => router.push("/weather")}
      activeOpacity={0.9}
    >
      <View style={styles.top}>
        <View style={styles.left}>
          <View style={styles.tempRow}>
            <Feather name="cloud" size={32} color="rgba(255,255,255,0.9)" />
            <Text style={styles.temp}>{weatherData.temp}°C</Text>
          </View>
          <Text style={styles.condition}>{weatherData.condition}</Text>
          <Text style={styles.advice} numberOfLines={2}>
            {weatherData.advice}
          </Text>
        </View>
        <View style={styles.right}>
          <View style={styles.locationBadge}>
            <Feather name="map-pin" size={10} color="#fff" />
            <Text style={styles.locationText}>{tr("liveLocation")}</Text>
          </View>
          <Text style={styles.location}>{weatherData.location}</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Feather name="droplet" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.stat}>
              <Feather name="wind" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{weatherData.wind} km/h</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  temp: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  condition: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },
  advice: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
    maxWidth: 180,
    lineHeight: 16,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 10,
    color: "#fff",
    fontFamily: "Inter_500Medium",
  },
  location: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_500Medium",
    textAlign: "right",
    marginBottom: 12,
  },
  stats: {
    gap: 6,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_400Regular",
  },
});
