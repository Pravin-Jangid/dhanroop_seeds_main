"use client";

import { db } from "@/app/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

interface GalleryItem {
  id: string;
  name: string;
  alt: string;
  imageUrl: string;
  createdAt?: any;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  /* ================= FETCH FROM FIREBASE ================= */
  useEffect(() => {
    const fetchGallery = async () => {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setImages(data);
      setLoading(false);
    };

    fetchGallery();
  }, []);

  /* ================= PRELOAD IMAGES ================= */
  useEffect(() => {
    if (images.length > 0) {
      images.slice(0, 6).forEach((image) => {
        const img = new window.Image();
        img.src = image.imageUrl;
      });
    }
  }, [images]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl animate-pulse"
              style={{
                height: `${200 + (i % 3) * 80}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ================= MAIN GALLERY ================= */}
      <section className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Premium Header */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Gallery</span>
            </div>
          </div>

          {/* Responsive Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {images.map((item, index) => (
              <MasonryItem
                key={item.id}
                item={item}
                index={index}
                delay={index * 0.05}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No images yet
              </h3>
              <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
                Our gallery will be updated soon with premium product images
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= LIGHTBOX MODAL ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
              <h3 className="text-white text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {selectedImage.name}
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                {selectedImage.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= MASONRY ITEM COMPONENT ================= */
function MasonryItem({
  item,
  index,
  delay,
  onClick,
}: {
  item: GalleryItem;
  index: number;
  delay: number;
  onClick: () => void;
}) {
  const heights = [240, 280, 200, 260, 220, 300];
  const mobileHeights = [180, 220, 160, 200, 180, 240];

  // Responsive heights
  const height = `h-[${mobileHeights[index % mobileHeights.length]}px] sm:h-[${
    heights[index % heights.length]
  }px]`;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 hover:scale-[0.99] ${height}`}
      style={{
        animationDelay: `${delay}s`,
      }}
      onClick={onClick}
    >
      {/* Background Image with proper object-fit */}
      <div className="absolute inset-0 bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.alt}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading={index < 6 ? "eager" : "lazy"}
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-semibold text-base sm:text-lg mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100 truncate">
          {item.name}
        </h3>
        <p className="text-gray-200 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 line-clamp-2">
          {item.alt}
        </p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300 rounded-xl"></div>
    </div>
  );
}
