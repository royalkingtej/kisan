import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppContext } from "@/context/AppContext";
import { LANGUAGES } from "@/constants/translations";
import { useColors } from "@/hooks/useColors";

export function LanguagePicker() {
  const { language, setLanguage, showLanguagePicker, setShowLanguagePicker, tr } = useAppContext();
  const colors = useColors();

  return (
    <Modal
      visible={showLanguagePicker}
      animationType="slide"
      transparent
      onRequestClose={() => setShowLanguagePicker(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {tr("selectLanguage")}
            </Text>
            <TouchableOpacity
              onPress={() => setShowLanguagePicker(false)}
              style={[styles.closeBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.langBtn,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.muted,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      setLanguage(lang.code);
                      setShowLanguagePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.nativeName,
                        { color: isSelected ? "#fff" : colors.foreground },
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.engName,
                        { color: isSelected ? "rgba(255,255,255,0.8)" : colors.mutedForeground },
                      ]}
                    >
                      {lang.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkMark}>
                        <Feather name="check" size={12} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function FloatingLanguageButton() {
  const { language, setShowLanguagePicker } = useAppContext();
  const colors = useColors();
  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <Pressable
      style={[styles.fab, { backgroundColor: colors.secondary }]}
      onPress={() => setShowLanguagePicker(true)}
    >
      <Text style={styles.fabText}>{currentLang?.nativeName?.charAt(0) || "A"}</Text>
      <Feather name="globe" size={12} color="#fff" style={{ marginTop: 1 }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 10,
  },
  langBtn: {
    width: "47%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    position: "relative",
  },
  nativeName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  engName: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  checkMark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    gap: 1,
  },
  fabText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
