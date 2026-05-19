import { Image, StyleSheet, Text, View } from "react-native";

import { theme } from "../constants/theme";
import { Song } from "../types/song";

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  const minutes = Math.floor(song.duration_seconds / 60);
  const seconds = String(song.duration_seconds % 60).padStart(2, "0");

  return (
    <View style={styles.card}>
      <Image source={{ uri: song.cover_url }} style={styles.cover} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta} numberOfLines={1}>
            {song.album}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{minutes}:{seconds}</Text>
        </View>

        <View style={styles.tagRow}>
          <Text style={styles.tag}>{song.genre}</Text>
          <Text style={styles.tag}>{song.language}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cover: {
    width: 78,
    height: 78,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    minWidth: 0,
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  artist: {
    marginTop: 3,
    color: theme.colors.muted,
    fontSize: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  meta: {
    color: theme.colors.soft,
    fontSize: 12,
  },
  dot: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
});
