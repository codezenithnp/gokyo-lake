"use client";

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Reveal from "@/components/ui/Reveal";
import RoomCards from "@/components/public/RoomCards";
import Amenities from "@/components/public/Amenities";
import { useEffect, useState } from "react";
import { isCloudinaryUrl } from "@/lib/image";

type GalleryImage = {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
};

const HomePage = () => {
  const [heroImage, setHeroImage] = useState("");
  const [homeImages, setHomeImages] = useState<GalleryImage[]>([]);
  const [restaurantImages, setRestaurantImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/public/gallery");
        if (!res.ok) return;
        const data = await res.json();
        const all: GalleryImage[] = Array.isArray(data.images) ? data.images : [];
        const hero = all.find((img) => img.category === "Hero");
        if (hero) setHeroImage(hero.imageUrl);
        setHomeImages(all.filter((img) => img.category === "Home"));
        setRestaurantImages(all.filter((img) => img.category === "Restaurant"));
      } catch { /* silent */ }
    };
    load();
  }, []);

  const featureImage1 = homeImages[0]?.imageUrl ?? "";
  const featureImage2 = homeImages[1]?.imageUrl ?? "";

  return (
    <div>
      {/* Hero Section with Navbar */}
      <div
        className="relative h-screen bg-cover bg-center bg-gray-800"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        <div className="absolute inset-0 hero-overlay"></div>
        <Navbar />
        <Reveal
          className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          <h2 className="text-2xl font-light">WELCOME TO</h2>
          <h1 className="text-7xl font-serif font-bold">Hotel Gokyo lake</h1>
          <p className="mt-4 text-lg">Book your stay and enjoy at the most affordable rates.</p>
          <div className="absolute bottom-10 flex flex-col items-center animate-bounce">
            <span>Scroll</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </Reveal>
      </div>

      {/* Restaurant & Dining Section */}
      {restaurantImages.length > 0 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-4xl font-serif mb-4 text-gray-900">EXPLORE</h2>
              <p className="max-w-2xl mx-auto text-gray-600 mb-12">
                We want your stay at our lush hotel to be truly unforgettable. That is why we give special attention to all of your needs so that we can ensure an experience quite unique.
              </p>
            </Reveal>
            <div className="flex flex-col items-center space-y-16">
              {restaurantImages.map((img) => (
                <div key={img._id} className="relative w-full max-w-5xl overflow-hidden rounded-xl shadow-lg">
                    <div className="relative w-full h-[420px]">
                      <Image
                        src={img.imageUrl}
                        alt={img.title || "Restaurant"}
                        fill
                        className="object-cover"
                        unoptimized={isCloudinaryUrl(img.imageUrl)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                      <div className="rounded-md bg-white px-10 py-4 shadow-lg border border-gray-200">
                        <h3 className="text-lg font-extrabold tracking-widest text-gray-900">
                          RESTAURANT
                        </h3>
                        <p className="mt-1 text-xs font-medium text-gray-600 text-center">
                          Dining &amp; refreshments
                        </p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Accommodation Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl font-serif mb-8 text-gray-900">Accommodation</h2>
          </Reveal>
          <RoomCards />
          <p className="text-center text-gray-700 mt-8">
            All our room types are including complementary breakfast
          </p>
        </div>
      </div>

      {/* Luxury Redefined Section */}
      {featureImage1 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Reveal className="text-center md:text-left">
                <h2 className="text-4xl font-serif mb-4 text-gray-900">
                  Luxury redefined
                </h2>
                <p className="text-gray-700 mb-6">
                  Our rooms are designed to transport you into an environment made for leisure. Take your mind off the day-to-day of home life and find a private paradise for yourself.
                </p>
                <Link href="/accommodation">
                  <button className="lux-btn bg-[color:var(--primary-blue)] text-white px-8 py-3 font-bold hover:bg-[color:var(--secondary-blue)] rounded shadow">
                    EXPLORE
                  </button>
                </Link>
              </Reveal>
              <Reveal delay={150}>
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={featureImage1}
                    alt="Luxury redefined"
                    fill
                    className="rounded-lg shadow-lg lux-card object-cover"
                    unoptimized={isCloudinaryUrl(featureImage1)}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      {/* Leave your worries Section */}
      {featureImage2 && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Reveal>
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={featureImage2}
                    alt="Leave your worries in the sand"
                    fill
                    className="rounded-lg shadow-lg lux-card object-cover"
                    unoptimized={isCloudinaryUrl(featureImage2)}
                  />
                </div>
              </Reveal>
              <Reveal delay={150} className="text-center md:text-left">
                <h2 className="text-4xl font-serif mb-4 text-gray-900">
                  Leave your worries in the sand
                </h2>
                <p className="text-gray-700 mb-6">
                  We love life at the beach. Being close to the ocean with access to endless sandy beach ensures a relaxed state of mind. It seems like time stands still watching the ocean.
                </p>
                <Link href="/accommodation">
                  <button className="lux-btn bg-[color:var(--primary-blue)] text-white px-8 py-3 font-bold hover:bg-[color:var(--secondary-blue)] rounded shadow">
                    EXPLORE
                  </button>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      {/* Amenities Section */}
      <Amenities />

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl font-serif mb-8 text-gray-900">
              Testimonials
            </h2>

            <p className="mx-auto max-w-2xl text-lg italic text-gray-800">
              {"Calm, Serene, Retro \u2013 What a way to relax and enjoy"}
            </p>
            <p className="mt-3 text-sm font-semibold text-gray-600">Rizs - Nepal</p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="h-10 w-10 rounded bg-[#d7b16b] text-white text-2xl leading-none">
                {"\u2039"}
              </button>
              <button className="h-10 w-10 rounded bg-[#d7b16b] text-white text-2xl leading-none">
                {"\u203a"}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
