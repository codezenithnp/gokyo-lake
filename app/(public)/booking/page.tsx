"use client";

import { Suspense } from "react";
import BookingForm from "./BookingForm";

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}