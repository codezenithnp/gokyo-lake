"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import RoomImageCard from "@/components/public/RoomImageCard";

type PublicAmenity = {
  _id: string;
  name: string;
};

type PublicRoom = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  amenityIds?: PublicAmenity[];
};

type RoomCardsProps = {
  limit?: number;
};

export default function RoomCards({ limit = 6 }: RoomCardsProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
            <div className="w-full bg-gray-200" style={{ aspectRatio: "3 / 2" }} />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!rooms.length) {
    return <p className="text-center text-gray-500">No rooms available at the moment.</p>;
  }

  const roomsToRender = rooms.slice(0, limit).map((room) => ({
    id: room._id,
    name: room.title,
    price: room.price,
    image:
      (room.images ?? []).find(
        (img) => img && img.trim() && (img.startsWith("http") || img.startsWith("/"))
      ) || "/images/placeholder-room.svg",
    amenities: room.amenityIds ?? [],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {roomsToRender.map((room) => (
        <Reveal
          key={room.id}
          className="bg-white shadow-md rounded-lg overflow-hidden lux-card"
        >
          <RoomImageCard
            src={room.image}
            alt={room.name}
            priority={false}
          />
          <div className="bg-blue-900 text-white p-3">
            <h3 className="font-bold text-lg">{room.name.toUpperCase()}</h3>
            {room.amenities.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
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
          <div className="p-4 flex justify-between items-center">
            <span className="font-bold text-yellow-600">Rs. {room.price}</span>
            <Link href={`/booking?room=${room.name}`}>
              <Button className="w-full">Book Now</Button>
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
