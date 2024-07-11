import type { Metadata } from "next";
import { Baloo_Bhaijaan_2 } from "next/font/google";
import "./globals.css";


const ballo = Baloo_Bhaijaan_2({subsets:["arabic"]})

export const metadata: Metadata = {
  title: "ECL",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={ballo.className}>{children}</body>
    </html>
  );
}
