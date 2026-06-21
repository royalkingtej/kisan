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
  updateUser: (updates: Partial<UserProfile>) => void;
  crops: Crop[];
  addCrop: (crop: Omit<Crop, "id">) => void;
  updateCrop: (id: string, updates: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  notifications: number;
  showLanguagePicker: boolean;
  setShowLanguagePicker: (show: boolean) => void;
  isLoggedIn: boolean;
  login: (phone: string, name: string, state: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
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

const DEFAULT_CROPS: Crop[] = [
  { id: "1", name: "Wheat", field: "F001", plantingDate: "15/10/2025", harvestDate: "20/03/2026", quantity: 250, status: "planted", notes: "Good growth expected" },
  { id: "2", name: "Paddy", field: "F002", plantingDate: "10/06/2025", harvestDate: "15/10/2025", quantity: 180, status: "harvested", notes: "Excellent yield" },
  { id: "3", name: "Tomato", field: "F003", plantingDate: "01/01/2026", harvestDate: "15/04/2026", quantity: 80, status: "planted", notes: "Drip irrigation setup" },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [crops, setCrops] = useState<Crop[]>(DEFAULT_CROPS);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const notifications = 3;

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const [savedLang, savedDark, savedCrops, savedLogin, savedUser] = await Promise.all([
          AsyncStorage.getItem("language"),
          AsyncStorage.getItem("darkMode"),
          AsyncStorage.getItem("crops"),
          AsyncStorage.getItem("isLoggedIn"),
          AsyncStorage.getItem("user"),
        ]);
        if (savedLang) setLanguageState(savedLang);
        if (savedDark !== null) setIsDarkMode(savedDark === "true");
        if (savedCrops) setCrops(JSON.parse(savedCrops));
        if (savedLogin === "true") setIsLoggedIn(true);
        if (savedUser) setUser(JSON.parse(savedUser));
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

  const tr = useCallback((key: TranslationKey) => getTranslation(language, key), [language]);

  const login = useCallback(async (phone: string, name: string, state: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      phone,
      name,
      state,
      location: `${state}, India`,
    };
    setUser(newUser);
    setIsLoggedIn(true);
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } catch {}
  }, []);

  const logout = useCallback(async () => {
    setIsLoggedIn(false);
    setUser(DEFAULT_USER);
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("user");
    } catch {}
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem("user", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

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
    <AppContext.Provider value={{
      language, setLanguage, tr,
      isDarkMode, toggleDarkMode,
      user, updateUser,
      crops, addCrop, updateCrop, deleteCrop,
      notifications,
      showLanguagePicker, setShowLanguagePicker,
      isLoggedIn, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
