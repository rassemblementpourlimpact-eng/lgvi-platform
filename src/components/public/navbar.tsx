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
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">LG</span>
          </div>
          <span className="font-black text-secondary text-sm tracking-tight hidden sm:block">LGVI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === l.href
                  ? "text-primary font-semibold"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/inscription"
            className="hidden md:inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            S&apos;inscrire
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setOuvert(!ouvert)}
            aria-label="Menu"
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
              className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 pb-1">
            <Link
              href="/inscription"
              onClick={() => setOuvert(false)}
              className="block px-4 py-3 bg-primary text-white text-sm font-bold rounded-lg text-center"
            >
              S&apos;inscrire maintenant
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
