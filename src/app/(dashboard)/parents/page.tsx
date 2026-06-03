import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, Phone, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Parents" };
export const dynamic = "force-dynamic";

export default async function ParentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const parPage = 20;

  const where = q
    ? {
        OR: [
          { nom: { contains: q, mode: "insensitive" as const } },
          { prenom: { contains: q, mode: "insensitive" as const } },
          { telephonePrincipal: { contains: q } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, parents] = await Promise.all([
    prisma.parent.count({ where }),
    prisma.parent.findMany({
      where,
      include: {
        participants: {
          select: { id: true, prenom: true, nom: true, statut: true },
          orderBy: { prenom: "asc" },
        },
        _count: { select: { paiements: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * parPage,
      take: parPage,
    }),
  ]);

  const totalPages = Math.ceil(total / parPage);

  return (
    <>
      <DashboardHeader title="Parents" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <form method="GET" className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Rechercher un parent..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <p className="text-sm text-muted-foreground shrink-0">{total} parent{total > 1 ? "s" : ""}</p>
        </div>

        {parents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UserCheck className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{q ? "Aucun résultat" : "Aucun parent"}</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {parents.map((parent) => (
              <Card key={parent.id} className="hover:shadow-sm transition-shadow">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">
                      {parent.prenom[0]}{parent.nom[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">
                      {parent.prenom} {parent.nom}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <a href={`tel:${parent.telephonePrincipal}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <Phone className="w-3 h-3" /> {parent.telephonePrincipal}
                      </a>
                      {parent.email && (
                        <a href={`mailto:${parent.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <Mail className="w-3 h-3" /> {parent.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {parent.participants.map((enfant) => (
                        <Badge key={enfant.id} variant={enfant.statut === "ACTIF" ? "success" : "muted"} className="text-xs">
                          {enfant.prenom} {enfant.nom}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Inscrit le {formatDate(parent.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {page} sur {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && <a href={`?q=${q}&page=${page - 1}`} className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted">← Précédent</a>}
              {page < totalPages && <a href={`?q=${q}&page=${page + 1}`} className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted">Suivant →</a>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
