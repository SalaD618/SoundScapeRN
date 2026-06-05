import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ArtistCard from "../components/ArtistCard";
import { useApp } from "../context/AppContext";
import type { AppTheme, DetailsNavigation } from "../types";

type Props = {
  theme: AppTheme;
  navigation: DetailsNavigation;
};

export default function FavoritesScreen({ navigation, theme }: Props): React.JSX.Element {
  const { favorites } = useApp();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.subtitle}>Saved locally for offline access.</Text>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={theme.colors.muted} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.subtitle}>Open an artist and tap the heart button.</Text>
        </View>
      ) : (
        <FlatList
          data={[...favorites].sort((a, b) => a.name.localeCompare(b.name))}
          keyExtractor={(item) => item.name}
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
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: "900" },
    subtitle: { color: theme.colors.muted, marginTop: 4 },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    emptyTitle: { color: theme.colors.text, fontSize: 18, fontWeight: "800", marginTop: 14 }
  });
}
