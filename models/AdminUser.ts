import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

export type AdminUserDocument = InferSchemaType<typeof AdminUserSchema>;

export const AdminUser: Model<AdminUserDocument> =
  mongoose.models.AdminUser ||
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);
