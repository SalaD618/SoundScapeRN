import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppSettings, Artist } from "../types";

const keys = {
  favorites: "soundscape:favorites",
  settings: "soundscape:settings",
};

const defaultSettings: AppSettings = {
  darkMode: false,
  defaultGenre: "All",
  language: "English"
};

export async function loadFavorites(): Promise<Artist[]> {
  const raw = await AsyncStorage.getItem(keys.favorites);
  return raw ? (JSON.parse(raw) as Artist[]) : [];
}

export async function saveFavorites(favorites: Artist[]): Promise<void> {
  await AsyncStorage.setItem(keys.favorites, JSON.stringify(favorites));
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(keys.settings);
  return raw ? { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) } : defaultSettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(keys.settings, JSON.stringify(settings));
}

