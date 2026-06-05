import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppProvider, useApp } from "./src/context/AppContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { createTheme } from "./src/theme/theme";

function AppShell(): React.JSX.Element {
  const { settings } = useApp();
  const appTheme = createTheme(settings.darkMode);
  const navigationTheme = settings.darkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: appTheme.colors.background,
          card: appTheme.colors.surface,
          text: appTheme.colors.text,
          primary: appTheme.colors.primary,
          border: appTheme.colors.border
        }
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: appTheme.colors.background,
          card: appTheme.colors.surface,
          text: appTheme.colors.text,
          primary: appTheme.colors.primary,
          border: appTheme.colors.border
        }
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={settings.darkMode ? "light" : "dark"} />
      <RootNavigator theme={appTheme} />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
