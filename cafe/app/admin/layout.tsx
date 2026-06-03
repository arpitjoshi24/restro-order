"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Tags,
  Table2,
  ChefHat,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      name: "Menu",
      href: "/admin/menu",
      icon: UtensilsCrossed,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tags,
    },
    {
      name: "Tables",
      href: "/admin/tables",
      icon: Table2,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F3EB]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#2C1810] text-white flex flex-col shadow-2xl">
        
        {/* Logo */}
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#C46A2D] flex items-center justify-center">
              <ChefHat size={24} />
            </div>

            <div>
              <h1 className="font-bold text-xl">
                Café Admin
              </h1>

              <p className="text-xs text-gray-400">
                Restaurant Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                  ${
                    active
                      ? "bg-[#C46A2D] text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <div className="bg-[#3A241A] rounded-2xl p-4">
            <p className="text-sm text-gray-300">
              QR Ordering System
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Manage orders, menu and tables
            </p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}