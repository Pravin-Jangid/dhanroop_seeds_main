"use client";

import Image from "next/image";
import { useLanguage, t } from "@/app/utils/translations";

export default function AboutDhanroop() {
  // 🔥 THIS LINE IS THE KEY
  const { lang } = useLanguage(); // re-render trigger

  return (
    <section className="bg-brand-bg-skin py-4">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

        {/* ================= TEXT ================= */}
        <div>
          {/* Badge */}
          <span
            className="
              inline-block mb-4
              px-4 py-1.5
              text-xs font-semibold tracking-wide
              rounded-full
              bg-primary/10 text-primary
            "
          >
            {t("about.badge")}
          </span>

          {/* Heading */}
          <h2 className="font-heading font-semibold text-3xl sm:text-4xl leading-tight text-dark">
            {t("about.title")} <br />
            <span className="text-primary">
              {t("about.subtitle")}
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 text-gray-700 text-sm sm:text-base max-w-xl">
            {t("about.description1")}
          </p>

          <p className="mt-4 text-gray-700 text-sm sm:text-base max-w-xl">
            {t("about.description2")}
          </p>

          {/* Highlights */}
          <ul className="mt-6 space-y-3 text-sm sm:text-base text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✔</span>
              {t("about.points.point1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✔</span>
              {t("about.points.point2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✔</span>
              {t("about.points.point3")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✔</span>
              {t("about.points.point4")}
            </li>
          </ul>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="relative">
          <Image
            src="https://i.pinimg.com/736x/e2/32/e6/e232e63fa541b267897330c4d44e148c.jpg"
            alt={t("about.imageAlt")}
            width={700}
            height={500}
            className="w-76 h-120"
          />

          {/* Accent */}
          <div
            className="
              absolute -bottom-6 -right-6
              w-28 h-28
              rounded-full
              bg-primary/20
              blur-2xl
              -z-10
            "
          />
        </div>
      </div>
    </section>
  );
}
