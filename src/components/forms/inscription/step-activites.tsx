"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActiviteData = {
  activiteId: string;
};

interface Activite {
  id: string;
  nom: string;
  description: string | null;
  capacite: number;
  inscrits: number;
}

interface StepActivitesProps {
  activites: Activite[];
  defaultActiviteId?: string;
  onNext: (data: ActiviteData) => void;
  onBack: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const ICONES: Record<string, string> = {
  Peinture: "🎨",
  Bricolage: "🔨",
  Théâtre: "🎭",
  Cuisine: "👨‍🍳",
  Musique: "🎵",
  "Danse et expression": "💃",
  default: "⭐",
};

export function StepActivites({
  activites,
  defaultActiviteId,
  onNext,
  onBack,
  isLoading = false,
  submitLabel = "Continuer",
}: StepActivitesProps) {
  const [selected, setSelected] = useState<string>(defaultActiviteId ?? "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selected) {
      setError("Veuillez choisir une activité.");
      return;
    }
    setError("");
    onNext({ activiteId: selected });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">
          Choix de l&apos;activité
        </h2>
        <p className="text-sm text-muted-foreground">
          Sélectionnez l&apos;activité principale de votre enfant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {activites.map((a) => {
          const icone = ICONES[a.nom] ?? ICONES.default;
          const complet = a.inscrits >= a.capacite;
          const isSelected = selected === a.id;
          const restants = a.capacite - a.inscrits;

          return (
            <button
              key={a.id}
              type="button"
              disabled={complet}
              onClick={() => setSelected(a.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : complet
                  ? "border-[#e2e8f0] bg-[#f8fafc] opacity-50 cursor-not-allowed"
                  : "border-[#e2e8f0] hover:border-primary/50 bg-white"
              )}
            >
              <span className="text-2xl">{icone}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#0f172a]">{a.nom}</p>
                  {complet && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
                      Complet
                    </span>
                  )}
                </div>
                {a.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {a.description}
                  </p>
                )}
                {!complet && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {restants} place{restants > 1 ? "s" : ""} restante{restants > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button type="button" onClick={handleNext} className="flex-1" size="lg" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : submitLabel}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
