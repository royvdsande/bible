import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bijbel Leesplan",
  description:
    "Een persoonlijk bijbelleesplan voor 7 dagen – ontdek Gods Woord met dagelijkse passages, reflectievragen en gebed.",
  keywords: ["bijbel", "leesplan", "geloof", "devotie", "christelijk"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="bg-black text-[#F0EDE8] font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
