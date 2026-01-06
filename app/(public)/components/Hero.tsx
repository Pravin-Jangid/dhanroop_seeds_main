"use client";

import { getLanguage, subscribeLanguage, t } from "@/app/utils/translations";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   PRODUCT SLIDER DATA
------------------------------------------------------------------ */
const PRODUCTS = [
  "/Products/product-1.png",
  "/Products/product-2.png",
  "/Products/product-3.png",
];

// 🔥 ring slider ke liye first slide clone
const SLIDES = [...PRODUCTS, PRODUCTS[0]];

export default function Hero() {
  const [, forceUpdate] = useState(getLanguage());

  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);

  /* ------------------ LANGUAGE SUBSCRIBE ------------------ */
  useEffect(() => {
    const unsubscribe = subscribeLanguage(() => {
      forceUpdate(getLanguage());
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  /* ------------------ AUTO SLIDER ------------------ */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  /* ------------------ RING RESET LOGIC ------------------ */
  useEffect(() => {
    if (active === PRODUCTS.length) {
      // clone slide pe aane ke baad instant reset
      setTimeout(() => {
        setAnimate(false);
        setActive(0);
      }, 1200); // transition duration ke barabar
    } else {
      setAnimate(true);
    }
  }, [active]);

  return (
    <section
      className="relative min-h-[90svh] lg:min-h-[80vh] flex items-center"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/030/218/878/non_2x/leek-onions-farm-field-fresh-green-vegetation-after-watering-agroindustry-farming-agriculture-landscape-growing-vegetables-agronomy-agriculture-and-agribusiness-agricultural-subsidies-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* TEXT */}
          <div
            className="
              max-w-xl text-white
              bg-gradient-to-b
              from-[#0b8f3a]/30
              via-[#1fa64b]/35
              to-[#000000]/70
              p-6 sm:p-7
              rounded-3xl
              border border-white/10
            "
          >
            <span className="text-xs sm:text-sm">{t("hero.badge")}</span>

            <h1 className="font-heading mt-4 leading-tight text-3xl sm:text-4xl lg:text-5xl">
              {t("hero.titleLine1")} <br />
              <span className="text-[#fefad5]">
                {t("hero.titlePrimary")}
              </span>{" "}
              <span className="text-[#ffe08a]">{t("hero.titleAccent")}</span>
            </h1>

            <p className="mt-5 text-white/90 text-sm sm:text-base max-w-lg">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <button className="btn btn-primary w-full sm:w-auto shadow-lg">
                  {t("hero.explore")}
                </button>
              </Link>

              <Link href="/contact">
                <button className="btn btn-outline bg-white/90 text-green-800 w-full sm:w-auto">
                  {t("hero.contact")}
                </button>
              </Link>
            </div>
          </div>

          {/* PRODUCT RING SLIDER */}
          <div
            className="
              relative mx-auto overflow-hidden
              w-[260px] h-[260px]
              sm:w-[320px] sm:h-[320px]
              lg:w-[420px] lg:h-[420px]
            "
          >
            <div
              className={`
                flex h-full
                ${animate ? "transition-transform duration-[1200ms]" : ""}
                ease-[cubic-bezier(0.4,0,0.2,1)]
              `}
              style={{
                transform: `translateX(-${active * 100}%)`,
              }}
            >
              {SLIDES.map((src, index) => (
                <div
                  key={index}
                  className="relative min-w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={src}
                    alt={`Product ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                  />
                </div>
              ))}
            </div>

            {/* DOTS */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {PRODUCTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active % PRODUCTS.length === i
                      ? "w-6 bg-primary"
                      : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
