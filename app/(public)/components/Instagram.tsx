"use client";

import { t, useLanguage } from "@/app/utils/translations";
import { useEffect, useState } from "react";

/* ================= DATA ================= */
const INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/DIYwq4ZS9jI/",
  "https://www.instagram.com/p/DIra-MKyP3U/",
  "https://www.instagram.com/p/DIhIOEAos8J/",
];

/* ================= MOUNT GUARD ================= */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function InstagramSection() {
  const mounted = useMounted();
  const { lang } = useLanguage(); // 🔥 re-render trigger

  /* ================= LOAD INSTAGRAM SCRIPT ================= */
  useEffect(() => {
    if (!mounted) return;

    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      window.instgrm?.Embeds.process();
    }
  }, [mounted]);

  /* 🔥 HYDRATION FIX */
  if (!mounted) return null;

  return (
    <section className="bg-white py-4">
      <div className="max-w-6xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-12">
          <span className="label">{t("instagram.badge")}</span>
          <h2 className="heading-lg font-heading text-dark mt-2">
            {t("instagram.title")}
          </h2>
          <p className="text-muted text-base mt-3 max-w-xl mx-auto">
            {t("instagram.description")}
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
          {INSTAGRAM_POSTS.map((url, index) => (
            <div
              key={index}
              className="
                bg-card
                rounded-xl
                shadow-sm
                overflow-hidden
                w-full
                max-w-[300px]
                aspect-[3/4]
              "
            >
              {/* CROPPED VIEWPORT */}
              <div className="w-full h-full overflow-hidden">
                {/* SCALED EMBED */}
                <div
                  style={{
                    transform: "scale(0.78)",
                    transformOrigin: "top center",
                    width: "128%",
                    marginLeft: "-14%",
                    pointerEvents: "none",
                  }}
                >
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style={{ margin: 0, background: "#fff" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-14 text-center">
          <a
            href="https://www.instagram.com/dhanroopseeds"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {t("instagram.follow")}
          </a>
        </div>
      </div>
    </section>
  );
}
