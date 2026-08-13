import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "26Q2 OGV 市场复盘",
  description: "可持续更新的 OGV 季度市场复盘",
  icons: {
    icon: "/ogv-market-review/favicon.svg",
    shortcut: "/ogv-market-review/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
