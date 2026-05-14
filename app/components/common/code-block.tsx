import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import yaml from "highlight.js/lib/languages/yaml";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import typescript from "highlight.js/lib/languages/typescript";
import { cn } from "~/lib/utils";

hljs.registerLanguage("python", python);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("typescript", typescript);

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const highlighted = useMemo(() => {
    try {
      return hljs.highlight(code.trim(), { language }).value;
    } catch {
      return code.trim();
    }
  }, [code, language]);

  return (
    <div className={cn("my-6 overflow-hidden rounded-lg border border-border/40", className)}>
      {filename && (
        <div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-4 py-2">
          <span className="font-label text-xs text-muted-foreground">{filename}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-[#22272e] p-4 text-sm leading-relaxed">
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
