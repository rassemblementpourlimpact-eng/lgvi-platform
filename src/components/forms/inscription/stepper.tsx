import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const ETAPES = [
  { numero: 1, label: "Parent" },
  { numero: 2, label: "Enfant" },
  { numero: 3, label: "Médical" },
  { numero: 4, label: "Activités" },
  { numero: 5, label: "Paiement" },
];

interface StepperProps {
  etapeActuelle: number;
}

export function Stepper({ etapeActuelle }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {ETAPES.map((etape, i) => {
        const estFait = etape.numero < etapeActuelle;
        const estActuel = etape.numero === etapeActuelle;

        return (
          <div key={etape.numero} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                  estFait
                    ? "bg-primary border-primary text-white"
                    : estActuel
                    ? "bg-white border-primary text-primary"
                    : "bg-white border-[#e2e8f0] text-muted-foreground"
                )}
              >
                {estFait ? <Check className="w-4 h-4" /> : etape.numero}
              </div>
              <span
                className={cn(
                  "text-xs mt-1.5 font-medium whitespace-nowrap",
                  estActuel ? "text-primary" : "text-muted-foreground"
                )}
              >
                {etape.label}
              </span>
            </div>
            {i < ETAPES.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-5 transition-all",
                  estFait ? "bg-primary" : "bg-[#e2e8f0]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
