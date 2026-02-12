import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bug Tracker Dashboard",
  description: "Professional bug tracker dashboard built with Next.js 14 and Tailwind CSS"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
