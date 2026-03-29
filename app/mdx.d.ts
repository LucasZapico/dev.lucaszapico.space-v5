declare module "*.mdx" {
  let MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export const frontmatter: Record<string, unknown>;
  export default MDXComponent;
}
