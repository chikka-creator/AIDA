import { Playfair_Display } from "next/font/google";
import SessionProvider from "./components/SessionProvider";
import Toast from "./components/Toast"; // Add this

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  display: 'swap',
});

export const metadata = {
  title: "AIDA Creative",
  description: "A minimal and elegant creative portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <SessionProvider>
          <Toast /> {/* Add this */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}