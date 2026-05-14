import { cn } from "~/lib/utils";

export const paddingClasses = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
} as const;

export type SectionPadding = keyof typeof paddingClasses;

interface SectionProps {
  children: React.ReactNode;
  padding?: SectionPadding;
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export function Section({
  children,
  padding = "lg",
  divider = true,
  className,
  style,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag className={cn(paddingClasses[padding], divider && "border-t", className)} style={style}>
      {children}
    </Tag>
  );
}
