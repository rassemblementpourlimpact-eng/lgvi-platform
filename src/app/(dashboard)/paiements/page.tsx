import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatMontant, formatDate } from "@/lib/utils";
import { ValiderPaiementButton } from "@/components/dashboard/valider-paiement-button";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = { title: "Paiements" };
export const dynamic = "force-dynamic";

const STATUT_CONFIG = {
  en_attente: { label: "En attente", variant: "destructive" as const },
  partiel: { label: "Partiel", variant: "warning" as const },
  paye: { label: "Payé", variant: "success" as const },
  annule: { label: "Annulé", variant: "muted" as const },
  rembourse: { label: "Remboursé", variant: "muted" as const },
};

const PROVIDER_LABELS: Record<string, string> = {
  fedapay: "FedaPay",
  kikapay: "KikaPay",
  especes: "Espèces",
  mobile_money: "Mobile Money",
  manuel: "Manuel",
};

export default async function PaiementsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statutFiltre = params.statut;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const parPage = 20;

  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] } },
    orderBy: { annee: "desc" },
  });

  const where = {
    ...(editionActive ? { editionId: editionActive.id } : {}),
    ...(statutFiltre ? { statut: statutFiltre as "en_attente" | "partiel" | "paye" | "annule" | "rembourse" } : {}),
  };

  const [total, paiements, stats] = await Promise.all([
    prisma.paiement.count({ where }),
    prisma.paiement.findMany({
      where,
      include: {
        participant: true,
        parent: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * parPage,
      take: parPage,
    }),
    prisma.paiement.groupBy({
      by: ["statut"],
      where: editionActive ? { editionId: editionActive.id } : {},
      _count: true,
      _sum: { montantPaye: true },
    }),
  ]);

  const totalPages = Math.ceil(total / parPage);
  const totalCollecte = stats.reduce(
    (acc, s) => acc + (s._sum.montantPaye ?? 0),
    0
  );

  const STATUTS = ["en_attente", "partiel", "paye", "annule"] as const;

  return (
    <>
      <DashboardHeader title="Paiements" editionNom={editionActive?.nom} />
      <div className="flex-1 p-6 space-y-5">

        {/* Stats rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUTS.map((s) => {
            const stat = stats.find((st) => st.statut === s);
            const config = STATUT_CONFIG[s];
            return (
              <a
                key={s}
                href={`?statut=${s}`}
                className={`block p-4 rounded-xl border-2 transition-all ${
                  statutFiltre === s
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <p className="text-2xl font-bold text-foreground">
                  {stat?._count ?? 0}
                </p>
                <Badge variant={config.variant} className="mt-1">
                  {config.label}
                </Badge>
              </a>
            );
          })}
        </div>

        {/* Total collecté */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} paiement{total > 1 ? "s" : ""}
            {statutFiltre && ` · filtre : ${STATUT_CONFIG[statutFiltre as keyof typeof STATUT_CONFIG]?.label}`}
          </p>
          <p className="text-sm font-semibold text-foreground">
            Total collecté :{" "}
            <span className="text-primary">{formatMontant(totalCollecte)}</span>
          </p>
        </div>

        {/* Filtres */}
        {statutFiltre && (
          <a href="/paiements" className="text-sm text-primary hover:underline">
            ✕ Supprimer le filtre
          </a>
        )}

        {paiements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun paiement
            </h3>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    {["Participant", "Parent", "Montant", "Payé", "Mode", "Statut", "Date", "Action"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paiements.map((p) => {
                    const config = STATUT_CONFIG[p.statut] ?? STATUT_CONFIG.en_attente;
                    return (
                      <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {p.participant.prenom} {p.participant.nom}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.parent.prenom} {p.parent.nom}
                          <br />
                          <span className="text-xs">{p.parent.telephonePrincipal}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {formatMontant(p.montant)}
                        </td>
                        <td className="px-4 py-3 text-primary font-medium">
                          {formatMontant(p.montantPaye)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {PROVIDER_LABELS[p.provider] ?? p.provider}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          {p.statut === "en_attente" && (
                            <ValiderPaiementButton paiementId={p.id} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <a
                      href={`?statut=${statutFiltre ?? ""}&page=${page - 1}`}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      ← Précédent
                    </a>
                  )}
                  {page < totalPages && (
                    <a
                      href={`?statut=${statutFiltre ?? ""}&page=${page + 1}`}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      Suivant →
                    </a>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
