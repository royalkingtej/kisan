import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

interface DiseaseResult {
  name: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  description: string;
  treatments: string[];
  organic: string[];
  prevention: string;
}

const MOCK_DISEASES: DiseaseResult[] = [
  {
    name: "Leaf Blight (Helminthosporium)",
    confidence: 94,
    severity: "High",
    description: "Fungal disease causing brown lesions on leaves. Spreads rapidly in humid conditions above 25°C.",
    treatments: [
      "Apply Mancozeb 75WP @ 2.5g/L water",
      "Spray Propiconazole 25EC @ 1ml/L",
      "Repeat spray after 10-12 days",
    ],
    organic: [
      "Neem oil spray 5ml/L water",
      "Trichoderma viride 5g/L",
      "Remove infected leaves immediately",
    ],
    prevention: "Use certified disease-free seeds. Maintain proper spacing for air circulation. Avoid overhead irrigation.",
  },
  {
    name: "Aphid Infestation",
    confidence: 88,
    severity: "Medium",
    description: "Sucking pest causing leaf curl and yellowing. Vectors for multiple viral diseases.",
    treatments: [
      "Imidacloprid 17.8SL @ 0.5ml/L water",
      "Thiamethoxam 25WG @ 0.2g/L",
      "Dimethoate 30EC @ 1.5ml/L",
    ],
    organic: [
      "Garlic-chili spray (50g garlic + 20g chili per liter)",
      "Neem soap spray 5ml/L",
      "Yellow sticky traps",
    ],
    prevention: "Regular monitoring. Encourage natural predators like ladybugs. Avoid excess nitrogen fertilizer.",
  },
];

