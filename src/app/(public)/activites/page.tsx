import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Activités — LGVI",
  description:
    "Découvrez les 8 ateliers des Grandes Vacances de l'Impact : Peinture, Danse, Théâtre, Musique, Bricolage, Cuisine, Plein air et Talk Show.",
};

const ACTIVITES = [
  {
    nom: "Peinture",
    emoji: "🎨",
    desc: "Exploration des couleurs, techniques artistiques et expression créative. Les enfants découvrent différents styles de peinture et créent leurs propres œuvres.",
    objectifs: ["Expression artistique", "Créativité", "Motricité fine"],
  },
  {
    nom: "Danse",
    emoji: "💃",
    desc: "Expression corporelle à travers différents styles dont les danses africaines. Les enfants développent leur coordination, leur rythme et leur confiance en eux.",
    objectifs: ["Expression corporelle", "Danses africaines", "Confiance en soi"],
  },
  {
    nom: "Théâtre",
    emoji: "🎭",
    desc: "Jeu dramatique, improvisation et mise en scène. Les enfants apprennent à s'exprimer devant un public et à travailler en équipe pour créer des saynètes.",
    objectifs: ["Prise de parole", "Travail d'équipe", "Imagination"],
  },
  {
    nom: "Musique",
    emoji: "🎵",
    desc: "Initiation aux instruments, apprentissage du rythme et du chant. Les enfants découvrent l'univers musical à travers des exercices ludiques et pratiques.",
    objectifs: ["Sens du rythme", "Écoute active", "Créativité sonore"],
  },
  {
    nom: "Bricolage",
    emoji: "🔨",
    desc: "Créations manuelles à partir de matériaux recyclés ou naturels. Les enfants développent leur débrouillardise, leur patience et leur motricité fine.",
    objectifs: ["Débrouillardise", "Recyclage", "Précision"],
  },
  {
    nom: "Cuisine",
    emoji: "👨‍🍳",
    desc: "Découverte culinaire et équilibre alimentaire. Les enfants préparent des recettes simples et apprennent les bases d'une alimentation saine.",
    objectifs: ["Autonomie", "Équilibre alimentaire", "Curiosité"],
  },
  {
    nom: "Plein air",
    emoji: "🌿",
    desc: "Jeux collectifs, sports et animations en extérieur. Les enfants développent leur esprit d'équipe, leur forme physique et leur connexion à la nature.",
    objectifs: ["Esprit d'équipe", "Activité physique", "Socialisation"],
  },
  {
    nom: "Talk Show",
    emoji: "🎤",
    desc: "Temps d'inspiration unique : chaque jour, une personnalité béninoise (entrepreneur, artiste, sportif...) partage son parcours avec les enfants.",
    objectifs: ["Inspiration", "Éveil citoyen", "Ambition"],
    highlight: true,
  },
];

export default function ActivitesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Nos activités</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            8 ateliers conçus pour révéler le talent de chaque enfant, de 5 à 13 ans.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIVITES.map((a) => (
            <div
              key={a.nom}
              className={`rounded-2xl border p-6 transition-all hover:shadow-md ${
                a.highlight
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{a.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{a.nom}</h2>
                    {a.highlight && (
                      <span className="text-xs px-2 py-0.5 bg-primary text-white rounded-full font-medium">
                        Exclusif
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {a.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {a.objectifs.map((o) => (
                  <span
                    key={o}
                    className="text-xs px-2.5 py-1 bg-muted rounded-full text-muted-foreground font-medium"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Les places sont limitées — inscrivez votre enfant dès maintenant.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all text-lg shadow-lg shadow-primary/20"
          >
            Inscrire mon enfant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
