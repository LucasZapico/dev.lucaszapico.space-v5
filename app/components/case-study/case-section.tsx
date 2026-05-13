import type { CaseSection, ContentBlock } from "~/lib/case-studies";
import { H2, H3 } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === "text") {
    return (
      <p
        className="text-muted-foreground [&>strong]:text-foreground/80 [&>code]:rounded [&>code]:bg-secondary [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:text-sm [&>em]:text-foreground/60"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    );
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-6 text-muted-foreground [&_strong]:text-foreground/80 [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm">
        {block.items.map((item, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    );
  }
  return null;
}

// Default single-column prose
function ProseSections({ section }: { section: CaseSection }) {
  return (
    <section className="mt-16 first:mt-0">
      {section.image && (
        <img
          src={section.image.src}
          alt={section.image.alt}
          className="mb-8 w-full rounded-lg shadow-lg"
          loading="lazy"
        />
      )}
      <H2>{section.heading}</H2>
      <div className="mt-4 space-y-4">
        {section.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

// Image on one side, text on the other — breaks out of 650px
function SideBySideSection({
  section,
  flip,
}: {
  section: CaseSection;
  flip?: boolean;
}) {
  return (
    <section className="mt-16 first:mt-0">
      <div className="mx-auto flex flex-col gap-8 md:-mx-24 md:max-w-5xl md:flex-row md:items-start lg:-mx-32">
        <div className={`md:w-1/2 ${flip ? "md:order-2" : ""}`}>
          {section.image && (
            <img
              src={section.image.src}
              alt={section.image.alt}
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
          )}
        </div>
        <div className={`md:w-1/2 ${flip ? "md:order-1" : ""}`}>
          <H2>{section.heading}</H2>
          <div className="mt-4 space-y-4">
            {section.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Each text block as a card in a grid
function CardsSection({ section }: { section: CaseSection }) {
  return (
    <section className="mt-16 first:mt-0 md:-mx-24 lg:-mx-32">
      {section.image && (
        <img
          src={section.image.src}
          alt={section.image.alt}
          className="mb-8 w-full rounded-lg shadow-lg"
          loading="lazy"
        />
      )}
      <H2>{section.heading}</H2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {section.blocks.map((block, i) => {
          if (block.type === "text") {
            return (
              <div
                key={i}
                className="rounded-lg border border-border/50 p-5"
              >
                <p
                  className="text-sm text-muted-foreground [&>strong]:block [&>strong]:mb-2 [&>strong]:text-base [&>strong]:text-foreground/80 [&>code]:rounded [&>code]:bg-secondary [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:text-xs"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              </div>
            );
          }
          if (block.type === "list") {
            return (
              <div key={i} className="rounded-lg border border-border/50 p-5 md:col-span-2">
                <BlockRenderer block={block} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}

// Wider callout with subtle background — for results / impact
function CalloutSection({ section }: { section: CaseSection }) {
  return (
    <section
      className="mt-16 first:mt-0 -mx-4 rounded-lg bg-secondary/50 px-6 py-8 md:-mx-8 md:px-10 md:py-10"
    >
      {section.image && (
        <img
          src={section.image.src}
          alt={section.image.alt}
          className="mb-8 w-full rounded-lg shadow-lg"
          loading="lazy"
        />
      )}
      <H2>{section.heading}</H2>
      <div className="mt-4 space-y-4">
        {section.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

// Track side-by-side flip state across sections
let sideBySideCount = 0;

export function CaseSectionRenderer({ section, index }: { section: CaseSection; index: number }) {
  const variant = section.variant || "prose";

  let content: React.ReactNode;

  if (variant === "side-by-side" && section.image) {
    sideBySideCount++;
    content = <SideBySideSection section={section} flip={sideBySideCount % 2 === 0} />;
  } else if (variant === "cards") {
    content = <CardsSection section={section} />;
  } else if (variant === "callout") {
    content = <CalloutSection section={section} />;
  } else {
    content = <ProseSections section={section} />;
  }

  return <FadeIn delay={index === 0 ? 0 : 0.1}>{content}</FadeIn>;
}
