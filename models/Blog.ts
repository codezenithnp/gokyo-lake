import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    author: { type: String, default: "Admin", trim: true },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1, createdAt: -1 });

export type BlogDocument = InferSchemaType<typeof BlogSchema>;

export const Blog: Model<BlogDocument> =
  mongoose.models.Blog || mongoose.model<BlogDocument>("Blog", BlogSchema);
