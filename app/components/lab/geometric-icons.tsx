import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "~/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
  loop?: boolean;
}

function IconWrapper({
  children,
  className,
  size = 48,
  animated = true,
  loop = false,
}: IconProps & { children: React.ReactNode; animated?: boolean }) {
  const animationClass = loop ? "animate-icon-loop" : "animate-icon";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", animated && animationClass, className)}
      width={size}
      height={size}
    >
      <style>{`
        @keyframes draw {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes draw-loop {
          0% { stroke-dashoffset: 200; }
          40% { stroke-dashoffset: 0; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 200; }
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-loop {
          0% { opacity: 0; } 30% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; }
        }
        .animate-icon path, .animate-icon line, .animate-icon circle, .animate-icon rect {
          stroke-dasharray: 200; stroke-dashoffset: 0;
          animation: draw 1.5s ease-out forwards;
        }
        .animate-icon circle[fill="currentColor"], .animate-icon rect[fill="currentColor"] {
          stroke-dasharray: none; animation: fade-in 0.5s ease-out 0.8s both;
        }
        .animate-icon-loop path, .animate-icon-loop line,
        .animate-icon-loop circle, .animate-icon-loop rect {
          stroke-dasharray: 200; animation: draw-loop 3s ease-in-out infinite;
        }
        .animate-icon-loop circle[fill="currentColor"], .animate-icon-loop rect[fill="currentColor"] {
          stroke-dasharray: none; animation: fade-loop 3s ease-in-out infinite;
        }
      `}</style>
      {children}
    </svg>
  );
}

// Two overlapping circles drawing simultaneously CW + CCW
export function IconConnection({ className, size, loop, delay = 0 }: IconProps & { delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });

  return (
    <span ref={ref} className="inline-block">
      <IconWrapper className={className} size={size} loop={loop} animated={inView}>
        <style>{`
          @keyframes connection-cw { 0% { stroke-dashoffset: 76; } 100% { stroke-dashoffset: 0; } }
          @keyframes connection-ccw { 0% { stroke-dashoffset: -76; } 100% { stroke-dashoffset: 0; } }
          @keyframes connection-cw-loop {
            0% { stroke-dashoffset: 76; } 40% { stroke-dashoffset: 0; }
            60% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 76; }
          }
          @keyframes connection-ccw-loop {
            0% { stroke-dashoffset: -76; } 40% { stroke-dashoffset: 0; }
            60% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -76; }
          }
          .animate-icon circle.connection-cw {
            stroke-dasharray: 76; animation: connection-cw 1.6s ease-out both;
          }
          .animate-icon circle.connection-ccw {
            stroke-dasharray: 76; animation: connection-ccw 1.6s ease-out both;
          }
          .animate-icon-loop circle.connection-cw {
            stroke-dasharray: 76; animation: connection-cw-loop 3s ease-in-out infinite;
          }
          .animate-icon-loop circle.connection-ccw {
            stroke-dasharray: 76; animation: connection-ccw-loop 3s ease-in-out infinite;
          }
        `}</style>
        <circle
          className="connection-cw"
          cx="18" cy="24" r="12"
          stroke="currentColor" strokeWidth="1"
          strokeDasharray="76" strokeDashoffset="76"
          style={{ animationDelay: `${delay}s` }}
        />
        <circle
          className="connection-ccw"
          cx="30" cy="24" r="12"
          stroke="currentColor" strokeWidth="1"
          strokeDasharray="76" strokeDashoffset="-76"
          style={{ animationDelay: `${delay}s` }}
        />
      </IconWrapper>
    </span>
  );
}

// 4×4 dot grid cycling through quadrant phases
export function IconShift({ className, size, loop }: IconProps) {
  const positions = [6, 16, 26, 36];

  return (
    <IconWrapper className={className} size={size} loop={loop}>
      <style>{`
        @keyframes dot-phase-1 { 0%,100%{fill:currentColor} 25%,75%{fill:none} }
        @keyframes dot-phase-2 { 0%,50%,100%{fill:none} 25%{fill:currentColor} }
        @keyframes dot-phase-3 { 0%,25%,75%,100%{fill:none} 50%{fill:currentColor} }
        @keyframes dot-phase-4 { 0%,50%,100%{fill:none} 75%{fill:currentColor} }
        .animate-icon-loop .dot-phase-1 { animation: dot-phase-1 4s ease-in-out infinite; }
        .animate-icon-loop .dot-phase-2 { animation: dot-phase-2 4s ease-in-out infinite; }
        .animate-icon-loop .dot-phase-3 { animation: dot-phase-3 4s ease-in-out infinite; }
        .animate-icon-loop .dot-phase-4 { animation: dot-phase-4 4s ease-in-out infinite; }
        .animate-icon .dot-phase-1 { fill: currentColor; }
        .animate-icon .dot-phase-2, .animate-icon .dot-phase-3, .animate-icon .dot-phase-4 { fill: none; }
      `}</style>
      {positions.map((y, row) =>
        positions.map((x, col) => {
          const phase =
            row < 2 && col < 2 ? 1 :
            row < 2 && col >= 2 ? 2 :
            row >= 2 && col >= 2 ? 3 : 4;
          return (
            <circle
              key={`${row}-${col}`}
              cx={x + 3} cy={y + 3} r="3"
              stroke="currentColor" strokeWidth="1"
              className={`dot-phase-${phase}`}
            />
          );
        })
      )}
    </IconWrapper>
  );
}
