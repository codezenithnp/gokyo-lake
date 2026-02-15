"use client";

import Image from "next/image";
import { optimizedImageUrl, IMAGE_SIZES, isCloudinaryUrl } from "@/lib/image";

type RoomImageCardProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

/**
 * Displays a single room image in a 3:2 aspect-ratio container.
 * Uses Next.js <Image /> with `fill` + `object-cover` so the image
 * is never stretched or distorted regardless of the source dimensions.
 */
export default function RoomImageCard({
  src,
  alt,
  priority = false,
  className = "",
}: RoomImageCardProps) {
  const safeSrc = src && src.trim() ? src : "/images/placeholder-room.svg";
  const optimized = optimizedImageUrl(safeSrc, "card");
  const skipNextOpt = isCloudinaryUrl(safeSrc);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-t-lg ${className}`}
      style={{ aspectRatio: "3 / 2" }}
    >
      <Image
        src={optimized}
        alt={alt}
        fill
        sizes={IMAGE_SIZES.card}
        priority={priority}
        className="object-cover"
        unoptimized={skipNextOpt}
      />
    </div>
  );
}
