import { Song } from "../types/song";

const API_BASE_URL = "http://192.168.0.38:8000";

export async function fetchSongs(): Promise<Song[]> {
  const response = await fetch(`${API_BASE_URL}/songs`);

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  return response.json();
}
