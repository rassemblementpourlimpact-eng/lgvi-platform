import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Palette, Music, Mic2, Utensils, Wrench, Leaf, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Activités — LGVI",
  description: "Découvrez les 8 ateliers des Grandes Vacances de l'Impact.",
};

const ACTIVITES = [
  {
    nom: "Peinture",
    icon: Palette,
    desc: "Exploration des couleurs, techniques artistiques et expression créative. Les enfants découvrent différents styles de peinture et créent leurs propres œuvres.",
    objectifs: ["Expression artistique", "Créativité", "Motricité fine"],
  },
  {
    nom: "Danse",
    icon: Users,
    desc: "Expression corporelle à travers différents styles dont les danses africaines. Coordination, rythme et confiance en soi.",
    objectifs: ["Expression corporelle", "Danses africaines", "Confiance en soi"],
  },
  {
    nom: "Théâtre",
    icon: Mic2,
    desc: "Jeu dramatique, improvisation et mise en scène. Les enfants apprennent à s'exprimer devant un public et à travailler en équipe.",
    objectifs: ["Prise de parole", "Travail d'équipe", "Imagination"],
  },
  {
    nom: "Musique",
    icon: Music,
    desc: "Initiation aux instruments, apprentissage du rythme et du chant à travers des exercices ludiques et pratiques.",
    objectifs: ["Sens du rythme", "Écoute active", "Créativité sonore"],
  },
  {
    nom: "Bricolage",
    icon: Wrench,
    desc: "Créations manuelles à partir de matériaux recyclés ou naturels. Débrouillardise, patience et motricité fine.",
    objectifs: ["Débrouillardise", "Recyclage", "Précision"],
  },
  {
    nom: "Cuisine",
    icon: Utensils,
    desc: "Découverte culinaire et alimentation équilibrée. Les enfants préparent des recettes simples et saines.",
    objectifs: ["Autonomie", "Équilibre alimentaire", "Curiosité"],
  },
  {
    nom: "Plein air",
    icon: Leaf,
    desc: "Jeux collectifs, sports et animations en extérieur. Esprit d'équipe, activité physique et connexion à la nature.",
    objectifs: ["Esprit d'équipe", "Activité physique", "Socialisation"],
  },
  {
    nom: "Talk Show",
    icon: Mic2,
    desc: "Chaque jour, une personnalité béninoise partage son parcours avec les enfants. Un moment d'inspiration unique.",
    objectifs: ["Inspiration", "Éveil citoyen", "Ambition"],
    highlight: true,
  },
];

export default function ActivitesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Programme LGVI</p>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Nos ateliers</h1>
          <p className="text-white/60 max-w-xl">
            8 activités conçues pour révéler le talent de chaque enfant, de 5 à 13 ans.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACTIVITES.map((a) => (
            <div
              key={a.nom}
              className={`p-6 rounded-xl border transition-all ${
                a.highlight
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${a.highlight ? "bg-primary/15" : "bg-secondary/5"}`}>
                  <a.icon className={`w-5 h-5 ${a.highlight ? "text-primary" : "text-secondary"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-foreground">{a.nom}</h2>
                    {a.highlight && (
                      <span className="text-[10px] px-2 py-0.5 bg-primary text-white rounded-full font-semibold uppercase tracking-wide">
                        Exclusif
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{a.desc}</p>
              <div className="flex flex-wrap gap-2">
                {a.objectifs.map((o) => (
                  <div key={o} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-xs text-muted-foreground">{o}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-muted-foreground mb-5">
            Les places sont limitées — inscrivez votre enfant dès maintenant.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Inscrire mon enfant
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
