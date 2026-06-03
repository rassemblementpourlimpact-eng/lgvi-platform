import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChangeStatutEditionButton } from "@/components/dashboard/change-statut-edition-button";
import { formatDate, formatMontant } from "@/lib/utils";
import { Settings, Calendar, CreditCard, Mail, Globe } from "lucide-react";

export const metadata: Metadata = { title: "Paramètres" };
export const dynamic = "force-dynamic";

const STATUT_ORDRE = [
  "PREPARATION",
  "INSCRIPTIONS_OUVERTES",
  "EN_COURS",
  "TERMINEE",
  "ARCHIVEE",
] as const;

export default async function ParametresPage() {
  const editions = await prisma.edition.findMany({
    orderBy: { annee: "desc" },
    include: { budgetPrevisionnel: true, _count: { select: { participants: true } } },
  });

  const editionActive = editions.find((e) =>
    ["INSCRIPTIONS_OUVERTES", "EN_COURS"].includes(e.statut)
  );

  return (
    <>
      <DashboardHeader title="Paramètres" />
      <div className="flex-1 p-6 space-y-6">

        {/* Édition active */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Gestion des éditions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {editions.map((edition) => {
                const idxActuel = STATUT_ORDRE.indexOf(edition.statut as typeof STATUT_ORDRE[number]);
                const prochainStatut = STATUT_ORDRE[idxActuel + 1];
                return (
                  <div key={edition.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{edition.nom}</p>
                        {editionActive?.id === edition.id && (
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(edition.dateDebut)} — {formatDate(edition.dateFin)} · {edition._count.participants} inscrits
                      </p>
                      {edition.budgetPrevisionnel && (
                        <p className="text-xs text-muted-foreground">
                          Prix : {formatMontant(edition.budgetPrevisionnel.prixInscription)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={edition.statut === "INSCRIPTIONS_OUVERTES" ? "success" : edition.statut === "EN_COURS" ? "default" : "muted"}>
                        {edition.statut.replace(/_/g, " ")}
                      </Badge>
                      {prochainStatut && (
                        <ChangeStatutEditionButton editionId={edition.id} prochainStatut={prochainStatut} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Variables d'environnement */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Configuration requise</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: Globe, label: "DATABASE_URL", desc: "Connexion PostgreSQL", key: "DATABASE_URL" },
                { icon: Settings, label: "BETTER_AUTH_SECRET", desc: "Clé d'authentification (32 chars)", key: "BETTER_AUTH_SECRET" },
                { icon: Settings, label: "ENCRYPTION_KEY", desc: "Chiffrement AES-256 (hex 32 bytes)", key: "ENCRYPTION_KEY" },
                { icon: CreditCard, label: "FEDAPAY_SECRET_KEY", desc: "Clé secrète FedaPay", key: "FEDAPAY_SECRET_KEY" },
                { icon: Mail, label: "RESEND_API_KEY", desc: "Clé API Resend (emails)", key: "RESEND_API_KEY" },
                { icon: Globe, label: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", desc: "Cloudinary (galerie)", key: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" },
                { icon: Globe, label: "NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER", desc: "Numéro WhatsApp LGVI", key: "NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER" },
                { icon: Settings, label: "CRON_SECRET", desc: "Secret pour les jobs Vercel Cron", key: "CRON_SECRET" },
              ].map((item) => {
                const configured = !!process.env[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-mono font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Badge variant={configured ? "success" : "destructive"}>
                      {configured ? "✓ Configuré" : "✗ Manquant"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
