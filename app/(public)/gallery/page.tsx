"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isCloudinaryUrl } from "@/lib/image";

type GalleryImage = {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
  description: string;
};

const GALLERY_CATEGORIES = ["Rooms", "Restaurant", "Surroundings", "Blog"];

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch gallery images, room images, and blog images in parallel
        const [galleryRes, roomsRes, blogsRes] = await Promise.all([
          fetch("/api/public/gallery"),
          fetch("/api/public/rooms"),
          fetch("/api/public/blogs"),
        ]);

        let galleryImages: GalleryImage[] = [];
        if (galleryRes.ok) {
          const data = await galleryRes.json();
          const all: GalleryImage[] = Array.isArray(data.images) ? data.images : [];
          galleryImages = all.filter((img) => GALLERY_CATEGORIES.includes(img.category));
        }

        // Pull all images from rooms and add them as "Rooms" category
        let roomImages: GalleryImage[] = [];
        if (roomsRes.ok) {
          const data = await roomsRes.json();
          const rooms = Array.isArray(data.rooms) ? data.rooms : [];
          rooms.forEach((room: { _id: string; title: string; images?: string[] }) => {
            const imgs = Array.isArray(room.images) ? room.images : [];
            imgs.forEach((url, idx) => {
              if (url && typeof url === "string" && url.startsWith("http")) {
                roomImages.push({
                  _id: `room-${room._id}-${idx}`,
                  imageUrl: url,
                  title: room.title,
                  category: "Rooms",
                  description: "",
                });
              }
            });
          });
        }

        // Pull cover images from published blogs
        let blogImages: GalleryImage[] = [];
        if (blogsRes.ok) {
          const data = await blogsRes.json();
          const blogs = Array.isArray(data.blogs) ? data.blogs : [];
          blogs.forEach((blog: { _id: string; title: string; coverImage?: string }) => {
            if (blog.coverImage && typeof blog.coverImage === "string" && blog.coverImage.startsWith("http")) {
              blogImages.push({
                _id: `blog-${blog._id}`,
                imageUrl: blog.coverImage,
                title: blog.title,
                category: "Blog",
                description: "",
              });
            }
          });
        }

        // Merge: gallery "Rooms" images first, then room images, then blog images
        const nonRoomGallery = galleryImages.filter((img) => img.category !== "Rooms");
        const roomGallery = galleryImages.filter((img) => img.category === "Rooms");
        setImages([...nonRoomGallery, ...roomGallery, ...roomImages, ...blogImages]);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ["All", ...GALLERY_CATEGORIES];

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((image) => image.category === activeCategory);

  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-gray-700 max-w-3xl mx-auto mb-10">
            Explore the beauty of Hotel Gokyo Lake and its stunning surroundings
            through our curated gallery.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex justify-center gap-2 md:gap-4 mb-10 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`lux-btn font-semibold py-2 px-6 rounded-full text-sm transition-colors ${
                  isActive
                    ? "bg-[color:var(--primary-blue)] text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No photos available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <button
                key={image._id}
                type="button"
                onClick={() => setLightbox(image)}
                className="overflow-hidden rounded-lg group lux-card relative aspect-[4/3] cursor-pointer"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  unoptimized={isCloudinaryUrl(image.imageUrl)}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title}
                fill
                className="object-contain rounded-lg"
                unoptimized={isCloudinaryUrl(lightbox.imageUrl)}
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-white font-semibold">{lightbox.title}</p>
              {lightbox.description && (
                <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
