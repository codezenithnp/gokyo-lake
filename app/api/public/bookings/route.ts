import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";
import User from "@/models/User";
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

export async function POST(req: Request) {
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

    // Upsert user — create if new email, update name/phone if returning guest
    const email = normalizeEmail(guestEmail);
    const name = normalizeName(guestName);
    const phone = guestPhone?.trim() || undefined;

    await User.findOneAndUpdate(
      { email },
      {
        $set: { name, ...(phone ? { phone } : {}) },
        $setOnInsert: { email, status: "active" },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Public booking create failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to create booking." },
      { status: 500 }
    );
  }
}
