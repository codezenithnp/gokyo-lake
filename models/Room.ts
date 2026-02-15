import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const RoomSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    amenityIds: [{ type: Schema.Types.ObjectId, ref: "Amenity", default: [] }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type RoomDocument = InferSchemaType<typeof RoomSchema>;

export const Room: Model<RoomDocument> =
  mongoose.models.Room || mongoose.model<RoomDocument>("Room", RoomSchema);
