import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import type { AppTheme, Artist } from "../types";
import { formatNumber } from "../utils/format";

const chartColors = ["#6650A4", "#E91E63", "#2196F3", "#4CAF50", "#FF9800"];

type Props = {
  theme: AppTheme;
};

export default function StatsScreen({ theme }: Props): React.JSX.Element {
  const { favorites } = useApp();
  const styles = createStyles(theme);

  const totalFavorites = favorites.length;
  const totalPlaycount = favorites.reduce((sum, artist) => sum + Number(artist.playcount || 0), 0);
  const avgPlaycount = totalFavorites ? Math.round(totalPlaycount / totalFavorites) : 0;
  const topByPlaycount = [...favorites]
    .sort((a, b) => Number(b.playcount || 0) - Number(a.playcount || 0))
    .slice(0, 5);
  const topByListeners = [...favorites]
    .sort((a, b) => Number(b.listeners || 0) - Number(a.listeners || 0))
    .slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Statistics</Text>
      <Text style={styles.subtitle}>Insights about your music taste</Text>

      <View style={styles.statRow}>
        <StatCard theme={theme} icon="heart" label="Favorites" value={String(totalFavorites)} color="#E91E63" />
        <StatCard theme={theme} icon="trending-up" label="Total Plays" value={formatNumber(totalPlaycount)} color="#6650A4" />
        <StatCard theme={theme} icon="star" label="Avg Plays" value={formatNumber(avgPlaycount)} color="#2196F3" />
      </View>

      {topByPlaycount.length > 0 ? (
        <Chart theme={theme} title="Top Artists by Playcount" artists={topByPlaycount} field="playcount" />
      ) : null}
      {topByListeners.length > 0 ? (
        <Chart theme={theme} title="Top Artists by Listeners" artists={topByListeners} field="listeners" />
      ) : null}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♪</Text>
          <Text style={styles.subtitle}>Add artists to favorites to see stats here.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function StatCard({
  theme,
  icon,
  label,
  value,
  color
}: {
  theme: AppTheme;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={[styles.statCard, { backgroundColor: `${color}22` }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Chart({
  theme,
  title,
  artists,
  field
}: {
  theme: AppTheme;
  title: string;
  artists: Artist[];
  field: "playcount" | "listeners";
}): React.JSX.Element {
  const styles = createStyles(theme);
  const max = Math.max(...artists.map((artist) => Number(artist[field] || 0)), 1);

  return (
    <View style={styles.chart}>
      <Text style={styles.chartTitle}>{title}</Text>
      {artists.map((artist, index) => {
        const value = Number(artist[field] || 0);
        const width = `${Math.max(6, (value / max) * 100)}%` as `${number}%`;
        const color = chartColors[index % chartColors.length];

        return (
          <View key={artist.name} style={styles.barRow}>
            <View style={styles.barHeader}>
              <Text style={styles.barName} numberOfLines={1}>
                {index + 1}. {artist.name}
              </Text>
              <Text style={[styles.barValue, { color }]}>{formatNumber(value)}</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width, backgroundColor: color }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, paddingBottom: 28 },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: "900" },
    subtitle: { color: theme.colors.muted, marginTop: 4 },
    statRow: { flexDirection: "row", gap: 10, marginTop: 18 },
    statCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center" },
    statValue: { fontSize: 20, fontWeight: "900", marginTop: 6 },
    statLabel: { color: theme.colors.muted, fontSize: 11, marginTop: 3 },
    chart: {
      marginTop: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 14
    },
    chartTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "800", marginBottom: 12 },
    barRow: { marginBottom: 12 },
    barHeader: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    barName: { color: theme.colors.text, flex: 1 },
    barValue: { fontWeight: "800" },
    barTrack: {
      height: 9,
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceMuted,
      marginTop: 5,
      overflow: "hidden"
    },
    barFill: { height: "100%", borderRadius: 999 },
    empty: { height: 220, alignItems: "center", justifyContent: "center" },
    emptyIcon: { color: theme.colors.muted, fontSize: 54 }
  });
}
