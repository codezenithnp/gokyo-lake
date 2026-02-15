"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import RoomImageGallery from "@/components/public/RoomImageGallery";

type PublicAmenity = {
  _id: string;
  name: string;
};

type PublicRoom = {
  _id: string;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  amenityIds?: PublicAmenity[];
};

export default function AccommodationRooms() {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch("/api/public/rooms");
        if (!response.ok) return;
        const data = await response.json();
        setRooms(Array.isArray(data.rooms) ? data.rooms : []);
      } catch {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-12">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-full max-w-5xl rounded-lg overflow-hidden shadow-lg bg-white animate-pulse">
            <div className="w-full bg-gray-200" style={{ aspectRatio: "3 / 2" }} />
            <div className="p-8 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!rooms.length) {
    return <p className="text-center text-gray-500">No rooms available at the moment.</p>;
  }

  const roomsToRender = rooms.map((room) => {
    const validImages = (room.images ?? []).filter(
      (img) => img && img.trim() && (img.startsWith("http") || img.startsWith("/"))
    );
    return {
      id: room._id,
      name: room.title,
      price: room.price,
      description: room.description || `The ${room.title.toLowerCase()} is a great choice for travelers looking for a comfortable and affordable stay.`,
      images: validImages.length ? validImages : ["/images/placeholder-room.svg"],
      amenities: room.amenityIds ?? [],
    };
  });

  return (
    <div className="flex flex-col items-center space-y-12">
      {roomsToRender.map((room, index) => (
        <Reveal
          key={room.id}
          delay={index * 120}
          className="w-full max-w-5xl border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white lux-card"
        >
          <RoomImageGallery images={room.images} alt={room.name} />

          <div className="bg-[#0f5f7a] text-white p-4 text-center">
            <h3 className="font-bold text-2xl tracking-wider">{room.name}</h3>
            {room.amenities.length ? (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity._id}
                    className="rounded-full bg-white/15 px-2 py-0.5 text-xs"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="p-8 text-left">
            <h3 className="text-2xl font-serif text-gray-900">{room.name}</h3>
            <p className="text-lg text-gray-700 mt-2">
              Starting from{" "}
              <span className="font-bold text-xl">Rs. {room.price}</span> / night
            </p>
            <p className="mt-4 text-gray-600">{room.description}</p>
            <Link href={`/booking?room=${room.name.split(" ")[0]}`}>
              <button className="lux-btn mt-6 bg-[color:var(--primary-blue)] text-white font-bold py-2 px-4 rounded hover:bg-[color:var(--secondary-blue)]">
                Book Now
              </button>
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
