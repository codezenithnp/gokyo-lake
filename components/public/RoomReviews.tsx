"use client";

import { useEffect, useState } from "react";

type PublicRoom = {
  _id: string;
  title: string;
};

type ReviewItem = {
  _id: string;
  userName: string;
  review: string;
  rating: number;
  roomId?: { _id: string; title?: string } | string;
  createdAt: string;
};

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-lg ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
        >
          <svg
            className={`h-5 w-5 ${star <= value ? "text-[#FFD700] fill-[#FFD700]" : "text-gray-300"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function RoomReviews() {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [roomsRes, reviewsRes] = await Promise.all([
          fetch("/api/public/rooms"),
          fetch("/api/reviews"),
        ]);
        if (roomsRes.ok) {
          const data = await roomsRes.json();
          setRooms(Array.isArray(data.rooms) ? data.rooms : []);
        }
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    setFormError("");
    setFormSuccess("");

    if (!userName.trim() || !userEmail.trim() || !reviewText.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (rating === 0) {
      setFormError("Please select a rating.");
      return;
    }
    if (!roomId) {
      setFormError("Please select a room.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userName.trim(),
          userEmail: userEmail.trim(),
          review: reviewText.trim(),
          rating,
          roomId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFormError(data?.error ?? "Unable to submit review.");
        return;
      }

      setFormSuccess("Thank you! Your review has been submitted and will appear once approved.");
      setUserName("");
      setUserEmail("");
      setReviewText("");
      setRating(0);
      setRoomId("");
      setShowForm(false);
    } catch {
      setFormError("Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getRoomTitle = (r: ReviewItem) => {
    if (r.roomId && typeof r.roomId === "object" && r.roomId.title) {
      return r.roomId.title;
    }
    return "Room";
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Approved Reviews */}
      {reviews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <StarRating value={r.rating} readonly />
                <span className="text-xs text-gray-400">
                  {formatDate(r.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{r.review}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{r.userName}</p>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                  {getRoomTitle(r)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No reviews yet. Be the first to share your experience!
        </p>
      )}

      {/* Submit Review */}
      <div className="text-center">
        {formSuccess && (
          <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
            {formSuccess}
          </p>
        )}

        {!showForm ? (
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setFormSuccess("");
            }}
            className="rounded-md bg-[color:var(--primary-blue)] px-6 py-2.5 text-white font-semibold hover:bg-[color:var(--secondary-blue)] transition"
          >
            Write a Review
          </button>
        ) : (
          <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your experience..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
                />
              </div>

              {formError && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-md bg-[color:var(--primary-blue)] px-5 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)] transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
