import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";
import { getAdminFromRequest } from "@/lib/auth";
import {
  buildOverlapQuery,
  isValidObjectId,
  parseDate,
  startOfToday,
} from "@/lib/booking";
import {
  bookingPayloadSchema,
  normalizeEmail,
  normalizeName,
} from "@/lib/validation";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const roomId = url.searchParams.get("roomId");
    const checkIn = url.searchParams.get("checkIn");
    const checkOut = url.searchParams.get("checkOut");

    const query: Record<string, unknown> = {};

    if (status === "CONFIRMED" || status === "CANCELED") {
      query.status = status;
    }

    if (roomId) {
      if (!isValidObjectId(roomId)) {
        return NextResponse.json(
          { ok: false, error: "Invalid room id." },
          { status: 400 }
        );
      }
      query.roomId = roomId;
    }

    if (checkIn && checkOut) {
      const checkInDate = parseDate(checkIn);
      const checkOutDate = parseDate(checkOut);
      if (!checkInDate || !checkOutDate) {
        return NextResponse.json(
          { ok: false, error: "Invalid dates." },
          { status: 400 }
        );
      }
      query.checkIn = { $lt: checkOutDate };
      query.checkOut = { $gt: checkInDate };
    }

    await connectDB();
    const bookings = await Booking.find(query)
      .populate("roomId", "title")
      .sort({ checkIn: 1 })
      .lean();

    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error("Admin bookings fetch failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load bookings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = bookingPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut } =
      parsed.data;

    if (!isValidObjectId(roomId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid room id." },
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
    const room = await Room.findById(roomId).lean();
    if (!room || room.isActive === false) {
      return NextResponse.json(
        { ok: false, error: "Room not found." },
        { status: 404 }
      );
    }

    const overlap = await Booking.exists({
      roomId,
      ...buildOverlapQuery(checkInDate, checkOutDate),
    });
    if (overlap) {
      return NextResponse.json(
        { ok: false, error: "Room is not available for these dates." },
        { status: 409 }
      );
    }

    const booking = await Booking.create({
      roomId,
      guestName: normalizeName(guestName),
      guestEmail: normalizeEmail(guestEmail),
      guestPhone: guestPhone?.trim() || undefined,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      status: "CONFIRMED",
    });

    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Admin booking create failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to create booking." },
      { status: 500 }
    );
  }
}
