import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LeadModal } from "@/app/components/ui/LeadModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "321 Swipe | Payment Intelligence for Home Service Contractors",
  description:
    "321 Swipe helps HVAC, plumbing, electrical, roofing, and home service contractors understand processing costs, review statements, and improve payment workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-navy-900">
        {children}
        <LeadModal />

        {/*
          Tawk.to live chat — replace YOUR_PROPERTY_ID/YOUR_WIDGET_ID with
          the IDs from your Tawk.to dashboard → Administration → Channels → Chat Widget.
          Example: https://embed.tawk.to/64abc123def/1habcdefg
        */}
        <Script id="tawk-to" strategy="lazyOnload">{`
          var Tawk_API=Tawk_API||{},Tawk_LoadTime=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6a0321d34322901c35ea413d/1joe3o927';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `}</Script>
      </body>
    </html>
  );
}
