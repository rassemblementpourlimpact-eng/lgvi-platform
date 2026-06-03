import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AjouterDepenseButton } from "@/components/dashboard/ajouter-depense-button";
import { formatMontant, formatDate } from "@/lib/utils";
import { BarChart3, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SupprimerDepenseButton } from "@/components/dashboard/supprimer-depense-button";

export const metadata: Metadata = { title: "Comptabilité" };
export const dynamic = "force-dynamic";

const CAT_LABELS: Record<string, string> = {
  FONCTIONNEMENT: "Fonctionnement", COMMUNICATION: "Communication",
  RESTAURATION: "Restauration", MATERIEL: "Matériel",
  LOGISTIQUE: "Logistique", ACTIVITES: "Activités", AUTRE: "Autre",
};

export default async function ComptabilitePage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS", "TERMINEE"] } },
    orderBy: { annee: "desc" },
    include: { budgetPrevisionnel: true },
  });

  if (!editionActive) {
    return (
      <>
        <DashboardHeader title="Comptabilité" />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-muted-foreground">Aucune édition active.</p>
        </div>
      </>
    );
  }

  const [paiementsStats, depenses] = await Promise.all([
    prisma.paiement.aggregate({
      where: { editionId: editionActive.id, statut: { in: ["paye", "partiel"] } },
      _sum: { montantPaye: true, montant: true },
      _count: true,
    }),
    prisma.depense.findMany({
      where: { editionId: editionActive.id },
      orderBy: { date: "desc" },
    }),
  ]);

  const totalRecettes = paiementsStats._sum.montantPaye ?? 0;
  const totalAttendu = paiementsStats._sum.montant ?? 0;
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
  const solde = totalRecettes - totalDepenses;
  const budget = editionActive.budgetPrevisionnel;

  const depensesParCat = depenses.reduce<Record<string, number>>((acc, d) => {
    acc[d.categorie] = (acc[d.categorie] ?? 0) + d.montant;
    return acc;
  }, {});

  return (
    <>
      <DashboardHeader title="Comptabilité" editionNom={editionActive.nom} />
      <div className="flex-1 p-6 space-y-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard titre="Recettes collectées" valeur={formatMontant(totalRecettes)}
            sous_titre={`Sur ${formatMontant(totalAttendu)} attendus`} icon={TrendingUp} couleur="green" />
          <KpiCard titre="Total dépenses" valeur={formatMontant(totalDepenses)}
            sous_titre={`${depenses.length} opération${depenses.length > 1 ? "s" : ""}`} icon={TrendingDown} couleur="orange" />
          <KpiCard titre="Solde" valeur={formatMontant(solde)}
            sous_titre={solde >= 0 ? "Excédent" : "Déficit"} icon={Wallet} couleur={solde >= 0 ? "green" : "orange"} />
          {budget && (
            <KpiCard titre="Objectif inscriptions" valeur={budget.objectifInscrits}
              sous_titre={`Prix : ${formatMontant(budget.prixInscription)}`} icon={BarChart3} couleur="blue" />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dépenses par catégorie */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dépenses par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(depensesParCat).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune dépense enregistrée.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(depensesParCat)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, montant]) => {
                      const pct = Math.round((montant / totalDepenses) * 100);
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground">{CAT_LABELS[cat] ?? cat}</span>
                            <span className="font-medium text-foreground">{formatMontant(montant)}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste des dépenses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Dépenses</h3>
              <AjouterDepenseButton editionId={editionActive.id} />
            </div>

            {depenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
                <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Aucune dépense enregistrée.</p>
              </div>
            ) : (
              <Card>
                <div className="divide-y divide-border">
                  {depenses.map((d) => (
                    <div key={d.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{d.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="muted" className="text-xs">{CAT_LABELS[d.categorie]}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(d.date)}</span>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground shrink-0">{formatMontant(d.montant)}</p>
                      <SupprimerDepenseButton depenseId={d.id} />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
