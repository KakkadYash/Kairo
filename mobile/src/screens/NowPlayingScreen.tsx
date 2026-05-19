import Slider from "@react-native-community/slider";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "../constants/theme";
import { usePlayer } from "../context/PlayerContext";

type NowPlayingScreenProps = {
  onBack: () => void;
};

export function NowPlayingScreen({ onBack }: NowPlayingScreenProps) {
  const { currentSong, isPlaying, position, duration, pause, resume, seekTo } = usePlayer();
  const [coverLoadFailed, setCoverLoadFailed] = useState(false);
  const entrance = useRef(new Animated.Value(0)).current;
  const safeDuration = Math.max(0, duration);
  const safePosition =
    safeDuration > 0 ? Math.max(0, Math.min(position, safeDuration)) : 0;
  const isSeekEnabled = safeDuration > 0;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  useEffect(() => {
    setCoverLoadFailed(false);
  }, [currentSong?.id]);

  if (!currentSong) {
    return null;
  }

  function togglePlayback() {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }

  function formatTime(seconds: number) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }

  return (
    <Animated.View style={[styles.screen, { opacity: entrance, transform: [{ translateY }] }]}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconButton} onPress={onBack}>
          <Text style={styles.iconButtonText}>v</Text>
        </Pressable>

        <Text style={styles.topTitle}>Now Playing</Text>

        <View style={styles.iconButtonSpacer} />
      </View>

      <View style={styles.artWrap}>
        {coverLoadFailed ? (
          <View style={styles.artPlaceholder}>
            <Text style={styles.artPlaceholderText}>Kairo</Text>
          </View>
        ) : (
          <Image
            source={{ uri: currentSong.cover_url }}
            style={styles.art}
            onError={() => setCoverLoadFailed(true)}
          />
        )}
      </View>

      <View style={styles.songInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {currentSong.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(safePosition)}</Text>
          <Text style={styles.timeText}>{formatTime(safeDuration)}</Text>
        </View>

        <Slider
          value={safePosition}
          minimumValue={0}
          maximumValue={safeDuration || 1}
          disabled={!isSeekEnabled}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.card}
          thumbTintColor={theme.colors.primary}
          onSlidingComplete={(value) => {
            if (isSeekEnabled) {
              seekTo(value);
            }
          }}
          style={styles.slider}
        />
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.secondaryControl}>
          <Text style={styles.secondaryControlText}>{"<<"}</Text>
        </Pressable>

        <Pressable style={styles.primaryControl} onPress={togglePlayback}>
          <Text style={styles.primaryControlText}>{isPlaying ? "II" : ">"}</Text>
        </Pressable>

        <Pressable style={styles.secondaryControl}>
          <Text style={styles.secondaryControlText}>{">>"}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 34,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  iconButtonSpacer: {
    width: 42,
    height: 42,
  },
  topTitle: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  artWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },
  art: {
    width: "100%",
    maxWidth: 340,
    aspectRatio: 1,
    borderRadius: 34,
    backgroundColor: theme.colors.card,
  },
  artPlaceholder: {
    width: "100%",
    maxWidth: 340,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  artPlaceholderText: {
    color: theme.colors.primary,
    fontSize: 34,
    fontWeight: "900",
  },
  songInfo: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    textAlign: "center",
  },
  artist: {
    marginTop: 8,
    color: theme.colors.muted,
    fontSize: 16,
    textAlign: "center",
  },
  progressSection: {
    paddingTop: 28,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeText: {
    color: theme.colors.soft,
    fontSize: 12,
    fontWeight: "700",
  },
  slider: {
    width: "100%",
    height: 34,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingTop: 32,
  },
  secondaryControl: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryControlText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  primaryControl: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  primaryControlText: {
    color: theme.colors.background,
    fontSize: 24,
    fontWeight: "900",
  },
});
