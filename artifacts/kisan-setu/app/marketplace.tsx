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

const CATEGORIES = ["All", "Seeds", "Fertilizers", "Pesticides", "Tools", "Organic"];

const PRODUCTS = [
  {
    name: "HDSR Paddy Seeds (NSC Certified)",
    category: "Seeds",
    price: "₹220/kg",
    unit: "5 kg bag",
    rating: 4.7,
    seller: "National Seeds Corp",
    certified: true,
    organic: false,
    discount: 10,
    color: "#2E7D32",
    icon: "feather" as const,
  },
  {
    name: "Urea (46% N) - Govt Rate",
    category: "Fertilizers",
    price: "₹267/bag",
    unit: "50 kg bag",
    rating: 4.8,
    seller: "IFFCO",
    certified: true,
    organic: false,
    discount: 0,
    color: "#1565C0",
    icon: "droplet" as const,
  },
  {
    name: "Organic Neem Oil (3% EC)",
    category: "Pesticides",
    price: "₹180/L",
    unit: "1 liter",
    rating: 4.5,
    seller: "AgroOrganic Ltd",
    certified: true,
    organic: true,
    discount: 15,
    color: "#33691E",
    icon: "shield" as const,
  },
  {
    name: "Vermi Compost (Premium)",
    category: "Organic",
    price: "₹8/kg",
    unit: "50 kg bag",
    rating: 4.9,
    seller: "GreenSoil Farm",
    certified: true,
    organic: true,
    discount: 0,
    color: "#558B2F",
    icon: "sun" as const,
  },
  {
    name: "Hybrid Wheat Variety HI 8498",
    category: "Seeds",
    price: "₹350/kg",
    unit: "2 kg pack",
    rating: 4.6,
    seller: "IARI Seeds",
    certified: true,
    organic: false,
    discount: 5,
    color: "#F57F17",
    icon: "feather" as const,
  },
  {
    name: "Manual Sprayer (16L Knapsack)",
    category: "Tools",
    price: "₹850",
    unit: "1 piece",
    rating: 4.4,
    seller: "AgroTools India",
    certified: false,
    organic: false,
    discount: 20,
    color: "#E65100",
    icon: "tool" as const,
  },
  {
    name: "DAP Fertilizer (18:46:00)",
    category: "Fertilizers",
    price: "₹1,350/bag",
    unit: "50 kg bag",
    rating: 4.7,
    seller: "Coromandel",
    certified: true,
    organic: false,
    discount: 0,
    color: "#0277BD",
    icon: "droplet" as const,
  },
  {
    name: "Bio-Pesticide Tricho-King",
    category: "Pesticides",
    price: "₹120/kg",
    unit: "1 kg pack",
    rating: 4.3,
    seller: "BioControl Labs",
    certified: true,
    organic: true,
    discount: 8,
    color: "#2E7D32",
    icon: "shield" as const,
  },
];

export default function MarketplaceScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Set<string>>(new Set());

  const filtered = selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory);

  const toggleCart = (name: string) => {
    setCart((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#BF360C", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("inputStore")}</Text>
        <View style={{ position: "relative" }}>
          <Feather name="shopping-cart" size={22} color="#fff" />
          {cart.size > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.size}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { backgroundColor: colors.card }]} contentContainerStyle={styles.filterContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, { backgroundColor: selectedCategory === cat ? "#BF360C" : colors.muted }]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, { color: selectedCategory === cat ? "#fff" : colors.mutedForeground }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        <View style={styles.grid}>
          {filtered.map((product) => (
            <View key={product.name} style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.productIconBg, { backgroundColor: product.color }]}>
                <Feather name={product.icon} size={24} color="#fff" />
                {product.discount > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{product.discount}% OFF</Text>
                  </View>
                )}
              </View>
              <View style={styles.badges}>
                {product.certified && (
                  <View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
                    <Feather name="check-circle" size={9} color={colors.primary} />
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{tr("verified")}</Text>
                  </View>
                )}
                {product.organic && (
                  <View style={[styles.badge, { backgroundColor: "#33691E20" }]}>
                    <Text style={[styles.badgeText, { color: "#33691E" }]}>{tr("organic")}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>{product.name}</Text>
              <Text style={[styles.productSeller, { color: colors.mutedForeground }]}>{product.seller}</Text>
              <View style={styles.ratingRow}>
                <Feather name="star" size={10} color="#FFB300" />
                <Text style={[styles.ratingText, { color: colors.foreground }]}>{product.rating}</Text>
                <Text style={[styles.unitText, { color: colors.mutedForeground }]}>· {product.unit}</Text>
              </View>
              <Text style={[styles.price, { color: colors.primary }]}>{product.price}</Text>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: cart.has(product.name) ? colors.primary : "#BF360C" }]}
                onPress={() => toggleCart(product.name)}
              >
                <Feather name={cart.has(product.name) ? "check" : "plus"} size={14} color="#fff" />
                <Text style={styles.addBtnText}>{cart.has(product.name) ? "Added" : tr("addToCart")}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF5252",
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: "#fff", fontSize: 8, fontFamily: "Inter_700Bold" },
  filterRow: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  productCard: {
    width: "47.5%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  productIconBg: {
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF5252",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold" },
  badges: { flexDirection: "row", gap: 4, flexWrap: "wrap" },
  badge: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontFamily: "Inter_500Medium" },
  productName: { fontSize: 12, fontFamily: "Inter_600SemiBold", lineHeight: 16 },
  productSeller: { fontSize: 10, fontFamily: "Inter_400Regular" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  unitText: { fontSize: 10, fontFamily: "Inter_400Regular" },
  price: { fontSize: 14, fontFamily: "Inter_700Bold" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
