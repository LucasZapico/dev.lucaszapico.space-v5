import { useEffect, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}

export function Typewriter({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseMs = 1400,
  className,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];

    if (isPaused) {
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseMs);
      return () => clearTimeout(t);
    }

    if (isDeleting) {
      if (displayed.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        return;
      }
      const t = setTimeout(
        () => setDisplayed((d) => d.slice(0, -1)),
        deletingSpeed
      );
      return () => clearTimeout(t);
    }

    if (displayed.length === current.length) {
      setIsPaused(true);
      return;
    }

    const t = setTimeout(
      () => setDisplayed(current.slice(0, displayed.length + 1)),
      typingSpeed
    );
    return () => clearTimeout(t);
  }, [displayed, isDeleting, isPaused, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className}>
      {displayed}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[1px] animate-[blink_1s_step-end_infinite] bg-current" />
    </span>
  );
}
