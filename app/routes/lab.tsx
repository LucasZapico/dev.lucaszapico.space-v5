import type React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { generateMeta } from "~/lib/meta";
import { H1, H3, Lead, Small, SectionLabel } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { Section } from "~/components/common/section";
import { Button } from "~/components/ui/button";
import { builds, buildOrder, statusLabel, type BuildStatus } from "~/lib/builds";
import { MagneticButton } from "~/components/lab/magnetic-button";
import { ScrambleText } from "~/components/lab/scramble-text";
import { MorphBlob } from "~/components/lab/morph-blob";
import { Typewriter } from "~/components/lab/typewriter";
import { HamburgerClose } from "~/components/lab/hamburger-close";
import { HeartLike } from "~/components/lab/heart-like";
import { IconConnection, IconShift } from "~/components/lab/geometric-icons";
import { CartFill } from "~/components/lab/cart-fill";
import { MicAudio } from "~/components/lab/mic-audio";
import { PillArrowButton } from "~/components/lab/pill-arrow-button";
import { StickyFigure } from "~/components/lab/sticky-figure";
import { ScrollMorphHeader } from "~/components/lab/scroll-morph-header";
import { ScrollPathDraw } from "~/components/lab/scroll-path-draw";
import { ExperimentModal } from "~/components/lab/experiment-modal";
import { TagCloud } from "~/components/lab/tag-cloud";

const statusColors: Record<BuildStatus, string> = {
  shipped: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  running: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  prototype: "bg-secondary text-muted-foreground",
};

export function meta() {
  return generateMeta({
    title: "Lab — Lucas Zapico",
    description: "Micro-interactions, experiments, and toy builds.",
    path: "/lab",
  });
}

