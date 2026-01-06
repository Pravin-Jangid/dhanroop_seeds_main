"use client";

import { useEffect, useState } from "react";
import { t, useLanguage } from "@/app/utils/translations";

/* ================= DATA ================= */
const YOUTUBE_VIDEOS = [
  {
    id: "yt-1",
    url: "https://www.youtube.com/watch?v=DKltsPgpqvo",
    title: "Dhanroop Seeds - Chhatrapati Sambhajinagar",
    stats: "15 views • January 2026",
    embedCode: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/DKltsPgpqvo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    thumbnail: "https://img.youtube.com/vi/DKltsPgpqvo/hqdefault.jpg",
  },
  {
    id: "yt-2",
    url: "https://www.youtube.com/watch?v=kHxXxkROzds",
    title: "Dhanroop Seeds Premium Quality",
    stats: "27K views • 1 month ago",
    embedCode: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/kHxXxkROzds" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    thumbnail: "https://img.youtube.com/vi/kHxXxkROzds/hqdefault.jpg",
  },
];

/* ================= MOUNT GUARD ================= */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function YouTubeSection() {
  const mounted = useMounted();
  const { lang } = useLanguage(); // 🔥 re-render trigger

  const [activeModalContent, setActiveModalContent] = useState<{
    title: string;
    embedCode?: string;
    url?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ================= PRELOAD THUMBNAILS ================= */
  useEffect(() => {
    const imagePromises = YOUTUBE_VIDEOS.map(
      (item) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = item.thumbnail;
          img.onload = resolve;
          img.onerror = resolve;
        })
    );

    Promise.all(imagePromises).finally(() => setIsLoading(false));
  }, []);

  const handleCardClick = (item: typeof YOUTUBE_VIDEOS[0]) => {
    setActiveModalContent({
      title: item.title,
      embedCode: item.embedCode,
      url: item.url,
    });
  };

  const closeModal = () => setActiveModalContent(null);

  /* 🔥 HYDRATION FIX */
  if (!mounted) return null;

  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* ================= HEADER ================= */}
          <div className="text-center mb-12">
            <span className="label">
              {t("youtube.badge")}
            </span>
            <h2 className="heading-lg font-heading text-dark mt-2">
              {t("youtube.title")}
            </h2>
            <p className="text-muted text-base mt-3 max-w-xl mx-auto">
              {t("youtube.description")}
            </p>
          </div>

          {/* ================= GRID ================= */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl animate-pulse aspect-video"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {YOUTUBE_VIDEOS.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleCardClick(item)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#FF0000]/90 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {item.stats}
                      </span>
                      <span className="inline-flex items-center text-sm font-medium text-[#FF0000]">
                        {t("youtube.watch")}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= CTA ================= */}
          <div className="mt-14 text-center">
            <a
              href="https://www.youtube.com/@dhanroopseeds"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t("youtube.subscribe")}
            </a>
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {activeModalContent && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              onClick={closeModal}
            >
              ✕
            </button>

            <div className="p-2 md:p-4 h-full">
              <div className="aspect-video w-full">
                <div
                  className="w-full h-full rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: activeModalContent.embedCode || "",
                  }}
                />
              </div>

              <div className="mt-4 p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeModalContent.title}
                </h3>
                <a
                  href={activeModalContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-sm text-primary hover:underline"
                >
                  {t("youtube.open")}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
