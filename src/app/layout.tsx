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
  title: "TechnoAi — Advanced Technology Solutions for Mission Critical Operations",
  description:
    "Delivering drones, robotics, satellite connectivity, AI hardware, security systems and infrastructure technology for government, enterprise and industrial sectors.",
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
