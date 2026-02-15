"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { optimizedImageUrl, IMAGE_SIZES, isCloudinaryUrl } from "@/lib/image";

type RoomImageGalleryProps = {
  images: string[];
  alt: string;
};

/**
 * Carousel-ready image gallery for room detail / accommodation pages.
 * Shows a hero image with thumbnail strip. Click a thumbnail to swap.
 * Left/right arrows navigate between images.
 */
export default function RoomImageGallery({
  images,
  alt,
}: RoomImageGalleryProps) {
  const isValidSrc = (img: string) => img && img.trim() && (img.startsWith("http") || img.startsWith("/"));
  const safeImages =
    images.filter(isValidSrc).length > 0
      ? images.filter(isValidSrc)
      : ["/images/placeholder-room.svg"];
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = useCallback(
    () =>
      setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1)),
    [safeImages.length]
  );

  const goNext = useCallback(
    () =>
      setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1)),
    [safeImages.length]
  );

  const currentImg = safeImages[activeIndex] || "/images/placeholder-room.svg";
  const heroSrc = optimizedImageUrl(currentImg, "hero");
  const skipNextOpt = isCloudinaryUrl(currentImg);

  return (
    <div className="w-full">
      {/* Hero image */}
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "3 / 2" }}
      >
        <Image
          src={heroSrc}
          alt={`${alt} — image ${activeIndex + 1}`}
          fill
          sizes={IMAGE_SIZES.hero}
          priority={activeIndex === 0}
          className="object-cover transition-opacity duration-300"
          unoptimized={skipNextOpt}
        />

        {/* Navigation arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === activeIndex
                    ? "bg-white"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => {
            const safeThumb = img && img.trim() ? img : "/images/placeholder-room.svg";
            const thumbSrc = optimizedImageUrl(safeThumb, "thumbnail");
            const thumbSkip = isCloudinaryUrl(safeThumb);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative shrink-0 overflow-hidden rounded-md transition ring-2 ${
                  i === activeIndex
                    ? "ring-[#0f5f7a]"
                    : "ring-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ width: 80, height: 54 }}
              >
                <Image
                  src={thumbSrc}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  sizes={IMAGE_SIZES.thumbnail}
                  className="object-cover"
                  unoptimized={thumbSkip}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
