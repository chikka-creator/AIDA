import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIDA Shop",
  description: "AIDA PAGE SHOP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
