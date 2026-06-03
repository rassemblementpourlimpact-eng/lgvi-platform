import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CreditCard, ClipboardCheck } from "lucide-react";

export const metadata: Metadata = { title: "Documents" };
export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const editionActive = await prisma.edition.findFirst({
    where: { statut: { in: ["INSCRIPTIONS_OUVERTES", "EN_COURS"] } },
    orderBy: { annee: "desc" },
  });

  const stats = editionActive
    ? {
        participants: await prisma.participant.count({ where: { editionId: editionActive.id } }),
        paiements: await prisma.paiement.count({ where: { editionId: editionActive.id, statut: "paye" } }),
        presences: await prisma.presence.count({ where: { editionId: editionActive.id } }),
      }
    : { participants: 0, paiements: 0, presences: 0 };

  const DOCUMENTS = [
    {
      titre: "Liste des participants",
      desc: `${stats.participants} participant${stats.participants > 1 ? "s" : ""} — nom, prénom, âge, activité, statut paiement`,
      icon: Users,
      href: `/api/documents/participants${editionActive ? `?editionId=${editionActive.id}` : ""}`,
      format: "PDF",
    },
    {
      titre: "Liste de présence vierge",
      desc: "Feuille de pointage à imprimer pour les formateurs",
      icon: ClipboardCheck,
      href: `/api/documents/presence-vierge${editionActive ? `?editionId=${editionActive.id}` : ""}`,
      format: "PDF",
    },
    {
      titre: "Rapport financier",
      desc: `${stats.paiements} paiement${stats.paiements > 1 ? "s" : ""} validés — recettes, dépenses, solde`,
      icon: CreditCard,
      href: `/api/documents/rapport-financier${editionActive ? `?editionId=${editionActive.id}` : ""}`,
      format: "PDF",
    },
    {
      titre: "Export participants (CSV)",
      desc: "Données complètes exportables dans Excel ou Google Sheets",
      icon: FileText,
      href: `/api/documents/export-csv${editionActive ? `?editionId=${editionActive.id}` : ""}`,
      format: "CSV",
    },
  ];

  return (
    <>
      <DashboardHeader title="Documents" editionNom={editionActive?.nom} />
      <div className="flex-1 p-6 space-y-5">
        <p className="text-sm text-muted-foreground">
          Générez et téléchargez les documents de gestion pour l&apos;édition active.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOCUMENTS.map((doc) => (
            <Card key={doc.titre} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <doc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{doc.titre}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{doc.desc}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={editionActive ? doc.href : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    editionActive
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  onClick={!editionActive ? (e) => e.preventDefault() : undefined}
                >
                  <FileText className="w-4 h-4" />
                  Télécharger ({doc.format})
                </a>
                {!editionActive && (
                  <p className="text-xs text-muted-foreground mt-2">Aucune édition active.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
