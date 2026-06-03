import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LGVI — Les Grandes Vacances de l'Impact",
    template: "%s | LGVI",
  },
  description:
    "Programme éducatif, créatif et récréatif pour les enfants de 5 à 13 ans à Cotonou. Peinture, danse, théâtre, musique, bricolage, cuisine — du 7 au 31 juillet 2026.",
  keywords: [
    "vacances enfants Cotonou",
    "LGVI",
    "Les Grandes Vacances de l'Impact",
    "activités enfants Bénin",
    "programme éducatif Cotonou",
    "école La Ronde",
  ],
  openGraph: {
    title: "LGVI — Les Grandes Vacances de l'Impact",
    description:
      "Programme éducatif, créatif et récréatif pour les enfants de 5 à 13 ans à Cotonou. Du 7 au 31 juillet 2026.",
    locale: "fr_BJ",
    type: "website",
    siteName: "LGVI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
