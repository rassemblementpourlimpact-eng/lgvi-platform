import { prisma } from "@/lib/prisma";
import { InscriptionForm } from "@/components/forms/inscription/inscription-form";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Inscription — LGVI",
  description: "Inscrivez votre enfant aux Grandes Vacances de l'Impact",
};

export const revalidate = 60;

async function getEditionEtActivites() {
  const edition = await prisma.edition.findFirst({
    where: { statut: "INSCRIPTIONS_OUVERTES" },
    orderBy: { annee: "desc" },
    include: { budgetPrevisionnel: true },
  });

  if (!edition) return { edition: null, activites: [] };

  const activites = await prisma.activite.findMany({
    where: { editionId: edition.id },
    include: {
      _count: { select: { participants: true } },
    },
    orderBy: { nom: "asc" },
  });

  return {
    edition,
    activites: activites.map((a) => ({
      id: a.id,
      nom: a.nom,
      description: a.description,
      capacite: a.capacite,
      inscrits: a._count.participants,
    })),
  };
}

export default async function InscriptionPage() {
  const { edition, activites } = await getEditionEtActivites();

  if (!edition) {
    return (
      <main className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary mb-2">
            Inscriptions fermées
          </h1>
          <p className="text-muted-foreground">
            Les inscriptions pour la prochaine édition de LGVI ne sont pas
            encore ouvertes. Revenez bientôt !
          </p>
        </div>
      </main>
    );
  }

  const montant = edition.budgetPrevisionnel?.prixInscription ?? 0;

  return (
    <main className="min-h-screen bg-muted py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3">
            <span className="text-white font-black text-base">LG</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary">
            Inscription LGVI
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {edition.nom} · {new Date(edition.dateDebut).getFullYear()}
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <InscriptionForm
            editionId={edition.id}
            montantInscription={montant}
            activites={activites}
          />
        </div>
      </div>
    </main>
  );
}
