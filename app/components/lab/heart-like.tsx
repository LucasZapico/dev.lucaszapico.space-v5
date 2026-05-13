import { useState, useEffect } from "react";

const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const PARTICLES = [
  { angle: -80,  dist: 38, size: 10, color: "#f43f5e", delay: 0 },
  { angle: -30,  dist: 44, size: 8,  color: "#fb7185", delay: 30 },
  { angle: 20,   dist: 40, size: 12, color: "#f43f5e", delay: 10 },
  { angle: 70,   dist: 42, size: 9,  color: "#fda4af", delay: 50 },
  { angle: 120,  dist: 36, size: 11, color: "#fb7185", delay: 20 },
  { angle: 170,  dist: 44, size: 8,  color: "#f43f5e", delay: 40 },
  { angle: -140, dist: 40, size: 10, color: "#fda4af", delay: 15 },
  { angle: -110, dist: 36, size: 8,  color: "#fb7185", delay: 35 },
];

export function HeartLike() {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [key, setKey] = useState(0);

  function triggerBurst() {
    setBurst(true);
    setKey((k) => k + 1);
    setTimeout(() => setBurst(false), 700);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setLiked((l) => {
        if (!l) triggerBurst();
        return !l;
      });
    }, 2200);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick() {
    if (!liked) triggerBurst();
    setLiked((l) => !l);
  }

  return (
    <div className="relative flex items-center justify-center">
      <style>{`
        @keyframes heart-fly {
          0%   { transform: translate(0,0) scale(0) rotate(0deg); opacity: 1; }
          40%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>

      {burst &&
        PARTICLES.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.dist;
          const ty = Math.sin(rad) * p.dist;
          const rot = p.angle * 0.4;
          return (
            <svg
              key={`${key}-${i}`}
              viewBox="0 0 24 24"
              width={p.size}
              height={p.size}
              className="pointer-events-none absolute"
              style={{
                fill: p.color,
                animationDelay: `${p.delay}ms`,
                animation: `heart-fly 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${p.delay}ms forwards`,
                ["--tx" as string]: `${tx}px`,
                ["--ty" as string]: `${ty}px`,
                ["--rot" as string]: `${rot}deg`,
              }}
            >
              <path d={HEART_PATH} />
            </svg>
          );
        })}

      <button
        onClick={handleClick}
        className="flex items-center gap-2 transition-transform active:scale-90"
        aria-label={liked ? "Unlike" : "Like"}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          style={{
            transform: burst ? "scale(1.3)" : liked ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <path
            d={HEART_PATH}
            fill={liked ? "#f43f5e" : "none"}
            stroke={liked ? "#f43f5e" : "currentColor"}
            strokeWidth="1.5"
            className="transition-all duration-300"
          />
        </svg>
        <span className="text-sm text-muted-foreground">
          {liked ? "Liked" : "Like"}
        </span>
      </button>
    </div>
  );
}
