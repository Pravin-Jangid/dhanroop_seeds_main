"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/app/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
  User,
  Star,
  Search,
  Filter,
  MoreVertical,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  imageUrl: string;
  status: "active" | "hidden";
  rating?: number;
  createdAt: any;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
    image: null as File | null,
    preview: null as string | null,
  });

  /* ---------------- FETCH ---------------- */
  const loadData = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "testimonials"));
      const testimonialData = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Testimonial[];
      
      // Sort by newest first
      testimonialData.sort((a, b) => 
        b.createdAt?.toDate() - a.createdAt?.toDate()
      );
      
      setTestimonials(testimonialData);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- FILTERED DATA ---------------- */
  const filteredTestimonials = testimonials.filter(t => 
    searchQuery === "" ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- MODAL HANDLERS ---------------- */
  const openAddModal = () => {
    setFormData({
      name: "",
      role: "",
      message: "",
      rating: 5,
      image: null,
      preview: null,
    });
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
      rating: testimonial.rating || 5,
      image: null,
      preview: testimonial.imageUrl,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openViewModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTestimonial(null);
  };

  /* ---------------- FORM HANDLER ---------------- */
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.message.trim()) {
      alert("Name and message are required");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = formData.preview || "";

      // Upload new image if selected
      if (formData.image) {
        const imgRef = ref(storage, `testimonials/${Date.now()}-${formData.image.name}`);
        await uploadBytes(imgRef, formData.image);
        imageUrl = await getDownloadURL(imgRef);
      }

      const testimonialData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        message: formData.message.trim(),
        rating: formData.rating,
        imageUrl,
        updatedAt: serverTimestamp(),
        ...(modalMode === "add" && {
          status: "active",
          createdAt: serverTimestamp(),
        }),
      };

      if (modalMode === "edit" && selectedTestimonial) {
        await updateDoc(doc(db, "testimonials", selectedTestimonial.id), testimonialData);
      } else {
        await addDoc(collection(db, "testimonials"), testimonialData);
      }

      closeModal();
      loadData();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, "testimonials", id));
      loadData();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOGGLE STATUS ---------------- */
  const toggleStatus = async (testimonial: Testimonial) => {
    try {
      setLoading(true);
      const newStatus = testimonial.status === "active" ? "hidden" : "active";
      await updateDoc(doc(db, "testimonials", testimonial.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER STARS ---------------- */
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={`mr-0.5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  /* ---------------- FORMAT DATE ---------------- */
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-sm text-gray-600 mt-1">
              {testimonials.length} total • {testimonials.filter(t => t.status === "active").length} active
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <User size={16} />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 uppercase tracking-wider">
          <div className="col-span-3">Person</div>
          <div className="col-span-4">Message</div>
          <div className="col-span-2">Details</div>
          <div className="col-span-1">Rating</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Loading State */}
        {loading && testimonials.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2 text-sm">Loading testimonials...</p>
          </div>
        ) : filteredTestimonials.length > 0 ? (
          /* Table Body */
          <div className="divide-y divide-gray-100">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
              >
                {/* Person Info */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={testimonial.imageUrl || "/placeholder-avatar.png"}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        testimonial.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="col-span-4">
                  <div 
                    className="flex items-start gap-2 cursor-pointer group"
                    onClick={() => openViewModal(testimonial)}
                  >
                    <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {testimonial.message}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="col-span-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(testimonial.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {testimonial.status === "active" ? (
                        <>
                          <CheckCircle size={12} className="text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">Hidden</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="col-span-1">
                  {renderStars(testimonial.rating || 5)}
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center justify-end gap-2">
                   
                    
                    <button
                      onClick={() => openEditModal(testimonial)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              {searchQuery ? "Try adjusting your search query" : "Get started by adding your first testimonial"}
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <User size={16} />
              Add Testimonial
            </button>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing <span className="font-medium">{filteredTestimonials.length}</span> of{" "}
          <span className="font-medium">{testimonials.length}</span> testimonials
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Active: {testimonials.filter(t => t.status === "active").length}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            Hidden: {testimonials.filter(t => t.status === "hidden").length}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            modalMode === "view" ? "max-w-lg" : ""
          }`}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalMode === "add" && "Add Testimonial"}
                  {modalMode === "edit" && "Edit Testimonial"}
                  {modalMode === "view" && "View Testimonial"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {modalMode === "view" ? "Full testimonial details" : "Fill in the testimonial details"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalMode === "view" && selectedTestimonial ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedTestimonial.imageUrl || "/placeholder-avatar.png"}
                      alt={selectedTestimonial.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedTestimonial.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTestimonial.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(selectedTestimonial.rating || 5)}
                        <span className="text-xs text-gray-500">
                          {selectedTestimonial.rating || 5}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedTestimonial.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {selectedTestimonial.status === "active" ? (
                          <>
                            <CheckCircle size={12} />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            Hidden
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Added On</p>
                      <p className="text-sm font-medium">
                        {formatDate(selectedTestimonial.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Testimonial</p>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedTestimonial.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role / Position
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleFormChange("role", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Farmer / Customer"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleFormChange("rating", star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={20}
                            className={star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={formData.preview || "/placeholder-avatar.png"}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover border border-gray-200"
                        />
                        <label className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                          <Upload size={12} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFormChange("image", file);
                                handleFormChange("preview", URL.createObjectURL(file));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Click the camera icon to upload a new photo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleFormChange("message", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                      placeholder="Share your experience..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.message.length}/500 characters
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {modalMode === "view" ? (
                  <>
                    <button
                      onClick={() => selectedTestimonial && openEditModal(selectedTestimonial)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => selectedTestimonial && toggleStatus(selectedTestimonial)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          selectedTestimonial?.status === "active"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {selectedTestimonial?.status === "active" ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading || !formData.name.trim() || !formData.message.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {loading ? "Saving..." : modalMode === "add" ? "Add Testimonial" : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}