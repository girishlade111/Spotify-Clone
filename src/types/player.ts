/**
 * Player Types
 */

import type { SpotifyTrack, SpotifyPlaybackContext } from "./spotify";

export type RepeatState = "off" | "context" | "track";

export interface PlayerState {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  progressMs: number | null;
  durationMs: number | null;
  shuffleState: boolean;
  repeatState: RepeatState;
  volumePercent: number | null;
  isMuted: boolean;
  deviceId: string | null;
  isPlayerReady: boolean;
  contextUri: string | null;
  contextType: SpotifyPlaybackContext["type"];
}
