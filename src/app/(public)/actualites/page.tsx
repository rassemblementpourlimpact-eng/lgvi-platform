import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils";
import { Newspaper } from "lucide-react";

export const metadata = {
  title: "Actualités — LGVI",
  description: "Les dernières nouvelles des Grandes Vacances de l'Impact",
};

export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  let actualites: Awaited<ReturnType<typeof prisma.actualite.findMany>> = [];
  try {
    actualites = await prisma.actualite.findMany({
      where: { publie: true },
      orderBy: { publieLe: "desc" },
    });
  } catch {
    actualites = [];
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Actualités</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Suivez toutes les nouvelles des Grandes Vacances de l&apos;Impact.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {actualites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Newspaper className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Bientôt disponible</h2>
            <p className="text-muted-foreground">Les actualités de la prochaine édition seront publiées ici.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {actualites.map((actu) => (
              <article
                key={actu.id}
                className="group flex flex-col md:flex-row gap-6 border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all"
              >
                {actu.image && (
                  <div className="md:w-64 shrink-0 bg-muted overflow-hidden">
                    <img
                      src={getCloudinaryUrl(actu.image, "card")}
                      alt={actu.titre}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  {actu.publieLe && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(actu.publieLe).toLocaleDateString("fr-BJ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {actu.titre}
                  </h2>
                  {actu.extrait && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {actu.extrait}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
