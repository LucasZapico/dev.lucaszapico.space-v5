import { useState, useEffect } from "react";

export function HamburgerClose() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setOpen((o) => !o), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="flex h-10 w-10 flex-col items-center justify-center gap-[6px]"
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <span
        className="block h-[2px] w-6 rounded-full bg-foreground transition-all duration-300 ease-in-out"
        style={{ transform: open ? "translateY(8px) rotate(45deg)" : "none" }}
      />
      <span
        className="block h-[2px] w-6 rounded-full bg-foreground transition-all duration-300 ease-in-out"
        style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }}
      />
      <span
        className="block h-[2px] w-6 rounded-full bg-foreground transition-all duration-300 ease-in-out"
        style={{ transform: open ? "translateY(-8px) rotate(-45deg)" : "none" }}
      />
    </button>
  );
}
