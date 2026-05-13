import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { navigation } from "~/components/layout/site-header";
import { SITE_CONFIG } from "~/lib/site-config";

const gradientStyle = {
  backgroundColor: "hsla(10,78%,55%,1)",
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),radial-gradient(circle at 88% 9%, hsla(47,75%,65%,1) 3%,transparent 68%),radial-gradient(circle at 80% 54%, hsla(8,75%,45%,1) 3%,transparent 68%),radial-gradient(circle at 5% 22%, hsla(185,100%,15%,1) 3%,transparent 68%),radial-gradient(circle at 7% 3%, hsla(246,81%,14%,1) 3%,transparent 68%)`,
  backgroundBlendMode: "overlay,normal,normal,normal,normal",
};

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  // Two elements staggered — second starts moving only after scroll has progressed 20%
  const y1 = useTransform(scrollYProgress, [0.15, 1], [80, 0]);
  const y2 = useTransform(scrollYProgress, [0.35, 1], [80, 0]);

  return (
    <footer ref={ref} className="overflow-hidden">
      <div style={gradientStyle}>
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-48">
          <motion.div style={{ y: y1 }} className="flex flex-col gap-2 mix-blend-difference">
            <p className="font-heading text-3xl font-semibold text-white">
              {SITE_CONFIG.name}
            </p>
            <p className="text-white">Full-stack engineer. Building systems that last.</p>
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            className="flex flex-col items-start justify-between gap-8 mix-blend-difference md:flex-row md:items-end"
          >
            <ul className="flex flex-wrap gap-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-white transition-colors hover:text-white/70"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm text-white">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
