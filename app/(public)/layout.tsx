import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: {
    default: "Dhanroop Seeds | India's Largest Onion & Vegetable Seed Producer",
    template: "%s | Dhanroop Seeds",
  },

  description:
    "Dhanroop Seeds is India’s largest onion and vegetable seed producer. Trusted by 2500+ farmers for high-quality hybrid seeds, exceptional yields, and sustainable farming practices.",

  keywords: [
    "Dhanroop Seeds",
    "onion seeds manufacturer India",
    "vegetable seed company India",
    "hybrid onion seeds",
    "agriculture seeds India",
    "high yield vegetable seeds",
    "farming seeds supplier",
    "Indian seed company",
    "best onion seeds",
  ],

  alternates: {
    canonical: "https://www.dhanroopseeds.in",
  },

  openGraph: {
    title: "Dhanroop Seeds | Quality is Identity",
    description:
      "India’s largest onion & vegetable seed producer. Revolutionizing agriculture with premium hybrid seeds trusted by 2500+ farmers.",
    url: "https://www.dhanroopseeds.in",
    siteName: "Dhanroop Seeds",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.dhanroopseeds.in/og-image.jpg", // add later if not ready
        width: 1200,
        height: 630,
        alt: "Dhanroop Seeds - Quality is Identity",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Dhanroop Seeds | India's Leading Seed Brand",
    description:
      "Premium onion & vegetable seeds delivering exceptional yield and sustainable farming.",
    images: ["https://www.dhanroopseeds.in/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="bg-page font-body">
      <Header />

      {/* WhatsApp Floating Button */}
      <Link
        href="https://wa.me/917020186411"
        target="_blank"
        aria-label="Chat with Dhanroop Seeds on WhatsApp"
        className="
          fixed bottom-6 right-6 z-[9999]
          flex items-center gap-3
          bg-[#0b8f3a]
          text-white
          px-4 py-3
          rounded-full
          shadow-lg
          hover:scale-105
          hover:shadow-xl
          transition-all duration-300
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="22"
          height="22"
          fill="currentColor"
        >
          <path d="M16.003 2.003c-7.732 0-14 6.268-14 14 0 2.469.646 4.88 1.873 7.018L2 30l7.158-1.828A13.93 13.93 0 0 0 16.003 30c7.732 0 14-6.268 14-14s-6.268-13.997-14-13.997zm0 25.56a11.55 11.55 0 0 1-5.886-1.612l-.422-.25-4.248 1.084 1.132-4.134-.275-.425a11.565 11.565 0 1 1 9.699 5.337zm6.361-8.678c-.349-.175-2.064-1.018-2.385-1.133-.321-.117-.555-.175-.789.175-.233.349-.906 1.133-1.111 1.366-.204.233-.408.262-.758.087-.349-.175-1.474-.544-2.809-1.737-1.039-.926-1.74-2.071-1.945-2.421-.204-.349-.021-.537.154-.712.158-.157.349-.408.524-.612.175-.204.233-.349.349-.583.117-.233.058-.437-.029-.612-.087-.175-.789-1.901-1.082-2.604-.285-.686-.575-.593-.789-.603l-.671-.012c-.233 0-.612.087-.933.437-.321.349-1.227 1.2-1.227 2.925s1.256 3.392 1.432 3.625c.175.233 2.472 3.775 5.988 5.292.837.362 1.489.578 1.997.74.839.267 1.603.229 2.206.139.673-.1 2.064-.845 2.356-1.661.291-.816.291-1.516.204-1.661-.087-.145-.321-.233-.671-.408z" />
        </svg>
        <span className="hidden sm:inline font-medium">Chat on WhatsApp</span>
      </Link>

      {children}

      <Footer />
    </body>
  );
}
