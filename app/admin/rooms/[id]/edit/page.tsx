"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

type Amenity = {
  _id: string;
  name: string;
  isActive?: boolean;
};

type RoomResponse = {
  _id: string;
  title: string;
  price: number;
  capacity: number;
  description?: string;
  images?: string[];
  amenityIds?: Amenity[] | string[];
  isActive: boolean;
};

const EditRoomPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState({
    title: "",
    price: "",
    capacity: "",
    description: "",
    images: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [amenityQuery, setAmenityQuery] = useState("");
  const [amenityMessage, setAmenityMessage] = useState("");
  const [amenityError, setAmenityError] = useState("");
  const [amenitySaving, setAmenitySaving] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setError("Room not found.");
      setLoading(false);
      return;
    }

    const loadRoom = async () => {
      try {
        const response = await fetch(`/api/admin/rooms/${roomId}`);
        if (!response.ok) {
          setError("Unable to load room.");
          return;
        }
        const data = await response.json();
        const room: RoomResponse | undefined = data.room;
        if (!room) {
          setError("Room not found.");
          return;
        }
        setForm({
          title: room.title ?? "",
          price: room.price?.toString() ?? "",
          capacity: room.capacity?.toString() ?? "",
          description: room.description ?? "",
          images: room.images?.join("\n") ?? "",
          isActive: room.isActive ?? true,
        });

        const ids = Array.isArray(room.amenityIds)
          ? room.amenityIds.map((item) =>
              typeof item === "string" ? item : item._id
            )
          : [];
        setAmenityIds(ids);
      } catch {
        setError("Unable to load room.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const response = await fetch("/api/admin/amenities");
        if (!response.ok) return;
        const data = await response.json();
        setAmenities(data.amenities ?? []);
      } catch {
        setAmenities([]);
      }
    };

    loadAmenities();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadError("");
    setIsUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/admin/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          setUploadError(data?.error ?? "Image upload failed.");
          continue;
        }

        const data = await response.json();
        if (data?.url) {
          setForm((prev) => ({
            ...prev,
            images: prev.images
              ? `${prev.images}\n${data.url}`
              : String(data.url),
          }));
        }
      }
    } catch {
      setUploadError("Image upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const capacity = Number(form.capacity);
    if (!form.title.trim() || Number.isNaN(price) || Number.isNaN(capacity)) {
      setError("Please provide a title, price, and capacity.");
      return;
    }

    const images = form.images
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          price,
          capacity,
          description: form.description.trim() || undefined,
          images: images.length ? images : undefined,
          isActive: form.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ? "Failed to update room." : "Failed to update room.");
        return;
      }

      router.push("/admin/rooms");
    } catch {
      setError("Failed to update room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmenityToggle = (id: string) => {
    setAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const saveAmenities = async () => {
    if (!roomId) return;
    setAmenityMessage("");
    setAmenityError("");
    setAmenitySaving(true);
    try {
      const response = await fetch(`/api/admin/rooms/${roomId}/amenities`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amenityIds }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setAmenityError(data?.error ?? "Unable to save amenities.");
        return;
      }
      setAmenityMessage("Amenities updated.");
    } catch {
      setAmenityError("Unable to save amenities.");
    } finally {
      setAmenitySaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/admin/rooms")}
            className="mt-4 lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Room</h1>
          <button
            type="button"
            onClick={() => router.push("/admin/rooms")}
            className="lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Back to Rooms
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Capacity</label>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Images (one URL per line)
            </label>
            <textarea
              name="images"
              value={form.images}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="mt-2 w-full rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600"
              />
              {isUploading ? (
                <p className="mt-2 text-xs text-gray-500">Uploading...</p>
              ) : null}
              {uploadError ? (
                <p className="mt-2 text-xs text-red-600">{uploadError}</p>
              ) : null}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Amenities
                </h3>
                <p className="text-xs text-gray-600">
                  Attach amenities to this room.
                </p>
              </div>
              <button
                type="button"
                onClick={saveAmenities}
                className="lux-btn rounded-md border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700"
                disabled={amenitySaving}
              >
                {amenitySaving ? "Saving..." : "Save amenities"}
              </button>
            </div>

            <input
              value={amenityQuery}
              onChange={(event) => setAmenityQuery(event.target.value)}
              placeholder="Search amenities"
              className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {amenities
                .filter((amenity) =>
                  amenity.name
                    .toLowerCase()
                    .includes(amenityQuery.toLowerCase())
                )
                .map((amenity) => (
                  <label
                    key={amenity._id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={amenityIds.includes(amenity._id)}
                      onChange={() => handleAmenityToggle(amenity._id)}
                    />
                    {amenity.name}
                  </label>
                ))}
            </div>

            {amenityError ? (
              <p className="mt-2 text-xs text-red-600">{amenityError}</p>
            ) : null}
            {amenityMessage ? (
              <p className="mt-2 text-xs text-green-600">{amenityMessage}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="lux-btn rounded-md bg-[color:var(--primary-blue)] px-5 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)]"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/rooms")}
              className="lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomPage;
