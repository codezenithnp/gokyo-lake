import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import "@/models/Room";
import mongoose from "mongoose";

const createReviewSchema = z.object({
  userName: z.string().min(2).max(100),
  userEmail: z.string().email(),
  review: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5),
  roomId: z.string(),
});

/* GET – fetch approved reviews (optionally filtered by roomId) */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");

    await connectDB();
    const query: Record<string, unknown> = { status: "approved" };
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      query.roomId = roomId;
    }

    const reviews = await Review.find(query)
      .populate("roomId", "title")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, reviews });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/* POST – submit a new review (public, goes to pending) */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userName, userEmail, review, rating, roomId } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid room." },
        { status: 400 }
      );
    }

    await connectDB();
    const newReview = await Review.create({
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      review: review.trim(),
      rating,
      roomId,
      status: "pending",
    });

    return NextResponse.json(
      { ok: true, review: newReview },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
