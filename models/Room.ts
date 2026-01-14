import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomType: string;
  guestNo: number;
  checkInDate: Date;
  status: string;
  price: number;
}

const RoomSchema: Schema = new Schema({
  roomType: { type: String, required: true },
  guestNo: { type: Number, required: true },
  checkInDate: { type: Date, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
