import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userName: string;
  review: string;
  status: string;
}

const ReviewSchema: Schema = new Schema({
  userName: { type: String, required: true },
  review: { type: String, required: true },
  status: { type: String, default: 'pending' },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
