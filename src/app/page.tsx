import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ArrowRight, MapPin, Calendar, Clock, Check } from "lucide-react";

export const revalidate = 3600;

const ACTIVITES = [
  { nom: "Peinture", desc: "Expression artistique et techniques de dessin" },
  { nom: "Danse", desc: "Expression corporelle et danses africaines" },
  { nom: "Théâtre", desc: "Improvisation, jeu de rôle et prise de parole" },
  { nom: "Musique", desc: "Rythme, chant et initiation aux instruments" },
  { nom: "Bricolage", desc: "Créations manuelles et recyclage créatif" },
  { nom: "Cuisine", desc: "Recettes simples et alimentation équilibrée" },
  { nom: "Plein air", desc: "Sports collectifs et jeux en extérieur" },
  { nom: "Talk Show", desc: "Rencontres avec des personnalités béninoises" },
];

const PROGRAMME = [
  { jour: "Semaine 1", titre: "Découverte", desc: "Prise en main des activités, premières rencontres entre enfants" },
  { jour: "Semaine 2", titre: "Approfondissement", desc: "Développement des compétences créatives et artistiques" },
  { jour: "Semaine 3", titre: "Maîtrise", desc: "Collaboration, projets collectifs et préparation" },
  { jour: "Semaine 4", titre: "Spectacle final", desc: "Présentation des réalisations devant les familles" },
];

async function getStats() {
  try {
    const [participants, inscriptionsOuvertes] = await Promise.all([
      prisma.participant.count(),
      prisma.edition.findFirst({ where: { statut: "INSCRIPTIONS_OUVERTES" } }),
    ]);
    return { participants, inscriptionsOuvertes };
  } catch {
    return { participants: 0, inscriptionsOuvertes: null };
  }
}

export default async function HomePage() {
  const { participants, inscriptionsOuvertes } = await getStats();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* HERO */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          {inscriptionsOuvertes && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full mb-8 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Inscriptions ouvertes
            </div>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-secondary leading-[1.0] mb-6">
            Les Grandes<br />
            Vacances<br />
            <span className="text-primary">de l&apos;Impact</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mb-8">
            Programme éducatif, créatif et récréatif pour les enfants de 5 à 13 ans.
            8 ateliers, 1 mois, à Cotonou.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10 border-y border-border py-4">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> 7 – 31 juillet 2026</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 8h00 – 12h00</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Cotonou, Bénin</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Inscrire mon enfant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/preinscription"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-secondary text-secondary font-bold rounded-lg hover:bg-secondary hover:text-white transition-colors text-sm"
            >
              Réserver une place
            </Link>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="bg-secondary text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-6 text-center divide-x divide-white/15">
            <div className="px-4">
              <p className="text-3xl md:text-4xl font-black text-primary">8</p>
              <p className="text-white/60 text-sm mt-1">Ateliers</p>
            </div>
            <div className="px-4">
              <p className="text-3xl md:text-4xl font-black text-primary">{participants > 0 ? `${participants}+` : "50+"}</p>
              <p className="text-white/60 text-sm mt-1">Enfants accueillis</p>
            </div>
            <div className="px-4">
              <p className="text-3xl md:text-4xl font-black text-primary">4</p>
              <p className="text-white/60 text-sm mt-1">Semaines</p>
            </div>
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">À propos</p>
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-5">
                Plus qu&apos;un centre de vacances
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                LGVI est un programme qui combine loisirs et apprentissage dans un
                environnement sécurisé et stimulant. Chaque journée est structurée
                pour permettre à l&apos;enfant de créer, grandir et s&apos;épanouir.
              </p>
              <div className="space-y-2.5">
                {["Développement personnel et créatif", "Ateliers encadrés par des formateurs", "Intervenants inspirants chaque jour", "Spectacle final devant les familles"].map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Lundi · Mardi", sub: "Jeudi · Vendredi", accent: true },
                { label: "8h00 – 12h00", sub: "4 heures/jour", accent: false },
                { label: "5 – 13 ans", sub: "CI au CM2", accent: false },
                { label: "École La Ronde", sub: "Zogbohouè, Cotonou", accent: true },
              ].map((item, i) => (
                <div key={i} className={`p-5 rounded-xl ${item.accent ? "bg-secondary text-white" : "bg-muted border border-border"}`}>
                  <p className={`font-bold text-base ${item.accent ? "text-white" : "text-foreground"}`}>{item.label}</p>
                  <p className={`text-sm mt-0.5 ${item.accent ? "text-white/60" : "text-muted-foreground"}`}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITÉS */}
      <section className="border-b border-border bg-muted/40">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="mb-10">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Programme</p>
            <h2 className="text-3xl md:text-4xl font-black text-secondary">8 ateliers créatifs</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ACTIVITES.map((a, i) => (
              <div key={a.nom} className="bg-white p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-xs font-black text-primary">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{a.nom}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/activites" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Voir le détail des activités <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMME 4 SEMAINES */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="mb-10">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Déroulement</p>
            <h2 className="text-3xl md:text-4xl font-black text-secondary">4 semaines structurées</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PROGRAMME.map((s, i) => (
              <div key={s.jour} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${i === 3 ? "bg-primary text-white" : "bg-secondary text-white"}`}>
                    {i + 1}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{s.jour}</p>
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{s.titre}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFORMATIONS PRATIQUES */}
      <section className="border-b border-border bg-muted/40">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="mb-10">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Informations pratiques</p>
            <h2 className="text-3xl md:text-4xl font-black text-secondary">Tout ce qu&apos;il faut savoir</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                titre: "Dates",
                lignes: ["7 – 31 juillet 2026", "Lundi, mardi, jeudi, vendredi", "8h00 – 12h00"],
              },
              {
                titre: "Lieu",
                lignes: ["École La Ronde", "Zogbohouè, Cotonou", "Derrière le Stade de l'Amitié"],
              },
              {
                titre: "Conditions",
                lignes: ["Enfants de 5 à 13 ans", "CI au CM2", "Places limitées"],
              },
            ].map((card) => (
              <div key={card.titre} className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wide border-b border-border pb-3">{card.titre}</h3>
                <div className="space-y-2">
                  {card.lignes.map((l) => (
                    <p key={l} className="text-sm text-muted-foreground">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA INSCRIPTION */}
      <section className="bg-primary">
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Prêt à inscrire votre enfant ?
          </h2>
          <p className="text-white/75 mb-8 text-lg">
            Les places sont limitées. L&apos;inscription prend moins de 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-colors"
            >
              S&apos;inscrire maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/preinscription"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/15 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/30"
            >
              Réserver une place
            </Link>
          </div>
          <p className="mt-5 text-white/50 text-sm">
            Une question ?{" "}
            <Link href="/contact" className="text-white/80 underline hover:text-white">
              Contactez-nous
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
