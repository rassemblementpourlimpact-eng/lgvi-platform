import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouvellEditionButton } from "@/components/dashboard/nouvelle-edition-button";
import { formatDate } from "@/lib/utils";
import { Users, Calendar, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Éditions" };
export const dynamic = "force-dynamic";

const STATUT_CONFIG = {
  PREPARATION: { label: "Préparation", variant: "muted" as const },
  INSCRIPTIONS_OUVERTES: { label: "Inscriptions ouvertes", variant: "success" as const },
  EN_COURS: { label: "En cours", variant: "default" as const },
  TERMINEE: { label: "Terminée", variant: "secondary" as const },
  ARCHIVEE: { label: "Archivée", variant: "muted" as const },
};

export default async function EditionsPage() {
  const editions = await prisma.edition.findMany({
    orderBy: { annee: "desc" },
    include: {
      _count: { select: { participants: true } },
      budgetPrevisionnel: true,
    },
  });

  return (
    <>
      <DashboardHeader title="Éditions" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {editions.length} édition{editions.length > 1 ? "s" : ""} au total
          </p>
          <NouvellEditionButton />
        </div>

        {editions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune édition
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Créez votre première édition pour commencer.
            </p>
            <NouvellEditionButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {editions.map((edition) => {
              const config = STATUT_CONFIG[edition.statut];
              const tauxRemplissage = Math.round(
                (edition._count.participants / edition.capaciteMaximale) * 100
              );

              return (
                <Card key={edition.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {edition.nom}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(edition.dateDebut)} →{" "}
                          {formatDate(edition.dateFin)}
                        </p>
                      </div>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-foreground">
                          {edition._count.participants}
                        </p>
                        <p className="text-xs text-muted-foreground">Inscrits</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-foreground">
                          {tauxRemplissage}%
                        </p>
                        <p className="text-xs text-muted-foreground">Remplissage</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-foreground">
                          {edition.capaciteMaximale}
                        </p>
                        <p className="text-xs text-muted-foreground">Capacité</p>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>{edition._count.participants} inscrits</span>
                        <span>max {edition.capaciteMaximale}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(tauxRemplissage, 100)}%` }}
                        />
                      </div>
                    </div>
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
