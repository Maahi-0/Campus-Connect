import { Outfit, Space_Grotesk } from 'next/font/google'
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space',
})

export const metadata = {
  title: "Campus Connect | Centralized Club & Event Platform",
  description: "A centralized platform for college clubs to manage events and students to stay updated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-black text-white">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-white/5 py-8 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

