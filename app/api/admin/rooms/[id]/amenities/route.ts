import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Room } from "@/models/Room";
import { Amenity } from "@/models/Amenity";
import { getAdminFromRequest } from "@/lib/auth";

const updateAmenitiesSchema = z.object({
  amenityIds: z.array(z.string().min(1)),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id: roomId } = await params;
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateAmenitiesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const invalidId = parsed.data.amenityIds.find(
      (aid) => !mongoose.Types.ObjectId.isValid(aid)
    );
    if (invalidId) {
      return NextResponse.json(
        { ok: false, error: "Invalid amenity id." },
        { status: 400 }
      );
    }

    await connectDB();
    const room = await Room.findByIdAndUpdate(
      roomId,
      { amenityIds: parsed.data.amenityIds },
      { new: true }
    )
      .populate("amenityIds", "name isActive")
      .lean();

    if (!room) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, room });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
