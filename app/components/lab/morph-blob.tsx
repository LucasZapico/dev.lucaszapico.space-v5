import { cn } from "~/lib/utils";

interface MorphBlobProps {
  className?: string;
  size?: number;
}

export function MorphBlob({ className, size = 140 }: MorphBlobProps) {
  return (
    <>
      <style>{`
        @keyframes blob-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50%       { border-radius: 50% 60% 30% 60% / 30% 40% 60% 50%; }
          75%       { border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%; }
        }
      `}</style>
      <div
        className={cn(
          "bg-gradient-to-br from-accent via-ring to-primary opacity-75",
          className
        )}
        style={{
          width: size,
          height: size,
          animation: "blob-morph 7s ease-in-out infinite",
        }}
      />
    </>
  );
}
