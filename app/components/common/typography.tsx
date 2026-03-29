import { cn } from "~/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-4xl leading-tight tracking-tight md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn("text-2xl leading-snug tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: TypographyProps) {
  return (
    <h3
      className={cn("text-xl leading-snug", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function SectionLabel({ children, className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-label text-sm font-medium uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function Lead({ children, className, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-lg text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Body({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function Small({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}
