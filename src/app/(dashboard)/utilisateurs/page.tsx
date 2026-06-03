import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouvelUtilisateurButton } from "@/components/dashboard/nouvel-utilisateur-button";
import { ChangeRoleSelect } from "@/components/dashboard/change-role-select";
import { formatDate } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Utilisateurs" };
export const dynamic = "force-dynamic";

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: "Super Admin", variant: "secondary" as const },
  DIRECTION: { label: "Direction", variant: "default" as const },
  COMPTABILITE: { label: "Comptabilité", variant: "warning" as const },
  COMMUNICATION: { label: "Communication", variant: "success" as const },
  ACCUEIL: { label: "Accueil", variant: "muted" as const },
  FORMATEUR: { label: "Formateur", variant: "muted" as const },
  COORDINATEUR: { label: "Coordinateur", variant: "muted" as const },
  LECTURE_SEULE: { label: "Lecture seule", variant: "muted" as const },
};

export default async function UtilisateursPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, emailVerified: true },
  });

  return (
    <>
      <DashboardHeader title="Utilisateurs" />
      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{users.length} utilisateur{users.length > 1 ? "s" : ""}</p>
          <NouvelUtilisateurButton />
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun utilisateur</h3>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {users.map((u) => {
                const config = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.LECTURE_SEULE;
                return (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <ChangeRoleSelect userId={u.id} roleActuel={u.role} />
                    </div>
                    <p className="text-xs text-muted-foreground hidden lg:block shrink-0">
                      {formatDate(u.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
