"use client";

import { useEffect, useMemo, useState } from "react";

type Amenity = {
  _id: string;
  name: string;
  isActive: boolean;
};

const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAmenities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/amenities?includeInactive=${includeInactive ? "1" : "0"}`
      );
      if (!res.ok) {
        setError("Failed to load amenities.");
        return;
      }
      const data = await res.json();
      setAmenities(data.amenities ?? []);
    } catch {
      setError("Failed to load amenities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [includeInactive]);

  const activeCount = useMemo(
    () => amenities.filter((amenity) => amenity.isActive).length,
    [amenities]
  );

  const handleCreate = async () => {
    setMessage("");
    setError("");
    const trimmed = normalizeName(name);
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to create amenity.");
        return;
      }
      setName("");
      setMessage("Amenity created.");
      fetchAmenities();
    } catch {
      setError("Unable to create amenity.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (amenity: Amenity) => {
    setEditingId(amenity._id);
    setEditingName(amenity.name);
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setMessage("");
    setError("");
    const trimmed = normalizeName(editingName);
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/amenities/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to update amenity.");
        return;
      }
      setMessage("Amenity updated.");
      setEditingId(null);
      setEditingName("");
      fetchAmenities();
    } catch {
      setError("Unable to update amenity.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (amenity: Amenity) => {
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/amenities/${amenity._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !amenity.isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to update amenity.");
        return;
      }
      setMessage(amenity.isActive ? "Amenity deactivated." : "Amenity reactivated.");
      fetchAmenities();
    } catch {
      setError("Unable to update amenity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (amenity: Amenity) => {
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/amenities/${amenity._id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Unable to delete amenity.");
        return;
      }
      if (data?.message) {
        setMessage(data.message);
      } else {
        setMessage("Amenity deleted.");
      }
      fetchAmenities();
    } catch {
      setError("Unable to delete amenity.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-lg lux-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Amenities</h1>
            <p className="mt-1 text-sm text-gray-600">
              {activeCount} active amenities
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

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Add new amenity (WiFi, Parking, AC...)"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="lux-btn rounded-md bg-[color:var(--primary-blue)] px-5 py-2 text-white font-semibold hover:bg-[color:var(--secondary-blue)]"
          >
            {saving ? "Saving..." : "Add Amenity"}
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
            <p className="text-gray-600">Loading amenities...</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Name</th>
                  <th className="py-2">Active</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {amenities.map((amenity) => (
                  <tr key={amenity._id} className="border-b">
                    <td className="py-3">
                      {editingId === amenity._id ? (
                        <input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        amenity.name
                      )}
                    </td>
                    <td className="py-3">
                      {amenity.isActive ? "Yes" : "No"}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      {editingId === amenity._id ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="lux-btn rounded-md border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="lux-btn rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(amenity)}
                            className="lux-btn rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleActive(amenity)}
                            className="lux-btn rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
                          >
                            {amenity.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(amenity)}
                            className="lux-btn rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
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
