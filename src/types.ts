export type Artist = {
  name: string;
  listeners: string;
  playcount: string;
  imageUrl: string;
  url: string;
};

export type ArtistDetails = Artist & {
  summary: string;
  tags: string[];
};

export type AppSettings = {
  darkMode: boolean;
  defaultGenre: string;
  language: string;
};

export type AppTheme = {
  darkMode: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    primary: string;
    primarySoft: string;
    text: string;
    muted: string;
    border: string;
    danger: string;
    success: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

export type RootStackParamList = {
  Main: undefined;
  Details: { artistName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Stats: undefined;
  Settings: undefined;
};

export type DetailsNavigation = {
  navigate: (screen: "Details", params: { artistName: string }) => void;
  push: (screen: "Details", params: { artistName: string }) => void;
};
