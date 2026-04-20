import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kith — Run with your people",
  description: "Find your kith. Plan a run. Show up together.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#F95E2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Maps script loaded on-demand by LocationPicker */}
      </head>
      <body className="font-body antialiased bg-white text-kith-text">
        {children}
      </body>
    </html>
  );
}
