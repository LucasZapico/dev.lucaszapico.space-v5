import { useAnimation, motion } from "motion/react";
import { cn } from "~/lib/utils";

function PillIcon() {
  return (
    <svg width="9" height="17" viewBox="0 0 9 17" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="7.5" height="15.5" rx="3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

interface PillArrowButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function PillArrowButton({
  children = "Explore",
  className,
  onClick,
}: PillArrowButtonProps) {
  const spinControls = useAnimation();

  function onMouseEnter() {
    spinControls.start({
      rotate: [0, 450],
      transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
    });
  }

  function onMouseLeave() {
    spinControls.set({ rotate: 0 });
  }

  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 rounded-full border border-foreground/20 bg-background px-6 py-3 text-sm font-medium transition-colors duration-200 hover:border-foreground/40 hover:bg-foreground hover:text-background",
        className
      )}
    >
      {children}
      <motion.span animate={spinControls} className="flex shrink-0 items-center justify-center">
        <PillIcon />
      </motion.span>
    </button>
  );
}
