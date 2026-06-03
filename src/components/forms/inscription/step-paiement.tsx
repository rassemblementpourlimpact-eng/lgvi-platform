"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CreditCard, Smartphone, Banknote, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMontant } from "@/lib/utils";

type ModePaiement = "fedapay" | "mobile_money" | "especes";

interface StepPaiementProps {
  montant: number;
  prenomEnfant: string;
  onSubmit: (mode: ModePaiement) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  success?: boolean;
  reference?: string;
}

const MODES = [
  {
    id: "fedapay" as ModePaiement,
    label: "Carte bancaire / FedaPay",
    description: "Paiement sécurisé en ligne",
    icone: CreditCard,
    badge: "Recommandé",
  },
  {
    id: "mobile_money" as ModePaiement,
    label: "Mobile Money",
    description: "MTN, Moov, ou autre",
    icone: Smartphone,
    badge: null,
  },
  {
    id: "especes" as ModePaiement,
    label: "Espèces sur place",
    description: "À régler à l'accueil lors de l'arrivée",
    icone: Banknote,
    badge: null,
  },
];

export function StepPaiement({
  montant,
  prenomEnfant,
  onSubmit,
  onBack,
  isLoading,
  success,
  reference,
}: StepPaiementProps) {
  const [modeChoisi, setModeChoisi] = useState<ModePaiement>("fedapay");

  if (success && reference) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0f172a]">
          Inscription enregistrée !
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          L&apos;inscription de <strong>{prenomEnfant}</strong> a bien été prise en compte.
          Un email de confirmation vous a été envoyé.
        </p>
        <div className="inline-block bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-6 py-3">
          <p className="text-xs text-muted-foreground">Référence</p>
          <p className="font-mono font-bold text-[#0f172a]">{reference}</p>
        </div>

        {/* WhatsApp CTA — Correction V1.1 Section 5.1 */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Bonjour LGVI, je viens d'inscrire ${prenomEnfant} (Réf: ${reference}). Pouvez-vous confirmer la réception ?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25d366] text-white rounded-xl font-semibold hover:bg-[#20b858] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
          </svg>
          Contacter LGVI sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">Paiement</h2>
        <p className="text-sm text-muted-foreground">
          Choisissez votre mode de paiement.
        </p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Inscription LGVI</p>
            <p className="font-semibold text-[#0f172a]">{prenomEnfant}</p>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatMontant(montant)}
          </p>
        </div>
      </div>

      {/* Modes de paiement */}
      <div className="space-y-2">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setModeChoisi(mode.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
              modeChoisi === mode.id
                ? "border-primary bg-primary/5"
                : "border-[#e2e8f0] hover:border-primary/50 bg-white"
            )}
          >
            <mode.icone
              className={cn(
                "w-5 h-5 shrink-0",
                modeChoisi === mode.id ? "text-primary" : "text-muted-foreground"
              )}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-[#0f172a] text-sm">{mode.label}</p>
                {mode.badge && (
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                    {mode.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{mode.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button
          type="button"
          onClick={() => onSubmit(modeChoisi)}
          disabled={isLoading}
          className="flex-1"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Traitement...
            </>
          ) : (
            "Confirmer l'inscription"
          )}
        </Button>
      </div>
    </div>
  );
}
