import { cn } from "~/lib/utils";

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
} as const;

type ProseSize = keyof typeof sizeClasses;

interface ProseProps {
  children: React.ReactNode;
  size?: ProseSize;
  className?: string;
  as?: React.ElementType;
}

export function Prose({ children, size = "sm", className, as: Tag = "div" }: ProseProps) {
  return (
    <Tag className={cn("mx-auto", sizeClasses[size], className)}>
      {children}
    </Tag>
  );
}
