import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Retrivo — AI-Powered Lost & Found",
  description:
    "Retrivo uses AI to intelligently match lost and found items, helping reunite people with their belongings faster.",
  keywords: ["lost and found", "AI", "retrivo", "missing items"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
