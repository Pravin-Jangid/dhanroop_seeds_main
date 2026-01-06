"use client";

import { db, storage } from "@/app/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

interface GalleryItem {
  id: string;
  name: string;
  alt: string;
  imageUrl: string;
  createdAt?: any;
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    alt: "",
    image: null as File | null,
    preview: null as string | null,
  });

  // Load gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "gallery"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryItem[];

      // Sort by newest first
      items.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

      setGalleryItems(items);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Open modal for adding new item
  const openAddModal = () => {
    setFormData({ name: "", alt: "", image: null, preview: null });
    setEditingItem(null);
    setShowModal(true);
  };

  // Open modal for editing existing item
  const openEditModal = (item: GalleryItem) => {
    setFormData({
      name: item.name,
      alt: item.alt,
      image: null,
      preview: item.imageUrl,
    });
    setEditingItem(item);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: "", alt: "", image: null, preview: null });
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  // Save gallery item (add or update)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.alt.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (!editingItem && !formData.image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = formData.preview;

      // Upload new image if selected
      if (formData.image) {
        const storageRef = ref(
          storage,
          `gallery/${Date.now()}-${formData.image.name}`
        );
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const galleryData = {
        name: formData.name.trim(),
        alt: formData.alt.trim(),
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, "gallery", editingItem.id), galleryData);
      } else {
        // Add new item
        await addDoc(collection(db, "gallery"), {
          ...galleryData,
          createdAt: serverTimestamp(),
        });
      }

      closeModal();
      fetchGalleryItems();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image");
    } finally {
      setLoading(false);
    }
  };

  // Delete gallery item
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      setLoading(true);

      // Delete from Firestore
      await deleteDoc(doc(db, "gallery", id));

      // Try to delete from Storage if it's a Firebase URL
      if (imageUrl.includes("firebasestorage.googleapis.com")) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn("Could not delete from storage:", error);
        }
      }

      fetchGalleryItems();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
              <p className="text-gray-600 text-sm mt-1">
                {galleryItems.length} image
                {galleryItems.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload size={18} />
              Add Image
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {loading && galleryItems.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading gallery...</p>
                </div>
              </div>
            ) : galleryItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p
                        className="font-medium text-sm text-gray-900 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-xs text-gray-600 truncate"
                        title={item.alt}
                      >
                        {item.alt}
                      </p>

                      {/* Actions */}
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.imageUrl)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div className="h-full flex items-center justify-center">
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No images yet
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Upload your first image to get started
                  </p>
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Upload size={18} />
                    Upload Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
            {/* ================= HEADER ================= */}
            <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-base font-semibold text-gray-900">
                {editingItem ? "Edit Image" : "Add Image"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* ================= SCROLLABLE CONTENT ================= */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Image Upload / Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {formData.preview ? (
                    <img
                      src={formData.preview}
                      alt="Preview"
                      className="w-40 h-40 object-contain mx-auto rounded-md"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-9 h-9 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-700 font-medium">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Image Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter image name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Alt Text
                </label>
                <textarea
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  placeholder="Describe the image for accessibility"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Used for accessibility & SEO
                </p>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={closeModal}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  loading || !formData.name.trim() || !formData.alt.trim()
                }
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? "Saving..."
                  : editingItem
                  ? "Save Changes"
                  : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
