import { useEffect, useRef } from "react";

function lerpColor(a: [number,number,number], b: [number,number,number], t: number) {
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
}
const GREEN: [number,number,number] = [34,197,94];
const AMBER: [number,number,number] = [245,158,11];
const RED:   [number,number,number] = [239,68,68];
function volumeColor(v: number) {
  return v < 0.5 ? lerpColor(GREEN, AMBER, v / 0.5) : lerpColor(AMBER, RED, (v-0.5)/0.5);
}

// Ionicons IoMicOutline capsule bounds in 512×512 viewBox
const CAP_TOP = 64;
const CAP_BOT = 304;
const CAP_H   = CAP_BOT - CAP_TOP;
const CAP_X   = 192;
const CAP_W   = 128;

export function MicAudio() {
  const fillRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    let raf: number;
    let t = 0;
    const tick = () => {
      t += 0.025;
      const raw = Math.sin(t*2.1)*0.35 + Math.sin(t*5.3)*0.2 + Math.sin(t*1.4)*0.25 + Math.sin(t*7.7)*0.1 + 0.55;
      const v = Math.max(0.02, Math.min(0.98, raw / 1.1));
      const h = v * CAP_H;
      if (fillRef.current) {
        fillRef.current.setAttribute("y",      String(CAP_BOT - h));
        fillRef.current.setAttribute("height", String(h));
        fillRef.current.setAttribute("fill",   volumeColor(v));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 512 512" width="80" height="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
        <defs>
          <clipPath id="mic-cap-clip">
            <path d="M256 64a63.68 63.68 0 0 0-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z" />
          </clipPath>
        </defs>

        {/* volume fill — clipped to Ionicons capsule shape */}
        <rect
          ref={fillRef}
          clipPath="url(#mic-cap-clip)"
          x={CAP_X} y={CAP_BOT} width={CAP_W} height={0}
          stroke="none"
        />

        {/* capsule outline */}
        <path d="M256 64a63.68 63.68 0 0 0-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z" />

        {/* stand + stem + base */}
        <path d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80" />
      </svg>

      <span className="text-xs text-muted-foreground">listening…</span>
    </div>
  );
}
