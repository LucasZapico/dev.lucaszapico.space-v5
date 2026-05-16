import { cn } from "~/lib/utils";

interface TagCloudProps {
  tags: { tag: string; count: number }[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export function TagCloud({ tags, selected, onToggle, onClear }: TagCloudProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          selected.size === 0
            ? "border-foreground bg-foreground text-background"
            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
        )}
      >
        All
      </button>
      {tags.map(({ tag, count }) => {
        const isSelected = selected.has(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            aria-pressed={isSelected}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            <span>{tag}</span>
            <span
              className={cn(
                "text-[10px] tabular-nums",
                isSelected ? "text-background/70" : "text-muted-foreground/60",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
