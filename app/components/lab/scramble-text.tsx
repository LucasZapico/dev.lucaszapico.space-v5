import { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  autoLoop?: boolean;
  pauseMs?: number;
}

export function ScrambleText({ text, className, speed = 30, autoLoop = false, pauseMs = 2000 }: ScrambleTextProps) {
  const [output, setOutput] = useState(text);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const loopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    frame.current = 0;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      frame.current += 1;
      const revealed = Math.floor(frame.current / 2);
      setOutput(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealed) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (revealed >= text.length) {
        clearInterval(timer.current!);
        setOutput(text);
        if (autoLoop) {
          loopTimer.current = setTimeout(start, pauseMs);
        }
      }
    }, speed);
  }

  function stop() {
    if (timer.current) clearInterval(timer.current);
    if (loopTimer.current) clearTimeout(loopTimer.current);
    setOutput(text);
  }

  useEffect(() => {
    if (autoLoop) start();
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (loopTimer.current) clearTimeout(loopTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoop]);

  return (
    <span
      onMouseEnter={autoLoop ? undefined : start}
      onMouseLeave={autoLoop ? undefined : stop}
      className={cn("cursor-default select-none font-label", className)}
    >
      {output}
    </span>
  );
}
