import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";
import { getAdminFromRequest } from "@/lib/auth";

/**
 * GET /api/admin/calendar?month=2026-02
 * Returns all rooms and confirmed bookings that overlap with the given month.
 */
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const month = url.searchParams.get("month"); // e.g. "2026-02"

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { ok: false, error: "Provide ?month=YYYY-MM" },
        { status: 400 }
      );
    }

    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const mon = Number(monthStr) - 1; // 0-indexed

    // Range: first day of month → first day of next month
    const rangeStart = new Date(Date.UTC(year, mon, 1));
    const rangeEnd = new Date(Date.UTC(year, mon + 1, 1));

    await connectDB();

    const [rooms, bookings] = await Promise.all([
      Room.find({ isActive: true }).select("title").sort({ title: 1 }).lean(),
      Booking.find({
        status: "CONFIRMED",
        checkIn: { $lt: rangeEnd },
        checkOut: { $gt: rangeStart },
      })
        .populate("roomId", "title")
        .sort({ checkIn: 1 })
        .lean(),
    ]);

    return NextResponse.json({ ok: true, rooms, bookings, rangeStart, rangeEnd });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
