import { prisma } from "@/lib/prisma";
import { PreinscriptionForm } from "@/components/forms/preinscription/preinscription-form";
import { AlertCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Préinscription — LGVI",
  description: "Réservez la place de votre enfant aux Grandes Vacances de l'Impact. Paiement à finaliser ultérieurement.",
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
    include: { _count: { select: { participants: true } } },
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

export default async function PreinscriptionPage() {
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
            Les inscriptions pour la prochaine édition de LGVI ne sont pas encore ouvertes.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3">
            <span className="text-white font-black text-base">LG</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary">
            Préinscription LGVI
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {edition.nom} · {new Date(edition.dateDebut).getFullYear()}
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Préinscription sans paiement immédiat</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Réservez la place de votre enfant maintenant. Vous recevrez une référence et
              pourrez finaliser le paiement à votre convenance sur la page{" "}
              <span className="font-semibold">/payer</span>.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <PreinscriptionForm
            editionId={edition.id}
            activites={activites}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Vous avez déjà une préinscription ?{" "}
          <a href="/payer" className="text-primary font-medium hover:underline">
            Finaliser mon paiement →
          </a>
        </p>
      </div>
    </main>
  );
}
