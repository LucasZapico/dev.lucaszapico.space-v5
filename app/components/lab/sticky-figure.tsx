import { useEffect, useRef, useState } from "react";

interface StickyFigureProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const stages = [
  {
    label: "01",
    title: "Idle",
    body: "The shape sits at rest. As you scroll, watch the figure on the right react in real time — its color, rotation, and inner geometry are all driven by your scroll position inside this modal.",
    color: "var(--color-muted-foreground)",
    rotate: 0,
    inner: 0.2,
  },
  {
    label: "02",
    title: "Awaken",
    body: "First transition. The fill warms and the inner ring begins to expand outward. Each stage is a discrete waypoint — the values lerp between them.",
    color: "oklch(0.65 0.18 50)",
    rotate: 30,
    inner: 0.45,
  },
  {
    label: "03",
    title: "Charge",
    body: "Rotation accelerates. This is the kind of pattern you'd use to walk a user through a multi-step concept without making them click through slides — the page itself becomes the storyboard.",
    color: "oklch(0.7 0.2 200)",
    rotate: 180,
    inner: 0.75,
  },
  {
    label: "04",
    title: "Resolve",
    body: "The shape settles into its final form. Notice how the figure remained pinned in place while the narrative scrolled past — that's the whole trick.",
    color: "oklch(0.75 0.15 145)",
    rotate: 360,
    inner: 1,
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolateStage(progress: number) {
  const segments = stages.length - 1;
  const segProgress = progress * segments;
  const idx = Math.min(Math.floor(segProgress), segments - 1);
  const t = segProgress - idx;
  const a = stages[idx];
  const b = stages[idx + 1];
  return {
    rotate: lerp(a.rotate, b.rotate, t),
    inner: lerp(a.inner, b.inner, t),
    color: t < 0.5 ? a.color : b.color,
    activeIdx: t < 0.5 ? idx : idx + 1,
  };
}

export function StickyFigure({ containerRef }: StickyFigureProps) {
  const [state, setState] = useState(() => interpolateStage(0));
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.max(0, Math.min(1, el.scrollTop / max)) : 0;
      setState(interpolateStage(progress));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <div className="grid grid-cols-12 gap-6 px-6 py-10" ref={innerRef}>
      {/* Pinned figure */}
      <div className="col-span-12 sm:col-span-5">
        <div className="sticky top-6 flex h-[calc(100vh-12rem)] max-h-[480px] items-center justify-center">
          <div className="relative">
            <div
              className="h-40 w-40 rounded-2xl border-2 transition-colors duration-300"
              style={{
                borderColor: state.color,
                transform: `rotate(${state.rotate}deg)`,
                transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
                style={{
                  width: `${state.inner * 100}px`,
                  height: `${state.inner * 100}px`,
                  backgroundColor: state.color,
                  opacity: 0.85,
                }}
              />
            </div>
            <div className="mt-6 text-center">
              <div className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                Stage {stages[state.activeIdx]?.label ?? "—"}
              </div>
              <div className="mt-1 text-sm font-medium">
                {stages[state.activeIdx]?.title ?? ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling narrative */}
      <div className="col-span-12 sm:col-span-7 space-y-[60vh] py-[20vh]">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="font-label text-xs uppercase tracking-widest text-muted-foreground/60">
              {s.label} — {s.title}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{s.body}</p>
            {i === stages.length - 1 && (
              <p className="mt-6 text-xs text-muted-foreground/60">
                — scroll back up to reverse the animation —
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
