import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SongCard } from "../components/SongCard";
import { theme } from "../constants/theme";
import { fetchSongs } from "../services/api";
import { Song } from "../types/song";

export function LibraryScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSongs(isRefresh = false) {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const nextSongs = await fetchSongs();
      setSongs(nextSongs);
    } catch {
      setError("Could not load your library. Make sure the Kairo backend is running.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Kairo</Text>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Your personal cloud music locker.</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading library</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.hintText}>
            Physical phones cannot use 127.0.0.1. Replace it with your computer's
            local IP when testing on a device.
          </Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(song) => song.id}
          renderItem={({ item }) => <SongCard song={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              tintColor={theme.colors.primary}
              onRefresh={() => loadSongs(true)}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 18,
    paddingTop: 18,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 8,
    color: theme.colors.muted,
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  separator: {
    height: 12,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  stateText: {
    marginTop: 12,
    color: theme.colors.muted,
    fontSize: 14,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  hintText: {
    marginTop: 12,
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
