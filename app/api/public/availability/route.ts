import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";
import "@/models/Amenity";
import { buildOverlapQuery, parseDate, startOfToday } from "@/lib/booking";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const checkIn = url.searchParams.get("checkIn");
    const checkOut = url.searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { ok: false, error: "Missing check-in or check-out." },
        { status: 400 }
      );
    }

    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);
    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { ok: false, error: "Invalid dates." },
        { status: 400 }
      );
    }

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { ok: false, error: "Check-out must be after check-in." },
        { status: 400 }
      );
    }

    if (checkInDate < startOfToday()) {
      return NextResponse.json(
        { ok: false, error: "Check-in must be today or later." },
        { status: 400 }
      );
    }

    await connectDB();
    const conflicts = await Booking.find({
      ...buildOverlapQuery(checkInDate, checkOutDate),
    }).select("roomId");

    const blockedRoomIds = conflicts.map((booking) => booking.roomId);

    const rooms = await Room.find({
      isActive: true,
      _id: { $nin: blockedRoomIds },
    })
      .populate("amenityIds", "name isActive")
      .lean();

    const sanitized = rooms.map((room) => ({
      ...room,
      amenityIds: Array.isArray(room.amenityIds)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (room.amenityIds as any[]).filter((amenity) => amenity?.isActive !== false)
        : [],
    }));

    return NextResponse.json({ ok: true, rooms: sanitized });
  } catch (error) {
    console.error("Availability lookup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to check availability." },
      { status: 500 }
    );
  }
}
