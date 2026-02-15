"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import AccommodationRooms from "@/components/public/AccommodationRooms";
import RoomReviews from "@/components/public/RoomReviews";

const AccommodationPage = () => {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/public/gallery");
        if (!res.ok) return;
        const data = await res.json();
        const all = Array.isArray(data.images) ? data.images : [];
        const hero = all.find((img: { category: string }) => img.category === "Hero");
        if (hero) setHeroImage(hero.imageUrl);
      } catch { /* silent */ }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center bg-gray-800"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        <div className="absolute inset-0 hero-overlay" />
        <Reveal className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          <h2 className="text-2xl font-light tracking-widest">WELCOME TO</h2>
          <h1 className="text-6xl md:text-7xl font-serif font-bold drop-shadow-lg">
            Hotel Gokyo lake
          </h1>
          <p className="mt-4 text-lg text-white/90 drop-shadow">
            Book your stay and enjoy at the most affordable rates.
          </p>

          <div className="absolute bottom-10 flex flex-col items-center animate-bounce">
            <span className="text-white/90">Scroll</span>
            <div className="mt-2 w-8 h-8 border-2 border-white/80 rounded-full flex items-center justify-center bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Rooms and Rates Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl font-serif mb-4 text-gray-900">
              ROOMS AND RATES
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700 mb-16">
              We want your stay at our lush hotel to be truly unforgettable. That
              is why we give special attention to all of your needs so that we can
              ensure an experience quite unique.
            </p>
          </Reveal>

          <AccommodationRooms />
        </div>
      </div>

      {/* Guest Reviews Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl font-serif mb-4 text-gray-900 text-center">
              Guest Reviews
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700 mb-12 text-center">
              Hear what our guests have to say about their stay.
            </p>
          </Reveal>
          <RoomReviews />
        </div>
      </div>
    </div>
  );
};

export default AccommodationPage;

