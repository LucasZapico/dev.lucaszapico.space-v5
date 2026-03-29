import ExampleDoc, { frontmatter } from "~/docs/example.mdx";

export default function DocsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-4xl p-8">
      <h1>{frontmatter.title as string}</h1>
      <p className="text-muted-foreground">{frontmatter.description as string}</p>
      <ExampleDoc />
    </div>
  );
}
