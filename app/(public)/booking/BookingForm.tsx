"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type RoomType = "Single" | "Double" | "Twin";

export default function BookingForm() {
  const searchParams = useSearchParams();
  const initialRoomType = searchParams.get("room");

  const [roomType, setRoomType] = useState<RoomType>("Single");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (
      initialRoomType === "Single" ||
      initialRoomType === "Double" ||
      initialRoomType === "Twin"
    ) {
      setRoomType(initialRoomType);
    }
  }, [initialRoomType]);

  const generateInquiryText = () => {
    return `
Booking Inquiry:
Room Type: ${roomType}
Check-in: ${checkIn || "N/A"}
Check-out: ${checkOut || "N/A"}
Guests: ${guests || "N/A"}
Full Name: ${fullName || "N/A"}
Phone: ${phone || "N/A"}
Message: ${message || "N/A"}
    `.trim();
  };

  const handleWhatsApp = () => {
    const text = generateInquiryText();
    const url = `https://wa.me/9779841598973?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const inputStyles = "w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d7b16b]";

  return (
    <div className="bg-[#f6f6f6] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold font-serif text-gray-800">
            Book Your Stay
          </h1>
          <p className="text-gray-600 mt-2">
            Fill the form and we’ll open WhatsApp with your booking inquiry.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleWhatsApp();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="room-type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Room Type
              </label>
              <select
                id="room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className={inputStyles}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Twin">Twin</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="guests"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Guests
              </label>
              <input
                id="guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
                placeholder="Number of Guests"
                className={inputStyles}
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Full Name"
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Phone Number"
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Additional Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any special requests or questions?"
              rows={4}
              className={inputStyles}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d7b16b] text-white font-semibold text-lg py-3 rounded-lg hover:bg-[#c5a060] transition-colors"
          >
            Send Booking Inquiry via WhatsApp
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            No online payment. Booking is confirmed via WhatsApp/call.
          </p>
        </div>
      </div>
    </div>
  );
}
