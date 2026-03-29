import type { ReactNode } from "react";
import { Screenshot } from "./screenshot";

interface ImagePlacement {
  src: string;
  alt?: string;
  caption?: string;
}

export function createMdxComponents(
  imageMap: Record<string, ImagePlacement>
) {
  return {
    h2: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => {
      const text = extractText(children);
      const placement = imageMap[text];
      return (
        <>
          {placement && (
            <Screenshot
              src={placement.src}
              alt={placement.alt}
              caption={placement.caption}
            />
          )}
          <h2 {...props}>{children}</h2>
        </>
      );
    },
  };
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}
