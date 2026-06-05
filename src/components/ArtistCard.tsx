import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppTheme, Artist } from "../types";
import { formatNumber } from "../utils/format";
import ArtistImage from "./ArtistImage";

type Props = {
  artist: Artist;
  theme: AppTheme;
  rank?: number;
  onPress?: () => void;
};

export default function ArtistCard({ artist, theme, rank, onPress }: Props): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {rank ? <Text style={styles.rank}>#{rank}</Text> : null}
      <ArtistImage artist={artist} theme={theme} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {artist.name}
        </Text>
        <Text style={styles.meta}>{formatNumber(artist.listeners)} listeners</Text>
        {Number(artist.playcount) > 0 ? (
          <Text style={styles.meta}>{formatNumber(artist.playcount)} plays</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pressed: {
      opacity: 0.78,
      transform: [{ scale: 0.99 }]
    },
    rank: {
      width: 28,
      color: theme.colors.muted,
      fontWeight: "800"
    },
    content: {
      flex: 1
    },
    name: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700"
    },
    meta: {
      color: theme.colors.muted,
      marginTop: 2,
      fontSize: 13
    }
  });
}
