"use client";

import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

import AgriTips from "./Views/Agritips";
import CareerApplications from "./Views/CareerApplications";
import Contacts from "./Views/Contacts";
import Dashboard from "./Views/Dashboard";
import Downloads from "./Views/Download";
import Gallery from "./Views/Gallery";
import Products from "./Views/Products";
import Testimonials from "./Views/Testimonials";

export default function AdminPage() {
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login"); // ❌ login nahi to redirect
      } else {
        setLoading(false); // ✅ login hai
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const renderView = () => {
    switch (active) {
      case "agritips":
        return <AgriTips />;
      case "testimonials":
        return <Testimonials />;
      case "contacts":
        return <Contacts />;
      case "downloads":
        return <Downloads />;
      case "gallery":
        return <Gallery />;
      case "Products":
        return <Products />;
      case "Career":
        return <CareerApplications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1">
        <Header />
        <main className="p-6  overflow-hidden">{renderView()}</main>
      </div>
    </div>
  );
}
