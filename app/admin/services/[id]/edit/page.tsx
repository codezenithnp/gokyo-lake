"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

type Service = {
  _id: string;
  name: string;
  price?: number;
  description?: string;
  isActive: boolean;
};

const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) {
      setError("Service not found.");
      setLoading(false);
      return;
    }

    const loadService = async () => {
      try {
        const response = await fetch("/api/admin/services?includeInactive=1");
        if (!response.ok) {
          setError("Unable to load service.");
          return;
        }
        const data = await response.json();
        const list: Service[] = data.services ?? [];
        const service = list.find((item) => item._id === serviceId);
        if (!service) {
          setError("Service not found.");
          return;
        }
        setForm({
          name: service.name,
          price: typeof service.price === "number" ? String(service.price) : "",
          description: service.description ?? "",
          isActive: service.isActive ?? true,
        });
      } catch {
        setError("Unable to load service.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!serviceId) return;

    const trimmed = normalizeName(form.name);
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    const parsedPrice = form.price.trim() ? Number(form.price) : undefined;
    if (typeof parsedPrice === "number" && Number.isNaN(parsedPrice)) {
      setError("Price must be a number.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          price: parsedPrice,
          description: form.description.trim() || undefined,
          isActive: form.isActive,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Unable to update service.");
        return;
      }
      router.push("/admin/services");
    } catch {
      setError("Unable to update service.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/admin/services")}
            className="mt-4 lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Service</h1>
          <button
            type="button"
            onClick={() => router.push("/admin/services")}
            className="lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Back to Services
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
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
              />
            </div>
            <div className="flex items-center gap-2 pt-6 text-sm font-medium text-gray-700">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="lux-btn rounded-md bg-[color:var(--primary-blue)] px-5 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/services")}
              className="lux-btn rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
