import { createAudioPlayer, type AudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
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
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);

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

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
      }
    };
  }, []);

  async function handleSongPress(song: Song) {
    console.log("Selected song:" + song.title);
    setSelectedSong(song);

    try {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
      }

      const nextPlayer = createAudioPlayer({ uri: song.stream_url });

      playerRef.current = nextPlayer;
      nextPlayer.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setError("Could not play this song. Check the stream URL and network connection.");
    }
  }

  async function togglePlayback() {
    if (!playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  }

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
          renderItem={({ item }) => (
            <SongCard song={item} onPress={handleSongPress} />
          )}
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

      {selectedSong ? (
        <View style={styles.miniPlayer}>
          <View style={styles.miniPlayerText}>
            <Text style={styles.miniTitle} numberOfLines={1}>
              {selectedSong.title}
            </Text>
            <Text style={styles.miniArtist} numberOfLines={1}>
              {selectedSong.artist}
            </Text>
          </View>

          <Pressable style={styles.playButton} onPress={togglePlayback}>
            <Text style={styles.playButtonText}>{isPlaying ? "Pause" : "Play"}</Text>
          </Pressable>
        </View>
      ) : null}
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
    paddingBottom: 116,
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
  miniPlayer: {
    position: "absolute",
    bottom: 18,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  miniPlayerText: {
    flex: 1,
    minWidth: 0,
  },
  miniTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  miniArtist: {
    marginTop: 3,
    color: theme.colors.muted,
    fontSize: 13,
  },
  playButton: {
    minWidth: 78,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  playButtonText: {
    color: theme.colors.background,
    fontSize: 13,
    fontWeight: "800",
  },
});
