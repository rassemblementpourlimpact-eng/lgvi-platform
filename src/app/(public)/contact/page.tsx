import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — LGVI",
  description: "Contactez l'équipe des Grandes Vacances de l'Impact",
};

const FAQ = [
  {
    q: "Quel est l'âge requis ?",
    r: "Le programme est ouvert aux enfants de 5 à 13 ans (du CI au CM2).",
  },
  {
    q: "Quels sont les horaires ?",
    r: "Lundi, mardi, jeudi et vendredi de 8h00 à 12h00.",
  },
  {
    q: "Comment s'inscrire ?",
    r: "L'inscription se fait en ligne via notre formulaire en 5 étapes : informations du parent, de l'enfant, données médicales, choix de l'activité et paiement.",
  },
  {
    q: "Quels modes de paiement acceptez-vous ?",
    r: "FedaPay (carte bancaire), Mobile Money et espèces à l'accueil.",
  },
  {
    q: "Puis-je inscrire plusieurs enfants ?",
    r: "Oui, après la première inscription vous pouvez en faire une autre sans ressaisir vos informations de parent.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Nous joindre</p>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Contact</h1>
          <p className="text-white/60">
            L&apos;équipe LGVI répond du lundi au vendredi de 8h à 18h, et le samedi de 9h à 15h.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-12">
        {/* Coordonnées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="tel:+22901614816020"
            className="flex items-center gap-4 p-5 border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Téléphone</p>
              <p className="font-semibold text-foreground">+229 01 61 48 16 20</p>
            </div>
          </a>

          <a
            href="mailto:lgvi@rassemblementpourlimpact.org"
            className="flex items-center gap-4 p-5 border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="font-semibold text-foreground text-sm">lgvi@rassemblementpourlimpact.org</p>
            </div>
          </a>

          <div className="flex items-start gap-4 p-5 border border-border rounded-xl">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Adresse</p>
              <p className="font-semibold text-foreground text-sm leading-relaxed">
                École La Ronde, Zogbohouè<br />
                <span className="font-normal text-muted-foreground">
                  Derrière le Stade de l&apos;Amitié G.M. Kerekou, Cotonou
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 border border-border rounded-xl">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Édition 2026</p>
              <p className="font-semibold text-foreground text-sm">7 – 31 juillet 2026</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Lun · Mar · Jeu · Ven · 8h00 – 12h00 · 5–13 ans
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-[#25d366]/8 border border-[#25d366]/25 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-7 h-7 text-[#25d366] shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Réponse rapide sur WhatsApp</p>
              <p className="text-sm text-muted-foreground">Pour toute question, contactez-nous directement.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-2.5 bg-[#25d366] text-white font-semibold rounded-lg hover:bg-[#20b858] transition-colors text-sm"
          >
            Ouvrir WhatsApp
          </a>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-5">Questions fréquentes</h2>
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {FAQ.map((item, i) => (
              <div key={i} className="px-6 py-5 bg-white">
                <h3 className="font-semibold text-foreground mb-1.5 text-sm">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
