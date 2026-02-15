import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }

  try {
    await connectDB();
    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const room = await Room.findById(booking.roomId).select("title").lean();

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking._id,
        roomTitle: room?.title ?? "Room",
        guestName: booking.guestName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Public booking read failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load booking." },
      { status: 500 }
    );
  }
}
