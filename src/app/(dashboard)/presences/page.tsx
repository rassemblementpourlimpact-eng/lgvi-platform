import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { PointagePresence } from "@/components/dashboard/pointage-presence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ClipboardCheck } from "lucide-react";

export const metadata: Metadata = { title: "Présences" };
export const dynamic = "force-dynamic";

export default async function PresencesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; groupeId?: string }>;
}) {
  const params = await searchParams;
  const dateStr = params.date ?? new Date().toISOString().split("T")[0];
  const dateFiltre = new Date(dateStr + "T00:00:00");
  const dateFiltreMax = new Date(dateStr + "T23:59:59");

  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] } },
    orderBy: { annee: "desc" },
  });

  if (!editionActive) {
    return (
      <>
        <DashboardHeader title="Présences" />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-muted-foreground">Aucune édition active.</p>
        </div>
      </>
    );
  }

  const groupes = await prisma.groupe.findMany({
    where: { editionId: editionActive.id },
    include: {
      participants: { include: { participant: true } },
    },
    orderBy: { nom: "asc" },
  });

  const presencesExistantes = await prisma.presence.findMany({
    where: {
      editionId: editionActive.id,
      date: { gte: dateFiltre, lte: dateFiltreMax },
    },
  });

  const presenceParParticipant = Object.fromEntries(
    presencesExistantes.map((p) => [p.participantId, p.statut])
  );

  // Si pas de groupes, prendre tous les participants directement
  const tousParticipants = await prisma.participant.findMany({
    where: { editionId: editionActive.id, statut: "ACTIF" },
    orderBy: [{ prenom: "asc" }],
  });

  return (
    <>
      <DashboardHeader title="Présences" editionNom={editionActive.nom} />
      <div className="flex-1 p-6 space-y-6">

        {/* Sélecteur de date */}
        <div className="flex items-center gap-4">
          <form method="GET" className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">Date :</label>
            <input
              type="date"
              name="date"
              defaultValue={dateStr}
              max={new Date().toISOString().split("T")[0]}
              className="px-3 py-1.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Voir
            </button>
          </form>
          <Badge variant="muted" className="ml-auto">
            {formatDate(dateFiltre)}
          </Badge>
        </div>

        {groupes.length > 0 ? (
          /* Pointage par groupe */
          <div className="space-y-6">
            {groupes.map((groupe) => {
              const participantsGroupe = groupe.participants.map((pg) => ({
                id: pg.participant.id,
                prenom: pg.participant.prenom,
                nom: pg.participant.nom,
                statutActuel: presenceParParticipant[pg.participant.id] as
                  | "PRESENT"
                  | "ABSENT"
                  | "RETARD"
                  | "DEPART_ANTICIPE"
                  | undefined,
              }));

              return (
                <Card key={groupe.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <ClipboardCheck className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">{groupe.nom}</CardTitle>
                      <Badge variant="muted" className="ml-auto">
                        {participantsGroupe.length} enfant{participantsGroupe.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PointagePresence
                      participants={participantsGroupe}
                      editionId={editionActive.id}
                      date={dateStr}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Pointage général sans groupe */
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Tous les participants — {editionActive.nom}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tousParticipants.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Aucun participant inscrit pour le moment.
                </p>
              ) : (
                <PointagePresence
                  participants={tousParticipants.map((p) => ({
                    id: p.id,
                    prenom: p.prenom,
                    nom: p.nom,
                    statutActuel: presenceParParticipant[p.id] as
                      | "PRESENT"
                      | "ABSENT"
                      | "RETARD"
                      | "DEPART_ANTICIPE"
                      | undefined,
                  }))}
                  editionId={editionActive.id}
                  date={dateStr}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
