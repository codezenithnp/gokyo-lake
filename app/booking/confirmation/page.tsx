"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/dates";

type BookingDetails = {
  id: string;
  roomTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "CONFIRMED" | "CANCELED";
};

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError("Booking not found.");
        return;
      }
      try {
        const response = await fetch(`/api/public/bookings/${bookingId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data?.error ?? "Booking not found.");
          return;
        }
        setBooking(data.booking ?? null);
      } catch {
        setError("Unable to load booking.");
      }
    };

    loadBooking();
  }, [bookingId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Booking confirmation
          </h1>
          <p className="mt-4 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your booking is confirmed
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Booking reference: {booking.id}
        </p>

        <div className="mt-6 space-y-3 text-left text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Room</span>
            <span>{booking.roomTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Guest</span>
            <span>{booking.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Check-in</span>
            <span>{formatDate(booking.checkIn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Check-out</span>
            <span>{formatDate(booking.checkOut)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Status</span>
            <span>{booking.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
          <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading booking...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
