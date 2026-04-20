"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";

interface BottomNavProps {
  username?: string;
  avatarUrl?: string | null;
  fullName?: string | null;
}

const navItems = [
  {
    href: "/feed",
    label: "Feed",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/run/new",
    label: "Run",
    isPost: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    href: "/crew",
    label: "Crew",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function BottomNav({ username, avatarUrl, fullName }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-kith-gray-light/50 pb-[env(safe-area-inset-bottom)]">
      <div className="app-container flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          if (item.isPost) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-kith-orange text-white active:scale-95 transition-transform"
              >
                {item.icon}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 text-[10px] font-body",
                isActive ? "text-kith-orange" : "text-kith-muted"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
        {username && (
          <Link
            href="/profile"
            className={clsx(
              "flex flex-col items-center gap-0.5 text-[10px] font-body",
              pathname.startsWith("/profile") ? "text-kith-orange" : "text-kith-muted"
            )}
          >
            <Avatar
              src={avatarUrl}
              username={username}
              fullName={fullName}
              size="sm"
            />
            <span>Profile</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
