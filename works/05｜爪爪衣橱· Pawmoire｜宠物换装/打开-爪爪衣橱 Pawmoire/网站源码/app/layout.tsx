import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "爪爪衣橱 PAWMOIRE · 宠物试穿工作室",
  description: "上传宠物照片和穿搭参考，为毛孩子发现新的可爱。",
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
