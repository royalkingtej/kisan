import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { TranslationKey, getTranslation } from "@/constants/translations";

export interface UserProfile {
  name: string;
  location: string;
  state: string;
  acres: number;
  cropsCount: number;
  earnings: string;
  plotsCount: number;
  ordersCount: number;
  qtlStored: number;
  lastPayment: string;
  phone: string;
}

interface Crop {
  id: string;
  name: string;
  field: string;
  plantingDate: string;
  harvestDate: string;
  quantity: number;
  status: "planted" | "harvested";
  notes: string;
}

interface AppContextType {
  language: string;
  setLanguage: (lang: string) => void;
  tr: (key: TranslationKey) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: UserProfile;
  crops: Crop[];
  addCrop: (crop: Omit<Crop, "id">) => void;
  updateCrop: (id: string, updates: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  notifications: number;
  showLanguagePicker: boolean;
  setShowLanguagePicker: (show: boolean) => void;
}

const defaultUser: UserProfile = {
  name: "Rahul Singh",
  location: "Rural, Punjab",
  state: "Punjab",
  acres: 12,
  cropsCount: 5,
  earnings: "₹2.1L",
  plotsCount: 3,
  ordersCount: 2,
  qtlStored: 15,
  lastPayment: "₹12,500",
  phone: "+91 98765 43210",
};

const defaultCrops: Crop[] = [
  {
    id: "1",
    name: "Wheat",
    field: "F001",
    plantingDate: "15/10/2025",
    harvestDate: "20/03/2026",
    quantity: 250,
    status: "planted",
    notes: "Good growth expected",
  },
  {
    id: "2",
    name: "Paddy",
    field: "F002",
    plantingDate: "10/06/2025",
    harvestDate: "15/10/2025",
    quantity: 180,
    status: "harvested",
    notes: "Excellent yield",
  },
  {
    id: "3",
    name: "Tomato",
    field: "F003",
    plantingDate: "01/01/2026",
    harvestDate: "15/04/2026",
    quantity: 80,
    status: "planted",
    notes: "Drip irrigation setup",
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [crops, setCrops] = useState<Crop[]>(defaultCrops);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const notifications = 3;

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const savedLang = await AsyncStorage.getItem("language");
        const savedDark = await AsyncStorage.getItem("darkMode");
        const savedCrops = await AsyncStorage.getItem("crops");
        if (savedLang) setLanguageState(savedLang);
        if (savedDark !== null) setIsDarkMode(savedDark === "true");
        if (savedCrops) setCrops(JSON.parse(savedCrops));
      } catch {}
    };
    loadPrefs();
  }, []);

  const setLanguage = useCallback(async (lang: string) => {
    setLanguageState(lang);
    try { await AsyncStorage.setItem("language", lang); } catch {}
  }, []);

  const toggleDarkMode = useCallback(async () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem("darkMode", String(next)).catch(() => {});
      return next;
    });
  }, []);

  const tr = useCallback((key: TranslationKey) => {
    return getTranslation(language, key);
  }, [language]);

  const addCrop = useCallback((crop: Omit<Crop, "id">) => {
    const newCrop: Crop = { ...crop, id: Date.now().toString() };
    setCrops((prev) => {
      const next = [newCrop, ...prev];
      AsyncStorage.setItem("crops", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const updateCrop = useCallback((id: string, updates: Partial<Crop>) => {
    setCrops((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      AsyncStorage.setItem("crops", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const deleteCrop = useCallback((id: string) => {
    setCrops((prev) => {
      const next = prev.filter((c) => c.id !== id);
      AsyncStorage.setItem("crops", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        tr,
        isDarkMode,
        toggleDarkMode,
        user: defaultUser,
        crops,
        addCrop,
        updateCrop,
        deleteCrop,
        notifications,
        showLanguagePicker,
        setShowLanguagePicker,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
