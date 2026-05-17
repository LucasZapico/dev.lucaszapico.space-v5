import { useRef, useState } from "react";

const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play();
    }
    setPlaying(!playing);
  }

  function onTimeUpdate() {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    setProgress(el.currentTime / el.duration);
  }

  function onLoadedMetadata() {
    const el = audioRef.current;
    if (!el) return;
    setDuration(el.duration);
  }

  function onEnded() {
    setPlaying(false);
    setProgress(0);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const el = audioRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  }

  function cycleSpeed() {
    const el = audioRef.current;
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    if (el) el.playbackRate = SPEEDS[next];
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // Some MP3s without an Info/Xing header report duration as Infinity until
  // the whole file has been scanned. Guard against both Infinity and NaN.
  const hasDuration = Number.isFinite(duration) && duration > 0;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-secondary/40 px-4 py-3">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="1" width="3" height="10" rx="1" />
            <rect x="7" y="1" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 1.5l7 4.5-7 4.5V1.5z" />
          </svg>
        )}
      </button>
      <div
        className="relative h-1 flex-1 cursor-pointer rounded-full bg-border"
        onClick={seek}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-foreground/60 transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
        {hasDuration ? fmt(progress * duration) : "0:00"} / {hasDuration ? fmt(duration) : "--:--"}
      </span>
      <button
        onClick={cycleSpeed}
        aria-label="Playback speed"
        className="shrink-0 rounded px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {SPEEDS[speedIndex]}×
      </button>
    </div>
  );
}
