import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ArrowRight, Star, Users, Calendar, MapPin, CheckCircle } from "lucide-react";

export const revalidate = 3600;

const ACTIVITES = [
  { nom: "Peinture", emoji: "🎨", desc: "Exploration des couleurs et techniques artistiques" },
  { nom: "Danse", emoji: "💃", desc: "Expression corporelle, styles variés et danses africaines" },
  { nom: "Théâtre", emoji: "🎭", desc: "Jeu dramatique et développement de la confiance en soi" },
  { nom: "Musique", emoji: "🎵", desc: "Initiation aux instruments et apprentissage du rythme" },
  { nom: "Bricolage", emoji: "🔨", desc: "Créations manuelles et développement de la motricité" },
  { nom: "Cuisine", emoji: "👨‍🍳", desc: "Découverte culinaire et équilibre alimentaire" },
  { nom: "Plein air", emoji: "🌿", desc: "Jeux collectifs, sports et animations en extérieur" },
  { nom: "Talk Show", emoji: "🎤", desc: "Rencontres avec des personnalités inspirantes du Bénin" },
];

const VALEURS = [
  "Développement personnel",
  "Créativité",
  "Socialisation",
  "Éveil citoyen",
  "Apprentissage pratique",
  "Expression artistique",
];

async function getStats() {
  try {
    const [editions, participants] = await Promise.all([
      prisma.edition.count({ where: { statut: { in: ["TERMINEE", "ARCHIVEE", "EN_COURS"] } } }),
      prisma.participant.count(),
    ]);
    const inscriptionsOuvertes = await prisma.edition.findFirst({
      where: { statut: "INSCRIPTIONS_OUVERTES" },
    });
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

      {/* ── HERO ── */}
      <section className="relative bg-linear-to-br from-secondary via-[#163058] to-[#0f2640] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            {inscriptionsOuvertes && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/40 rounded-full text-sm font-medium text-primary mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Inscriptions ouvertes — {inscriptionsOuvertes.nom}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Les Grandes Vacances
              <br />
              <span className="text-primary">de l&apos;Impact</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-4 max-w-2xl">
              Un programme éducatif, créatif et récréatif pour les enfants de 5 à 13 ans
              à Cotonou. Peinture, danse, théâtre, musique, bricolage, cuisine et bien plus
              encore — dans un cadre sécurisé et stimulant.
            </p>
            <div className="flex flex-wrap gap-3 mb-8 text-sm text-white/60">
              <span className="flex items-center gap-1.5">📅 7 – 31 juillet 2026</span>
              <span className="flex items-center gap-1.5">🕐 8h – 12h</span>
              <span className="flex items-center gap-1.5">📆 Lun · Mar · Jeu · Ven</span>
              <span className="flex items-center gap-1.5">👶 5 – 13 ans</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 text-lg"
              >
                Inscrire mon enfant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/activites"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg"
              >
                Découvrir les activités
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-6 text-center text-white">
            <div>
              <p className="text-4xl font-black">{editions > 0 ? editions : "1"}+</p>
              <p className="text-white/80 text-sm mt-1">Édition{editions > 1 ? "s" : ""} organisée{editions > 1 ? "s" : ""}</p>
            </div>
            <div>
              <p className="text-4xl font-black">{participants > 0 ? `${participants}+` : "50+"}</p>
              <p className="text-white/80 text-sm mt-1">Enfants accueillis</p>
            </div>
            <div>
              <p className="text-4xl font-black">8+</p>
              <p className="text-white/80 text-sm mt-1">Activités proposées</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVITÉS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5" />
              Nos activités
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Un programme riche et varié
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Chaque enfant trouve son domaine d&apos;expression dans nos ateliers
              encadrés par des formateurs passionnés.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACTIVITES.map((a) => (
              <div
                key={a.nom}
                className="group p-5 rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all bg-white"
              >
                <span className="text-3xl mb-3 block">{a.emoji}</span>
                <h3 className="font-bold text-foreground mb-1">{a.nom}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNÉE TYPE ── */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-4">
              🕐 Organisation
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Une journée type à LGVI
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              De 8h à 12h, chaque journée est structurée en 7 temps forts.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { h: "08h00", label: "Accueil & rituel", emoji: "🌅" },
              { h: "08h30", label: "Activité principale", emoji: "⭐" },
              { h: "09h45", label: "Pause détente", emoji: "😌" },
              { h: "10h00", label: "Session créative", emoji: "🎨" },
              { h: "11h00", label: "Collation saine", emoji: "🍎" },
              { h: "11h15", label: "Plein air & sports", emoji: "🌿" },
              { h: "11h45", label: "Talk Show", emoji: "🎤" },
            ].map((t) => (
              <div key={t.h} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl mb-2 block">{t.emoji}</span>
                <p className="text-xs text-white/40 font-mono mb-1">{t.h}</p>
                <p className="text-sm font-medium text-white/90 leading-tight">{t.label}</p>
              </div>
            ))}
          </div>

          {/* 4 semaines */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { sem: "Semaine 1", label: "Découverte", desc: "Prise en main des activités, rencontres", color: "bg-primary" },
              { sem: "Semaine 2", label: "Approfondissement", desc: "Développement des compétences créatives", color: "bg-[#1a56db]" },
              { sem: "Semaine 3", label: "Maîtrise", desc: "Collaboration et projets collectifs", color: "bg-[#7e3af2]" },
              { sem: "Semaine 4", label: "Spectacle final", desc: "Présentation devant les familles", color: "bg-[#0e9f6e]" },
            ].map((s) => (
              <div key={s.sem} className="rounded-2xl border border-white/10 overflow-hidden">
                <div className={`${s.color} px-4 py-2`}>
                  <p className="text-white/60 text-xs">{s.sem}</p>
                  <p className="text-white font-bold">{s.label}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-white/60 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Users className="w-3.5 h-3.5" />
                Notre approche
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6">
                Plus qu&apos;un centre de vacances
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                LGVI combine loisirs et apprentissage dans un environnement
                sécurisé. Chaque journée est conçue pour permettre à l&apos;enfant
                de grandir, créer, et s&apos;épanouir.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {VALEURS.map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Localisation</h4>
                    <p className="text-sm text-muted-foreground">
                      École La Ronde, Zogbohouè — derrière le Stade de l&apos;Amitié
                      Général Mathieu Kerekou, Cotonou, Bénin
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Période 2026</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>7 – 31 juillet 2026</strong><br />
                      Lundi, mardi, jeudi et vendredi · 8h00 – 12h00<br />
                      Enfants de 5 à 13 ans (CI à CM2)
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Partenariat</h4>
                    <p className="text-sm text-muted-foreground">
                      Une initiative du Rassemblement pour l&apos;Impact en partenariat
                      avec l&apos;École Primaire La Ronde.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Prêt à inscrire votre enfant ?
          </h2>
          <p className="text-white/70 mb-8">
            L&apos;inscription prend moins de 5 minutes. Les places sont limitées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg text-lg"
            >
              S&apos;inscrire maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25d366] text-white font-bold rounded-2xl hover:bg-[#20b858] transition-all text-lg"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
