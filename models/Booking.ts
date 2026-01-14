import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  guestName: string;
  roomType: string;
  checkInDate: Date;
  status: string;
}

const BookingSchema: Schema = new Schema({
  guestName: { type: String, required: true },
  roomType: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  status: { type: String, required: true },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
