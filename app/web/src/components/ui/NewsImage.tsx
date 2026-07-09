import * as React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

// ─── Variant Definitions ──────────────────────────────────────────────────────

type NewsImageVariant = "card" | "featured" | "hero" | "thumbnail";

const variantSizes: Record<NewsImageVariant, string> = {
  card: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  featured: "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw",
  hero: "(max-width: 1024px) 100vw, 800px",
  thumbnail: "(max-width: 768px) 50vw, 200px",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface NewsImageProps extends Omit<ImageProps, "sizes" | "quality" | "placeholder"> {
  variant?: NewsImageVariant;
}

/**
 * Reusable image component for news articles with optimized `sizes` per variant.
 * 
 * Variants:
 * - `card` — Cards in 3-col grid (desktop), 2-col (tablet), 1-col (mobile)
 * - `featured` — Highlighted card on listing page
 * - `hero` — Cover image on article detail page
 * - `thumbnail` — Small thumbnails (sidebar, related articles)
 */
const NewsImage = React.forwardRef<HTMLImageElement, NewsImageProps>(
  ({ variant = "card", className, priority, alt, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        sizes={variantSizes[variant]}
        quality={85}
        loading={priority ? "eager" : "lazy"}
        className={cn("object-cover", className)}
        priority={priority}
        alt={alt}
        {...props}
      />
    );
  }
);
NewsImage.displayName = "NewsImage";

export { NewsImage };
export type { NewsImageVariant };
