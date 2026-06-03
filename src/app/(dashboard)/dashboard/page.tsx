import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  CreditCard,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { formatMontant, formatDate } from "@/lib/utils";
import { getAgeActuel } from "@/lib/age";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

async function getDashboardData() {
  const editionActive = await prisma.edition.findFirst({
    where: {
      statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] },
    },
    orderBy: { annee: "desc" },
  });

  if (!editionActive) {
    return { editionActive: null, kpi: null, alertes: [] };
  }

  const [
    totalParticipants,
    paiementsStats,
    presencesAujourdhui,
    derniersInscrits,
    paiementsEnAttente,
  ] = await Promise.all([
    prisma.participant.count({
      where: { editionId: editionActive.id, statut: "ACTIF" },
    }),
    prisma.paiement.aggregate({
      where: { editionId: editionActive.id },
      _sum: { montantPaye: true, montant: true },
    }),
    prisma.presence.count({
      where: {
        editionId: editionActive.id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        statut: "PRESENT",
      },
    }),
    prisma.participant.findMany({
      where: { editionId: editionActive.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { parent: true },
    }),
    prisma.paiement.count({
      where: { editionId: editionActive.id, statut: "en_attente" },
    }),
  ]);

  const revenuTotal = paiementsStats._sum.montantPaye ?? 0;
  const montantTotal = paiementsStats._sum.montant ?? 0;
  const tauxRemplissage = Math.round(
    (totalParticipants / editionActive.capaciteMaximale) * 100
  );

  return {
    editionActive,
    kpi: {
      totalParticipants,
      capaciteMaximale: editionActive.capaciteMaximale,
      tauxRemplissage,
      revenuTotal,
      montantTotal,
      presencesAujourdhui,
    },
    derniersInscrits,
    paiementsEnAttente,
  };
}

const statutBadge: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "muted" }> = {
  paye: { label: "Payé", variant: "success" },
  partiel: { label: "Partiel", variant: "warning" },
  en_attente: { label: "En attente", variant: "destructive" },
  annule: { label: "Annulé", variant: "muted" },
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data.editionActive || !data.kpi) {
    return (
      <>
        <DashboardHeader title="Tableau de bord" />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">
              Aucune édition active
            </h2>
            <p className="text-muted-foreground mb-4">
              Créez une édition pour commencer à gérer les inscriptions.
            </p>
            <a
              href="/editions"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Créer une édition
            </a>
          </div>
        </div>
      </>
    );
  }

  const { editionActive, kpi, derniersInscrits, paiementsEnAttente } = data;

  return (
    <>
      <DashboardHeader title="Tableau de bord" editionNom={editionActive.nom} />

      <div className="flex-1 p-6 space-y-6">
        {/* Alerte paiements en attente */}
        {paiementsEnAttente > 0 && (
          <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-[#92400e]">
              <strong>{paiementsEnAttente} paiement{paiementsEnAttente > 1 ? "s" : ""}</strong> en attente de validation.{" "}
              <a href="/paiements" className="underline font-medium">
                Voir les paiements →
              </a>
            </p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            titre="Participants inscrits"
            valeur={kpi.totalParticipants}
            sous_titre={`Objectif : ${kpi.capaciteMaximale} places`}
            icon={Users}
            couleur="blue"
          />
          <KpiCard
            titre="Taux de remplissage"
            valeur={`${kpi.tauxRemplissage}%`}
            sous_titre={`${kpi.capaciteMaximale - kpi.totalParticipants} places restantes`}
            tendance={{ valeur: kpi.tauxRemplissage - 100, label: "de l'objectif" }}
            icon={TrendingUp}
            couleur="orange"
          />
          <KpiCard
            titre="Revenus collectés"
            valeur={formatMontant(kpi.revenuTotal)}
            sous_titre={`Sur ${formatMontant(kpi.montantTotal)} attendus`}
            icon={CreditCard}
            couleur="green"
          />
          <KpiCard
            titre="Présents aujourd'hui"
            valeur={kpi.presencesAujourdhui}
            sous_titre={`Sur ${kpi.totalParticipants} inscrits`}
            icon={ClipboardCheck}
            couleur="yellow"
          />
        </div>

        {/* Derniers inscrits */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Dernières inscriptions</CardTitle>
              <a
                href="/participants"
                className="text-sm text-primary hover:underline font-medium"
              >
                Voir tous →
              </a>
            </div>
          </CardHeader>
          <CardContent>
            {derniersInscrits && derniersInscrits.length > 0 ? (
              <div className="space-y-3">
                {derniersInscrits.map((p) => {
                  const age = getAgeActuel(p.dateNaissance);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">
                            {p.prenom[0]}{p.nom[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            {p.prenom} {p.nom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {age} ans · Parent : {p.parent.prenom} {p.parent.nom}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aucune inscription pour le moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
