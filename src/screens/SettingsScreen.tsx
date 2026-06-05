import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import type { AppTheme } from "../types";

const genres = ["All", "Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "Classical"];
const languages = ["English", "Romanian", "Spanish", "French", "German"];

type Props = {
  theme: AppTheme;
};

export default function SettingsScreen({ theme }: Props): React.JSX.Element {
  const { settings, updateSettings } = useApp();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Customize your SoundScape experience</Text>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Dark Mode</Text>
          <Text style={styles.rowText}>Switch between light and dark theme</Text>
        </View>
        <Switch
          value={settings.darkMode}
          onValueChange={(darkMode) => updateSettings({ darkMode })}
        />
      </View>

      <OptionSection
        title="Default Genre"
        values={genres}
        current={settings.defaultGenre}
        onSelect={(defaultGenre) => updateSettings({ defaultGenre })}
        theme={theme}
      />
      <OptionSection
        title="Language"
        values={languages}
        current={settings.language}
        onSelect={(language) => updateSettings({ language })}
        theme={theme}
      />
    </ScrollView>
  );
}

function OptionSection({
  title,
  values,
  current,
  onSelect,
  theme
}: {
  title: string;
  values: string[];
  current: string;
  onSelect: (value: string) => void;
  theme: AppTheme;
}): React.JSX.Element {
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={styles.chips}>
        {values.map((item) => (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[styles.chip, current === item && styles.chipActive]}
          >
            <Text style={[styles.chipText, current === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, paddingBottom: 28 },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: "900" },
    subtitle: { color: theme.colors.muted, marginTop: 4, marginBottom: 12 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderColor: theme.colors.border
    },
    rowTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "800" },
    rowText: { color: theme.colors.muted, marginTop: 3 },
    section: { paddingVertical: 18, borderBottomWidth: 1, borderColor: theme.colors.border },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface
    },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.text, fontWeight: "700" },
    chipTextActive: { color: theme.darkMode ? "#1D1B20" : "#FFFFFF" }
  });
}
