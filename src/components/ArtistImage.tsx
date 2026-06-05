import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { AppTheme, Artist } from "../types";

type Props = {
  artist: Pick<Artist, "name" | "imageUrl">;
  theme: AppTheme;
  size?: number;
  rounded?: number;
  icon?: boolean;
};

export default function ArtistImage({
  artist,
  theme,
  size = 56,
  rounded = 12,
  icon = false
}: Props): React.JSX.Element {
  const styles = createStyles(theme, size, rounded);

  if (artist.imageUrl) {
    return <Image source={{ uri: artist.imageUrl }} style={styles.image} />;
  }

  return (
    <View style={styles.fallback}>
      {icon ? (
        <Ionicons name="musical-notes" size={Math.round(size * 0.45)} color={theme.colors.primary} />
      ) : (
        <Text style={styles.initial}>{artist.name.charAt(0)}</Text>
      )}
    </View>
  );
}

function createStyles(theme: AppTheme, size: number, rounded: number) {
  return StyleSheet.create({
    image: {
      width: size,
      height: size,
      borderRadius: rounded,
      backgroundColor: theme.colors.surfaceMuted
    },
    fallback: {
      width: size,
      height: size,
      borderRadius: rounded,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft
    },
    initial: {
      color: theme.colors.primary,
      fontSize: Math.round(size * 0.42),
      fontWeight: "800"
    }
  });
}
