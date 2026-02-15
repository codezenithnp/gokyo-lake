import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { getAdminFromRequest } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "CANCELED" },
      { new: true }
    ).lean();

    if (!booking) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    console.error("Admin booking cancel failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to cancel booking." },
      { status: 500 }
    );
  }
}
