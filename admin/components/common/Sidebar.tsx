"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  ChevronLeft,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Images
} from "lucide-react";
import clsx from "clsx";

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/products", icon: ShoppingBag },
  { title: "Orders", href: "/orders", icon: ClipboardList },
  { title: "Users", href: "/users", icon: Users },
  { title: "Sliders", href: "/sliders", icon: Images },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: open ? 240 : 80 }}
      transition={{ duration: 0.3 }}
      className="border-r bg-white p-3 flex flex-col"
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center mb-6",
          open ? "justify-between" : "justify-center"
        )}
      >
        {open && <span className="font-bold text-lg">Admin</span>}

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-md py-2 transition flex items-center",
                open ? "px-3 gap-3 justify-start" : "justify-center px-0",
                active
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />

              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.title}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}