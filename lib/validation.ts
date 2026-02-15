import { z } from "zod";

export const bookingPayloadSchema = z.object({
  roomId: z.string().min(1),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

export const normalizeName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const normalizeEmail = (value: string) =>
  value.trim().toLowerCase();
