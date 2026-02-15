import mongoose from "mongoose";

export const buildOverlapQuery = (checkIn: Date, checkOut: Date) => ({
  checkIn: { $lt: checkOut },
  checkOut: { $gt: checkIn },
  status: "CONFIRMED",
});

export const isValidObjectId = (value: string) =>
  mongoose.Types.ObjectId.isValid(value);

export const parseDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
