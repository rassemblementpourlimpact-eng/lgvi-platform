import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(montant);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-BJ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getCloudinaryUrl(
  publicId: string,
  context: "card" | "gallery" | "hero" | "avatar" = "card"
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transforms = {
    card: "f_auto,q_auto,w_400,h_300,c_fill",
    gallery: "f_auto,q_auto,w_800,h_600,c_fill",
    hero: "f_auto,q_auto,w_1200,h_600,c_fill",
    avatar: "f_auto,q_auto,w_200,h_200,c_fill,g_face",
  };
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms[context]}/${publicId}`;
}
