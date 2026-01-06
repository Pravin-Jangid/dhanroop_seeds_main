"use client";

import { t, useLanguage } from "@/app/utils/translations";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import { useState } from "react";

/* ================= PRODUCT CONFIG ================= */
const PRODUCTS = [
  {
    id: 1,
    key: "gulabiPushp",
    image: "/Products/product-1.png",
  },
  {
    id: 2,
    key: "dollar111",
    image: "/Products/product-2.png",
  },
  {
    id: 3,
    key: "chinaGold",
    image: "/Products/product-3.png",
  },
] as const;

const WHATSAPP_LINK = "https://wa.me/917020186411";

/* ================= COMPONENT ================= */
export default function Products() {
  // 🔥 re-render on language change
  const { lang } = useLanguage();

  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section className="relative bg-[#0b8f3a]/90 py-4">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-white text-center mb-4">
          {t("products.sectionTitle")}
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => {
            const isActive = activeId === product.id;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setActiveId(product.id)}
                onMouseLeave={() => setActiveId(null)}
                className="
                  relative rounded-xl bg-white
                  border border-gray-200
                  shadow-sm hover:shadow-xl
                  transition-all duration-300
                  cursor-pointer
                "
              >
                {/* IMAGE */}
                <div className="h-[220px] flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={t(`products.${product.key}.name`)}
                    className="max-h-full object-contain"
                  />
                </div>

                {/* BASIC INFO */}
                <div className="px-5 pb-5 text-center">
                  <h3 className="text-lg font-semibold text-green-900">
                    {t(`products.${product.key}.name`)}
                  </h3>
                  <p className="text-sm text-green-700">
                    {t(`products.${product.key}.category`)}
                  </p>
                </div>

                {/* DETAILS PANEL */}
                <div
                  className={
                    "absolute inset-x-0 bottom-0 " +
                    "bg-white/40 backdrop-blur-md " +
                    "border-t border-green-200 rounded-b-xl " +
                    "px-5 py-4 transition-all duration-300 " +
                    (isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6 pointer-events-none")
                  }
                >
                  {/* WHATSAPP BUTTON */}
                  <a
                    href={`https://wa.me/917020186411?text=${encodeURIComponent(
                      `Hello Dhanroop Seeds 👋\n\nI am interested in *${t(
                        `products.${product.key}.name`
                      )}*.\n\nPlease share price, availability, and more details.\n\nThank you.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
    mt-4 w-full
    flex items-center justify-center gap-2
    py-2.5 rounded-lg
    bg-[#25D366] text-white
    text-sm font-semibold
    hover:bg-[#1ebe5d]
    transition
  "
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIEW ALL */}
        <div className="flex justify-center mt-6">
          <Link href="/products" className="btn btn-accent">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
