import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NouveauFormateurButton } from "@/components/dashboard/nouveau-formateur-button";
import { GraduationCap, Phone, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Formateurs & Équipe" };
export const dynamic = "force-dynamic";

const CATEGORIE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "muted" }> = {
  DIRECTION: { label: "Direction", variant: "secondary" },
  COORDINATION: { label: "Coordination", variant: "default" },
  FORMATEUR: { label: "Formateur", variant: "success" },
  ANIMATEUR: { label: "Animateur", variant: "warning" },
  MEDIA: { label: "Médias", variant: "muted" },
  BENEVOLE: { label: "Bénévole", variant: "muted" },
};

export default async function FormateursPage() {
  const formateurs = await prisma.formateur.findMany({
    where: { actif: true },
    include: { _count: { select: { activites: true, groupes: true } } },
    orderBy: [{ categorie: "asc" }, { nom: "asc" }],
  });

  const parCategorie = formateurs.reduce<Record<string, typeof formateurs>>((acc, f) => {
    acc[f.categorie] = acc[f.categorie] ?? [];
    acc[f.categorie].push(f);
    return acc;
  }, {});

  const ordreCategories = ["DIRECTION", "COORDINATION", "FORMATEUR", "ANIMATEUR", "MEDIA", "BENEVOLE"];

  return (
    <>
      <DashboardHeader title="Formateurs & Équipe" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formateurs.length} membre{formateurs.length > 1 ? "s" : ""} de l&apos;équipe
          </p>
          <NouveauFormateurButton />
        </div>

        {formateurs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun membre</h3>
            <p className="text-sm text-muted-foreground mb-4">Ajoutez les membres de l&apos;équipe LGVI.</p>
            <NouveauFormateurButton />
          </div>
        ) : (
          ordreCategories.map((cat) => {
            const membres = parCategorie[cat];
            if (!membres?.length) return null;
            const config = CATEGORIE_CONFIG[cat];
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={config.variant}>{config.label}</Badge>
                  <span className="text-sm text-muted-foreground">{membres.length} membre{membres.length > 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {membres.map((f) => (
                    <Card key={f.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-bold">
                              {f.prenom[0]}{f.nom[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {f.prenom} {f.nom}
                            </p>
                            {f.specialite && (
                              <p className="text-xs text-muted-foreground">{f.specialite}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {f.telephone && (
                            <a href={`tel:${f.telephone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                              <Phone className="w-3 h-3" /> {f.telephone}
                            </a>
                          )}
                          {f.email && (
                            <a href={`mailto:${f.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                              <Mail className="w-3 h-3" /> {f.email}
                            </a>
                          )}
                        </div>
                        {(f._count.activites > 0 || f._count.groupes > 0) && (
                          <div className="mt-3 pt-3 border-t border-border flex gap-3 text-xs text-muted-foreground">
                            {f._count.activites > 0 && <span>{f._count.activites} activité{f._count.activites > 1 ? "s" : ""}</span>}
                            {f._count.groupes > 0 && <span>{f._count.groupes} groupe{f._count.groupes > 1 ? "s" : ""}</span>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
