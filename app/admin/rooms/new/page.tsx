"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const NewRoomPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    capacity: "",
    description: "",
    images: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [amenities, setAmenities] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [amenityQuery, setAmenityQuery] = useState("");

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

  const handleAmenityToggle = (id: string) => {
    setAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

        const response = await fetch("/api/admin/upload", {
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
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          price,
          capacity,
          description: form.description.trim() || undefined,
          images: images.length ? images : undefined,
          amenityIds: amenityIds.length ? amenityIds : undefined,
          isActive: form.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ? "Failed to create room." : "Failed to create room.");
        return;
      }

      router.push("/admin/rooms");
    } catch {
      setError("Failed to create room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Add Room</h1>
          <button
            type="button"
            onClick={() => router.push("/admin/rooms")}
            className="lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Back to Rooms
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Deluxe Lake View"
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
              placeholder={"https://example.com/room.jpg\nhttps://example.com/view.jpg"}
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
                  Select amenities available for this room.
                </p>
              </div>
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
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="lux-btn rounded-md bg-[color:var(--primary-blue)] px-5 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)]"
            >
              {isSubmitting ? "Saving..." : "Save Room"}
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

export default NewRoomPage;
