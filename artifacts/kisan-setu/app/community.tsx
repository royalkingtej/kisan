import React, { useState } from "react";
import {
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

const CATEGORIES = ["All", "Rice", "Wheat", "Vegetables", "Organic", "Dairy", "Market"];

const POSTS = [
  {
    id: "1",
    user: "Ravi Jadhav",
    location: "Ulhasnagar, Maharashtra",
    time: "2h ago",
    category: "Vegetables",
    question: "My soybean plant is showing yellow and white color patches on leaves. Leafs are falling. What disease is this and how to control?",
    image: true,
    likes: 24,
    replies: 8,
    expertAnswered: true,
    avatar: "RJ",
    avatarColor: "#2E7D32",
  },
  {
    id: "2",
    user: "Sukhdeep Singh",
    location: "Amritsar, Punjab",
    time: "5h ago",
    category: "Wheat",
    question: "What is the best time to apply second dose of fertilizer for wheat crop in Punjab? Soil is loamy with moderate moisture.",
    image: false,
    likes: 15,
    replies: 12,
    expertAnswered: true,
    avatar: "SS",
    avatarColor: "#1565C0",
  },
  {
    id: "3",
    user: "Lakshmi Devi",
    location: "Guntur, Andhra Pradesh",
    time: "1d ago",
    category: "Rice",
    question: "Paddy crop showing brownish sheath at base of stem. Is this sheath blight disease? What organic remedy can I use?",
    image: true,
    likes: 31,
    replies: 19,
    expertAnswered: true,
    avatar: "LD",
    avatarColor: "#E65100",
  },
  {
    id: "4",
    user: "Mohan Kumar",
    location: "Coimbatore, Tamil Nadu",
    time: "2d ago",
    category: "Organic",
    question: "Transitioning to organic farming. What natural pest control methods work best for cotton in Tamil Nadu climate?",
    image: false,
    likes: 45,
    replies: 22,
    expertAnswered: false,
    avatar: "MK",
    avatarColor: "#4A148C",
  },
];

const EXPERTS = [
  { name: "Dr. Arjun Sharma", spec: "Plant Pathology", available: true, rating: 4.9, avatar: "AS", color: "#1B5E20" },
  { name: "Dr. Meena Reddy", spec: "Agronomy", available: true, rating: 4.8, avatar: "MR", color: "#1565C0" },
  { name: "Dr. Priya Singh", spec: "Soil Science", available: false, rating: 4.7, avatar: "PS", color: "#880E4F" },
];

export default function CommunityScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [selectedCat, setSelectedCat] = useState("All");
  const [tab, setTab] = useState<"forum" | "experts">("forum");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const filtered = POSTS.filter((p) => selectedCat === "All" || p.category === selectedCat);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#880E4F", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={[styles.postBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Tab */}
      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, tab === "forum" && { borderBottomColor: "#880E4F", borderBottomWidth: 2 }]}
          onPress={() => setTab("forum")}
        >
          <Text style={[styles.tabText, { color: tab === "forum" ? "#880E4F" : colors.mutedForeground }]}>
            {tr("forum")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "experts" && { borderBottomColor: "#880E4F", borderBottomWidth: 2 }]}
          onPress={() => setTab("experts")}
        >
          <Text style={[styles.tabText, { color: tab === "experts" ? "#880E4F" : colors.mutedForeground }]}>
            {tr("askExpert")}
          </Text>
        </TouchableOpacity>
      </View>

      {tab === "forum" ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { backgroundColor: colors.card }]} contentContainerStyle={styles.filterContent}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, { backgroundColor: selectedCat === cat ? "#880E4F" : colors.muted }]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={[styles.chipText, { color: selectedCat === cat ? "#fff" : colors.mutedForeground }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
            {filtered.map((post) => (
              <View key={post.id} style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.postTop}>
                  <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
                    <Text style={styles.avatarText}>{post.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.postUser, { color: colors.foreground }]}>{post.user}</Text>
                    <Text style={[styles.postLocation, { color: colors.mutedForeground }]}>{post.location} · {post.time}</Text>
                  </View>
                  <View style={[styles.catBadge, { backgroundColor: "#880E4F20" }]}>
                    <Text style={[styles.catText, { color: "#880E4F" }]}>{post.category}</Text>
                  </View>
                </View>
                <Text style={[styles.question, { color: colors.foreground }]}>{post.question}</Text>
                {post.image && (
                  <View style={[styles.imagePlaceholder, { backgroundColor: colors.muted }]}>
                    <Feather name="image" size={24} color={colors.mutedForeground} />
                    <Text style={[styles.imagePlaceholderText, { color: colors.mutedForeground }]}>Crop photo attached</Text>
                  </View>
                )}
                {post.expertAnswered && (
                  <View style={[styles.expertBadge, { backgroundColor: colors.primary + "15" }]}>
                    <Feather name="check-circle" size={12} color={colors.primary} />
                    <Text style={[styles.expertBadgeText, { color: colors.primary }]}>Expert answered</Text>
                  </View>
                )}
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                      const next = new Set(likedPosts);
                      likedPosts.has(post.id) ? next.delete(post.id) : next.add(post.id);
                      setLikedPosts(next);
                    }}
                  >
                    <Feather name="thumbs-up" size={14} color={likedPosts.has(post.id) ? colors.primary : colors.mutedForeground} />
                    <Text style={[styles.actionText, { color: colors.mutedForeground }]}>
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Feather name="message-circle" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.actionText, { color: colors.mutedForeground }]}>{post.replies} replies</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Feather name="share-2" size={14} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={[styles.expertTitle, { color: colors.foreground }]}>Available Experts</Text>
          {EXPERTS.map((exp) => (
            <View key={exp.name} style={[styles.expertCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.expAvatar, { backgroundColor: exp.color }]}>
                <Text style={styles.expAvatarText}>{exp.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.expName, { color: colors.foreground }]}>{exp.name}</Text>
                <Text style={[styles.expSpec, { color: colors.mutedForeground }]}>{exp.spec}</Text>
                <View style={styles.expRow}>
                  <Feather name="star" size={11} color="#FFB300" />
                  <Text style={[styles.expRating, { color: colors.foreground }]}>{exp.rating}</Text>
                  <View style={[styles.availBadge, { backgroundColor: exp.available ? colors.primary + "20" : colors.muted }]}>
                    <View style={[styles.availDot, { backgroundColor: exp.available ? colors.primary : colors.mutedForeground }]} />
                    <Text style={[styles.availText, { color: exp.available ? colors.primary : colors.mutedForeground }]}>
                      {exp.available ? "Online" : "Offline"}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.consultBtn, { backgroundColor: exp.available ? "#880E4F" : colors.muted }]}>
                <Text style={[styles.consultBtnText, { color: exp.available ? "#fff" : colors.mutedForeground }]}>
                  {exp.available ? "Consult" : "Unavailable"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={[styles.askCard, { backgroundColor: "#880E4F15", borderColor: "#880E4F" }]}>
            <Text style={[styles.askTitle, { color: colors.foreground }]}>Ask Your Question</Text>
            <TextInput
              style={[styles.askInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Describe your farming problem in detail..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={[styles.askBtn, { backgroundColor: "#880E4F" }]}>
              <Feather name="send" size={16} color="#fff" />
              <Text style={styles.askBtnText}>Post to Community</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  postBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  postBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  filterRow: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  postCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  postTop: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  postUser: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  postLocation: { fontSize: 11, fontFamily: "Inter_400Regular" },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  question: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 10 },
  imagePlaceholder: { height: 80, borderRadius: 10, alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 10 },
  imagePlaceholderText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  expertBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
  expertBadgeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  postActions: { flexDirection: "row", alignItems: "center", gap: 16, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: "#E0E0E0" },
  action: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  expertTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  expertCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10, gap: 12 },
  expAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  expAvatarText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  expName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  expSpec: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 5 },
  expRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  expRating: { fontSize: 12, fontFamily: "Inter_500Medium" },
  availBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  availDot: { width: 6, height: 6, borderRadius: 3 },
  availText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  consultBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  consultBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  askCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 8, gap: 12 },
  askTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  askInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 13, fontFamily: "Inter_400Regular", minHeight: 100, textAlignVertical: "top" },
  askBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 12 },
  askBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
