import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
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

type Step = "phone" | "otp" | "details";

export default function LoginScreen() {
  const colors = useColors();
  const { tr, login } = useAppContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState("Punjab");
  const [loading, setLoading] = useState(false);
  const [showStates, setShowStates] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    startResendTimer();
  };

  const handleOtpChange = (val: string, idx: number) => {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = cleaned;
    setOtp(next);
    if (cleaned && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!cleaned && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    if (otp.join("").length < 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("details");
  };

  const handleComplete = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await login(`+91 ${phone}`, name.trim(), selectedState);
    setLoading(false);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Green hero top */}
      <View style={[styles.hero, { paddingTop: isWeb ? 60 : insets.top + 20 }]}>
        <View style={styles.logoRow}>
          <View style={[styles.logoCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="feather" size={28} color="#fff" />
          </View>
          <Text style={styles.logoText}>KisanSetu</Text>
        </View>
        <Text style={styles.heroTitle}>{tr("welcomeTitle")}</Text>
        <Text style={styles.heroSub}>{tr("loginSubtitle")}</Text>

        {/* Steps */}
        <View style={styles.stepsRow}>
          {(["phone", "otp", "details"] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <View style={[styles.stepDot, { backgroundColor: step === s || (i < ["phone","otp","details"].indexOf(step)) ? "#fff" : "rgba(255,255,255,0.3)" }]}>
                {i < ["phone","otp","details"].indexOf(step) ? (
                  <Feather name="check" size={10} color="#2E7D32" />
                ) : (
                  <Text style={[styles.stepNum, { color: step === s ? "#2E7D32" : "rgba(255,255,255,0.7)" }]}>{i + 1}</Text>
                )}
              </View>
              {i < 2 && <View style={[styles.stepLine, { backgroundColor: i < ["phone","otp","details"].indexOf(step) ? "#fff" : "rgba(255,255,255,0.3)" }]} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView
        style={[styles.card, { backgroundColor: colors.card }]}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 1: Phone */}
        {step === "phone" && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{tr("phoneNumber")}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{tr("phoneHint")}</Text>
            <View style={[styles.phoneInput, { borderColor: phone.length === 10 ? colors.primary : colors.border, backgroundColor: colors.muted }]}>
              <View style={[styles.countryCode, { borderRightColor: colors.border }]}>
                <Text style={[styles.countryCodeText, { color: colors.foreground }]}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={[styles.phoneField, { color: colors.foreground }]}
                placeholder="98765 43210"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
              {phone.length === 10 && <Feather name="check-circle" size={18} color={colors.primary} />}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: phone.length === 10 ? colors.primary : colors.muted, opacity: phone.length === 10 ? 1 : 0.6 }]}
              onPress={handleSendOTP}
              disabled={phone.length < 10 || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={styles.primaryBtnText}>{tr("sendOTP")}</Text>
                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>secure login</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.trustRow}>
              {[{ icon: "shield" as const, text: "Govt Verified" }, { icon: "lock" as const, text: "Secure OTP" }, { icon: "users" as const, text: "1Cr+ Farmers" }].map((item) => (
                <View key={item.text} style={styles.trustItem}>
                  <Feather name={item.icon} size={16} color={colors.primary} />
                  <Text style={[styles.trustText, { color: colors.mutedForeground }]}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <View>
            <TouchableOpacity onPress={() => setStep("phone")} style={styles.backRow}>
              <Feather name="arrow-left" size={18} color={colors.primary} />
              <Text style={[styles.backText, { color: colors.primary }]}>Change number</Text>
            </TouchableOpacity>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{tr("verifyOTP")}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
              {tr("otpSent")}{"\n"}+91 {phone}
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { otpRefs.current[i] = r; }}
                  style={[
                    styles.otpBox,
                    {
                      borderColor: digit ? colors.primary : colors.border,
                      backgroundColor: digit ? colors.primary + "15" : colors.muted,
                      color: colors.foreground,
                    },
                  ]}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(v, i)}
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: otp.join("").length === 6 ? colors.primary : colors.muted, opacity: otp.join("").length === 6 ? 1 : 0.6 }]}
              onPress={handleVerifyOTP}
              disabled={otp.join("").length < 6 || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={styles.primaryBtnText}>{tr("verifyOTP")}</Text>
                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => { if (resendTimer === 0) { setOtp(["","","","","",""]); startResendTimer(); } }}
              disabled={resendTimer > 0}
            >
              <Text style={[styles.resendText, { color: resendTimer > 0 ? colors.mutedForeground : colors.primary }]}>
                {resendTimer > 0 ? `${tr("resendOTP")} in ${resendTimer}s` : tr("resendOTP")}
              </Text>
            </TouchableOpacity>

            <View style={[styles.demoHint, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}>
              <Feather name="info" size={13} color={colors.primary} />
              <Text style={[styles.demoHintText, { color: colors.primary }]}>Demo: Use any 6-digit OTP to continue</Text>
            </View>
          </View>
        )}

        {/* STEP 3: Details */}
        {step === "details" && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Complete Your Profile</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>Tell us about yourself to personalize your experience</Text>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>{tr("fullName")}</Text>
            <View style={[styles.inputBox, { borderColor: name ? colors.primary : colors.border, backgroundColor: colors.muted }]}>
              <Feather name="user" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.inputField, { color: colors.foreground }]}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>{tr("stateName")}</Text>
            <TouchableOpacity
              style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.muted }]}
              onPress={() => setShowStates(!showStates)}
            >
              <Feather name="map-pin" size={16} color={colors.mutedForeground} />
              <Text style={[styles.inputField, { color: colors.foreground }]}>{selectedState}</Text>
              <Feather name={showStates ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
            </TouchableOpacity>

            {showStates && (
              <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                  {INDIAN_STATES.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.dropdownItem, { borderBottomColor: colors.border, backgroundColor: selectedState === s ? colors.primary + "15" : "transparent" }]}
                      onPress={() => { setSelectedState(s); setShowStates(false); }}
                    >
                      <Text style={[styles.dropdownText, { color: selectedState === s ? colors.primary : colors.foreground }]}>{s}</Text>
                      {selectedState === s && <Feather name="check" size={14} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: name.trim() ? colors.primary : colors.muted, opacity: name.trim() ? 1 : 0.6, marginTop: 16 }]}
              onPress={handleComplete}
              disabled={!name.trim() || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Feather name="feather" size={18} color="#fff" />
                  <Text style={styles.primaryBtnText}>Enter KisanSetu</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  logoCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  heroTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 6 },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular", marginBottom: 24 },
  stepsRow: { flexDirection: "row", alignItems: "center" },
  stepDot: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  stepNum: { fontSize: 12, fontFamily: "Inter_700Bold" },
  stepLine: { flex: 1, height: 2, marginHorizontal: 6 },
  card: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
  },
  stepTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 6 },
  stepSub: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 24 },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 20,
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRightWidth: 1,
  },
  countryCodeText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  phoneField: { flex: 1, paddingHorizontal: 14, fontSize: 16, fontFamily: "Inter_500Medium" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  trustRow: { flexDirection: "row", justifyContent: "space-around" },
  trustItem: { alignItems: "center", gap: 4 },
  trustText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  otpRow: { flexDirection: "row", gap: 8, marginBottom: 24, justifyContent: "center" },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  resendBtn: { alignItems: "center", marginBottom: 16 },
  resendText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  demoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  demoHintText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 6, letterSpacing: 0.5 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
  },
  inputField: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 8,
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
});
