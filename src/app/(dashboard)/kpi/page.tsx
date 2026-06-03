import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCharts } from "@/components/dashboard/kpi-charts";
import { formatMontant } from "@/lib/utils";
import { Users, CreditCard, TrendingUp, ClipboardCheck } from "lucide-react";

export const metadata: Metadata = { title: "KPI & Analytics" };
export const dynamic = "force-dynamic";

export default async function KpiPage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] } },
    orderBy: { annee: "desc" },
  });

  if (!editionActive) {
    return (
      <>
        <DashboardHeader title="KPI & Analytics" />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-muted-foreground">Aucune édition active.</p>
        </div>
      </>
    );
  }

  const [participants, paiementsStats, presenceSemaine, repartitionSexe, repartitionActivites] =
    await Promise.all([
      prisma.participant.count({ where: { editionId: editionActive.id, statut: "ACTIF" } }),
      prisma.paiement.aggregate({
        where: { editionId: editionActive.id },
        _sum: { montantPaye: true, montant: true },
      }),
      // Présences des 7 derniers jours
      prisma.presence.groupBy({
        by: ["date", "statut"],
        where: {
          editionId: editionActive.id,
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        _count: true,
      }),
      // Répartition par sexe
      prisma.participant.groupBy({
        by: ["sexe"],
        where: { editionId: editionActive.id },
        _count: true,
      }),
      // Inscrits par activité
      prisma.participantActivite.groupBy({
        by: ["activiteId"],
        where: { editionId: editionActive.id },
        _count: true,
      }),
    ]);

  const recettes = paiementsStats._sum.montantPaye ?? 0;
  const attendus = paiementsStats._sum.montant ?? 0;
  const tauxCollecte = attendus > 0 ? Math.round((recettes / attendus) * 100) : 0;
  const tauxRemplissage = Math.round((participants / editionActive.capaciteMaximale) * 100);

  // Prépare les données pour les graphiques
  const activitesIds = repartitionActivites.map((r) => r.activiteId);
  const activitesDetails = await prisma.activite.findMany({
    where: { id: { in: activitesIds } },
    select: { id: true, nom: true },
  });
  const activiteMap = Object.fromEntries(activitesDetails.map((a) => [a.id, a.nom]));

  const dataActivites = repartitionActivites.map((r) => ({
    nom: activiteMap[r.activiteId] ?? "Inconnu",
    inscrits: r._count,
  }));

  const dataSexe = repartitionSexe.map((r) => ({
    nom: r.sexe === "M" ? "Garçons" : "Filles",
    valeur: r._count,
  }));

  // Présences par jour
  const presenceParJour: Record<string, { present: number; absent: number }> = {};
  presenceSemaine.forEach((p) => {
    const jour = new Date(p.date).toLocaleDateString("fr-BJ", { weekday: "short", day: "numeric" });
    presenceParJour[jour] = presenceParJour[jour] ?? { present: 0, absent: 0 };
    if (p.statut === "PRESENT") presenceParJour[jour].present += p._count;
    if (p.statut === "ABSENT") presenceParJour[jour].absent += p._count;
  });
  const dataPresences = Object.entries(presenceParJour).map(([jour, v]) => ({ jour, ...v }));

  return (
    <>
      <DashboardHeader title="KPI & Analytics" editionNom={editionActive.nom} />
      <div className="flex-1 p-6 space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard titre="Inscrits" valeur={participants} sous_titre={`/ ${editionActive.capaciteMaximale} places`} icon={Users} couleur="blue" />
          <KpiCard titre="Remplissage" valeur={`${tauxRemplissage}%`} icon={TrendingUp} couleur="orange" />
          <KpiCard titre="Recettes" valeur={formatMontant(recettes)} icon={CreditCard} couleur="green" />
          <KpiCard titre="Taux collecte" valeur={`${tauxCollecte}%`} sous_titre={`Sur ${formatMontant(attendus)}`} icon={ClipboardCheck} couleur="yellow" />
        </div>

        {/* Graphiques */}
        <KpiCharts
          dataActivites={dataActivites}
          dataSexe={dataSexe}
          dataPresences={dataPresences}
        />
      </div>
    </>
  );
}