export default function DiseaseScanScreen() {
  const colors = useColors();
  const { tr } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [tab, setTab] = useState<"chemical" | "organic">("chemical");

  const pickImage = async (source: "camera" | "gallery") => {
    let res;
    if (source === "camera") {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission needed", "Camera permission is required to scan crops.");
        return;
      }
      res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    } else {
      res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    }
    if (!res.canceled && res.assets[0]) {
      setImageUri(res.assets[0].uri);
      setResult(null);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setResult(MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)]);
      }, 2500);
    }
  };

  const severityColor = (sev: string) => {
    if (sev === "High") return colors.error;
    if (sev === "Medium") return colors.warning;
    return colors.success;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: "#1565C0", paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("diseaseScan")}</Text>
        <Feather name="info" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Scan area */}
        {!imageUri ? (
          <View style={[styles.scanArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="camera" size={48} color={colors.mutedForeground} />
            <Text style={[styles.scanTitle, { color: colors.foreground }]}>Scan Your Crop</Text>
            <Text style={[styles.scanSub, { color: colors.mutedForeground }]}>
              Take a clear photo of affected leaves, stems, or roots for AI analysis
            </Text>
            <View style={styles.scanButtons}>
              <TouchableOpacity
                style={[styles.scanBtn, { backgroundColor: "#1565C0" }]}
                onPress={() => pickImage("camera")}
              >
                <Feather name="camera" size={18} color="#fff" />
                <Text style={styles.scanBtnText}>{tr("scanCrop")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scanBtn, { backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border }]}
                onPress={() => pickImage("gallery")}
              >
                <Feather name="image" size={18} color={colors.foreground} />
                <Text style={[styles.scanBtnText, { color: colors.foreground }]}>{tr("uploadPhoto")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.imageContainer, { borderColor: colors.border }]}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
            <TouchableOpacity
              style={[styles.retakeBtn, { backgroundColor: colors.card }]}
              onPress={() => { setImageUri(null); setResult(null); }}
            >
              <Feather name="refresh-cw" size={14} color={colors.foreground} />
              <Text style={[styles.retakeText, { color: colors.foreground }]}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={[styles.loadingCard, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="large" color="#1565C0" />
            <Text style={[styles.loadingText, { color: colors.foreground }]}>Analyzing crop image...</Text>
            <Text style={[styles.loadingSub, { color: colors.mutedForeground }]}>AI processing leaf patterns & color signatures</Text>
          </View>
        )}

        {result && (
          <View>
            {/* Result header */}
            <View style={[styles.resultHeader, { backgroundColor: severityColor(result.severity) }]}>
              <View>
                <Text style={styles.resultName}>{tr("diseaseDetected")}</Text>
                <Text style={styles.resultDisease}>{result.name}</Text>
              </View>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{result.confidence}%</Text>
                <Text style={styles.confidenceLabel}>Match</Text>
              </View>
            </View>

            <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.severityRow, { backgroundColor: severityColor(result.severity) + "15" }]}>
                <Feather name="alert-triangle" size={14} color={severityColor(result.severity)} />
                <Text style={[styles.severityText, { color: severityColor(result.severity) }]}>
                  Severity: {result.severity}
                </Text>
              </View>
              <Text style={[styles.descText, { color: colors.foreground }]}>{result.description}</Text>

              {/* Treatment tabs */}
              <View style={[styles.tabRow, { backgroundColor: colors.muted, borderRadius: 10 }]}>
                <TouchableOpacity
                  style={[styles.tabBtn, tab === "chemical" && { backgroundColor: "#1565C0" }]}
                  onPress={() => setTab("chemical")}
                >
                  <Text style={[styles.tabText, { color: tab === "chemical" ? "#fff" : colors.mutedForeground }]}>Chemical</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, tab === "organic" && { backgroundColor: colors.primary }]}
                  onPress={() => setTab("organic")}
                >
                  <Text style={[styles.tabText, { color: tab === "organic" ? "#fff" : colors.mutedForeground }]}>Organic</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.treatLabel, { color: colors.foreground }]}>{tr("treatment")} Steps:</Text>
              {(tab === "chemical" ? result.treatments : result.organic).map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: tab === "chemical" ? "#1565C0" : colors.primary }]}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
                </View>
              ))}

              <View style={[styles.preventBox, { backgroundColor: colors.muted }]}>
                <Feather name="shield" size={14} color={colors.primary} />
                <Text style={[styles.preventText, { color: colors.foreground }]}>{result.prevention}</Text>
              </View>

              <TouchableOpacity style={[styles.expertBtn, { backgroundColor: colors.secondary }]}>
                <Feather name="message-circle" size={16} color="#fff" />
                <Text style={styles.expertBtnText}>{tr("askExpert")} for Detailed Advice</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tips */}
        {!result && !loading && (
          <View style={[styles.tipsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Tips for Better Scan</Text>
            {[
              "Use natural daylight, avoid harsh shadows",
              "Focus on the affected area of the leaf/stem",
              "Include both healthy and diseased parts if possible",
              "Ensure image is sharp and not blurry",
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Feather name="check" size={14} color={colors.primary} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
              </View>
            ))}
          </View>
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
  scanArea: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 40,
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  scanTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  scanSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  scanButtons: { flexDirection: "row", gap: 10, marginTop: 8 },
  scanBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  scanBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  imageContainer: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 16, position: "relative" },
  previewImage: { width: "100%", height: 240 },
  retakeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retakeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  loadingCard: { padding: 32, borderRadius: 16, alignItems: "center", gap: 12, marginBottom: 16 },
  loadingText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  loadingSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 14, marginBottom: 12 },
  resultName: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "Inter_500Medium" },
  resultDisease: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 2 },
  confidenceBadge: { alignItems: "center" },
  confidenceText: { color: "#fff", fontSize: 24, fontFamily: "Inter_700Bold" },
  confidenceLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "Inter_400Regular" },
  resultCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  severityRow: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10, borderRadius: 8 },
  severityText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  descText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  tabRow: { flexDirection: "row", padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  treatLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepNum: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  stepNumText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  stepText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  preventBox: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 10, alignItems: "flex-start" },
  preventText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  expertBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 12 },
  expertBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  tipsCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  tipsTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
});
