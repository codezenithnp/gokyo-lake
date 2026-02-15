"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Room = {
  _id: string;
  title: string;
  price: number;
  capacity: number;
  isActive: boolean;
  amenityIds?: { _id: string; name: string; isActive?: boolean }[];
};

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/rooms");
      if (!res.ok) {
        setError("Failed to load rooms.");
        return;
      }
      const data = await res.json();
      setRooms(data.rooms ?? []);
    } catch {
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this room? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete room.");
      }
      await fetchRooms();
    } catch {
      alert("Failed to delete room.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
          <button
            type="button"
            onClick={() => router.push("/admin/rooms/new")}
            className="lux-btn rounded-md bg-[color:var(--primary-blue)] px-4 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)]"
          >
            Add Room
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-600">Loading rooms...</p>
        ) : null}
        {error ? (
          <p className="mt-6 text-red-600">{error}</p>
        ) : null}

        {!loading && !error ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Title</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Capacity</th>
                  <th className="py-2">Active</th>
                  <th className="py-2">Amenities</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id} className="border-b">
                    <td className="py-2">{room.title}</td>
                    <td className="py-2">Rs. {room.price}</td>
                    <td className="py-2">{room.capacity}</td>
                    <td className="py-2">{room.isActive ? "Yes" : "No"}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2">
                        {(room.amenityIds ?? []).filter(
                          (amenity) => amenity?.name && amenity.isActive !== false
                        )
                          .length ? (
                          room.amenityIds
                            ?.filter(
                              (amenity) =>
                                amenity?.name && amenity.isActive !== false
                            )
                            .map((amenity) => (
                            <span
                              key={amenity._id}
                              className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
                            >
                              {amenity.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/admin/rooms/${room._id}/edit`)
                        }
                        className="lux-btn rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(room._id)}
                        disabled={deletingId === room._id}
                        className="lux-btn rounded-md border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-400 disabled:opacity-50"
                      >
                        {deletingId === room._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
