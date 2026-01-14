import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  description: string;
}

const FacilitySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);
