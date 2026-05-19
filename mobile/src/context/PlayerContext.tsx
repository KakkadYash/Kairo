import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { createAudioPlayer, type AudioPlayer } from "expo-audio";

import { Song } from "../types/song";

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playSong: (song: Song) => Promise<void>;
  pause: () => void;
  resume: () => void;
  seekTo: (seconds: number) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

type PlayerProviderProps = {
  children: ReactNode;
};

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<AudioPlayer | null>(null);
  const subscriptionRef = useRef<ReturnType<AudioPlayer["addListener"]> | null>(null);

  function releaseCurrentPlayer() {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove();
      playerRef.current = null;
    }
  }

  async function playSong(song: Song) {
    console.log("Selected song:" + song.title);
    releaseCurrentPlayer();

    setCurrentSong(song);
    setPosition(0);
    setDuration(song.duration_seconds);

    try {
      const nextPlayer = createAudioPlayer({ uri: song.stream_url });
      playerRef.current = nextPlayer;
      subscriptionRef.current = nextPlayer.addListener("playbackStatusUpdate", (status) => {
        setPosition(status.currentTime);
        setDuration(status.duration || song.duration_seconds);
        setIsPlaying(status.playing);
      });

      nextPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      setIsPlaying(false);
      console.warn("Could not play this song.", error);
    }
  }

  function pause() {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.pause();
    setIsPlaying(false);
  }

  function resume() {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.play();
    setIsPlaying(true);
  }

  async function seekTo(seconds: number) {
    if (!playerRef.current) {
      return;
    }

    const nextPosition = Math.max(0, Math.min(seconds, duration || seconds));
    await playerRef.current.seekTo(nextPosition);
    setPosition(nextPosition);
  }

  useEffect(() => {
    return () => {
      releaseCurrentPlayer();
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        position,
        duration,
        playSong,
        pause,
        resume,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }

  return context;
}
