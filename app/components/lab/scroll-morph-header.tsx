import { useEffect, useRef, useState } from "react";

interface ScrollMorphHeaderProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ScrollMorphHeader({ containerRef }: ScrollMorphHeaderProps) {
  const [progress, setProgress] = useState(0);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef?.current ?? fallbackRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.max(0, Math.min(1, el.scrollTop / max)) : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  // Header morphs from tall/transparent to compact/solid
  const headerHeight = lerp(120, 56, progress);
  const headerBg = `oklch(0.12 0 0 / ${lerp(0, 0.95, progress)})`;
  const titleSize = lerp(28, 16, progress);
  const titleOpacity = lerp(1, 0.9, progress);
  const taglineOpacity = lerp(1, 0, Math.min(progress * 2, 1));
  const borderOpacity = lerp(0, 0.15, progress);

  return (
    <div ref={fallbackRef} className="relative" style={containerRef ? undefined : { height: "100%", overflowY: "auto" }}>
      {/* Sticky morphing header */}
      <div
        className="sticky top-0 z-20 flex flex-col justify-center px-6 transition-[height,background-color] duration-150 ease-out"
        style={{
          height: `${headerHeight}px`,
          backgroundColor: headerBg,
          backdropFilter: progress > 0.1 ? "blur(8px)" : "none",
          borderBottom: `1px solid oklch(1 0 0 / ${borderOpacity})`,
        }}
      >
        <div
          className="font-heading font-semibold text-white transition-[font-size] duration-150"
          style={{ fontSize: `${titleSize}px`, opacity: titleOpacity }}
        >
          The Headline
        </div>
        <div
          className="font-label text-xs uppercase tracking-widest text-white/60 transition-opacity duration-150"
          style={{ opacity: taglineOpacity, height: taglineOpacity > 0.05 ? "auto" : 0, overflow: "hidden" }}
        >
          a header that earns its space back
        </div>
      </div>

      {/* Scrollable content */}
      <div className="space-y-8 px-6 py-10">
        <p className="text-sm leading-relaxed text-foreground/80">
          The header above starts tall and transparent. As you scroll, it compresses, picks up a
          solid background, and the tagline fades out. By the time you've scrolled a screenful,
          you've reclaimed almost 70px of vertical space without losing brand presence.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          The pattern: read scroll progress, drive layout values. Height, opacity, padding, and
          color all linearly interpolate between two waypoints. No spring, no easing — just a
          single number mapping to a handful of CSS properties.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          The "earn its space back" framing is intentional. A hero header is great on first
          paint and a nuisance after one scroll. Compress it instead of duplicating it as a
          sticky nav — fewer DOM nodes, fewer layout shifts, one source of truth for branding.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          The math is `lerp(start, end, progress)` for each driven value. Keep `progress`
          clamped to [0, 1] and tie it to whatever scroll signal makes sense — page scroll, a
          named container, an IntersectionObserver entry ratio. The header doesn't care where
          the number comes from.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          One trap: don't drive `display` or anything that triggers a reflow per frame. Stick
          to transform, opacity, background-color, and dimensions of elements outside the main
          flow. This whole demo updates ~17 properties on a single sticky element and never
          touches layout below the header.
        </p>
        <p className="pb-4 text-xs text-muted-foreground/60">
          — try scrolling back to the top to see the header expand again —
        </p>
      </div>
    </div>
  );
}
