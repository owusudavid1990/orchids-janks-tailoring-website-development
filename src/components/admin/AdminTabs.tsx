"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/clients", label: "Clients" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 mb-10 border-b border-white/10">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-3 text-[11px] tracking-[0.15em] uppercase border-b-2 -mb-px transition-colors ${
              active ? "border-gold text-white" : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
