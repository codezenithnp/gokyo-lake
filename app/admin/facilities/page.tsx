"use client";

import { useEffect, useState } from "react";

type Facility = {
  _id: string;
  name: string;
  description: string;
};

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchFacilities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/facilities");
      if (!res.ok) {
        setError("Failed to load facilities.");
        return;
      }
      const data = await res.json();
      setFacilities(data.facilities ?? []);
    } catch {
      setError("Failed to load facilities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleCreate = async () => {
    setError("");
    setMessage("");
    if (name.trim().length < 2 || description.trim().length < 2) {
      setError("Name and description must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to create facility.");
        return;
      }
      setName("");
      setDescription("");
      setMessage("Facility created.");
      fetchFacilities();
    } catch {
      setError("Unable to create facility.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (f: Facility) => {
    setEditingId(f._id);
    setEditName(f.name);
    setEditDesc(f.description);
    setError("");
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setError("");
    setMessage("");
    if (editName.trim().length < 2 || editDesc.trim().length < 2) {
      setError("Name and description must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/facilities/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to update facility.");
        return;
      }
      setMessage("Facility updated.");
      cancelEdit();
      fetchFacilities();
    } catch {
      setError("Unable to update facility.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) return;
    setError("");
    setMessage("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/facilities/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to delete facility.");
        return;
      }
      setMessage("Facility deleted.");
      fetchFacilities();
    } catch {
      setError("Unable to delete facility.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Facilities</h1>
            <p className="mt-1 text-sm text-gray-500">
              {facilities.length} {facilities.length === 1 ? "facility" : "facilities"}
            </p>
          </div>
        </div>

        {/* Create Form */}
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Facility name"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="rounded-md bg-[#1e293b] px-5 py-2 text-white font-semibold hover:bg-[#334155] transition"
          >
            {saving ? "Saving..." : "Add Facility"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {message && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
        )}

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-gray-500">Loading facilities...</p>
          ) : facilities.length === 0 ? (
            <p className="text-gray-500">No facilities yet. Add one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Name</th>
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => (
                  <tr key={f._id} className="border-b">
                    <td className="py-3">
                      {editingId === f._id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{f.name}</span>
                      )}
                    </td>
                    <td className="py-3">
                      {editingId === f._id ? (
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="text-gray-600">{f.description}</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      {editingId === f._id ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={saving}
                            className="rounded-md border border-green-300 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(f)}
                            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(f._id)}
                            disabled={deletingId === f._id}
                            className="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            {deletingId === f._id ? "Deleting..." : "Delete"}
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
