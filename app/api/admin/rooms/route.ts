import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { Room } from "@/models/Room";
import "@/models/Amenity";
import { optimizeImageUrls } from "@/lib/image";

const createRoomSchema = z.object({
  title: z.string().min(2),
  price: z.coerce.number().min(0),
  capacity: z.coerce.number().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  amenityIds: z.array(z.string()).optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find()
      .sort({ createdAt: -1 })
      .populate("amenityIds", "name isActive")
      .lean();
    return NextResponse.json({ ok: true, rooms });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createRoomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.amenityIds) {
      const invalidId = parsed.data.amenityIds.find(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );
      if (invalidId) {
        return NextResponse.json(
          { ok: false, error: "Invalid amenity id." },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const data = {
      ...parsed.data,
      images: parsed.data.images ? optimizeImageUrls(parsed.data.images) : undefined,
    };
    const room = await Room.create(data);
    return NextResponse.json({ ok: true, room }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
