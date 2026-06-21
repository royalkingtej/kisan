import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

const LANGUAGES_MAP: Record<string, string> = {
  en: "English", hi: "हिंदी", te: "తెలుగు", ta: "தமிழ்",
  kn: "ಕನ್ನಡ", ml: "മലയാളം", mr: "मराठी", gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ", bn: "বাংলা", or: "ଓଡ଼ିଆ", as: "অসমীয়া",
};

export default function ProfileScreen() {
  const colors = useColors();
  const { tr, user, isDarkMode, toggleDarkMode, setShowLanguagePicker, language, logout } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const handleLogout = () => {
    Alert.alert(
      tr("logout"),
      "Are you sure you want to sign out of KisanSetu?",
      [
        { text: tr("cancel"), style: "cancel" },
        {
          text: tr("logout"),
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const FARM_ITEMS = [
    { icon: "map" as const, label: tr("myLand"), sub: `${user.plotsCount} ${tr("plotsRegistered")}`, color: "#2E7D32" },
    { icon: "feather" as const, label: tr("myCrops"), sub: "Wheat, Paddy, Tomato", color: "#33691E" },
    { icon: "package" as const, label: tr("myOrders"), sub: `${user.ordersCount} ${tr("activeOrders")}`, color: "#E65100" },
    { icon: "archive" as const, label: tr("myStorage"), sub: `${user.qtlStored} ${tr("qtlStored")}`, color: "#006064" },
    { icon: "credit-card" as const, label: tr("payments"), sub: `${tr("lastPayment")}: ${user.lastPayment}`, color: "#1565C0" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.profileHeader, { backgroundColor: colors.primary, paddingTop: isWeb ? 67 : insets.top + 16 }]}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={() => router.push("/edit-profile")}
          >
            <Feather name="edit-2" size={14} color="#fff" />
            <Text style={styles.editBtnText}>{tr("edit")}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
          <Text style={styles.avatarText}>
            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color="rgba(255,255,255,0.7)" />
          <Text style={styles.location}>{user.location}</Text>
        </View>
        <View style={[styles.phonePill, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
          <Feather name="phone" size={12} color="rgba(255,255,255,0.8)" />
          <Text style={styles.phoneText}>{user.phone}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.acres}</Text>
            <Text style={styles.statLabel}>{tr("acres")}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.cropsCount}</Text>
            <Text style={styles.statLabel}>{tr("crops")}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.earnings}</Text>
            <Text style={styles.statLabel}>{tr("earnings")}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isWeb ? 100 : 80 }}>
        {/* My Farm */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {FARM_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, idx < FARM_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}>
                <Feather name={item.icon} size={18} color={item.color} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Edit Profile */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={() => router.push("/edit-profile")}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + "20" }]}>
              <Feather name="user" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{tr("editProfile")}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>Update name, phone, farm details</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Dark Mode */}
          <View style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: "#37474F20" }]}>
              <Feather name="moon" size={18} color="#37474F" />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{tr("darkMode")}</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />
          </View>

          {/* Language */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={() => setShowLanguagePicker(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#1565C020" }]}>
              <Feather name="globe" size={18} color="#1565C0" />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{tr("language")}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{LANGUAGES_MAP[language] || "English"}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: "#F57F1720" }]}>
              <Feather name="help-circle" size={18} color="#F57F17" />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{tr("helpSupport")}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{tr("chatExpert")}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#55555520" }]}>
              <Feather name="settings" size={18} color="#555" />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{tr("settings")}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{tr("appPreferences")}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutBtn, { borderColor: colors.destructive ?? "#C62828" }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={16} color={colors.destructive ?? "#C62828"} />
          <Text style={[styles.signOutText, { color: colors.destructive ?? "#C62828" }]}>{tr("logout")}</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>KisanSetu v1.0.0 · Made with ❤️ for Indian Farmers</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: "center", paddingBottom: 24, paddingHorizontal: 16 },
  headerTopRow: { flexDirection: "row", alignSelf: "stretch", justifyContent: "flex-end", marginBottom: 12 },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  editBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  avatar: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", marginBottom: 10, borderWidth: 3, borderColor: "rgba(255,255,255,0.4)" },
  avatarText: { color: "#fff", fontSize: 26, fontFamily: "Inter_700Bold" },
  name: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  location: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  phonePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 16 },
  phoneText: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", alignItems: "center" },
  stat: { alignItems: "center", paddingHorizontal: 24 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, height: 32 },
  card: { margin: 12, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 1 },
  menuSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, margin: 12, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5 },
  signOutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  version: { textAlign: "center", fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 8 },
});
