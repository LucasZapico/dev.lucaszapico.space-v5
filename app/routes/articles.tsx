import { Link } from "react-router";

export function meta() {
  return [
    { title: "Articles — Lucas Zapico" },
    {
      name: "description",
      content:
        "Writing on development, architecture, and engineering craft.",
    },
  ];
}

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Thinking out loud about architecture, tooling, and engineering
          craft.
        </p>
      </section>

      <section className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          New writing coming soon. In the meantime, the case studies in{" "}
          <Link to="/work" className="underline hover:text-foreground">
            Work
          </Link>{" "}
          tell most of the story.
        </p>
      </section>
    </main>
  );
}
