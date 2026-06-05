import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ArtistImage from "../components/ArtistImage";
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

  const savedArtists = favorites.length;
  const sortedByListeners = [...favorites].sort(
    (a, b) => Number(b.listeners || 0) - Number(a.listeners || 0)
  );
  const mostPopular = sortedByListeners[0];
  const nichePick = [...favorites]
    .filter((artist) => Number(artist.listeners || 0) > 0)
    .sort((a, b) => Number(a.listeners || 0) - Number(b.listeners || 0))[0];
  const mainstreamScore = calculateMainstreamScore(favorites);
  const tasteLabel = getTasteLabel(mainstreamScore);
  const topGenre = getTopGenre(favorites);
  const topFive = sortedByListeners.slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SoundScape profile</Text>
        <Text style={styles.title}>Your Music Taste</Text>
        <Text style={styles.subtitle}>Insights based on the artists you saved to Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState theme={theme} />
      ) : (
        <>
          <TasteProfileCard
            theme={theme}
            score={mainstreamScore}
            label={tasteLabel}
            mostPopular={mostPopular}
            nichePick={nichePick}
            topGenre={topGenre}
          />

          <View style={styles.statGrid}>
            <InsightCard theme={theme} icon="heart" label="Saved Artists" value={String(savedArtists)} color="#E91E63" />
            <InsightCard theme={theme} icon="radio" label="Taste Type" value={tasteLabel} color="#6650A4" />
            <InsightCard theme={theme} icon="trending-up" label="Most Popular" value={mostPopular?.name || "-"} color="#2196F3" compact />
            <InsightCard theme={theme} icon="leaf" label="Niche Pick" value={nichePick?.name || "-"} color="#4CAF50" compact />
            <InsightCard theme={theme} icon="pricetag" label="Top Genre" value={topGenre || "Mixed"} color="#FF9800" compact />
          </View>

          <PopularityMeter theme={theme} score={mainstreamScore} />

          {topFive.length > 0 ? (
            <Chart theme={theme} title="Favorites from Mainstream to Niche" artists={topFive} />
          ) : null}

          {favorites.length > 0 ? (
            <FavoriteRanking theme={theme} artists={favorites} />
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

function calculateMainstreamScore(artists: Artist[]): number {
  if (artists.length === 0) return 0;

  const scores = artists.map((artist) => {
    const listeners = Number(artist.listeners || 0);
    if (listeners >= 50_000_000) return 100;
    if (listeners >= 20_000_000) return 85;
    if (listeners >= 10_000_000) return 70;
    if (listeners >= 5_000_000) return 55;
    if (listeners >= 1_000_000) return 40;
    if (listeners >= 100_000) return 25;
    return 12;
  });

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getTasteLabel(score: number): string {
  if (score >= 75) return "Mainstream";
  if (score >= 45) return "Balanced";
  return "Explorer";
}

function getTopGenre(artists: Artist[]): string | null {
  const counts = new Map<string, number>();

  artists.forEach((artist) => {
    artist.tags?.forEach((tag) => {
      const normalized = tag.trim();
      if (normalized.length === 0) return;
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    });
  });

  const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return top?.[0] ?? null;
}

function TasteProfileCard({
  theme,
  score,
  label,
  mostPopular,
  nichePick,
  topGenre
}: {
  theme: AppTheme;
  score: number;
  label: string;
  mostPopular?: Artist;
  nichePick?: Artist;
  topGenre: string | null;
}): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View>
          <Text style={styles.profileLabel}>Taste profile</Text>
          <Text style={styles.profileTitle}>{label}</Text>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>
      <Text style={styles.profileDescription}>{getTasteDescription(label)}</Text>
      <View style={styles.genrePill}>
        <Ionicons name="musical-notes" size={16} color={theme.colors.primary} />
        <Text style={styles.genrePillText}>
          {topGenre ? `Most repeated genre: ${topGenre}` : "Save artist details to discover your genre pattern"}
        </Text>
      </View>
      <View style={styles.profileArtists}>
        {mostPopular ? <MiniArtist theme={theme} artist={mostPopular} label="Most popular" /> : null}
        {nichePick ? <MiniArtist theme={theme} artist={nichePick} label="Niche pick" /> : null}
      </View>
    </View>
  );
}

function getTasteDescription(label: string): string {
  if (label === "Mainstream") return "Your favorites lean toward artists with very broad public popularity.";
  if (label === "Balanced") return "Your saved artists mix widely known names with more selective discoveries.";
  return "Your favorites lean toward less mainstream artists and discovery-oriented choices.";
}

function MiniArtist({ theme, artist, label }: { theme: AppTheme; artist: Artist; label: string }): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={styles.miniArtist}>
      <ArtistImage artist={artist} theme={theme} size={42} rounded={10} icon />
      <View style={{ flex: 1 }}>
        <Text style={styles.miniLabel}>{label}</Text>
        <Text style={styles.miniName} numberOfLines={1}>{artist.name}</Text>
        <Text style={styles.miniMeta}>{formatNumber(artist.listeners)} listeners</Text>
      </View>
    </View>
  );
}

