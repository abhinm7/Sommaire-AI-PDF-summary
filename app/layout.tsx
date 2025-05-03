import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ORIGIN_URL } from "@/utils/helpers";
const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});



export const metadata: Metadata = {
  title: "Sommaire",
  description: "Sommaire is an app for summarzing PDF documents",
  icons:{
    icon:'/icon.ico',
  },
  openGraph:{
    images:[
      {
        url:'/opengraph-image.png',
      }
    ]
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates:{
    canonical:ORIGIN_URL
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${fontSans.variable} font-sans antialiased`}
        >
          <div className="flex relative min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            richColors 
            position="top-right"
            expand={true} // or "bottom-right", "top-left", etc.
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
