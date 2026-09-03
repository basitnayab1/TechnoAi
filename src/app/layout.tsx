import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
export const metadata: Metadata = {
  title: "TechnoAi — Advanced Technology Solutions for Mission Critical Operations",
  description: "Delivering drones, robotics, satellite connectivity, AI hardware, security systems and infrastructure technology for government, enterprise and industrial sectors.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} max-w-full overflow-x-hidden bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
