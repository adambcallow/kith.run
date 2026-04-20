"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationDot } from "./NotificationDot";

interface TopBarProps {
  username?: string;
  avatarUrl?: string | null;
  fullName?: string | null;
  unreadCount?: number;
}

export function TopBar({ username, avatarUrl, fullName, unreadCount = 0 }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] border-b border-kith-gray-light/50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="app-container flex items-center justify-between h-14">
        <Link href="/feed" className="font-display font-extrabold text-xl text-kith-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          kith
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/notifications"
            className="relative flex items-center justify-center w-11 h-11 rounded-full active:bg-kith-surface transition-colors"
            aria-label="Notifications"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-kith-text"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <NotificationDot count={unreadCount} />}
          </Link>
          {username && (
            <Link
              href="/profile"
              className="flex items-center justify-center w-11 h-11 rounded-full active:bg-kith-surface transition-colors"
              aria-label="Profile"
            >
              <Avatar
                src={avatarUrl}
                username={username}
                fullName={fullName}
                size="sm"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
