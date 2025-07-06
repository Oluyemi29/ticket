import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Provider from "@/components/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ticket Management System",
    template: "%s | Ticket Management System",
  },

  metadataBase: new URL("https://ticket-olive-xi.vercel.app"),
  description:
    "A smart and secure Ticket Management Software built with Next.js, Node.js, and PostgreSQL. This app supports seamless ticket routing based on category selection, and offers multi-admin access to manage categorized tickets efficiently. Featuring robust authentication, real-time session management, and a modern UI powered by Tailwind CSS, the system ensures streamlined issue tracking and resolution in one unified platform.",
  openGraph: {
    title: "Ticket Management System",
    description:
      "A smart and secure Ticket Management Software built with Next.js, Node.js, and PostgreSQL. This app supports seamless ticket routing based on category selection, and offers multi-admin access to manage categorized tickets efficiently. Featuring robust authentication, real-time session management, and a modern UI powered by Tailwind CSS, the system ensures streamlined issue tracking and resolution in one unified platform.",
    url: "https://ticket-olive-xi.vercel.app",
    siteName: "Ticket Management System",
    images: {
      url: "/ticketreg.PNG",
      width: 1200,
      height: 630,
      alt: "Ticket Management System",
    },
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <Toaster />
          <div className="w-[95%] mx-auto">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
