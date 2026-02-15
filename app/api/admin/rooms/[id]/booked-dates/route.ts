import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { getAdminFromRequest } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid room id." }, { status: 400 });
  }

  try {
    await connectDB();
    const bookings = await Booking.find({
      roomId: id,
      status: "CONFIRMED",
    })
      .select("checkIn checkOut -_id")
      .sort({ checkIn: 1 })
      .lean();

    return NextResponse.json({ ok: true, dates: bookings });
  } catch (error) {
    console.error("Booked dates lookup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load booked dates." },
      { status: 500 }
    );
  }
}
