import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { H1, H3, Lead } from "~/components/common/typography";

interface CaseHeroProps {
  heroImages: string[];
  title: string;
  category: string;
  tags: string[];
  impact?: string;
  overview?: string;
  interval?: number;
}

function splitOverview(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length <= 2) return [text];
  const mid = Math.ceil(sentences.length / 2);
  return [
    sentences.slice(0, mid).join("").trim(),
    sentences.slice(mid).join("").trim(),
  ];
}

export function CaseHero({
  heroImages,
  title,
  category,
  tags,
  impact,
  overview,
  interval = 2400,
}: CaseHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroImages.length, interval]);

  return (
    <section className="mb-12 md:mb-16">
      <div className="mx-auto max-w-7xl px-4 pt-4 md:pt-8">
        {/* Centered header block — 6 of 12 cols */}
        <div className="mt-8 grid grid-cols-12 md:mt-12">
          <div className="col-span-12 text-center md:col-span-6 md:col-start-4">
            <span className="text-sm font-medium text-muted-foreground">
              {category}
            </span>
            <H1 className="mt-2">{title}</H1>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            {impact && (
              <Lead className="mx-auto mt-10 text-2xl">
                {impact}
              </Lead>
            )}
          </div>
        </div>

        {/* Overview left 1/3 + Slideshow right 2/3 */}
        <div className="mt-10 grid grid-cols-12 gap-8 md:mt-14">
          {overview && (
            <div className="col-span-12 md:col-span-4">
              <H3 className="mb-4">The Problem</H3>
              {splitOverview(overview).map((paragraph, i) => (
                <p key={i} className="mt-3 text-muted-foreground first:mt-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          {heroImages.length > 0 && (
            <div className={`col-span-12 ${overview ? "md:col-span-8" : "md:col-span-8 md:col-start-5"}`}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                {heroImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${title} — screenshot ${i + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
                      i === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ))}

                {heroImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {heroImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`block h-1.5 rounded-full transition-all duration-300 ${
                          i === activeIndex
                            ? "w-5 bg-white"
                            : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
