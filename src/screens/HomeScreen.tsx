import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { getTopArtistsByGenre } from "../api/lastfm";
import ArtistCard from "../components/ArtistCard";
import ArtistImage from "../components/ArtistImage";
import { useApp } from "../context/AppContext";
import type { AppTheme, Artist, DetailsNavigation } from "../types";
import { formatNumber } from "../utils/format";

type Props = {
  theme: AppTheme;
  navigation: DetailsNavigation;
};

export default function HomeScreen({ navigation, theme }: Props): React.JSX.Element {
  const { settings } = useApp();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const styles = createStyles(theme);
  const selectedGenre = settings.defaultGenre;
  const isGlobalTrending = selectedGenre === "All";

  async function load(showInitialLoader = false): Promise<void> {
    try {
      if (showInitialLoader) setLoading(true);
      setError("");
      setArtists(await getTopArtistsByGenre(selectedGenre, 10));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load artists.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load(true);
  }, [selectedGenre]);

  if (loading) {
    return (
      <Centered
        theme={theme}
        text={isGlobalTrending ? "Loading trending artists..." : `Loading ${selectedGenre} artists...`}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={44} color={theme.colors.danger} />
        <Text style={styles.error}>{error}</Text>
        <Pressable
          onPress={() => {
            load(true);
          }}
          style={styles.retry}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const top = artists[0];
  const rest = artists.slice(1);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={rest}
      keyExtractor={(item) => item.name}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
      ListHeaderComponent={
        top ? (
          <View>
            <Text style={styles.title}>{isGlobalTrending ? "Trending Artists" : `${selectedGenre} Artists`}</Text>
            <Text style={styles.subtitle}>
              {isGlobalTrending
                ? "Most played worldwide right now"
                : `Top artists for your ${selectedGenre} preference`}
            </Text>
            <Pressable
              style={styles.hero}
              onPress={() => navigation.navigate("Details", { artistName: top.name })}
            >
              <ArtistImage artist={top} theme={theme} size={132} rounded={22} icon />
              <View style={styles.heroInfo}>
                <Text style={styles.badge}>{isGlobalTrending ? "#1 Trending" : `#1 ${selectedGenre}`}</Text>
                <Text style={styles.heroName} numberOfLines={1}>
                  {top.name}
                </Text>
                <Text style={styles.heroMeta}>{formatNumber(top.listeners)} listeners</Text>
                <Text style={styles.heroMeta}>{formatNumber(top.playcount)} plays</Text>
              </View>
            </Pressable>
            <Text style={styles.section}>{isGlobalTrending ? "More Trending" : `More ${selectedGenre}`}</Text>
          </View>
        ) : null
      }
      renderItem={({ item, index }) => (
        <ArtistCard
          artist={item}
          rank={index + 2}
          theme={theme}
          onPress={() => navigation.navigate("Details", { artistName: item.name })}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

function Centered({ theme, text }: { theme: AppTheme; text: string }): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={styles.center}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={styles.centerText}>{text}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, paddingBottom: 28 },
    title: { color: theme.colors.text, fontSize: 30, fontWeight: "900" },
    subtitle: { color: theme.colors.muted, marginTop: 4, marginBottom: 16 },
    section: { color: theme.colors.text, fontSize: 18, fontWeight: "800", marginTop: 18, marginBottom: 10 },
    hero: {
      flexDirection: "row",
      gap: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
      alignItems: "center"
    },
    heroInfo: { flex: 1 },
    badge: {
      alignSelf: "flex-start",
      color: theme.darkMode ? "#1D1B20" : "#FFFFFF",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: "hidden",
      fontWeight: "800",
      marginBottom: 8
    },
    heroName: { color: theme.colors.text, fontSize: 25, fontWeight: "900" },
    heroMeta: { color: theme.colors.muted, marginTop: 3 },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: 24
    },
    centerText: { color: theme.colors.muted, marginTop: 12 },
    error: { color: theme.colors.danger, textAlign: "center", marginTop: 12, marginBottom: 16 },
    retry: { backgroundColor: theme.colors.primary, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
    retryText: { color: theme.darkMode ? "#1D1B20" : "#FFFFFF", fontWeight: "800" }
  });
}
