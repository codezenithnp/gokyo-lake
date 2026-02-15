"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dates";

type BookingRoom = {
  _id: string;
  title?: string;
};

type Booking = {
  _id: string;
  roomId: BookingRoom | string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  status: "CONFIRMED" | "CANCELED";
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const params =
        status === "ALL" ? "" : `?status=${encodeURIComponent(status)}`;
      const res = await fetch(`/api/admin/bookings${params}`);
      if (!res.ok) {
        setError("Failed to load bookings.");
        return;
      }
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const handleCancel = async (bookingId: string) => {
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to cancel booking.");
        return;
      }
      setMessage("Booking canceled.");
      fetchBookings();
    } catch {
      setError("Failed to cancel booking.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage hotel bookings and cancellations.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-gray-600">Loading bookings...</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Room</th>
                  <th className="py-2">Guest</th>
                  <th className="py-2">Check-in</th>
                  <th className="py-2">Check-out</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const roomTitle =
                    typeof booking.roomId === "string"
                      ? booking.roomId
                      : booking.roomId?.title ?? booking.roomId?._id;
                  return (
                    <tr key={booking._id} className="border-b">
                      <td className="py-3">{roomTitle ?? "Room"}</td>
                      <td className="py-3">
                        <div className="font-medium text-gray-900">
                          {booking.guestName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.guestEmail}
                        </div>
                      </td>
                      <td className="py-3">{formatDate(booking.checkIn)}</td>
                      <td className="py-3">{formatDate(booking.checkOut)}</td>
                      <td className="py-3">{booking.status}</td>
                      <td className="py-3 text-right">
                        {booking.status === "CONFIRMED" ? (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking._id)}
                            className="lux-btn rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
