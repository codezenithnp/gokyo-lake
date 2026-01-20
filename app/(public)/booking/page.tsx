"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type RoomType = "Single" | "Double" | "Twin";

export default function BookingPage() {
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

  const handleEmail = () => {
    const subject = "Booking Inquiry - Hotel Gokyo Lake";
    const body = generateInquiryText();
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleCall = () => {
    const url = "tel:+9779841598973";
    window.location.href = url;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Book Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="roomType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Room Type
                </label>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Single</option>
                  <option>Double</option>
                  <option>Twin</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="guests"
                  className="block text-sm font-medium text-gray-700"
                >
                  Guests
                </label>
                <Input
                  id="guests"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="checkin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Check-in Date
                </label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="checkout"
                  className="block text-sm font-medium text-gray-700"
                >
                  Check-out Date
                </label>
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleWhatsApp}
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Send via WhatsApp
              </Button>
              <Button
                onClick={handleEmail}
                type="button"
                variant="secondary"
              >
                Send via Email
              </Button>
              <Button onClick={handleCall} type="button" variant="outline">
                Call Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}