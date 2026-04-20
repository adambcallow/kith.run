"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";

interface BottomNavProps {
  username?: string;
  avatarUrl?: string | null;
  fullName?: string | null;
  unreadCount?: number;
}

export function BottomNav({ username, avatarUrl, fullName, unreadCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-kith-gray-light/50 pb-[env(safe-area-inset-bottom)]">
      <div className="app-container relative h-16">
        {/* Center FAB — absolutely positioned */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
          <Link
            href="/run/new"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-kith-orange text-white shadow-lg shadow-kith-orange/30 transition-all duration-200 active:scale-[0.92]"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Link>
        </div>

        {/* 4 nav items, split around the center gap */}
        <div className="grid grid-cols-[1fr_1fr_56px_1fr_1fr] items-center h-full">
          <NavItem
            href="/feed"
            label="Feed"
            active={pathname === "/feed" || pathname === "/"}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
          />

          <NavItem
            href="/crew"
            label="Crew"
            active={pathname.startsWith("/crew")}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />

          {/* Center spacer for the FAB */}
          <div />

          <NavItem
            href="/notifications"
            label="Alerts"
            active={pathname.startsWith("/notifications")}
            badge={unreadCount > 0 ? unreadCount : undefined}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            }
          />

          {username ? (
            <Link
              href="/profile"
              className={clsx(
                "relative flex flex-col items-center justify-center gap-0.5 min-h-[48px] min-w-[48px] text-[10px] font-body transition-colors duration-200",
                pathname.startsWith("/profile") ? "text-kith-text" : "text-kith-muted"
              )}
            >
              <Avatar
                src={avatarUrl}
                username={username}
                fullName={fullName}
                size="sm"
              />
              <span>Profile</span>
              {pathname.startsWith("/profile") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-kith-orange" />
              )}
            </Link>
          ) : (
            <NavItem
              href="/profile"
              label="Profile"
              active={pathname.startsWith("/profile")}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
  icon,
  badge,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "relative flex flex-col items-center justify-center gap-0.5 min-h-[48px] min-w-[48px] text-[10px] font-body transition-colors duration-200",
        active ? "text-kith-text" : "text-kith-muted"
      )}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-2 bg-kith-orange text-white text-[9px] font-body font-medium min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 leading-none">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span>{label}</span>
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-kith-orange" />
      )}
    </Link>
  );
}
