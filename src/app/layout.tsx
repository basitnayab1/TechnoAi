import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TechnoAI — Intelligence, engineered for the real world",
  description:
    "TechnoAI builds foundation models, agent infrastructure, and developer tools that let teams ship reliable AI products in days, not quarters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-clip">
      <body
        className={`${geistSans.variable} ${geistMono.variable} max-w-full overflow-x-clip bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
