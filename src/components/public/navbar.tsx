"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LIENS = [
  { label: "Accueil", href: "/" },
  { label: "Activités", href: "/activites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">LG</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-secondary text-sm leading-tight">LGVI</p>
            <p className="text-muted-foreground text-[10px] leading-tight">Les Grandes Vacances de l'Impact</p>
          </div>
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-1">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === l.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/inscription"
            className="hidden md:inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            S&apos;inscrire
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setOuvert(!ouvert)}
          >
            {ouvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {ouvert && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOuvert(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/inscription"
            onClick={() => setOuvert(false)}
            className="block mt-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl text-center"
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      )}
    </nav>
  );
}
