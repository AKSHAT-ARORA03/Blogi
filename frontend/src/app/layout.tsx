import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blogi - A Full-Stack Blog Application",
  description: "A complete blog application with Next.js frontend and FastAPI backend",
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
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
              <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Blogi. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
