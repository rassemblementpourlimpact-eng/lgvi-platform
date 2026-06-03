import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getAgeAtEditionStart } from "@/lib/age";
import { Users, Search } from "lucide-react";

export const metadata: Metadata = { title: "Participants" };
export const dynamic = "force-dynamic";

const STATUT_PAIEMENT = {
  paye: { label: "Payé", variant: "success" as const },
  partiel: { label: "Partiel", variant: "warning" as const },
  en_attente: { label: "En attente", variant: "destructive" as const },
  annule: { label: "Annulé", variant: "muted" as const },
  rembourse: { label: "Remboursé", variant: "muted" as const },
};

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const parPage = 20;

  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] } },
    orderBy: { annee: "desc" },
  });

  const where = {
    ...(editionActive ? { editionId: editionActive.id } : {}),
    ...(q
      ? {
          OR: [
            { nom: { contains: q, mode: "insensitive" as const } },
            { prenom: { contains: q, mode: "insensitive" as const } },
            { parent: { nom: { contains: q, mode: "insensitive" as const } } },
            { parent: { prenom: { contains: q, mode: "insensitive" as const } } },
            { parent: { telephonePrincipal: { contains: q } } },
          ],
        }
      : {}),
  };

  const [total, participants] = await Promise.all([
    prisma.participant.count({ where }),
    prisma.participant.findMany({
      where,
      include: {
        parent: true,
        paiements: { orderBy: { createdAt: "desc" }, take: 1 },
        activites: { include: { activite: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * parPage,
      take: parPage,
    }),
  ]);

  const totalPages = Math.ceil(total / parPage);

  return (
    <>
      <DashboardHeader
        title="Participants"
        editionNom={editionActive?.nom}
      />
      <div className="flex-1 p-6 space-y-4">
        {/* Barre de recherche + stats */}
        <div className="flex items-center justify-between gap-4">
          <form method="GET" className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Rechercher un enfant, parent, téléphone..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </form>
          <p className="text-sm text-muted-foreground shrink-0">
            {total} participant{total > 1 ? "s" : ""}
          </p>
        </div>

        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {q ? "Aucun résultat" : "Aucun participant"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {q
                ? `Aucun participant ne correspond à "${q}".`
                : "Les inscriptions apparaîtront ici."}
            </p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Enfant
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Parent
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Âge
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Activité
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Paiement
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Inscrit le
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {participants.map((p) => {
                    const age = editionActive
                      ? getAgeAtEditionStart(p.dateNaissance, editionActive.dateDebut)
                      : getAgeAtEditionStart(p.dateNaissance, new Date());
                    const paiement = p.paiements[0];
                    const statutPaie = paiement
                      ? STATUT_PAIEMENT[paiement.statut] ?? STATUT_PAIEMENT.en_attente
                      : STATUT_PAIEMENT.en_attente;
                    const activite = p.activites[0]?.activite;

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <span className="text-white text-xs font-bold">
                                {p.prenom[0]}{p.nom[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {p.prenom} {p.nom}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {p.sexe === "M" ? "Garçon" : "Fille"}
                                {p.ecole ? ` · ${p.ecole}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-foreground">
                            {p.parent.prenom} {p.parent.nom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.parent.telephonePrincipal}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">
                            {age} ans
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {activite ? (
                            <span className="text-foreground">{activite.nom}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statutPaie.variant}>
                            {statutPaie.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <a
                      href={`?q=${q}&page=${page - 1}`}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      ← Précédent
                    </a>
                  )}
                  {page < totalPages && (
                    <a
                      href={`?q=${q}&page=${page + 1}`}
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
