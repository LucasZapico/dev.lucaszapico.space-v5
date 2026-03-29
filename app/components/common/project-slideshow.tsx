import { useState, useRef, useCallback, useEffect } from "react";

interface ProjectSlideshowProps {
  images: string[];
  alt: string;
  gradient: string;
  category?: string;
  interval?: number;
  aspect?: string;
}

export function ProjectSlideshow({
  images,
  alt,
  gradient,
  category,
  interval = 1200,
  aspect = "16/9",
}: ProjectSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideshow = useCallback(() => {
    if (images.length <= 1) return;
    setIsHovering(true);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, interval);
  }, [images.length, interval]);

  const stopSlideshow = useCallback(() => {
    setIsHovering(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (images.length === 0) {
    return (
      <div
        className="overflow-hidden"
        style={{ background: gradient, aspectRatio: aspect }}
      >
        <div className="flex h-full items-end p-6">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: gradient, aspectRatio: aspect }}
      onMouseEnter={startSlideshow}
      onMouseLeave={stopSlideshow}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} — screenshot ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}

      {/* Slide indicators */}
      {images.length > 1 && isHovering && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-4 bg-white"
                  : "w-1 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
