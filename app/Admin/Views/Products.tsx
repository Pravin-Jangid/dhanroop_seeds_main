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
import { Package, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductItem {
  id: string;
  name: string;
  title: string;
  category: string;
  Beej: string;
  jamin: string;
  mausam: string;
  nursery: string;
  ropai: string;
  pani: string;
  imageUrl: string;
  createdAt?: any;
}

interface Category {
  id: string;
  name: string;
  order: number;
  productCount: number;
}

export default function Products() {
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    category: "All",
    Beej: "",
    jamin: "",
    mausam: "",
    nursery: "",
    ropai: "",
    pani: "",
    image: null as File | null,
    preview: null as string | null,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });

  // Load product items
  const fetchProductItems = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductItem[];

      // Sort by newest first
      items.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

      setProductItems(items);
      updateCategoryCounts(items);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const categoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      // Sort by order
      categoryList.sort((a, b) => a.order - b.order);
      setCategories(categoryList);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Update category counts
  const updateCategoryCounts = (products: ProductItem[]) => {
    const categoryMap = new Map<string, number>();

    // Initialize with "All" category
    categoryMap.set("All", products.length);

    // Count products per category
    products.forEach((product) => {
      if (product.category && product.category !== "All") {
        categoryMap.set(
          product.category,
          (categoryMap.get(product.category) || 0) + 1
        );
      }
    });

    // Update categories with counts
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        productCount: categoryMap.get(cat.name) || 0,
      }))
    );
  };

  useEffect(() => {
    fetchProductItems();
    fetchCategories();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(productItems);
    } else {
      setFilteredProducts(
        productItems.filter((item) => item.category === selectedCategory)
      );
    }
  }, [selectedCategory, productItems]);

  // Open modal for adding new item
  const openAddModal = () => {
    setFormData({
      name: "",
      title: "",
      category: categories.length > 0 ? categories[0].name : "All",
      Beej: "",
      jamin: "",
      mausam: "",
      nursery: "",
      ropai: "",
      pani: "",
      image: null,
      preview: null,
    });
    setEditingItem(null);
    setShowModal(true);
  };

  // Open modal for editing existing item
  const openEditModal = (item: ProductItem) => {
    setFormData({
      name: item.name,
      title: item.title,
      category: item.category,
      Beej: item.Beej,
      jamin: item.jamin,
      mausam: item.mausam,
      nursery: item.nursery,
      ropai: item.ropai,
      pani: item.pani,
      image: null,
      preview: item.imageUrl,
    });
    setEditingItem(item);
    setShowModal(true);
  };

  // Open category modal
  const openCategoryModal = () => {
    setCategoryForm({ name: "" });
    setShowCategoryModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: "",
      title: "",
      category: "All",
      Beej: "",
      jamin: "",
      mausam: "",
      nursery: "",
      ropai: "",
      pani: "",
      image: null,
      preview: null,
    });
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryForm({ name: "" });
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryForm({ name: e.target.value });
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

  // Save category
  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      // Check if category already exists
      if (
        categories.some(
          (cat) =>
            cat.name.toLowerCase() === categoryForm.name.trim().toLowerCase()
        )
      ) {
        alert("Category already exists");
        return;
      }

      const categoryData = {
        name: categoryForm.name.trim(),
        order: categories.length,
        productCount: 0,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "categories"), categoryData);

      closeCategoryModal();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  // Delete category
  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    // Check if any products use this category
    const productsUsingCategory = productItems.filter(
      (product) => product.category === categoryName
    );

    if (productsUsingCategory.length > 0) {
      alert(
        `Cannot delete category "${categoryName}" because ${productsUsingCategory.length} product(s) are using it. Please reassign products first.`
      );
      return;
    }

    if (!confirm(`Delete category "${categoryName}"?`)) return;

    try {
      await deleteDoc(doc(db, "categories", categoryId));
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  // Save product item (add or update)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.title.trim()) {
      alert("Please fill in name and title fields");
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
          `products/${Date.now()}-${formData.image.name}`
        );
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        category: formData.category,
        Beej: formData.Beej.trim(),
        jamin: formData.jamin.trim(),
        mausam: formData.mausam.trim(),
        nursery: formData.nursery.trim(),
        ropai: formData.ropai.trim(),
        pani: formData.pani.trim(),
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, "products", editingItem.id), productData);
      } else {
        // Add new item
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      closeModal();
      fetchProductItems();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product item
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      setLoading(true);

      // Delete from Firestore
      await deleteDoc(doc(db, "products", id));

      // Try to delete from Storage if it's a Firebase URL
      if (imageUrl.includes("firebasestorage.googleapis.com")) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn("Could not delete from storage:", error);
        }
      }

      fetchProductItems();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Categories */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Categories</h2>
            <button
              onClick={openCategoryModal}
              className="p-1 hover:bg-gray-100 rounded-md"
              title="Add Category"
            >
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-1">
            {/* All Category */}
            <button
              onClick={() => setSelectedCategory("All")}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === "All"
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>All Products</span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  selectedCategory === "All"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {productItems.length}
              </span>
            </button>

            {/* User Categories */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full flex items-center justify-between group px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === category.name
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{category.name}</span>
                  {selectedCategory !== category.name && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id, category.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                      title="Delete category"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    selectedCategory === category.name
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {category.productCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* just for push */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 text-sm mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>
          </div>
          {/* Add Product Button - Bottom */}
          <div className="p-4 mt-auto">
            <button
              onClick={openAddModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Grid - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4 overflow-y-auto">
            {loading && productItems.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    {/* Image with Actions */}
                    <div className="relative h-40 bg-gray-100 overflow-hidden group">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md hover:bg-white"
                          title="Edit"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.imageUrl)}
                          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md hover:bg-white"
                          title="Delete"
                        >
                          <X size={14} className="text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="font-semibold text-gray-900 text-sm truncate"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                      <p
                        className="text-xs text-gray-600 truncate mb-2"
                        title={item.title}
                      >
                        {item.title}
                      </p>

                      {/* Compact Details Grid */}
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {item.Beej && (
                          <div
                            className="truncate"
                            title={`Beej: ${item.Beej}`}
                          >
                            <span className="text-gray-500">Beej:</span>{" "}
                            {item.Beej}
                          </div>
                        )}
                        {item.jamin && (
                          <div
                            className="truncate"
                            title={`Jamin: ${item.jamin}`}
                          >
                            <span className="text-gray-500">Jamin:</span>{" "}
                            {item.jamin}
                          </div>
                        )}
                        {item.mausam && (
                          <div
                            className="truncate"
                            title={`Mausam: ${item.mausam}`}
                          >
                            <span className="text-gray-500">Mausam:</span>{" "}
                            {item.mausam}
                          </div>
                        )}
                        {item.nursery && (
                          <div
                            className="truncate"
                            title={`Nursery: ${item.nursery}`}
                          >
                            <span className="text-gray-500">Nursery:</span>{" "}
                            {item.nursery}
                          </div>
                        )}
                        {item.ropai && (
                          <div
                            className="truncate"
                            title={`Ropai: ${item.ropai}`}
                          >
                            <span className="text-gray-500">Ropai:</span>{" "}
                            {item.ropai}
                          </div>
                        )}
                        {item.pani && (
                          <div
                            className="truncate"
                            title={`Pani: ${item.pani}`}
                          >
                            <span className="text-gray-500">Pani:</span>{" "}
                            {item.pani}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div className="h-full flex items-center justify-center">
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedCategory !== "All"
                      ? `No products in ${selectedCategory}`
                      : "No products yet"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {selectedCategory !== "All"
                      ? "Try adding products to this category"
                      : "Upload your first product to get started"}
                  </p>
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload size={16} />
                    Add Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                {editingItem ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Image Upload */}
              <div className="border border-gray-300 rounded-lg p-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="product-image-upload"
                />
                <label
                  htmlFor="product-image-upload"
                  className="cursor-pointer"
                >
                  {formData.preview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.preview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Change Image
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to upload new image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Upload Product Image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Form Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Product name"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Short title"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="All">All</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Beej
                    </label>
                    <input
                      type="text"
                      name="Beej"
                      value={formData.Beej}
                      onChange={handleInputChange}
                      placeholder="Seeds"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Jamin
                    </label>
                    <input
                      type="text"
                      name="jamin"
                      value={formData.jamin}
                      onChange={handleInputChange}
                      placeholder="Soil"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Mausam
                    </label>
                    <input
                      type="text"
                      name="mausam"
                      value={formData.mausam}
                      onChange={handleInputChange}
                      placeholder="Season"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nursery
                    </label>
                    <input
                      type="text"
                      name="nursery"
                      value={formData.nursery}
                      onChange={handleInputChange}
                      placeholder="Nursery"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Ropai
                    </label>
                    <input
                      type="text"
                      name="ropai"
                      value={formData.ropai}
                      onChange={handleInputChange}
                      placeholder="Planting"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Pani
                    </label>
                    <input
                      type="text"
                      name="pani"
                      value={formData.pani}
                      onChange={handleInputChange}
                      placeholder="Water"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  loading || !formData.name.trim() || !formData.title.trim()
                }
                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : editingItem ? "Save" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Add New Category</h2>
              <button
                onClick={closeCategoryModal}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={handleCategoryInputChange}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveCategory()}
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeCategoryModal}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={!categoryForm.name.trim()}
                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
