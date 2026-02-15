import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const BookingSchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, trim: true },
    guestPhone: { type: String },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export type BookingDocument = InferSchemaType<typeof BookingSchema>;

export const Booking: Model<BookingDocument> =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>("Booking", BookingSchema);
