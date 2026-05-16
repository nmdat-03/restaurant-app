"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronLeft,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Images,
  ChevronDown,
  ChartColumnBig,
  FolderTree,
} from "lucide-react";
import clsx from "clsx";

// ===== Types =====
type MenuItem =
  | {
    title: string;
    href: string;
    icon: any;
  }
  | {
    title: string;
    icon: any;
    children: {
      title: string;
      href: string;
    }[];
  };

// ===== Menu =====
const items: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Reports",
    icon: ChartColumnBig,
    children: [
      { title: "Revenue", href: "/reports/revenue" },
      { title: "Orders", href: "/reports/orders" },
      { title: "Products", href: "/reports/products" },
    ],
  },
  { title: "Orders", href: "/orders", icon: ClipboardList },
  { title: "Categories", href: "/categories", icon: FolderTree },
  { title: "Products", href: "/products", icon: ShoppingBag },
  { title: "Users", href: "/users", icon: Users },
  { title: "Sliders", href: "/sliders", icon: Images },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

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

          // ===== Dropdown item =====
          if ("children" in item) {
            const isOpen = openDropdown === item.title || pathname.startsWith("/reports");

            return (
              <div key={item.title}>
                <div
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : item.title)
                  }
                  className={clsx(
                    "rounded-md py-2 flex items-center cursor-pointer",
                    open ? "px-3 gap-3 justify-between" : "justify-center",
                    pathname.startsWith("/reports")
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {open && <span>{item.title}</span>}
                  </div>

                  {open && (
                    <ChevronDown
                      size={16}
                      className={clsx(
                        "transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </div>

                {/* Children */}
                <AnimatePresence>
                  {open && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 mt-1 flex flex-col gap-1 overflow-hidden"
                    >
                      {item.children.map((child) => {
                        const active = isActive(child.href);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={clsx(
                              "text-sm py-2 px-3 rounded-md",
                              active
                                ? "text-blue-600 font-medium"
                                : "text-gray-500 hover:bg-gray-100"
                            )}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // ===== Normal item =====
          const active = isActive(item.href);

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
              {open && <span>{item.title}</span>}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
