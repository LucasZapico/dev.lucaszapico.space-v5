import { useEffect, useState } from "react";
import { motion, useMotionValue } from "motion/react";

function CornerBracketCursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const [hovered, setHovered] = useState(false);


  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, input, textarea, select, label, [role='button']")) {
        setHovered(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest("a, button, input, textarea, select, label, [role='button']")) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [mx, my]);

  const box   = hovered ? 40 : 26;
  const arm   = hovered ? 12 : 8;
  const thick = "1.5px";

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x: mx, y: my, translateX: "-35%", translateY: "-35%", mixBlendMode: "difference" }}
    >
      <div
        className="relative"
        style={{ width: box, height: box, transition: "width 0.18s ease, height 0.18s ease" }}
      >
        {/* top-left */}
        <div className="absolute top-0 left-0"
          style={{ width: arm, height: arm, borderTopWidth: thick, borderLeftWidth: thick, borderColor: "white", transition: "all 0.18s ease" }} />
        {/* top-right */}
        <div className="absolute top-0 right-0"
          style={{ width: arm, height: arm, borderTopWidth: thick, borderRightWidth: thick, borderColor: "white", transition: "all 0.18s ease" }} />
        {/* bottom-left */}
        <div className="absolute bottom-0 left-0"
          style={{ width: arm, height: arm, borderBottomWidth: thick, borderLeftWidth: thick, borderColor: "white", transition: "all 0.18s ease" }} />
        {/* bottom-right */}
        <div className="absolute bottom-0 right-0"
          style={{ width: arm, height: arm, borderBottomWidth: thick, borderRightWidth: thick, borderColor: "white", transition: "all 0.18s ease" }} />
      </div>
    </motion.div>
  );
}

function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998]"
      style={{
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
      }}
    />
  );
}

export function SiteEffects() {
  return (
    <>
      <CornerBracketCursor />
      <GrainOverlay />
    </>
  );
}
