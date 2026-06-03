"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const LABELS: Record<string, string> = {
  PREPARATION: "En préparation",
  INSCRIPTIONS_OUVERTES: "Ouvrir les inscriptions",
  EN_COURS: "Démarrer",
  TERMINEE: "Clôturer",
  ARCHIVEE: "Archiver",
};

export function ChangeStatutEditionButton({
  editionId,
  prochainStatut,
}: {
  editionId: string;
  prochainStatut: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changer = () => {
    startTransition(async () => {
      await fetch(`/api/editions/${editionId}/statut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: prochainStatut }),
      });
      router.refresh();
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={changer} disabled={isPending}>
      {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : LABELS[prochainStatut] ?? prochainStatut}
    </Button>
  );
}