function InsightCard({
  theme,
  icon,
  label,
  value,
  color,
  compact = false
}: {
  theme: AppTheme;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  compact?: boolean;
}): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <Text style={[compact ? styles.statValueSmall : styles.statValue, { color }]} numberOfLines={compact ? 2 : 1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PopularityMeter({ theme, score }: { theme: AppTheme; score: number }): React.JSX.Element {
  const styles = createStyles(theme);
  const width = `${Math.max(6, score)}%` as `${number}%`;

  return (
    <View style={styles.chart}>
      <View style={styles.chartTitleRow}>
        <Text style={styles.chartTitle}>Mainstream Score</Text>
        <Text style={styles.scoreBadge}>{score}/100</Text>
      </View>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { width }]} />
      </View>
      <View style={styles.meterLabels}>
        <Text style={styles.meterLabel}>Explorer</Text>
        <Text style={styles.meterLabel}>Balanced</Text>
        <Text style={styles.meterLabel}>Mainstream</Text>
      </View>
    </View>
  );
}

function Chart({ theme, title, artists }: { theme: AppTheme; title: string; artists: Artist[] }): React.JSX.Element {
  const styles = createStyles(theme);
  const max = Math.max(...artists.map((artist) => Number(artist.listeners || 0)), 1);

  return (
    <View style={styles.chart}>
      <View style={styles.chartTitleRow}>
        <Text style={styles.chartTitle}>{title}</Text>
        <Ionicons name="people" size={20} color={theme.colors.primary} />
      </View>
      <Text style={styles.chartHint}>This compares the public popularity of the artists you saved.</Text>
      {artists.map((artist, index) => {
        const value = Number(artist.listeners || 0);
        const width = `${Math.max(7, (value / max) * 100)}%` as `${number}%`;
        const color = chartColors[index % chartColors.length];

        return (
          <View key={artist.name} style={styles.barRow}>
            <View style={styles.rankBadge}>
              <Text style={[styles.rankText, { color }]}>{index + 1}</Text>
            </View>
            <View style={styles.barContent}>
              <View style={styles.barHeader}>
                <Text style={styles.barName} numberOfLines={1}>{artist.name}</Text>
                <Text style={[styles.barValue, { color }]}>{formatNumber(value)}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width, backgroundColor: color }]} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function FavoriteRanking({ theme, artists }: { theme: AppTheme; artists: Artist[] }): React.JSX.Element {
  const styles = createStyles(theme);
  const sorted = [...artists].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.chart}>
      <View style={styles.chartTitleRow}>
        <Text style={styles.chartTitle}>Your Taste Mix</Text>
        <Ionicons name="list" size={20} color={theme.colors.primary} />
      </View>
      {sorted.map((artist) => (
        <View key={artist.name} style={styles.savedRow}>
          <ArtistImage artist={artist} theme={theme} size={38} rounded={9} icon />
          <View style={{ flex: 1 }}>
            <Text style={styles.savedName} numberOfLines={1}>{artist.name}</Text>
            <Text style={styles.savedMeta}>{formatNumber(artist.listeners)} listeners</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function EmptyState({ theme }: { theme: AppTheme }): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="analytics" size={44} color={theme.colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No taste profile yet</Text>
      <Text style={styles.emptyText}>Save a few artists to Favorites and this page will analyze your music taste.</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, paddingBottom: 32 },
    header: { marginBottom: 16 },
    eyebrow: { color: theme.colors.primary, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0, fontSize: 12 },
    title: { color: theme.colors.text, fontSize: 30, fontWeight: "900", marginTop: 4 },
    subtitle: { color: theme.colors.muted, marginTop: 4, lineHeight: 20 },
    profileCard: {
      overflow: "hidden",
      borderRadius: 22,
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 16
    },
    profileHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    profileLabel: { color: theme.colors.primary, fontWeight: "800" },
    profileTitle: { color: theme.colors.text, fontSize: 28, fontWeight: "900", marginTop: 2 },
    scoreCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft
    },
    scoreText: { color: theme.colors.primary, fontSize: 22, fontWeight: "900" },
    profileDescription: { color: theme.colors.muted, marginTop: 12, lineHeight: 20 },
    genrePill: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginTop: 12,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: theme.colors.primarySoft
    },
    genrePillText: { color: theme.colors.primary, fontSize: 12, fontWeight: "800" },
    profileArtists: { gap: 10, marginTop: 16 },
    miniArtist: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 14, backgroundColor: theme.colors.surfaceMuted },
    miniLabel: { color: theme.colors.primary, fontSize: 12, fontWeight: "800" },
    miniName: { color: theme.colors.text, fontWeight: "900", marginTop: 1 },
    miniMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 1 },
    statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    statCard: {
      width: "48%",
      minHeight: 118,
      borderRadius: 18,
      padding: 14,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    statValue: { fontSize: 24, fontWeight: "900", marginTop: 12 },
    statValueSmall: { fontSize: 17, lineHeight: 20, fontWeight: "900", marginTop: 12 },
    statLabel: { color: theme.colors.muted, fontSize: 12, marginTop: 3, fontWeight: "700" },
    chart: {
      marginTop: 18,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 18,
      padding: 15
    },
    chartTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    chartTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "900" },
    chartHint: { color: theme.colors.muted, fontSize: 12, lineHeight: 17, marginTop: -6, marginBottom: 12 },
    scoreBadge: { color: theme.colors.primary, fontWeight: "900" },
    meterTrack: { height: 14, borderRadius: 999, overflow: "hidden", backgroundColor: theme.colors.surfaceMuted },
    meterFill: { height: "100%", borderRadius: 999, backgroundColor: theme.colors.primary },
    meterLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
    meterLabel: { color: theme.colors.muted, fontSize: 11, fontWeight: "700" },
    barRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 13 },
    rankBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: "center",
      justifyContent: "center"
    },
    rankText: { fontWeight: "900" },
    barContent: { flex: 1 },
    barHeader: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    barName: { color: theme.colors.text, flex: 1, fontWeight: "700" },
    barValue: { fontWeight: "900" },
    barTrack: {
      height: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceMuted,
      marginTop: 6,
      overflow: "hidden"
    },
    barFill: { height: "100%", borderRadius: 999 },
    savedRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
    savedName: { color: theme.colors.text, fontWeight: "800" },
    savedMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 1 },
    empty: {
      marginTop: 28,
      minHeight: 260,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 24
    },
    emptyIconWrap: {
      width: 82,
      height: 82,
      borderRadius: 41,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
      marginBottom: 16
    },
    emptyTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "900" },
    emptyText: { color: theme.colors.muted, textAlign: "center", marginTop: 8, lineHeight: 20 }
  });
}
