import Link from "next/link";

export function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">LG</span>
              </div>
              <span className="font-bold text-lg">LGVI</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Les Grandes Vacances de l&apos;Impact — un programme éducatif,
              créatif et récréatif pour les enfants à Cotonou.
            </p>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#25d366] text-white text-sm font-medium rounded-lg hover:bg-[#20b858] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Liens */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Navigation</h4>
            <ul className="space-y-2">
              {[
                ["Accueil", "/"],
                ["Activités", "/activites"],
                ["Galerie", "/galerie"],
                ["Actualités", "/actualites"],
                ["Contact", "/contact"],
                ["Inscription", "/inscription"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Contact & Lieu</h4>
            <div className="text-white/60 text-sm space-y-2">
              <p>📍 École La Ronde, Zogbohouè</p>
              <p className="text-white/40 text-xs pl-5 leading-snug">
                Derrière le Stade de l&apos;Amitié<br />
                Général Mathieu Kerekou<br />
                Cotonou, Bénin
              </p>
              <a href="tel:+22901614816020" className="flex items-center gap-2 hover:text-white transition-colors mt-3">
                📞 +229 01 61 48 16 20
              </a>
              <a href="mailto:lgvi@rassemblementpourlimpact.org" className="flex items-center gap-2 hover:text-white transition-colors break-all">
                ✉️ lgvi@rassemblementpourlimpact.org
              </a>
              <p className="text-white/40 text-xs mt-2">
                🕐 8h – 12h · Lun, Mar, Jeu, Ven
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {annee} Les Grandes Vacances de l&apos;Impact. Tous droits réservés.
          </p>
          <Link
            href="/connexion"
            className="text-white/20 hover:text-white/50 text-xs transition-colors"
          >
            Accès administrateur
          </Link>
        </div>
      </div>
    </footer>
  );
}
