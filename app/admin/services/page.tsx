"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  _id: string;
  name: string;
  price?: number;
  description?: string;
  isActive: boolean;
};

const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/services?includeInactive=${includeInactive ? "1" : "0"}`
      );
      if (!res.ok) {
        setError("Failed to load services.");
        return;
      }
      const data = await res.json();
      setServices(data.services ?? []);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [includeInactive]);

  const handleCreate = async () => {
    setMessage("");
    setError("");
    const trimmed = normalizeName(name);
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    const parsedPrice = price.trim() ? Number(price) : undefined;
    if (typeof parsedPrice === "number" && Number.isNaN(parsedPrice)) {
      setError("Price must be a number.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          price: parsedPrice,
          description: description.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to create service.");
        return;
      }
      setName("");
      setPrice("");
      setDescription("");
      setMessage("Service created.");
      fetchServices();
    } catch {
      setError("Unable to create service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (serviceId: string) => {
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to deactivate service.");
        return;
      }
      setMessage("Service deactivated.");
      fetchServices();
    } catch {
      setError("Unable to deactivate service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage hotel service offerings.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(event) => setIncludeInactive(event.target.checked)}
            />
            Show inactive
          </label>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Service name (Laundry)"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Price (optional)"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="lux-btn rounded-md bg-[color:var(--primary-blue)] px-5 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)]"
          >
            {saving ? "Saving..." : "Add Service"}
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-gray-600">Loading services...</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Name</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Active</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id} className="border-b">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">
                        {service.name}
                      </div>
                      {service.description ? (
                        <div className="text-xs text-gray-500">
                          {service.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-3">
                      {typeof service.price === "number"
                        ? `Rs. ${service.price}`
                        : "—"}
                    </td>
                    <td className="py-3">
                      {service.isActive ? "Yes" : "No"}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/admin/services/${service._id}/edit`)
                        }
                        className="lux-btn rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeactivate(service._id)}
                        className="lux-btn rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
