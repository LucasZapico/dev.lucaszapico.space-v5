import { useRef, useEffect } from "react";
import { cn } from "~/lib/utils";

interface ScrollLinkedGridProps {
  startAngle?: number;
  endAngle?: number;
  startSkewX?: number;
  endSkewX?: number;
  cellSize?: number;
  lineColor?: string;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function ScrollLinkedGrid({
  startAngle = -15,
  endAngle = 15,
  startSkewX = -10,
  endSkewX = 10,
  cellSize = 40,
  lineColor = "rgba(128,128,128,0.4)",
  className,
  containerRef,
}: ScrollLinkedGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function applyProgress(progress: number) {
      const angle = startAngle + (endAngle - startAngle) * progress;
      const skewX = startSkewX + (endSkewX - startSkewX) * progress;
      grid!.style.transform = `rotate(${angle}deg) skewX(${skewX}deg)`;
    }

    applyProgress(0);

    const el = containerRef?.current;
    if (el) {
      const onScroll = () => {
        const max = el.scrollHeight - el.clientHeight;
        applyProgress(max > 0 ? el.scrollTop / max : 0);
      };
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    }

    const outerRef = grid.parentElement;
    const onWindowScroll = () => {
      if (!outerRef) return;
      const rect = outerRef.getBoundingClientRect();
      applyProgress(
        Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
      );
    };
    onWindowScroll();
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [containerRef, startAngle, endAngle, startSkewX, endSkewX]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div
        ref={gridRef}
        className="absolute inset-[-100%] w-[300%] h-[300%]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
