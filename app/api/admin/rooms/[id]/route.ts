import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Room } from "@/models/Room";
import "@/models/Amenity";
import { optimizeImageUrls } from "@/lib/image";

const updateRoomSchema = z.object({
  title: z.string().min(2).optional(),
  price: z.coerce.number().min(0).optional(),
  capacity: z.coerce.number().min(1).optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.coerce.boolean().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await connectDB();
    const room = await Room.findById(id)
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

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateRoomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const data = {
      ...parsed.data,
      images: parsed.data.images ? optimizeImageUrls(parsed.data.images) : undefined,
    };
    const room = await Room.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();

    if (!room) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, room });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await connectDB();
    const room = await Room.findByIdAndDelete(id).lean();

    if (!room) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
