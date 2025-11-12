import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "../components/SessionProvider";

export const metadata: Metadata = {
  title: "AIDA Shop",
  description: "AIDA PAGE SHOP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}