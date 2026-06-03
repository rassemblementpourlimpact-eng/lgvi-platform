import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouveauGroupeButton } from "@/components/dashboard/nouveau-groupe-button";
import { UsersRound } from "lucide-react";

export const metadata: Metadata = { title: "Groupes" };
export const dynamic = "force-dynamic";

export default async function GroupesPage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS", "PREPARATION"] } },
    orderBy: { annee: "desc" },
  });

  const groupes = editionActive
    ? await prisma.groupe.findMany({
        where: { editionId: editionActive.id },
        include: {
          formateur: { select: { prenom: true, nom: true } },
          participants: { include: { participant: true } },
        },
        orderBy: { nom: "asc" },
      })
    : [];

  const participantsSansGroupe = editionActive
    ? await prisma.participant.findMany({
        where: {
          editionId: editionActive.id,
          statut: "ACTIF",
          groupes: { none: {} },
        },
        orderBy: { prenom: "asc" },
      })
    : [];

  return (
    <>
      <DashboardHeader title="Groupes" editionNom={editionActive?.nom} />
      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {groupes.length} groupe{groupes.length > 1 ? "s" : ""}
            {participantsSansGroupe.length > 0 && (
              <span className="ml-2 text-warning font-medium">
                · {participantsSansGroupe.length} sans groupe
              </span>
            )}
          </p>
          {editionActive && <NouveauGroupeButton editionId={editionActive.id} />}
        </div>

        {groupes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UsersRound className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun groupe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez des groupes pour organiser les participants.
            </p>
            {editionActive && <NouveauGroupeButton editionId={editionActive.id} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupes.map((g) => {
              const taux = Math.round((g.participants.length / g.capacite) * 100);
              return (
                <Card key={g.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{g.nom}</CardTitle>
                      <Badge variant={g.participants.length >= g.capacite ? "destructive" : "muted"}>
                        {g.participants.length}/{g.capacite}
                      </Badge>
                    </div>
                    {g.formateur && (
                      <p className="text-xs text-muted-foreground">
                        Formateur : {g.formateur.prenom} {g.formateur.nom}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="h-1.5 bg-muted rounded-full mb-3">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(taux, 100)}%` }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      {g.participants.slice(0, 5).map((pg) => (
                        <div key={pg.id} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-secondary/20 flex items-center justify-center">
                            <span className="text-secondary text-[10px] font-bold">
                              {pg.participant.prenom[0]}{pg.participant.nom[0]}
                            </span>
                          </div>
                          <span className="text-sm text-foreground">
                            {pg.participant.prenom} {pg.participant.nom}
                          </span>
                        </div>
                      ))}
                      {g.participants.length > 5 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          + {g.participants.length - 5} autre{g.participants.length - 5 > 1 ? "s" : ""}...
                        </p>
                      )}
                      {g.participants.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">Aucun participant affecté</p>
                      )}
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
