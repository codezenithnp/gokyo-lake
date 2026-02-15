"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { isCloudinaryUrl } from "@/lib/image";

const CATEGORIES = ["Rooms", "Restaurant", "Surroundings", "Hero", "Home", "About", "Blog"] as const;

type GalleryImage = {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Rooms");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<string>("Rooms");
  const [editDescription, setEditDescription] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("0");

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) { setError("Failed to load gallery."); return; }
      const data = await res.json();
      setImages(data.images ?? []);
    } catch {
      setError("Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setIsUploading(true);
    setError("");
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          setError(d?.error ?? "Upload failed.");
          continue;
        }
        const d = await res.json();
        if (d?.url) setImageUrl(d.url);
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleCreate = async () => {
    setError(""); setMessage("");
    if (!title.trim() || !imageUrl.trim()) {
      setError("Title and image are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: imageUrl.trim(),
          category,
          description: description.trim(),
          sortOrder: Number(sortOrder) || 0,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.error ? JSON.stringify(d.error) : "Failed to create.");
        return;
      }
      setMessage("Image added!");
      setTitle(""); setImageUrl(""); setDescription(""); setSortOrder("0"); setCategory("Rooms");
      fetchImages();
    } catch {
      setError("Failed to create.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img._id);
    setEditTitle(img.title);
    setEditCategory(img.category);
    setEditDescription(img.description ?? "");
    setEditSortOrder(String(img.sortOrder));
  };

  const handleUpdate = async (id: string) => {
    setError(""); setMessage("");
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory,
          description: editDescription.trim(),
          sortOrder: Number(editSortOrder) || 0,
        }),
      });
      if (!res.ok) { setError("Update failed."); return; }
      setEditingId(null);
      setMessage("Updated!");
      fetchImages();
    } catch {
      setError("Update failed.");
    }
  };

  const handleToggleActive = async (img: GalleryImage) => {
    try {
      await fetch(`/api/admin/gallery/${img._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !img.isActive }),
      });
      fetchImages();
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Delete failed."); return; }
      setMessage("Deleted.");
      fetchImages();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filterCategory === "All"
    ? images
    : images.filter((i) => i.category === filterCategory);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>

      {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-4 py-2 text-red-700 text-sm">{error}</div>}
      {message && <div className="mb-4 rounded bg-green-50 border border-green-200 px-4 py-2 text-green-700 text-sm">{message}</div>}

      {/* Add new image */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-lg mb-4">Add Gallery Image</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Image title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Optional description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" min="0" />
          </div>
        </div>

        {/* Image upload / URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer inline-flex items-center gap-2 rounded bg-gray-100 border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-200">
              {isUploading ? "Uploading…" : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
            </label>
            <span className="text-xs text-gray-500">or paste URL below</span>
          </div>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-2" placeholder="https://..." />
          {imageUrl && (
            <div className="mt-2 relative w-40 h-28 rounded overflow-hidden border">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" unoptimized={isCloudinaryUrl(imageUrl)} />
            </div>
          )}
        </div>

        <button onClick={handleCreate} disabled={saving || isUploading} className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving…" : "Add Image"}
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1 rounded-full text-xs font-medium ${filterCategory === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Image list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img) => (
            <div key={img._id} className={`bg-white rounded-lg border shadow-sm overflow-hidden ${!img.isActive ? "opacity-60" : ""}`}>
              <div className="relative w-full h-44">
                <Image src={img.imageUrl} alt={img.title} fill className="object-cover" unoptimized={isCloudinaryUrl(img.imageUrl)} />
              </div>

              {editingId === img._id ? (
                <div className="p-3 space-y-2">
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Description" />
                  <input type="number" value={editSortOrder} onChange={(e) => setEditSortOrder(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" min="0" />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(img._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">{img.title}</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{img.category}</span>
                  </div>
                  {img.description && <p className="text-xs text-gray-500 mb-2 truncate">{img.description}</p>}
                  <div className="flex items-center gap-2 text-xs">
                    <button onClick={() => startEdit(img)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleToggleActive(img)} className={img.isActive ? "text-yellow-600 hover:underline" : "text-green-600 hover:underline"}>
                      {img.isActive ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => handleDelete(img._id)} disabled={deletingId === img._id} className="text-red-600 hover:underline">
                      {deletingId === img._id ? "…" : "Delete"}
                    </button>
                    <span className="ml-auto text-gray-400">#{img.sortOrder}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
