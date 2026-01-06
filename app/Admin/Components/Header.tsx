"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 🔴 Logout
  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  // 🖥️ Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Admin Panel</h1>

      <div className="flex items-center gap-4">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullScreen}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
