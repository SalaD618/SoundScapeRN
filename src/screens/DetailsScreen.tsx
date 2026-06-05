import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getArtistDetails, getSimilarArtists } from "../api/lastfm";
import ArtistCard from "../components/ArtistCard";
import ArtistImage from "../components/ArtistImage";
import { useApp } from "../context/AppContext";
import type { AppTheme, Artist, ArtistDetails, RootStackParamList } from "../types";
import { formatNumber } from "../utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "Details"> & {
  theme: AppTheme;
};

export default function DetailsScreen({ route, navigation, theme }: Props): React.JSX.Element {
  const { artistName } = route.params;
  const { isFavorite, toggleFavorite } = useApp();
  const [artist, setArtist] = useState<ArtistDetails | null>(null);
  const [similarArtists, setSimilarArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const styles = createStyles(theme);

  useEffect(() => {
    let active = true;

    async function load(): Promise<void> {
      try {
        setLoading(true);
        setError("");

        const [details, similar] = await Promise.all([
          getArtistDetails(artistName),
          getSimilarArtists(artistName)
        ]);

        if (active) {
          setArtist(details);
          setSimilarArtists(similar);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Could not load artist.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [artistName]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.muted}>Loading artist details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No artist details available.</Text>
      </View>
    );
  }

  const favorite = isFavorite(artist.name);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ArtistImage artist={artist} theme={theme} size={180} rounded={24} icon />
        <Text style={styles.title}>{artist.name}</Text>
        <Text style={styles.meta}>{formatNumber(artist.listeners)} listeners</Text>
        <Text style={styles.meta}>{formatNumber(artist.playcount)} plays</Text>

        <View style={styles.tags}>
          {artist.tags.slice(0, 6).map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>

        <Text style={styles.section}>Biography</Text>
        <Text style={styles.body}>{artist.summary || "No biography available."}</Text>

        {similarArtists.length > 0 ? <Text style={styles.section}>Similar Artists</Text> : null}
        <FlatList
          horizontal
          data={similarArtists}
          keyExtractor={(item) => item.name}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <View style={{ width: 230 }}>
              <ArtistCard
                artist={item}
                theme={theme}
                onPress={() => navigation.push("Details", { artistName: item.name })}
              />
            </View>
          )}
        />
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => toggleFavorite(artist)}>
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={28}
          color={favorite ? theme.colors.danger : theme.colors.primary}
        />
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 18, paddingBottom: 92 },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: 24
    },
    muted: { color: theme.colors.muted, marginTop: 12 },
    error: { color: theme.colors.danger, textAlign: "center" },
    title: { color: theme.colors.text, fontSize: 32, fontWeight: "900", marginTop: 18 },
    meta: { color: theme.colors.muted, marginTop: 4 },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
    tag: {
      color: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      overflow: "hidden",
      fontWeight: "700"
    },
    section: { color: theme.colors.text, fontSize: 20, fontWeight: "800", marginTop: 24, marginBottom: 8 },
    body: { color: theme.colors.text, lineHeight: 21 },
    fab: {
      position: "absolute",
      right: 18,
      bottom: 18,
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 4
    }
  });
}
