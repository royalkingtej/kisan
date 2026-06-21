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

const VEHICLES = [
  { type: "Mini Truck (1T)", capacity: "1 Ton", rate: "₹8/km", icon: "truck" as const, color: "#E65100" },
  { type: "Standard Truck (5T)", capacity: "5 Ton", rate: "₹12/km", icon: "truck" as const, color: "#BF360C" },
  { type: "Large Truck (10T)", capacity: "10 Ton", rate: "₹16/km", icon: "truck" as const, color: "#C62828" },
  { type: "Tractor Trailer", capacity: "3 Ton", rate: "₹6/km", icon: "truck" as const, color: "#1B5E20" },
  { type: "eNAM Transport", capacity: "Variable", rate: "Subsidized", icon: "shield" as const, color: "#1565C0" },
];

const ROUTES = [
  { from: "Ludhiana, PB", to: "Delhi APMC", distance: "300 km", time: "6h", toll: "₹180", fuel: "₹850" },
  { from: "Guntur, AP", to: "Hyderabad", distance: "160 km", time: "3h", toll: "₹80", fuel: "₹450" },
  { from: "Nashik, MH", to: "Mumbai APMC", distance: "160 km", time: "3.5h", toll: "₹120", fuel: "₹480" },
  { from: "Coimbatore, TN", to: "Chennai Koyambedu", distance: "500 km", time: "9h", toll: "₹250", fuel: "₹1400" },
];

const ACTIVE_BOOKINGS = [
  { id: "BK001", vehicle: "Standard Truck (5T)", from: "Ludhiana", to: "Delhi APMC", status: "In Transit", eta: "2h 30m", crop: "Wheat - 4.5T" },
];

export default function TransportScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#E65100", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("transport")}</Text>
        <Feather name="map-pin" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {/* Active booking */}
        {ACTIVE_BOOKINGS.map((booking) => (
          <View key={booking.id} style={[styles.activeCard, { backgroundColor: "#E65100" }]}>
            <View style={styles.activeTop}>
              <Feather name="navigation" size={16} color="#fff" />
              <Text style={styles.activeStatus}>{booking.status}</Text>
              <View style={styles.etaBadge}>
                <Text style={styles.etaText}>ETA {booking.eta}</Text>
              </View>
            </View>
            <Text style={styles.activeCrop}>{booking.crop}</Text>
            <View style={styles.routeRow}>
              <Text style={styles.routeText}>{booking.from}</Text>
              <Feather name="arrow-right" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.routeText}>{booking.to}</Text>
            </View>
          </View>
        ))}

        {/* Vehicle Selection */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Vehicle Type</Text>
        {VEHICLES.map((v) => (
          <TouchableOpacity
            key={v.type}
            style={[
              styles.vehicleCard,
              {
                backgroundColor: selectedVehicle === v.type ? v.color + "15" : colors.card,
                borderColor: selectedVehicle === v.type ? v.color : colors.border,
              },
            ]}
            onPress={() => setSelectedVehicle(v.type)}
          >
            <View style={[styles.vehicleIcon, { backgroundColor: v.color }]}>
              <Feather name={v.icon} size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.vehicleType, { color: colors.foreground }]}>{v.type}</Text>
              <Text style={[styles.vehicleCap, { color: colors.mutedForeground }]}>Capacity: {v.capacity}</Text>
            </View>
            <View style={[styles.rateBadge, { backgroundColor: v.color + "20" }]}>
              <Text style={[styles.rateText, { color: v.color }]}>{v.rate}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Popular Routes */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Popular Routes</Text>
        {ROUTES.map((route) => (
          <View key={route.from + route.to} style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.routeHeader}>
              <View>
                <Text style={[styles.routeFrom, { color: colors.foreground }]}>{route.from}</Text>
                <Text style={[styles.routeArrow, { color: colors.mutedForeground }]}>→ {route.to}</Text>
              </View>
              <View style={styles.routeMeta}>
                <Text style={[styles.routeDist, { color: colors.primary }]}>{route.distance}</Text>
                <Text style={[styles.routeTime, { color: colors.mutedForeground }]}>{route.time}</Text>
              </View>
            </View>
            <View style={styles.routeCosts}>
              <View style={[styles.costChip, { backgroundColor: colors.muted }]}>
                <Feather name="navigation" size={10} color={colors.mutedForeground} />
                <Text style={[styles.costText, { color: colors.foreground }]}>Toll: {route.toll}</Text>
              </View>
              <View style={[styles.costChip, { backgroundColor: colors.muted }]}>
                <Feather name="droplet" size={10} color={colors.mutedForeground} />
                <Text style={[styles.costText, { color: colors.foreground }]}>Fuel: {route.fuel}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Book Button */}
        {selectedVehicle && (
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: booked ? colors.success : "#E65100" }]}
            onPress={() => setBooked(true)}
          >
            <Feather name={booked ? "check-circle" : "truck"} size={18} color="#fff" />
            <Text style={styles.bookBtnText}>
              {booked ? "Booking Confirmed!" : `${tr("bookNow")} · ${selectedVehicle}`}
            </Text>
          </TouchableOpacity>
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
  activeCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  activeTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  activeStatus: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1 },
  etaBadge: { backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  etaText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  activeCrop: { color: "rgba(255,255,255,0.9)", fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 6 },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  routeText: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 10, marginTop: 4 },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  vehicleIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  vehicleType: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  vehicleCap: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rateBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  rateText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  routeCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8 },
  routeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  routeFrom: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  routeArrow: { fontSize: 13, fontFamily: "Inter_400Regular" },
  routeMeta: { alignItems: "flex-end" },
  routeDist: { fontSize: 14, fontFamily: "Inter_700Bold" },
  routeTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  routeCosts: { flexDirection: "row", gap: 8 },
  costChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  costText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  bookBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
