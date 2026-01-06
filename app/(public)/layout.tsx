// app/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Dhanroop",
  description: "Quality is Identity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <body className="bg-page font-body">
        <Header />
        {children}
        <Footer />
      </body>
  );
}
