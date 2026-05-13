import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "~/lib/utils";

export function CountUp({ to, suffix = "", duration = 1.2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * to) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

export function WordStagger({ children, className, delay = 0 }: { children: string; className?: string; delay?: number }) {
  const words = children.split(" ");
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      className={cn("inline", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 14, filter: "blur(3px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
          }}
          className="inline-block"
          style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "start 0.1"],
  });
  const opacity = useTransform(scrollYProgress, [delay, Math.min(delay + 0.5, 1)], [0, 1]);
  const y = useTransform(scrollYProgress, [delay, 1], [30, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export function Stagger({ children, className, stagger = 0.1 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  delay?: number;
}

export function ScrollReveal({ children, className, yOffset = 60, delay = 0 }: ScrollRevealProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    function compute() {
      const top = outer!.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const start = vh * (1 - delay * 0.5);
      const end = vh * 0.35;
      const p = Math.max(0, Math.min(1, (start - top) / (start - end)));
      inner!.style.transform = `translateY(${(1 - p) * yOffset}px)`;
    }

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    return () => window.removeEventListener("scroll", compute);
  }, [yOffset, delay]);

  return (
    <div ref={outerRef} className={className}>
      <div ref={innerRef} style={{ transform: `translateY(${yOffset}px)`, willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
