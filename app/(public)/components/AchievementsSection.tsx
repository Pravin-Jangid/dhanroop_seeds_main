"use client";

import { t, useLanguage } from "@/app/utils/translations";

export default function AchievementsSection() {
  // 🔥 THIS LINE IS THE KEY (instant re-render)
  const { lang } = useLanguage();

  return (
    <section
      className="relative py-2 md:py-4 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/f1/5e/92/f15e92c2bff08a19e905ace65704cc42.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-500/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        {/* Badge */}

        {/* Heading */}
        <h2 className="heading-md font-heading mt-3">
          {t("achievements.title")}
        </h2>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Achievement
            value={t("achievements.stats.year.value")}
            label={t("achievements.stats.year.label")}
          />
          <Achievement
            value={t("achievements.stats.farmers.value")}
            label={t("achievements.stats.farmers.label")}
          />
          <Achievement
            value={t("achievements.stats.onion.value")}
            label={t("achievements.stats.onion.label")}
          />
          <Achievement
            value={t("achievements.stats.seeds.value")}
            label={t("achievements.stats.seeds.label")}
          />
        </div>
      </div>
    </section>
  );
}

/* ===============================
   SINGLE STAT
   =============================== */
function Achievement({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <h3 className="text-3xl md:text-4xl font-heading font-semibold">
        {value}
      </h3>
      <p className="mt-1 text-xs md:text-sm text-white/80 font-body">{label}</p>
    </div>
  );
}
