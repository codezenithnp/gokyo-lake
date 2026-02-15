import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameLower: { type: String, required: true, unique: true, trim: true },
    price: { type: Number },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ServiceDocument = InferSchemaType<typeof ServiceSchema>;

export const Service: Model<ServiceDocument> =
  mongoose.models.Service ||
  mongoose.model<ServiceDocument>("Service", ServiceSchema);
