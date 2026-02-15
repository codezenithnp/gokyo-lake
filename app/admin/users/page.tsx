"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

const statusOptions = ["all", "active", "blocked"] as const;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users?status=${filter}`);
      if (!res.ok) {
        setError("Failed to load users.");
        return;
      }
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to update user.");
        return;
      }
      setMessage(`User ${newStatus === "blocked" ? "blocked" : "activated"}.`);
      fetchUsers();
    } catch {
      setError("Unable to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setError("");
    setMessage("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to delete user.");
        return;
      }
      setMessage("User deleted.");
      fetchUsers();
    } catch {
      setError("Unable to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              {users.length} {users.length === 1 ? "user" : "users"}
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

        {/* Search */}
        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
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
            <p className="text-gray-500">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="py-3 text-gray-600">{u.email}</td>
                    <td className="py-3 text-gray-600">{u.phone || "\u2014"}</td>
                    <td className="py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                          u.status === "active"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(u)}
                        disabled={saving}
                        className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                          u.status === "active"
                            ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                            : "border-green-300 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {u.status === "active" ? "Block" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u._id)}
                        disabled={deletingId === u._id}
                        className="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        {deletingId === u._id ? "Deleting..." : "Delete"}
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
