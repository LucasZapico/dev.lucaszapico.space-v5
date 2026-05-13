import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

export function ScrollIndicator() {
  const markerRef = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const calc = () => {
      const sections = Array.from(document.querySelectorAll("section"));
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollMax <= 0 || sections.length === 0) return;
      setTicks(sections.map((s) => (s.getBoundingClientRect().top + window.scrollY) / scrollMax));
      setTotal(sections.length);
    };

    const onScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollMax <= 0 || !markerRef.current) return;
      markerRef.current.style.top = `${(window.scrollY / scrollMax) * 100}%`;
    };

    const t1 = setTimeout(() => { calc(); onScroll(); }, 120);
    const t2 = setTimeout(() => { calc(); onScroll(); }, 500);
    const t3 = setTimeout(() => { calc(); onScroll(); }, 1200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", calc);
    };
  }, [location.pathname]);

  if (total === 0) return null;

  return (
    <div
      className="fixed z-50"
      style={{ right: "20px", top: "50%", transform: "translateY(-50%)" }}
    >
      {/* pill capsule — clips everything inside */}
      <div
        className="relative rounded-full overflow-hidden bg-foreground/8 border border-foreground/15"
        style={{ width: "14px", height: "15rem" }}
      >
        {/* vertical track — centered */}
        <div className="absolute top-0 bottom-0 bg-foreground/20" style={{ width: "1px", left: "50%", transform: "translateX(-50%)" }} />

        {/* section ticks — cross the track inside the pill */}
        {ticks.map((t, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 z-10 bg-foreground/40"
            style={{ top: `${t * 100}%`, height: "1px", transform: "translateY(-50%)" }}
          />
        ))}

        {/* moving position marker — bright, wider than ticks */}
        <div
          ref={markerRef}
          className="absolute left-0 right-0 z-20 bg-foreground"
          style={{ top: "0%", height: "2px", transform: "translateY(-50%)" }}
        />
      </div>
    </div>
  );
}
