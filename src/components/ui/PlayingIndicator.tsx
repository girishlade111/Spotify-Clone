/**
 * PlayingIndicator Component
 */

"use client";

interface PlayingIndicatorProps {
  isPlaying: boolean;
  size?: "sm" | "md";
}

export function PlayingIndicator({
  isPlaying,
  size = "sm",
}: PlayingIndicatorProps) {
  const barWidth = size === "sm" ? "3px" : "4px";
  const maxHeight = size === "sm" ? "12px" : "16px";
  const gap = size === "sm" ? "1.5px" : "2px";

  return (
    <div
      className="flex items-end gap-[1.5px]"
      style={{ gap }}
    >
      <div
        className="w-[3px] bg-[#1DB954] rounded-[1px]"
        style={{
          height: isPlaying ? undefined : "60%",
          maxHeight,
          transformOrigin: "bottom",
          animation: isPlaying ? "playingBar1 0.8s ease-in-out infinite" : "none",
        }}
      />
      <div
        className="w-[3px] bg-[#1DB954] rounded-[1px]"
        style={{
          height: isPlaying ? undefined : "80%",
          maxHeight,
          transformOrigin: "bottom",
          animation: isPlaying ? "playingBar2 0.8s ease-in-out infinite 0.2s" : "none",
        }}
      />
      <div
        className="w-[3px] bg-[#1DB954] rounded-[1px]"
        style={{
          height: isPlaying ? undefined : "40%",
          maxHeight,
          transformOrigin: "bottom",
          animation: isPlaying ? "playingBar3 0.8s ease-in-out infinite 0.4s" : "none",
        }}
      />
    </div>
  );
}
