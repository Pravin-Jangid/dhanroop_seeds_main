"use client";

import { useState } from "react";
import {
  MdDashboard,
  MdShoppingCart,
  MdEco,
  MdReviews,
  MdContacts,
  MdPhotoLibrary,
  MdMenuOpen,
} from "react-icons/md";

interface Props {
  active: string;
  setActive: (val: string) => void;
}

export default function Sidebar({ active, setActive }: Props) {
  const [collapsed, setCollapsed] = useState(true); // default minimized

  const menu = [
    // { key: "dashboard", label: "Dashboard", icon: MdDashboard },
    { key: "Products", label: "Products", icon: MdShoppingCart },
    // { key: "agritips", label: "AgriTips", icon: MdEco },
    { key: "testimonials", label: "Testimonials", icon: MdReviews },
    { key: "contacts", label: "Contacts", icon: MdContacts },
    { key: "Career", label: "Career", icon: MdContacts },
    { key: "gallery", label: "Gallery", icon: MdPhotoLibrary },
  ];

  return (
    <aside
      className={`bg-white shadow-md h-screen transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="font-bold text-lg">Admin</span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl"
        >
          <MdMenuOpen
            className={`transition-transform duration-300
              ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 px-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded transition
                ${
                  active === item.key
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-200"
                }`}
            >
              <Icon className="text-xl shrink-0" />

              {!collapsed && (
                <span className="text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
