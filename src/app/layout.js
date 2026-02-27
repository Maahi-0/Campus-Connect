import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: "Campus Connect | Centralized Club & Event Platform",
  description: "A centralized platform for college clubs to manage events and students to stay updated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-black/5 py-8 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

