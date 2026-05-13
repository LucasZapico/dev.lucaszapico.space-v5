import { useRef, useEffect } from "react";

interface StaggerRevealProps {
  items: string[];
}

export function StaggerReveal({ items }: StaggerRevealProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = scrollRef.current;
    const bar = barRef.current;
    if (!el || !bar) return;

    function applyProgress(progress: number) {
      bar!.style.width = `${progress * 100}%`;
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        // each item reveals when scroll passes its threshold
        const threshold = i / items.length;
        const revealed = progress >= threshold;
        item.style.opacity = revealed ? "1" : "0";
        item.style.transform = revealed ? "translateY(0)" : "translateY(14px)";
      });
    }

    applyProgress(0);

    let direction = 1;
    const id = setInterval(() => {
      el.scrollTop += direction * 1.2;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      if (el.scrollTop >= max) direction = -1;
      if (el.scrollTop <= 0) direction = 1;
      applyProgress(progress);
    }, 16);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* invisible scroll driver */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-scroll pointer-events-none"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="h-[600px]" />
      </div>

      {/* items */}
      <div className="flex flex-col gap-3 w-full px-8 relative z-10">
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="flex items-center gap-3"
            style={{ opacity: 0, transform: "translateY(14px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
          >
            <span className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium">{item}</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        ))}
      </div>

      {/* scroll progress bar — full card width via absolute on parent */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border/40 pointer-events-none z-10">
        <div ref={barRef} className="h-full bg-foreground/60 w-0" />
      </div>
    </>
  );
}
