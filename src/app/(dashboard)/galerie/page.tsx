import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouvelAlbumButton } from "@/components/dashboard/nouvel-album-button";
import { getCloudinaryUrl } from "@/lib/utils";
import { Image, ImageIcon } from "lucide-react";

export const metadata: Metadata = { title: "Galerie" };
export const dynamic = "force-dynamic";

export default async function GalerieDashboardPage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS", "TERMINEE"] } },
    orderBy: { annee: "desc" },
  });

  const albums = editionActive
    ? await prisma.mediaAlbum.findMany({
        where: { editionId: editionActive.id },
        include: {
          medias: { orderBy: { ordre: "asc" }, take: 4 },
          _count: { select: { medias: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const totalMedias = albums.reduce((acc, a) => acc + a._count.medias, 0);

  return (
    <>
      <DashboardHeader title="Galerie" editionNom={editionActive?.nom} />
      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {albums.length} album{albums.length > 1 ? "s" : ""} · {totalMedias} média{totalMedias > 1 ? "s" : ""}
          </p>
          {editionActive && <NouvelAlbumButton editionId={editionActive.id} />}
        </div>

        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
            <Image className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun album</h3>
            <p className="text-sm text-muted-foreground mb-4">Créez des albums pour archiver les souvenirs LGVI.</p>
            {editionActive && <NouvelAlbumButton editionId={editionActive.id} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album) => (
              <Card key={album.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                {/* Grille de miniatures */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {album.medias.length > 0 ? (
                    <div className="grid grid-cols-2 h-full">
                      {album.medias.slice(0, 4).map((m, i) => (
                        <div
                          key={m.id}
                          className={`relative overflow-hidden ${
                            album.medias.length === 1 ? "col-span-2 row-span-2" : ""
                          }`}
                        >
                          <img
                            src={getCloudinaryUrl(m.cloudinaryId, "card")}
                            alt={m.alt ?? album.titre}
                            className="w-full h-full object-cover"
                          />
                          {i === 3 && album._count.medias > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">+{album._count.medias - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{album.titre}</h3>
                      {album.activite && (
                        <p className="text-xs text-muted-foreground mt-0.5">{album.activite}</p>
                      )}
                    </div>
                    <Badge variant="muted">{album._count.medias} photo{album._count.medias > 1 ? "s" : ""}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
