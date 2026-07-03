import type { Metadata } from "next";
import { Poppins, Golos_Text } from "next/font/google";
import { TelegramProvider } from "@/components/telegram-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { Nav } from "@/components/nav";
import { ReferralTracker } from "@/components/referral-tracker";
import "./globals.css";

// Poppins не поддерживает кириллицу (только latin/latin-ext/devanagari) — для ru-локали
// добавлен Golos Text (родной для кириллицы, визуально близкий геометричный гротеск).
// Оба заданы одной CSS-переменной через font-stack: каждый символ берёт глиф из первого
// шрифта, где он есть, поэтому переключать шрифт по локале вручную не нужно.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["cyrillic", "latin"],
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
      className={`${poppins.variable} ${golosText.variable} h-full antialiased`}
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
