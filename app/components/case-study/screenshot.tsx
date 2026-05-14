interface ScreenshotProps {
  src: string;
  alt?: string;
  caption?: string;
}

export function Screenshot({ src, alt, caption }: ScreenshotProps) {
  return (
    <figure className="not-prose my-12 md:my-16 -mx-4 md:-mx-12 lg:-mx-24">
      <img
        src={src}
        alt={alt || ""}
        className="w-full rounded-lg shadow-xl"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-3 px-4 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ScreenshotPair({
  images,
}: {
  images: { src: string; alt?: string }[];
}) {
  return (
    <div className="not-prose my-12 md:my-16 -mx-4 md:-mx-12 lg:-mx-24 grid grid-cols-12 gap-4">
      {images.map(({ src, alt }) => (
        <img
          key={src}
          src={src}
          alt={alt || ""}
          className="col-span-12 w-full rounded-lg shadow-xl md:col-span-6"
          loading="lazy"
        />
      ))}
    </div>
  );
}
