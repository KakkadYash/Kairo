import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  type DimensionValue,
  View,
} from "react-native";

import { theme } from "../constants/theme";
import { usePlayer } from "../context/PlayerContext";

type MiniPlayerProps = {
  onOpen: () => void;
};

export function MiniPlayer({ onOpen }: MiniPlayerProps) {
  const { currentSong, isPlaying, position, duration, pause, resume } = usePlayer();
  const [coverLoadFailed, setCoverLoadFailed] = useState(false);

  useEffect(() => {
    setCoverLoadFailed(false);
  }, [currentSong?.id]);

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const progressPercent: DimensionValue = `${progress * 100}%`;

  function togglePlayback() {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }

  return (
    <Pressable style={styles.miniPlayer} onPress={onOpen}>
      {coverLoadFailed ? (
        <View style={styles.miniCoverPlaceholder}>
          <Text style={styles.miniCoverPlaceholderText}>K</Text>
        </View>
      ) : (
        <Image
          source={{ uri: currentSong.cover_url }}
          style={styles.miniCover}
          onError={() => setCoverLoadFailed(true)}
        />
      )}

      <View style={styles.miniPlayerText}>
        <Text style={styles.miniTitle} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={styles.miniArtist} numberOfLines={1}>
          {currentSong.artist}
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressPercent }]} />
        </View>
      </View>

      <Pressable
        style={styles.playButton}
        onPress={(event) => {
          event.stopPropagation();
          togglePlayback();
        }}
      >
        <Text style={styles.playButtonText}>{isPlaying ? "II" : ">"}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    bottom: 18,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  miniCover: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
  },
  miniCoverPlaceholder: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  miniCoverPlaceholderText: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "900",
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
  progressTrack: {
    height: 4,
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: theme.colors.card,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  playButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  playButtonText: {
    color: theme.colors.background,
    fontSize: 17,
    fontWeight: "900",
  },
});
