import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry Tracker",
  description: "An efficient and intuitive application for managing your pantry inventory. Easily add, update, and remove items, and use the search functionality to quickly find what you need. Built with Next.js, Material UI, and Firebase for a seamless user experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
