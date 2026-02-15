import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userName: string;
  userEmail: string;
  review: string;
  rating: number;
  roomId: mongoose.Types.ObjectId;
  status: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
