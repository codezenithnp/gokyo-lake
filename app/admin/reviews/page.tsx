"use client";

import { useEffect, useState } from "react";

type Review = {
  _id: string;
  userName: string;
  userEmail?: string;
  review: string;
  rating?: number;
  roomId?: { _id: string; title?: string } | string;
  status: string;
  createdAt?: string;
};

const statusOptions = ["all", "pending", "approved", "rejected"] as const;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/reviews?status=${filter}`);
      if (!res.ok) {
        setError("Failed to load reviews.");
        return;
      }
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to update review.");
        return;
      }
      setMessage(`Review ${status}.`);
      fetchReviews();
    } catch {
      setError("Unable to update review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setError("");
    setMessage("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to delete review.");
        return;
      }
      setMessage("Review deleted.");
      fetchReviews();
    } catch {
      setError("Unable to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  const getRoomTitle = (r: Review) => {
    if (r.roomId && typeof r.roomId === "object" && r.roomId.title) {
      return r.roomId.title;
    }
    return null;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
            <p className="mt-1 text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              {pendingCount > 0 && (
                <span className="ml-2 inline-block rounded-full bg-yellow-100 px-2 py-px text-xs font-medium text-yellow-700">
                  {pendingCount} pending
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  filter === s
                    ? "bg-[#1e293b] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {message && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
        )}

        <div className="mt-6">
          {loading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">No reviews found.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <div key={r._id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{r.userName}</p>
                        {r.userEmail && (
                          <span className="text-xs text-gray-400">{r.userEmail}</span>
                        )}
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${statusBadge(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        {r.rating ? renderStars(r.rating) : null}
                        {getRoomTitle(r) && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {getRoomTitle(r)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{r.review}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {r.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(r._id, "approved")}
                          disabled={saving}
                          className="rounded-md border border-green-300 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-50"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(r._id, "rejected")}
                          disabled={saving}
                          className="rounded-md border border-orange-300 px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-50"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                        className="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        {deletingId === r._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
