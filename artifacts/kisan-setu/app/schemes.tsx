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

interface Scheme {
  name: string;
  ministry: string;
  benefit: string;
  amount: string;
  eligibility: string;
  docs: string[];
  color: string;
  category: string;
}

const SCHEMES: Scheme[] = [
  {
    name: "PM-KISAN",
    ministry: "Ministry of Agriculture",
    benefit: "Direct income support of ₹6,000/year in 3 installments to farmer families.",
    amount: "₹6,000/year",
    eligibility: "All land-holding farmer families. Excludes institutional landholders.",
    docs: ["Aadhaar Card", "Land Records", "Bank Account"],
    color: "#1B5E20",
    category: "Income Support",
  },
  {
    name: "PM Fasal Bima Yojana",
    ministry: "Ministry of Agriculture",
    benefit: "Comprehensive crop insurance covering natural calamities, pests, and diseases.",
    amount: "Full sum insured",
    eligibility: "All farmers including sharecroppers and tenant farmers.",
    docs: ["Aadhaar Card", "Land Records", "Bank Account", "Crop Sowing Certificate"],
    color: "#1565C0",
    category: "Insurance",
  },
  {
    name: "Kisan Credit Card",
    ministry: "Ministry of Finance",
    benefit: "Easy credit for agricultural needs at subsidized interest rate of 4-7%.",
    amount: "Up to ₹3 lakh",
    eligibility: "Farmers, tenant farmers, sharecroppers with KYC documents.",
    docs: ["Aadhaar Card", "Land Records", "Two Passport Photos", "Income Certificate"],
    color: "#4A148C",
    category: "Credit",
  },
  {
    name: "PM Kusum Solar Pump",
    ministry: "Ministry of New & Renewable Energy",
    benefit: "Subsidy for installing solar-powered irrigation pumps. 90% subsidy available.",
    amount: "90% subsidy",
    eligibility: "Individual farmers, FPOs, cooperatives with cultivable land.",
    docs: ["Aadhaar Card", "Land Records", "Bank Account", "Mobile Number"],
    color: "#E65100",
    category: "Energy",
  },
  {
    name: "PM Krishi Sinchai Yojana",
    ministry: "Jal Shakti Ministry",
    benefit: "Irrigation infrastructure support. More crop per drop initiative.",
    amount: "Variable",
    eligibility: "All farmers. Focus on water-stressed regions and small farmers.",
    docs: ["Aadhaar Card", "Land Ownership/Lease Deed", "Water Source Details"],
    color: "#006064",
    category: "Irrigation",
  },
  {
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture",
    benefit: "Free soil health card with crop-wise recommendations for nutrients.",
    amount: "Free",
    eligibility: "All farmers across India.",
    docs: ["Aadhaar Card", "Land Details", "Mobile Number"],
    color: "#33691E",
    category: "Soil Health",
  },
  {
    name: "eNAM",
    ministry: "Ministry of Agriculture",
    benefit: "Online trading platform for agri commodities. Pan-India market access.",
    amount: "Market prices",
    eligibility: "Farmers registered with APMCs. KCC holders get priority.",
    docs: ["Aadhaar Card", "Bank Account", "APMC Registration"],
    color: "#880E4F",
    category: "Market",
  },
  {
    name: "AP Rythu Bharosa",
    ministry: "Government of Andhra Pradesh",
    benefit: "₹13,500/year direct benefit to AP farmers (₹7,500 + ₹4,000 + ₹2,000).",
    amount: "₹13,500/year",
    eligibility: "All AP farmer families with agricultural land.",
    docs: ["Aadhaar Card", "White Ration Card", "Land Records", "Bank Account"],
    color: "#BF360C",
    category: "State Scheme",
  },
];

const CATEGORIES = ["All", "Income Support", "Insurance", "Credit", "Energy", "Irrigation", "Market", "State Scheme"];

export default function SchemesScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = selectedCategory === "All" ? SCHEMES : SCHEMES.filter((s) => s.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#1A237E", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("govtSchemes")}</Text>
        <Feather name="info" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { backgroundColor: colors.card }]} contentContainerStyle={styles.filterContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, { backgroundColor: selectedCategory === cat ? "#1A237E" : colors.muted }]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, { color: selectedCategory === cat ? "#fff" : colors.mutedForeground }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {filtered.map((scheme) => (
          <TouchableOpacity
            key={scheme.name}
            style={[styles.schemeCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: scheme.color, borderLeftWidth: 4 }]}
            onPress={() => setExpanded(expanded === scheme.name ? null : scheme.name)}
            activeOpacity={0.9}
          >
            <View style={styles.schemeTop}>
              <View style={[styles.schemeBadge, { backgroundColor: scheme.color }]}>
                <Text style={styles.schemeBadgeText}>{scheme.category}</Text>
              </View>
              <Feather name={expanded === scheme.name ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.schemeName, { color: colors.foreground }]}>{scheme.name}</Text>
            <Text style={[styles.schemeMinistry, { color: colors.mutedForeground }]}>{scheme.ministry}</Text>
            <View style={[styles.amountBadge, { backgroundColor: scheme.color + "15" }]}>
              <Text style={[styles.amountText, { color: scheme.color }]}>Benefit: {scheme.amount}</Text>
            </View>

            {expanded === scheme.name && (
              <View style={styles.expanded}>
                <Text style={[styles.expandLabel, { color: colors.mutedForeground }]}>About</Text>
                <Text style={[styles.expandText, { color: colors.foreground }]}>{scheme.benefit}</Text>
                <Text style={[styles.expandLabel, { color: colors.mutedForeground }]}>{tr("eligibility")}</Text>
                <Text style={[styles.expandText, { color: colors.foreground }]}>{scheme.eligibility}</Text>
                <Text style={[styles.expandLabel, { color: colors.mutedForeground }]}>{tr("documents")} Required</Text>
                {scheme.docs.map((doc) => (
                  <View key={doc} style={styles.docRow}>
                    <Feather name="check-circle" size={13} color={scheme.color} />
                    <Text style={[styles.docText, { color: colors.foreground }]}>{doc}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[styles.applyBtn, { backgroundColor: scheme.color }]}>
                  <Text style={styles.applyText}>{tr("applyNow")}</Text>
                  <Feather name="external-link" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
  filterRow: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  schemeCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  schemeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  schemeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  schemeBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  schemeName: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 2 },
  schemeMinistry: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 10 },
  amountBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: "flex-start" },
  amountText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  expanded: { marginTop: 12 },
  expandLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginTop: 10, marginBottom: 4, letterSpacing: 0.5 },
  expandText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  docRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  docText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
