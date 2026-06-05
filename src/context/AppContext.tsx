import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppSettings, Artist } from "../types";
import {
  loadFavorites,
  loadSettings,
  saveFavorites,
  saveSettings
} from "../storage/storage";

type AppContextValue = {
  ready: boolean;
  favorites: Artist[];
  settings: AppSettings;
  isFavorite: (artistName: string) => boolean;
  toggleFavorite: (artist: Artist) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<Artist[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    defaultGenre: "All",
    language: "English"
  });

  useEffect(() => {
    async function boot(): Promise<void> {
      const [storedFavorites, storedSettings] = await Promise.all([
        loadFavorites(),
        loadSettings()
      ]);

      setFavorites(storedFavorites);
      setSettings(storedSettings);
      setReady(true);
    }

    boot();
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      favorites,
      settings,
      isFavorite: (artistName: string) =>
        favorites.some((artist) => artist.name.toLowerCase() === artistName.toLowerCase()),
      toggleFavorite: async (artist: Artist) => {
        const exists = favorites.some(
          (item) => item.name.toLowerCase() === artist.name.toLowerCase()
        );
        const next = exists
          ? favorites.filter((item) => item.name.toLowerCase() !== artist.name.toLowerCase())
          : [...favorites, artist];

        setFavorites(next);
        await saveFavorites(next);
      },
      updateSettings: async (patch: Partial<AppSettings>) => {
        const next = { ...settings, ...patch };
        setSettings(next);
        await saveSettings(next);
      }
    }),
    [favorites, ready, settings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return value;
}
