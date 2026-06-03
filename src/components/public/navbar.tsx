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
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs tracking-tight">LG</span>
          </div>
          <div className="leading-none">
            <p className="font-bold text-secondary text-sm">LGVI</p>
            <p className="text-muted-foreground text-[10px] hidden sm:block">Les Grandes Vacances de l&apos;Impact</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                pathname === l.href
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inscription"
            className="hidden md:inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
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

      {ouvert && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-0.5">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOuvert(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/inscription"
            onClick={() => setOuvert(false)}
            className="block mt-3 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg text-center"
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      )}
    </nav>
  );
}
