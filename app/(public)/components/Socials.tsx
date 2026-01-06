"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/DIYwq4ZS9jI/",
  "https://www.instagram.com/p/DIra-MKyP3U/",
];

/* ================= MOUNT GUARD ================= */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function SocialMediaPreview() {
  const mounted = useMounted();
  const { lang } = useLanguage(); // 🔥 re-render trigger

  const [activeModalContent, setActiveModalContent] = useState<{
    title: string;
    embedCode?: string;
    url?: string;
    platform: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ================= LOAD EMBEDS ================= */
  useEffect(() => {
    if (!mounted) return;

    // Instagram script
    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        window.instgrm?.Embeds?.process();
      };
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      window.instgrm?.Embeds?.process();
    }

    // Preload YouTube thumbnails
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
  }, [mounted]);

  const handleYouTubeClick = (item: typeof YOUTUBE_VIDEOS[0]) => {
    setActiveModalContent({
      title: item.title,
      embedCode: item.embedCode,
      url: item.url,
      platform: "youtube",
    });
  };

  const closeModal = () => setActiveModalContent(null);

  /* 🔥 HYDRATION FIX */
  if (!mounted) return null;

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl animate-pulse h-64"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* ================= HEADER ================= */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {t("social.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("social.title")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("social.description")}
            </p>
          </div>

          {/* ================= GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* YouTube 1 */}
            <MediaYouTubeCard
              video={YOUTUBE_VIDEOS[0]}
              onClick={handleYouTubeClick}
            />

            {/* Instagram 1 */}
            <InstagramPlaceholder
              title={t("social.instagramTitle")}
              subtitle={t("social.instagramSubtitle")}
            />

            {/* YouTube 2 */}
            <MediaYouTubeCard
              video={YOUTUBE_VIDEOS[1]}
              onClick={handleYouTubeClick}
            />

            {/* Instagram 2 */}
            <InstagramPlaceholder
              title={t("social.instagramStories")}
              subtitle={t("social.instagramStoriesSub")}
            />
          </div>

          {/* ================= VIEW MORE ================= */}
          <div className="mt-12 text-center">
            <Link
              href="/media"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all"
            >
              {t("social.viewAll")}
            </Link>
            <p className="text-gray-500 mt-4">
              {t("social.footerNote")}
            </p>
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {activeModalContent && activeModalContent.platform === "youtube" && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden">
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white"
              onClick={closeModal}
            >
              ✕
            </button>

            <div className="p-4">
              <div className="aspect-video w-full">
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeModalContent.embedCode || "",
                  }}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {activeModalContent.title}
              </h3>
              <a
                href={activeModalContent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm mt-2 inline-block"
              >
                {t("social.openYoutube")}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= SUB COMPONENTS ================= */

function MediaYouTubeCard({
  video,
  onClick,
}: {
  video: typeof YOUTUBE_VIDEOS[0];
  onClick: (v: any) => void;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border bg-white cursor-pointer hover:shadow-lg"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <span className="text-sm text-gray-500">{video.stats}</span>
      </div>
    </div>
  );
}

function InstagramPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
      <a
        href="https://www.instagram.com/dhanroopseeds"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary text-sm mt-3 inline-block"
      >
        {t("social.viewInstagram")}
      </a>
    </div>
  );
}
