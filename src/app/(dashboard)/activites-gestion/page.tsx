import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouvelleActiviteButton } from "@/components/dashboard/nouvelle-activite-button";
import { Star, Users } from "lucide-react";

export const metadata: Metadata = { title: "Activités" };
export const dynamic = "force-dynamic";

const ICONES: Record<string, string> = {
  Peinture: "🎨", Bricolage: "🔨", Théâtre: "🎭", Cuisine: "👨‍🍳",
  Musique: "🎵", "Danse et expression": "💃", default: "⭐",
};

export default async function ActivitesDashboardPage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS", "PREPARATION"] } },
    orderBy: { annee: "desc" },
  });

  const activites = editionActive
    ? await prisma.activite.findMany({
        where: { editionId: editionActive.id },
        include: {
          formateur: { select: { prenom: true, nom: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { nom: "asc" },
      })
    : [];

  return (
    <>
      <DashboardHeader title="Activités" editionNom={editionActive?.nom} />
      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {activites.length} activité{activites.length > 1 ? "s" : ""}
          </p>
          {editionActive && <NouvelleActiviteButton editionId={editionActive.id} />}
        </div>

        {activites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Star className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune activité</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez les activités de cette édition.
            </p>
            {editionActive && <NouvelleActiviteButton editionId={editionActive.id} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activites.map((a) => {
              const icone = ICONES[a.nom] ?? ICONES.default;
              const taux = Math.round((a._count.participants / a.capacite) * 100);
              const presque = taux >= 80;
              const complet = a._count.participants >= a.capacite;

              return (
                <Card key={a.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icone}</span>
                        <div>
                          <h3 className="font-bold text-foreground">{a.nom}</h3>
                          {a.formateur && (
                            <p className="text-xs text-muted-foreground">
                              {a.formateur.prenom} {a.formateur.nom}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={complet ? "destructive" : a.type === "PRINCIPALE" ? "default" : "muted"}>
                        {complet ? "Complet" : a.type === "PRINCIPALE" ? "Principale" : "Complémentaire"}
                      </Badge>
                    </div>

                    {a.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {a.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          {a._count.participants} / {a.capacite} inscrits
                        </span>
                        <span className={presque ? "text-warning font-medium" : "text-muted-foreground"}>
                          {taux}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            complet ? "bg-destructive" : presque ? "bg-warning" : "bg-primary"
                          }`}
                          style={{ width: `${Math.min(taux, 100)}%` }}
                        />
                      </div>
                    </div>

                    {(a.salle || a.horaires) && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                        {a.salle && <p>📍 {a.salle}</p>}
                        {a.horaires && <p>🕐 {a.horaires}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