type Experiment = {
  id: string;
  title: string;
  description: string;
  tech: string;
  tags: string[];
  demo: React.ReactNode;
  modalDemo?: (scrollRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
};

const experiments: Experiment[] = [
  {
    id: "magnetic-button",
    title: "Magnetic Button",
    description: "An element that drifts toward the cursor using spring physics. Hover the button.",
    tech: "Framer Motion",
    tags: ["motion", "input", "micro-interaction"],
    demo: (
      <MagneticButton>
        <Button size="lg" variant="outline" className="pointer-events-none select-none">
          Hover me
        </Button>
      </MagneticButton>
    ),
  },
  {
    id: "scramble-text",
    title: "Text Scramble",
    description: "Text that cycles through random characters before resolving to the original.",
    tech: "React",
    tags: ["react", "micro-interaction"],
    demo: (
      <ScrambleText
        text="SCRAMBLE"
        autoLoop
        className="text-xl font-medium tracking-widest"
      />
    ),
  },
  {
    id: "morph-blob",
    title: "Morphing Blob",
    description: "An ambient shape that continuously morphs using an 8-value CSS border-radius animation.",
    tech: "CSS",
    tags: ["css", "ambient"],
    demo: <MorphBlob />,
  },
  {
    id: "typewriter",
    title: "Typewriter",
    description: "Text that types out, pauses, then backspaces before cycling to the next phrase.",
    tech: "React",
    tags: ["react", "ambient"],
    demo: (
      <Typewriter
        phrases={["Full-Stack Engineer.", "Problem solver.", "Ship it."]}
        className="text-xl font-medium tracking-wide"
      />
    ),
  },
  {
    id: "hamburger-close",
    title: "Hamburger → Close",
    description: "Three lines morph into an X on click. A staple nav interaction built with pure CSS transitions.",
    tech: "CSS",
    tags: ["css", "input", "micro-interaction"],
    demo: <HamburgerClose />,
  },
  {
    id: "heart-like",
    title: "Heart Like",
    description: "A like button with a fill animation and particle burst on activation.",
    tech: "React",
    tags: ["react", "input", "micro-interaction"],
    demo: <HeartLike />,
  },
  {
    id: "mic-audio",
    title: "Mic Audio Indicator",
    description: "A microphone with live audio bars animating inside the capsule. Built with SVG clip-path and CSS keyframes.",
    tech: "CSS / SVG",
    tags: ["css", "svg", "ambient"],
    demo: <MicAudio />,
  },
  {
    id: "cart-fill",
    title: "Cart Fill",
    description: "Items stack into a cart with a bounce on each add. The cart jiggles and a badge increments.",
    tech: "CSS / SVG",
    tags: ["css", "svg", "input"],
    demo: <CartFill />,
  },
  {
    id: "icon-connection",
    title: "SVG Draw — Connection",
    description: "Two circles draw simultaneously in opposite directions using stroke-dashoffset.",
    tech: "CSS / SVG",
    tags: ["css", "svg", "ambient"],
    demo: <IconConnection size={64} loop />,
  },
  {
    id: "icon-shift",
    title: "SVG Shift — Dot Grid",
    description: "A 4×4 dot grid where filled quadrants cycle through phases using staggered CSS keyframe animations.",
    tech: "CSS / SVG",
    tags: ["css", "svg", "ambient"],
    demo: <IconShift size={64} loop />,
  },
  {
    id: "pill-arrow-button",
    title: "Pill → Arrow Button",
    description: "Full-radius pill button with a vertical capsule icon. Hover to spin it 405° and watch the pill morph into an arrow.",
    tech: "Framer Motion",
    tags: ["motion", "input", "micro-interaction"],
    demo: <PillArrowButton>Let's go</PillArrowButton>,
  },
  // Scroll-driven experiments
  {
    id: "sticky-figure",
    title: "Sticky Figure Scrollytelling",
    description: "A pinned visual transforms as narrative text scrolls past. Classic NYT-style storytelling pattern.",
    tech: "React / Scroll",
    tags: ["scroll", "react", "scrollytelling", "fixed-ui"],
    demo: (
      <div className="flex h-full w-full items-center justify-center gap-4">
        <div className="h-16 w-16 rounded-lg border-2 border-foreground/40" />
        <div className="space-y-1.5">
          <div className="h-1 w-20 rounded-full bg-foreground/40" />
          <div className="h-1 w-16 rounded-full bg-foreground/20" />
          <div className="h-1 w-24 rounded-full bg-foreground/30" />
        </div>
      </div>
    ),
    modalDemo: (scrollRef) => <StickyFigure containerRef={scrollRef} />,
  },
  {
    id: "scroll-morph-header",
    title: "Morphing Header on Scroll",
    description: "A sticky header that shrinks, gains opacity, and drops its tagline as you scroll. Reclaims vertical space.",
    tech: "React / Scroll",
    tags: ["scroll", "react", "fixed-ui", "micro-interaction"],
    demo: (
      <div className="flex h-full w-full flex-col gap-2">
        <div className="h-8 w-full rounded-md bg-foreground/80 px-3 py-1.5">
          <div className="h-2 w-16 rounded-full bg-background/60" />
        </div>
        <div className="h-1 w-full rounded-full bg-foreground/10" />
        <div className="h-1 w-3/4 rounded-full bg-foreground/10" />
        <div className="h-1 w-full rounded-full bg-foreground/10" />
        <div className="h-1 w-2/3 rounded-full bg-foreground/10" />
      </div>
    ),
    modalDemo: (scrollRef) => <ScrollMorphHeader containerRef={scrollRef} />,
  },
  {
    id: "scroll-path-draw",
    title: "Scroll-Driven SVG Path",
    description: "An SVG path draws in as you scroll, with a leading dot tracing along its tangent via offset-path.",
    tech: "CSS / SVG / Scroll",
    tags: ["scroll", "css", "svg"],
    demo: (
      <svg width="120" height="60" viewBox="0 0 120 60" className="text-foreground/60">
        <path
          d="M 10 30 C 30 30, 30 10, 50 10 S 70 50, 90 50 S 110 30, 115 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    modalDemo: (scrollRef) => <ScrollPathDraw containerRef={scrollRef} />,
  },
];

function useExperimentFilter() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const exp of experiments) {
      for (const t of exp.tags) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, []);

  const filtered = useMemo(() => {
    if (selected.size === 0) return experiments;
    return experiments.filter((exp) => exp.tags.some((t) => selected.has(t)));
  }, [selected]);

  const toggle = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };
  const clear = () => setSelected(new Set());

  return { tags, filtered, selected, toggle, clear };
}

