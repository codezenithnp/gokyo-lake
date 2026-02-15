import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Room } from "@/models/Room";
import "@/models/Amenity";

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({ isActive: true })
      .sort({ createdAt: -1 })
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
