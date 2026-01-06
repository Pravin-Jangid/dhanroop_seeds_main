"use client";

import {
  getLanguage,
  languages,
  setLanguage,
  subscribeLanguage,
  t,
} from "@/app/utils/translations";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiGlobe, FiMenu, FiX } from "react-icons/fi";

/* ------------------ MOUNT FIX ------------------ */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export default function Header() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi" | "mr">("en");
  const [languageOpen, setLanguageOpen] = useState(false);

  /* ------------------ LANGUAGE SYNC (FIXED) ------------------ */
  useEffect(() => {
    if (!mounted) return;

    setLang(getLanguage());

    const unsubscribe = subscribeLanguage(() => {
      setLang(getLanguage());
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [mounted]);

  /* ------------------ HYDRATION GUARD ------------------ */
  if (!mounted) return null;

  const handleLanguageChange = (newLang: "en" | "hi" | "mr") => {
    setLanguage(newLang);
    setLanguageOpen(false);
  };

  return (
    <header className="bg-skin shadow-sm p-2 sticky border-b-2  border-[#0b8f3a] top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Logos/logo.png"
            alt="Dhanroop Logo"
            width={160}
            height={60}
            priority
            className="max-h-[56px] object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-7 font-heading text-sm">
          {MENU.map((item) => (
           <Link
  key={item.key}
  href={item.href}
  className="
    group relative inline-block
    font-semibold
    text-[#14532d]
    hover:text-white
    transition-colors duration-300
  "
>
  {t(item.key)}

  {/* underline */}
  <span
    className="
      absolute left-0 -bottom-[3px]
      h-[2px] w-full
      bg-white                 /* ✅ underline white */
      scale-x-0
      origin-left
      transition-transform duration-300 ease-out
      group-hover:scale-x-100
    "
  />
</Link>

          ))}
        </nav>

        {/* Language Switcher */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
          >
            <FiGlobe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {languages.find((l) => l.code === lang)?.nativeName}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                languageOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Language Dropdown */}
          {languageOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setLanguageOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden animate-fadeIn">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() =>
                      handleLanguageChange(language.code as "en" | "hi" | "mr")
                    }
                    className={`
                      w-full px-4 py-3 text-left transition-all duration-150
                      flex items-center justify-between
                      ${
                        lang === language.code
                          ? "bg-primary/5 text-primary font-semibold"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{language.name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {language.nativeName}
                      </span>
                    </div>
                    {lang === language.code && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute left-0 top-full w-full bg-white shadow-lg
        transition-all duration-300 overflow-hidden z-40
        ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="px-6 py-5 flex flex-col ">
          {MENU.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <span className="font-medium text-dark">{t(item.key)}</span>
            </Link>
          ))}

          {/* Mobile Language Switcher */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-2 px-3">
              <FiGlobe className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-dark">
                Select Language
              </span>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-1 mt-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    handleLanguageChange(language.code as "en" | "hi" | "mr");
                    setOpen(false);
                  }}
                  className={`
          py-2 px-3 rounded-md
          transition-all duration-150
          flex items-center justify-between
          text-sm
          ${
            lang === language.code
              ? "bg-primary/10 text-primary font-semibold border border-primary/20"
              : "hover:bg-gray-50"
          }
        `}
                >
                  <div className="leading-tight">
                    <div className="text-[11px] text-gray-500">
                      {language.nativeName}
                    </div>
                  </div>

                  {lang === language.code && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ---------------- MENU ---------------- */
const MENU = [
  { key: "menu.home", href: "/" },
  { key: "menu.about", href: "/about-us" },
  { key: "menu.products", href: "/products" },
  { key: "menu.media", href: "/media" },
  { key: "menu.career", href: "/career" },
  { key: "menu.gallery", href: "/gallery" },
  { key: "menu.contact", href: "/contact" },
];
