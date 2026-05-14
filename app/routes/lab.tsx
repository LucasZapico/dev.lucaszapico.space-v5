import type React from "react";
import { Link } from "react-router";
import { generateMeta } from "~/lib/meta";
import { H1, H3, Lead, Small, SectionLabel } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { Section } from "~/components/common/section";
import { Button } from "~/components/ui/button";
import { builds, buildOrder, statusLabel, type BuildStatus } from "~/lib/builds";

const statusColors: Record<BuildStatus, string> = {
  shipped: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  running: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  prototype: "bg-secondary text-muted-foreground",
};
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

export function meta() {
  return generateMeta({
    title: "Lab — Lucas Zapico",
    description: "Micro-interactions, experiments, and toy builds.",
    path: "/lab",
  });
}

const experiments: { id: string; title: string; description: string; tech: string; demo: React.ReactNode }[] = [
  {
    id: "magnetic-button",
    title: "Magnetic Button",
    description: "An element that drifts toward the cursor using spring physics. Hover the button.",
    tech: "Framer Motion",
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
    demo: <MorphBlob />,
  },
  {
    id: "typewriter",
    title: "Typewriter",
    description: "Text that types out, pauses, then backspaces before cycling to the next phrase.",
    tech: "React",
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
    demo: <HamburgerClose />,
  },
  {
    id: "heart-like",
    title: "Heart Like",
    description: "A like button with a fill animation and particle burst on activation.",
    tech: "React",
    demo: <HeartLike />,
  },
  {
    id: "mic-audio",
    title: "Mic Audio Indicator",
    description: "A microphone with live audio bars animating inside the capsule. Built with SVG clip-path and CSS keyframes.",
    tech: "CSS / SVG",
    demo: <MicAudio />,
  },
  {
    id: "cart-fill",
    title: "Cart Fill",
    description: "Items stack into a cart with a bounce on each add. The cart jiggles and a badge increments.",
    tech: "CSS / SVG",
    demo: <CartFill />,
  },
  {
    id: "icon-connection",
    title: "SVG Draw — Connection",
    description: "Two circles draw simultaneously in opposite directions using stroke-dashoffset.",
    tech: "CSS / SVG",
    demo: <IconConnection size={64} loop />,
  },
  {
    id: "icon-shift",
    title: "SVG Shift — Dot Grid",
    description: "A 4×4 dot grid where filled quadrants cycle through phases using staggered CSS keyframe animations.",
    tech: "CSS / SVG",
    demo: <IconShift size={64} loop />,
  },
  {
    id: "pill-arrow-button",
    title: "Pill → Arrow Button",
    description: "Full-radius pill button with a vertical capsule icon. Hover to spin it 405° and watch the pill morph into an arrow.",
    tech: "Framer Motion",
    demo: <PillArrowButton>Let's go</PillArrowButton>,
  },
];

export default function LabPage() {
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
            Micro-interactions and UI techniques — things built to understand how something works.
          </p>
        </FadeIn>
        <div className="mt-8 grid grid-cols-12 gap-6">
        {experiments.map((exp) => (
          <FadeIn key={exp.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="flex h-full flex-col rounded-xl border bg-card">
              <div className="flex min-h-[220px] items-center justify-center rounded-t-xl bg-secondary/60 p-8">
                {exp.demo}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h3 className="font-heading text-base font-semibold">{exp.title}</h3>
                <Small className="flex-1">{exp.description}</Small>
                <span className="mt-3 font-label text-xs text-muted-foreground/60">
                  {exp.tech}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
        </div>
      </Section>
    </main>
  );
}
