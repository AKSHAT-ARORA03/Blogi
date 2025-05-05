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
            <footer className="bg-white dark:bg-gray-900 shadow-inner py-6 border-t border-gray-200 dark:border-gray-700">
              <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm space-y-2">
                <p>
                  © {new Date().getFullYear()}{" "}
                  <span className="font-semibold text-gray-800 dark:text-white">Blogi</span>. Empowering voices through words.
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <a href="/about" className="hover:underline">About</a>
                  <a href="/privacy" className="hover:underline">Privacy</a>
                  <a href="/terms" className="hover:underline">Terms</a>
                  <a
                    href="https://github.com/AKSHAT-ARORA03/Blogi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
