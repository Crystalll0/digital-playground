import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "行迹 · 私人旅行手札",
  description: "在世界地图上收藏旅行、照片与邮戳。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
