import React, { useState } from "react";
import {
  Alert,
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

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

interface FieldConfig {
  key: keyof FormData;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  numeric?: boolean;
}

interface FormData {
  name: string;
  phone: string;
  location: string;
  state: string;
  acres: string;
}

export default function EditProfileScreen() {
  const colors = useColors();
  const { tr, user, updateUser } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [form, setForm] = useState<FormData>({
    name: user.name,
    phone: user.phone,
    location: user.location,
    state: user.state,
    acres: String(user.acres),
  });
  const [showStates, setShowStates] = useState(false);
  const [saving, setSaving] = useState(false);

  const FIELDS: FieldConfig[] = [
    { key: "name", label: tr("fullName"), icon: "user", placeholder: "Your full name" },
    { key: "phone", label: tr("phoneNumber"), icon: "phone", placeholder: "+91 XXXXX XXXXX", numeric: false },
    { key: "location", label: "Village / Town", icon: "map-pin", placeholder: "e.g. Ludhiana, Punjab" },
    { key: "acres", label: `Farm Size (${tr("acres")})`, icon: "map", placeholder: "e.g. 12", numeric: true },
  ];

  const setField = (key: keyof FormData, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    await updateUser({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      state: form.state,
      acres: parseFloat(form.acres) || user.acres,
    });
    setSaving(false);
    Alert.alert("", tr("profileUpdated"), [{ text: "OK", onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("editProfile")}</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtn}>{saving ? "Saving..." : tr("saveChanges")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Text style={styles.avatarText}>
              {form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <Text style={[styles.avatarName, { color: colors.foreground }]}>{form.name || "Your Name"}</Text>
          <Text style={[styles.avatarSub, { color: colors.mutedForeground }]}>{tr("farmer")} · {form.state}</Text>
        </View>

        {/* Fields */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {FIELDS.map((field, idx) => (
            <View key={field.key} style={[styles.fieldRow, idx < FIELDS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.fieldIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={field.icon} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
                <TextInput
                  style={[styles.fieldInput, { color: colors.foreground }]}
                  value={form[field.key]}
                  onChangeText={(v) => setField(field.key, v)}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType={field.numeric ? "numeric" : "default"}
                  autoCapitalize={field.key === "name" ? "words" : "none"}
                />
              </View>
            </View>
          ))}

          {/* State Selector */}
          <TouchableOpacity
            style={[styles.fieldRow, { borderTopWidth: 1, borderTopColor: colors.border }]}
            onPress={() => setShowStates(!showStates)}
          >
            <View style={[styles.fieldIcon, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="globe" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{tr("stateName")}</Text>
              <Text style={[styles.fieldInput, { color: colors.foreground }]}>{form.state}</Text>
            </View>
            <Feather name={showStates ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {showStates && (
          <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled>
              {INDIAN_STATES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: colors.border, backgroundColor: form.state === s ? colors.primary + "10" : "transparent" },
                  ]}
                  onPress={() => { setField("state", s); setShowStates(false); }}
                >
                  <Text style={[styles.dropdownText, { color: form.state === s ? colors.primary : colors.foreground }]}>{s}</Text>
                  {form.state === s && <Feather name="check" size={14} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Farm Stats (read-only info) */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statsTitle, { color: colors.foreground }]}>Farm Overview</Text>
          <View style={styles.statsGrid}>
            {[
              { label: tr("crops"), value: String(user.cropsCount), icon: "sun" as const, color: "#2E7D32" },
              { label: tr("plotsRegistered"), value: String(user.plotsCount), icon: "map" as const, color: "#1565C0" },
              { label: tr("qtlStored"), value: String(user.qtlStored), icon: "archive" as const, color: "#006064" },
              { label: tr("earnings"), value: user.earnings, icon: "trending-up" as const, color: "#4A148C" },
            ].map((item) => (
              <View key={item.label} style={[styles.statBox, { backgroundColor: item.color + "10" }]}>
                <Feather name={item.icon} size={18} color={item.color} />
                <Text style={[styles.statVal, { color: item.color }]}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveFullBtn, { backgroundColor: saving ? colors.muted : colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Feather name="check" size={18} color="#fff" />
          <Text style={styles.saveFullBtnText}>{saving ? "Saving..." : tr("saveChanges")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveBtn: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  avatarSection: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff" },
  avatarName: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 3 },
  avatarSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: "hidden" },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  fieldIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  fieldLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginBottom: 2 },
  fieldInput: { fontSize: 15, fontFamily: "Inter_400Regular" },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
  },
  dropdownText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  statsCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  statsTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statBox: { flex: 1, minWidth: "45%", alignItems: "center", padding: 12, borderRadius: 12, gap: 4 },
  statVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  saveFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  saveFullBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
