import type { Metadata } from "next";
import { Baloo_Bhaijaan_2 } from "next/font/google";
import "./globals.css";
import Footer from "./landingPageComponents/Footer";


const ballo = Baloo_Bhaijaan_2({subsets:["arabic"]})

export const metadata: Metadata = {
  title: "ECL",
  description: "ecl",
  icons: {
    icon: '/eclLog.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className=" scroll-smooth focus:scroll-auto ">
      
      <body className={ballo.className}>
        <div className="flex flex-col min-h-screen">
          <main className=" flex-grow">
        {children}
        </main>
        </div>
        <Footer/>
      </body>
    </html>
  );
}
