import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — LGVI",
  description: "Contactez l'équipe des Grandes Vacances de l'Impact",
};

const FAQ = [
  {
    q: "Quel est l'âge requis pour participer ?",
    r: "Le programme est ouvert aux enfants de 5 à 13 ans (du CI au CM2).",
  },
  {
    q: "Quels sont les jours et horaires ?",
    r: "Lundi, mardi, jeudi et vendredi de 8h00 à 12h00.",
  },
  {
    q: "Comment se déroule l'inscription ?",
    r: "L'inscription se fait en ligne via notre formulaire en 5 étapes simples : informations du parent, de l'enfant, données médicales, choix de l'activité et paiement.",
  },
  {
    q: "Quels modes de paiement acceptez-vous ?",
    r: "Nous acceptons FedaPay (carte bancaire), Mobile Money et le paiement en espèces à l'accueil.",
  },
  {
    q: "Puis-je inscrire plusieurs enfants ?",
    r: "Oui, après la confirmation d'inscription du premier enfant, vous pouvez en inscrire un autre sans ressaisir vos informations de parent.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-muted">
      {/* Hero */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Nous contacter</h1>
          <p className="text-white/70">
            L&apos;équipe LGVI répond du lundi au vendredi de 8h à 18h,
            et le samedi de 9h à 15h.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Coordonnées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="tel:+22901614816020"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-border hover:shadow-md hover:border-primary/40 transition-all group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Téléphone</p>
              <p className="font-semibold text-foreground">+229 01 61 48 16 20</p>
            </div>
          </a>

          <a
            href="mailto:lgvi@rassemblementpourlimpact.org"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-border hover:shadow-md hover:border-primary/40 transition-all group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="font-semibold text-foreground text-sm">
                lgvi@rassemblementpourlimpact.org
              </p>
            </div>
          </a>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Adresse</p>
              <p className="font-semibold text-foreground text-sm leading-relaxed">
                École La Ronde, Zogbohouè<br />
                <span className="font-normal text-muted-foreground">
                  Derrière le Stade de l&apos;Amitié Général Mathieu Kerekou<br />
                  Cotonou, République du Bénin
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Programme 2026</p>
              <p className="font-semibold text-foreground text-sm">
                7 – 31 juillet 2026
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Lun · Mar · Jeu · Ven · 8h00 – 12h00<br />
                Enfants de 5 à 13 ans (CI à CM2)
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-[#25d366]/10 border border-[#25d366]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#25d366]" />
            <div>
              <p className="font-semibold text-foreground">Réponse rapide sur WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                Pour toute question urgente, contactez-nous directement.
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#20b858] transition-colors"
          >
            Ouvrir WhatsApp
          </a>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-5">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="bg-white rounded-2xl border border-border p-5"
              >
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
