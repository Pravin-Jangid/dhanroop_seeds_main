"use client";

import { subscribeLanguage, t } from "@/app/utils/translations";
import {
  ChevronRight,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [, forceUpdate] = useState(0);

  /* ------------------ LANGUAGE SUBSCRIBE (FIXED) ------------------ */
  useEffect(() => {
    const unsubscribe = subscribeLanguage(() => {
      forceUpdate((n) => n + 1);
    });

    // Return a cleanup function that doesn't return a value
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/dhanroopseeds?igsh=MXBrbHJ1djczb2lwaQ==",
      color: "hover:bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/share/1Jm51cFmap/",
      color: "hover:bg-blue-600",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@dhanroopseeds?si=hE0wMj19RXVofEJl",
      color: "hover:bg-red-600",
    },
  ];

  const quickLinks = [
    { name: t("menu.home"), href: "/" },
    { name: t("menu.products"), href: "/products" },
    { name: t("menu.about"), href: "/about" },
    { name: t("menu.contact"), href: "/contact" },
  ];

  return (
    <footer className="relative bg-skin animate-fadeIn border-t-2 border-[#0b8f3a]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid lg:grid-cols-4 gap-5 lg:gap-6 mb-6">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-1 space-y-4">
            <div className="mb-2">
              <Image
                src="/Logos/logo.png"
                alt="Dhanroop Natural Seeds Logo"
                width={140}
                height={50}
                priority
                className="max-h-[50px] object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
            <p className="font-body text-white leading-relaxed text-sm mb-2">
              {t("footer.description")}
            </p>

            {/* Social Media */}
            <div>
              <h4 className="font-heading font-semibold text-white mb-2">
                {t("footer.followUs")}
              </h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg  shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${social.color}`}
                      aria-label={`${t("footer.followUs")} ${social.name}`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-heading font-semibold text-white mb-3">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group/link flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/80 transition-all duration-200"
                  >
                    <ChevronRight className="w-3 h-3 text-white opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                    <span className="text-white group-hover/link:text-white group-hover/link:font-medium">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="font-heading font-semibold text-white mb-3">
              {t("footer.contactUs")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-medium text-white mb-1">
                    {t("footer.callUs")}
                  </h5>
                  <div className="space-y-0.5">
                    <a
                      href="tel:+917020186411"
                      className="block text-white hover:text-white transition-colors"
                    >
                      +91 70201 86411
                    </a>
                    <a
                      href="tel:+917020182831"
                      className="block text-white hover:text-white transition-colors"
                    >
                      +91 70201 82831
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-medium text-white mb-1">
                    {t("footer.email")}
                  </h5>
                  <a
                    href="mailto:dhanroopseed@gmail.com"
                    className="block text-white hover:text-white transition-colors"
                  >
                    dhanroopseed@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-medium text-white mb-1">
                    {t("footer.business")}
                  </h5>
                  <p className="text-white">info@dhanroop.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Address */}
          <div className="lg:col-span-1">
            <h4 className="font-heading font-semibold text-white mb-3">
              {t("footer.ourLocation")}
            </h4>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-white mb-1">
                  {t("footer.headOffice")}
                </h5>
                <address className="text-white not-italic leading-relaxed">
                  {t("footer.addressLine1")}
                  <br />
                  {t("footer.addressLine2")}
                  <br />
                  {t("footer.addressLine3")}
                  <br />
                  {t("footer.addressLine4")}
                  <br />
                  {t("footer.addressLine5")}
                  <br />
                  {t("footer.addressLine6")}
                  <br />
                  <span className="font-semibold text-white">
                    {t("footer.addressLine7")}
                  </span>
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-100 my-4"></div>

        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-white">
              © {currentYear} {t("footer.copyright")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-white" />
            <span className="font-medium text-white">
              {t("footer.qualityTagline")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-white hover:text-white transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              href="/terms"
              className="text-white hover:text-white transition-colors"
            >
              {t("footer.termsOfService")}
            </Link>
            <Link
              href="/sitemap"
              className="text-white hover:text-white transition-colors"
            >
              {t("footer.sitemap")}
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-green-100/50 text-center">
          <p className="text-white font-medium">{t("footer.committedTo")}</p>
        </div>
      </div>
    </footer>
  );
}
