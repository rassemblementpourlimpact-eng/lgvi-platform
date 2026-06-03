import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {
  ArrowRight, Palette, Music, Utensils, Wrench,
  Leaf, Mic2, Users, MapPin, Calendar, Clock, CheckCircle,
  ChevronRight,
} from "lucide-react";

export const revalidate = 3600;

const ACTIVITES = [
  { nom: "Peinture", icon: Palette, desc: "Techniques artistiques et expression par la couleur" },
  { nom: "Danse", icon: Users, desc: "Expression corporelle et danses africaines" },
  { nom: "Théâtre", icon: Mic2, desc: "Improvisation, mise en scène et confiance en soi" },
  { nom: "Musique", icon: Music, desc: "Rythme, chant et initiation aux instruments" },
  { nom: "Bricolage", icon: Wrench, desc: "Créations manuelles et recyclage créatif" },
  { nom: "Cuisine", icon: Utensils, desc: "Recettes simples et alimentation équilibrée" },
  { nom: "Plein air", icon: Leaf, desc: "Sports collectifs et animations en extérieur" },
  { nom: "Talk Show", icon: Mic2, desc: "Rencontres avec des personnalités inspirantes du Bénin" },
];

async function getStats() {
  try {
    const [editions, participants, inscriptionsOuvertes] = await Promise.all([
      prisma.edition.count({ where: { statut: { in: ["TERMINEE", "ARCHIVEE", "EN_COURS"] } } }),
      prisma.participant.count(),
      prisma.edition.findFirst({ where: { statut: "INSCRIPTIONS_OUVERTES" } }),
    ]);
    return { editions, participants, inscriptionsOuvertes };
  } catch {
    return { editions: 1, participants: 50, inscriptionsOuvertes: null };
  }
}

export default async function HomePage() {
  const { editions, participants, inscriptionsOuvertes } = await getStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          {inscriptionsOuvertes && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-xs font-semibold text-primary mb-8 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Inscriptions ouvertes — {inscriptionsOuvertes.nom}
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6 max-w-3xl">
            Les Grandes Vacances<br />
            <span className="text-primary">de l&apos;Impact</span>
          </h1>
          <p className="text-white/65 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl">
            Programme éducatif, créatif et récréatif pour les enfants de 5 à 13 ans
            à Cotonou. Un mois d&apos;ateliers variés dans un cadre sécurisé.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/45 mb-10">
            <span>7 – 31 juillet 2026</span>
            <span>8h00 – 12h00</span>
            <span>Lun · Mar · Jeu · Ven</span>
            <span>5 – 13 ans</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors text-base"
            >
              Inscrire mon enfant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/activites"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/15 transition-colors border border-white/15 text-base"
            >
              Voir les activités
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <p className="text-3xl font-black">{Math.max(editions, 1)}+</p>
              <p className="text-white/75 text-xs mt-0.5">Édition{editions > 1 ? "s" : ""}</p>
            </div>
            <div>
              <p className="text-3xl font-black">{participants > 0 ? `${participants}+` : "50+"}</p>
              <p className="text-white/75 text-xs mt-0.5">Enfants accueillis</p>
            </div>
            <div>
              <p className="text-3xl font-black">8</p>
              <p className="text-white/75 text-xs mt-0.5">Ateliers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITÉS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Programme</p>
            <h2 className="text-3xl md:text-4xl font-black text-secondary">8 ateliers pour révéler chaque enfant</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIVITES.map((a) => (
              <div key={a.nom} className="p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all bg-white group">
                <div className="w-10 h-10 bg-secondary/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <a.icon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{a.nom}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/activites" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              En savoir plus sur nos activités
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMME JOURNÉE */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Organisation</p>
            <h2 className="text-3xl md:text-4xl font-black">Une journée à LGVI</h2>
            <p className="text-white/55 mt-3 max-w-xl">De 8h à 12h, chaque journée est structurée autour de 7 temps forts.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { h: "08h00", label: "Accueil" },
              { h: "08h30", label: "Activité principale" },
              { h: "09h45", label: "Pause" },
              { h: "10h00", label: "Session créative" },
              { h: "11h00", label: "Collation" },
              { h: "11h15", label: "Plein air" },
              { h: "11h45", label: "Talk Show" },
            ].map((t) => (
              <div key={t.h} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/35 font-mono mb-2">{t.h}</p>
                <p className="text-sm font-medium text-white/85 leading-tight">{t.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { sem: "Semaine 1", label: "Découverte", desc: "Prise en main, rencontres" },
              { sem: "Semaine 2", label: "Approfondissement", desc: "Compétences créatives" },
              { sem: "Semaine 3", label: "Maîtrise", desc: "Projets collectifs" },
              { sem: "Semaine 4", label: "Spectacle final", desc: "Présentation aux familles" },
            ].map((s, i) => (
              <div key={s.sem} className="rounded-xl border border-white/10 overflow-hidden">
                <div className={`px-4 py-2.5 ${i === 0 ? "bg-primary" : i === 1 ? "bg-[#1a56db]" : i === 2 ? "bg-[#7e3af2]" : "bg-[#0e9f6e]"}`}>
                  <p className="text-white/60 text-[10px] uppercase tracking-wide">{s.sem}</p>
                  <p className="text-white font-bold text-sm">{s.label}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFOS PRATIQUES */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Pourquoi LGVI</p>
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6">Plus qu&apos;un centre de vacances</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                LGVI combine loisirs et apprentissage dans un environnement sécurisé.
                Chaque journée est conçue pour permettre à l&apos;enfant de grandir, créer et s&apos;épanouir.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Développement personnel", "Créativité", "Socialisation", "Éveil citoyen", "Apprentissage pratique", "Expression artistique"].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: MapPin, titre: "Lieu", contenu: "École La Ronde, Zogbohouè — derrière le Stade de l'Amitié G.M. Kerekou, Cotonou" },
                { icon: Calendar, titre: "Dates 2026", contenu: "7 – 31 juillet 2026 · Lundi, mardi, jeudi et vendredi" },
                { icon: Clock, titre: "Horaires", contenu: "8h00 – 12h00 · Enfants de 5 à 13 ans (CI à CM2)" },
              ].map((item) => (
                <div key={item.titre} className="bg-white rounded-xl p-5 border border-border flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm mb-0.5">{item.titre}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.contenu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
            Prêt à inscrire votre enfant ?
          </h2>
          <p className="text-muted-foreground mb-8">
            L&apos;inscription prend moins de 5 minutes. Les places sont limitées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              S&apos;inscrire maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/preinscription"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Réserver une place
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Pas encore décidé ?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Posez vos questions →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
