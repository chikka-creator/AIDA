import { Poppins, Playfair_Display } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300","400","500","600"],
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["700"],
  display: 'swap',
});

export const metadata = { 
  title: "portofolio", 
  description: "Creative Landing" 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.className} ${playfair.className}`}>
      <body>{children}</body>
    </html>
  );
}