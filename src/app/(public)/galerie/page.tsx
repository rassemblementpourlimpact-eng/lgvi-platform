import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export const metadata = {
  title: "Galerie — LGVI",
  description: "Photos et souvenirs des éditions des Grandes Vacances de l'Impact",
};

export const dynamic = "force-dynamic";

export default async function GaleriePage() {
  const albums = await prisma.mediaAlbum.findMany({
    where: {
      edition: { statut: { in: ["EN_COURS", "TERMINEE", "ARCHIVEE"] } },
      medias: { some: {} },
    },
    include: {
      medias: { orderBy: { ordre: "asc" }, take: 4 },
      _count: { select: { medias: true } },
      edition: { select: { nom: true, annee: true } },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Galerie</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Les meilleurs moments des éditions LGVI en images.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Bientôt disponible</h2>
            <p className="text-muted-foreground">Les photos de la prochaine édition seront publiées ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="group rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {album.medias.length > 0 ? (
                    <div className="grid grid-cols-2 h-full">
                      {album.medias.slice(0, 4).map((m, i) => (
                        <div
                          key={m.id}
                          className={`relative overflow-hidden ${album.medias.length === 1 ? "col-span-2 row-span-2" : ""}`}
                        >
                          <img
                            src={getCloudinaryUrl(m.cloudinaryId, "card")}
                            alt={m.alt ?? album.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {i === 3 && album._count.medias > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">+{album._count.medias - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground">{album.titre}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">
                      {album.activite ?? album.edition.nom}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {album._count.medias} photo{album._count.medias > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
