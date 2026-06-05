import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useApp } from "../context/AppContext";
import DetailsScreen from "../screens/DetailsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StatsScreen from "../screens/StatsScreen";
import type { AppTheme, MainTabParamList, RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type Props = {
  theme: AppTheme;
};

function MainTabs({ theme }: Props): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: "home",
            Search: "search",
            Favorites: "heart",
            Stats: "bar-chart",
            Settings: "settings"
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home">{(props) => <HomeScreen {...props} theme={theme} />}</Tab.Screen>
      <Tab.Screen name="Search">{(props) => <SearchScreen {...props} theme={theme} />}</Tab.Screen>
      <Tab.Screen name="Favorites">{(props) => <FavoritesScreen {...props} theme={theme} />}</Tab.Screen>
      <Tab.Screen name="Stats">{() => <StatsScreen theme={theme} />}</Tab.Screen>
      <Tab.Screen name="Settings">{() => <SettingsScreen theme={theme} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default function RootNavigator({ theme }: Props): React.JSX.Element {
  const { ready } = useApp();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => <MainTabs theme={theme} />}
      </Stack.Screen>
      <Stack.Screen
        name="Details"
        options={({ route }) => ({ title: route.params.artistName || "Details" })}
      >
        {(props) => <DetailsScreen {...props} theme={theme} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
