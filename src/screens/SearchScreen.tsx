import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { searchArtists } from "../api/lastfm";
import ArtistCard from "../components/ArtistCard";
import type { AppTheme, Artist, DetailsNavigation } from "../types";

type Props = {
  theme: AppTheme;
  navigation: DetailsNavigation;
};

export default function SearchScreen({ navigation, theme }: Props): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styles = createStyles(theme);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (!query.trim()) {
      setArtists([]);
      setError("");
      setLoading(false);
      return;
    }

    timer.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        setArtists(await searchArtists(query));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed.");
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Artists</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Artist name"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        autoCorrect={false}
      />
      {loading ? <ActivityIndicator style={{ marginTop: 24 }} color={theme.colors.primary} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && query.length > 0 && artists.length === 0 ? (
        <Text style={styles.empty}>No artists found.</Text>
      ) : null}
      <FlatList
        data={artists}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 18 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <ArtistCard
            artist={item}
            theme={theme}
            onPress={() => navigation.navigate("Details", { artistName: item.name })}
          />
        )}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: "900", marginBottom: 16 },
    input: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: theme.colors.text
    },
    error: { color: theme.colors.danger, marginTop: 18 },
    empty: { color: theme.colors.muted, marginTop: 18 }
  });
}
