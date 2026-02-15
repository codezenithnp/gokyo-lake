import mongoose, { Schema, Document } from "mongoose";

export interface IGalleryImage extends Document {
  imageUrl: string;
  title: string;
  category: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema: Schema = new Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Rooms", "Restaurant", "Surroundings", "Hero", "Home", "About", "Blog"],
      default: "Rooms",
    },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
