import type { SpotifySimplifiedArtist } from '@/types/spotify';

/**
 * Format duration in milliseconds to human-readable string
 * 0–59s: "0:SS" (e.g. 0:45)
 * 60s+: "M:SS" (e.g. 3:07)
 * 3600s+: "H:MM:SS" (e.g. 1:02:34)
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format total duration for albums/playlists
 * Under 1 hour: "X min"
 * 1+ hours: "X hr Y min"
 */
export function formatTotalDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`;
  }
  return `${minutes} min`;
}

/**
 * Format large numbers with abbreviations
 * Under 10000: "1,234"
 * 10000–999999: "12,345"
 * 1M+: "1.2M"
 * 1B+: "1.2B"
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(1)}B`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  return n.toLocaleString();
}

/**
 * Format follower counts with proper formatting
 */
export function formatFollowers(n: number): string {
  return `${formatNumber(n)} followers`;
}

/**
 * Format relative time from date string
 * Today: "Today"
 * < 7 days: "X days ago"
 * < 30 days: "X weeks ago"
 * < 12 months: "X months ago"
 * 1+ years: "X years ago"
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Get artist names as comma-separated string
 */
export function getArtistNames(artists: SpotifySimplifiedArtist[]): string {
  return artists.map((a) => a.name).join(', ');
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
