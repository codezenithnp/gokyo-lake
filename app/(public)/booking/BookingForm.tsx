"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Amenity = {
  _id: string;
  name: string;
};

type AvailableRoom = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  amenityIds?: Amenity[];
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preferredRoom = searchParams.get("room");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAvailability = async () => {
    setMessage("");
    setError("");
    setValidationError("");
    if (!checkIn || !checkOut) {
      setValidationError("Please choose check-in and check-out dates.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/public/availability?checkIn=${encodeURIComponent(
          checkIn
        )}&checkOut=${encodeURIComponent(checkOut)}`
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Failed to check availability.");
        return;
      }
      const available = data.rooms ?? [];
      setRooms(available);

      if (preferredRoom) {
        const match = available.find((room: AvailableRoom) =>
          room.title.toLowerCase().includes(preferredRoom.toLowerCase())
        );
        if (match) {
          setSelectedRoomId(match._id);
        }
      }
    } catch {
      setError("Failed to check availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      fetchAvailability();
    }
  }, [checkIn, checkOut]);

  const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setValidationError("");

    if (!selectedRoomId) {
      setValidationError("Please select an available room.");
      return;
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      setValidationError("Please provide your name and email.");
      return;
    }

    if (!checkIn || !checkOut) {
      setValidationError("Please choose check-in and check-out dates.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setValidationError("Check-out must be after check-in.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoomId,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim() || undefined,
          checkIn,
          checkOut,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setError("Room not available for selected dates.");
        } else if (response.status === 400) {
          setError(data?.error ?? "Please check your booking details.");
        } else {
          setError(data?.error ?? "Unable to create booking.");
        }
        return;
      }
      const bookingId = data?.booking?._id ?? data?.booking?.id;
      if (bookingId) {
        router.push(`/booking/confirmation?bookingId=${bookingId}`);
        return;
      }
      setMessage("Booking confirmed! We will contact you shortly.");
    } catch {
      setError("Unable to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d7b16b]";

  return (
    <div className="bg-[#f6f6f6] py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold font-serif text-gray-800">
            Book Your Stay
          </h1>
          <p className="text-gray-600 mt-2">
            Check availability, choose a room, and confirm your booking.
          </p>
        </div>

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="check-in"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Check-in Date
              </label>
              <input
                id="check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <label
                htmlFor="check-out"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Check-out Date
              </label>
              <input
                id="check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputStyles}
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={fetchAvailability}
            disabled={loading}
            className="lux-btn bg-[color:var(--primary-blue)] text-white px-5 py-2 rounded font-semibold hover:bg-[color:var(--secondary-blue)]"
          >
            {loading ? "Checking..." : "Check Availability"}
          </button>

          {rooms.length ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Rooms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <label
                    key={room._id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedRoomId === room._id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="room"
                      value={room._id}
                      checked={selectedRoomId === room._id}
                      onChange={() => setSelectedRoomId(room._id)}
                      className="mr-2"
                    />
                    <div className="mt-3">
                      <Image
                        src={room.images?.[0] ?? "/images/placeholder-room.svg"}
                        alt={room.title}
                        width={400}
                        height={240}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {room.title}
                        </span>
                        <span className="text-sm font-semibold text-blue-700">
                          Rs. {room.price}
                        </span>
                      </div>
                      {room.amenityIds?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {room.amenityIds.map((amenity) => (
                            <span
                              key={amenity._id}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                            >
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : checkIn && checkOut && !loading ? (
            <p className="text-sm text-gray-600">
              No rooms available for selected dates.
            </p>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="guest-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="guest-name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your Full Name"
                className={inputStyles}
                required
              />
            </div>
            <div>
              <label
                htmlFor="guest-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputStyles}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="guest-phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="guest-phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="Your Phone Number"
              className={inputStyles}
            />
          </div>

          {validationError ? (
            <p className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              {validationError}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#d7b16b] text-white font-semibold text-lg py-3 rounded-lg hover:bg-[#c5a060] transition-colors"
          >
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
