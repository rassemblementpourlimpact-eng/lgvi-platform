import type { Metadata } from "next";
import "./globals.css";

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
    "Rassemblement pour l'Impact",
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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
