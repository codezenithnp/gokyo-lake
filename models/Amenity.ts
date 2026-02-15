import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const AmenitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameLower: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type AmenityDocument = InferSchemaType<typeof AmenitySchema>;

export const Amenity: Model<AmenityDocument> =
  mongoose.models.Amenity ||
  mongoose.model<AmenityDocument>("Amenity", AmenitySchema);
