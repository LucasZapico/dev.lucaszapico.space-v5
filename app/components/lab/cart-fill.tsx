import { useState, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";

const MAX = 4;

export function CartFill() {
  const [count, setCount] = useState(0);
  const [flying, setFlying] = useState(false);
  const [jiggle, setJiggle] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFlying(true);

      setTimeout(() => {
        setFlying(false);
        setCount((c) => (c >= MAX ? 0 : c + 1));
        setJiggle(true);
        setTimeout(() => setJiggle(false), 400);
      }, 600);
    }, 1600);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex items-center justify-center gap-8 w-full px-8">
      <style>{`
        @keyframes fly-to-cart {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          80%  { transform: translate(88px, -8px) scale(0.5); opacity: 1; }
          100% { transform: translate(100px, 0) scale(0); opacity: 0; }
        }
        @keyframes cart-recv {
          0%,100% { transform: scale(1); }
          30%     { transform: scale(1.2) rotate(-8deg); }
          60%     { transform: scale(1.1) rotate(6deg); }
          80%     { transform: scale(1.05) rotate(-3deg); }
        }
        @keyframes badge-pop {
          0%   { transform: scale(0.6); }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* item */}
      <div
        className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold"
        style={flying ? { animation: "fly-to-cart 0.6s cubic-bezier(0.4,0,0.2,1) forwards" } : { opacity: 1 }}
      >
        +
      </div>

      {/* cart */}
      <div
        className="relative"
        style={jiggle ? { animation: "cart-recv 0.4s ease" } : undefined}
      >
        <IoCartOutline size={44} />
        {count > 0 && (
          <span
            key={count}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
            style={{ animation: "badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
