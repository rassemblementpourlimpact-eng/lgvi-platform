import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouvelleCampagneButton } from "@/components/dashboard/nouvelle-campagne-button";
import { EnvoyerCampagneButton } from "@/components/dashboard/envoyer-campagne-button";
import { formatDate } from "@/lib/utils";
import { Mail, Send, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Communication" };
export const dynamic = "force-dynamic";

const STATUT_CONFIG = {
  BROUILLON: { label: "Brouillon", variant: "muted" as const },
  PROGRAMME: { label: "Programmé", variant: "warning" as const },
  ENVOYE: { label: "Envoyé", variant: "success" as const },
  ECHEC: { label: "Échec", variant: "destructive" as const },
};

export default async function CommunicationPage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] } },
    orderBy: { annee: "desc" },
  });

  const campagnes = editionActive
    ? await prisma.emailCampagne.findMany({
        where: { editionId: editionActive.id },
        include: { _count: { select: { logs: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const totalParents = editionActive
    ? await prisma.parent.count({
        where: { participants: { some: { editionId: editionActive.id } }, email: { not: null } },
      })
    : 0;

  return (
    <>
      <DashboardHeader title="Communication" editionNom={editionActive?.nom} />
      <div className="flex-1 p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{campagnes.length}</p>
            <p className="text-xs text-muted-foreground">Campagne{campagnes.length > 1 ? "s" : ""}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalParents}</p>
            <p className="text-xs text-muted-foreground">Parents avec email</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {campagnes.filter((c) => c.statut === "ENVOYE").length}
            </p>
            <p className="text-xs text-muted-foreground">Envoyées</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Campagnes email</h3>
          {editionActive && <NouvelleCampagneButton editionId={editionActive.id} />}
        </div>

        {campagnes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
            <Mail className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune campagne</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez une campagne pour communiquer avec les parents.
            </p>
            {editionActive && <NouvelleCampagneButton editionId={editionActive.id} />}
          </div>
        ) : (
          <div className="space-y-3">
            {campagnes.map((c) => {
              const config = STATUT_CONFIG[c.statut];
              return (
                <Card key={c.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      c.statut === "ENVOYE" ? "bg-green-100" : "bg-muted"
                    }`}>
                      {c.statut === "ENVOYE" ? (
                        <Send className="w-5 h-5 text-green-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{c.sujet}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {c.envoiAt ? `Envoyé le ${formatDate(c.envoiAt)}` : `Créé le ${formatDate(c.createdAt)}`}
                        </span>
                        {c._count.logs > 0 && (
                          <span className="text-xs text-muted-foreground">· {c._count.logs} destinataire{c._count.logs > 1 ? "s" : ""}</span>
                        )}
                      </div>
                    </div>
                    {c.statut === "BROUILLON" && (
                      <EnvoyerCampagneButton campagneId={c.id} />
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
