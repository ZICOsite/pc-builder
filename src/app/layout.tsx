import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TelegramProvider } from "@/components/telegram-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { Nav } from "@/components/nav";
import { ReferralTracker } from "@/components/referral-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PC Forge",
  description: "Конфигуратор ПК в Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <TelegramProvider>
            <ReferralTracker />
            <Nav />
            {children}
          </TelegramProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
