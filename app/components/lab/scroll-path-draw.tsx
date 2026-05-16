import { useEffect, useRef, useState } from "react";

interface ScrollPathDrawProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

// Single continuous path that snakes through the SVG canvas
const PATH_D =
  "M 20 40 C 80 40, 80 120, 140 120 S 200 200, 260 200 S 320 280, 380 280 S 440 360, 480 360";
const PATH_LENGTH = 720;

export function ScrollPathDraw({ containerRef }: ScrollPathDrawProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.max(0, Math.min(1, el.scrollTop / max)) : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  const dashOffset = PATH_LENGTH * (1 - progress);

  return (
    <div className="relative">
      {/* Pinned SVG canvas */}
      <div className="sticky top-0 z-10 flex h-[60vh] items-center justify-center bg-gradient-to-b from-card to-card/80 backdrop-blur">
        <div className="relative">
          <svg width="500" height="400" viewBox="0 0 500 400" className="max-w-full">
            {/* Faint underlying path */}
            <path
              d={PATH_D}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
            {/* Drawn path */}
            <path
              d={PATH_D}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-foreground transition-[stroke-dashoffset] duration-100 ease-out"
              style={{
                strokeDasharray: PATH_LENGTH,
                strokeDashoffset: dashOffset,
              }}
            />
            {/* Leading dot */}
            <circle
              r="6"
              fill="currentColor"
              className="text-foreground"
              style={{
                offsetPath: `path("${PATH_D}")`,
                offsetDistance: `${progress * 100}%`,
              }}
            />
          </svg>
          <div className="absolute bottom-0 right-0 font-label text-xs tabular-nums text-muted-foreground">
            {Math.round(progress * 100)}%
          </div>
        </div>
      </div>

      {/* Scrollable narrative below */}
      <div className="space-y-8 px-6 py-10">
        <p className="text-sm leading-relaxed text-foreground/80">
          A single SVG path with `pathLength` ≈ 720. We set `stroke-dasharray` to that length
          and animate `stroke-dashoffset` from `pathLength` (invisible) to `0` (fully drawn).
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          The leading dot uses CSS `offset-path` — point it at the same path string and set
          `offset-distance` to a percentage. The browser handles the tangent math for us.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          Why this pattern works: one number drives two visually-coupled effects. The line
          fills in, the dot rides along its leading edge. Both are pure CSS once the path
          length is known.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          Real uses: visualizing a multi-step journey (signup flow, supply chain, narrative
          arcs). The trick is keeping the path short enough that it reads as a single gesture
          rather than a maze.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          The `getTotalLength()` DOM method is the right way to compute path length if you
          can't measure it by eye — call it on the SVG ref in a layout effect and cache the
          number.
        </p>
        <p className="pb-4 text-xs text-muted-foreground/60">
          — keep scrolling to complete the draw, or reverse to erase it —
        </p>
      </div>
    </div>
  );
}
