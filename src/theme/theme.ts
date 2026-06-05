import type { AppTheme } from "../types";

const lightColors = {
  background: "#F8F7FC",
  surface: "#FFFFFF",
  surfaceMuted: "#EEEAF6",
  primary: "#6650A4",
  primarySoft: "#E8DEF8",
  text: "#1D1B20",
  muted: "#625B71",
  border: "#E3DDEA",
  danger: "#BA1A1A",
  success: "#146C43"
};

const darkColors = {
  background: "#15131A",
  surface: "#211F27",
  surfaceMuted: "#302D38",
  primary: "#D0BCFF",
  primarySoft: "#4F378B",
  text: "#F4EFF4",
  muted: "#CAC4D0",
  border: "#49454F",
  danger: "#FFB4AB",
  success: "#9BE7C2"
};

export function createTheme(darkMode: boolean): AppTheme {
  return {
    darkMode,
    colors: darkMode ? darkColors : lightColors,
    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 22
    }
  };
}