export default function LabPage() {
  const [openedId, setOpenedId] = useState<string | null>(null);
  const { tags, filtered, selected, toggle, clear } = useExperimentFilter();
  const opened = openedId ? experiments.find((e) => e.id === openedId) ?? null : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <FadeIn>
        <section className="mb-16">
          <H1>Lab</H1>
          <Lead className="mt-4 max-w-xl">
            Personal builds, experiments, and micro-interactions. Some shipped,
            some still cooking — all built to learn something or scratch an itch.
          </Lead>
        </section>
      </FadeIn>

      {/* Builds */}
      <Section padding="lg">
        <FadeIn>
          <SectionLabel>Builds</SectionLabel>
        </FadeIn>
        <div className="mt-8 grid grid-cols-12 gap-6">
          {buildOrder.map((slug) => {
            const build = builds[slug];
            return (
              <FadeIn key={slug} className="col-span-12 md:col-span-6">
                <Link
                  to={`/lab/${slug}`}
                  className="group flex h-full flex-col rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[build.status]}`}>
                      {statusLabel[build.status]}
                    </span>
                    <span className="text-xs text-muted-foreground">{build.category}</span>
                  </div>
                  <H3 className="mt-4 text-base transition-colors group-hover:text-foreground/80">
                    {build.title}
                  </H3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {build.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {build.stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                    {build.stack.length > 4 && (
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                        +{build.stack.length - 4}
                      </span>
                    )}
                  </div>
                  <span className="mt-4 text-xs text-muted-foreground/60 transition-colors group-hover:text-foreground/60">
                    Read more →
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Experiments */}
      <Section padding="lg">
        <FadeIn>
          <SectionLabel>Experiments</SectionLabel>
          <p className="mt-2 text-sm text-muted-foreground">
            Micro-interactions and UI techniques — things built to understand how something works. Click any card to view full demo.
          </p>
        </FadeIn>

        <FadeIn className="mt-6">
          <TagCloud tags={tags} selected={selected} onToggle={toggle} onClear={clear} />
          <p className="mt-2 font-label text-xs text-muted-foreground/60">
            {filtered.length} of {experiments.length} experiments
            {selected.size > 0 && ` — matching ${[...selected].join(" or ")}`}
          </p>
        </FadeIn>

        <div className="mt-8 grid grid-cols-12 gap-6">
          {filtered.map((exp) => (
            <FadeIn key={exp.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <button
                type="button"
                onClick={() => setOpenedId(exp.id)}
                aria-label={`View ${exp.title} demo`}
                className="group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
              >
                <div className="relative flex min-h-[220px] items-center justify-center bg-secondary/60 p-8">
                  <div className="pointer-events-none">{exp.demo}</div>
                  <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 font-label text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    Click to view →
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="font-heading text-base font-semibold">{exp.title}</h3>
                  <Small className="flex-1">{exp.description}</Small>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="font-label text-xs text-muted-foreground/60">{exp.tech}</span>
                    {exp.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </FadeIn>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-12 rounded-xl border border-dashed bg-card/50 p-10 text-center text-sm text-muted-foreground">
              No experiments match the selected tags.{" "}
              <button type="button" onClick={clear} className="underline hover:text-foreground">
                Clear filter
              </button>
            </div>
          )}
        </div>
      </Section>

      {opened && (
        <ExperimentModal
          open={true}
          onClose={() => setOpenedId(null)}
          title={opened.title}
          description={opened.description}
          tags={opened.tags}
          tech={opened.tech}
        >
          {(scrollRef) =>
            opened.modalDemo ? (
              opened.modalDemo(scrollRef)
            ) : (
              <div className="flex min-h-full flex-col items-center justify-center p-12">
                <div className="scale-125">{opened.demo}</div>
                <p className="mt-12 max-w-md text-center text-sm text-muted-foreground">
                  This experiment doesn't need scroll to demo — try interacting with it above.
                </p>
              </div>
            )
          }
        </ExperimentModal>
      )}
    </main>
  );
}
