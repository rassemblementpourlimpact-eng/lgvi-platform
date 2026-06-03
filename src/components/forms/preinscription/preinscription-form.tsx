"use client";

import { useState, useEffect } from "react";
import { Stepper } from "../inscription/stepper";
import { StepParent, type ParentData } from "../inscription/step-parent";
import { StepEnfant, type EnfantData } from "../inscription/step-enfant";
import { StepMedical, type MedicalData } from "../inscription/step-medical";
import { StepActivites, type ActiviteData } from "../inscription/step-activites";
import { CheckCircle2 } from "lucide-react";

interface Activite {
  id: string;
  nom: string;
  description: string | null;
  capacite: number;
  inscrits: number;
}

interface PreinscriptionFormProps {
  editionId: string;
  activites: Activite[];
}

const STORAGE_KEY = "lgvi_preinscription_draft";

type FormData = {
  parent?: ParentData;
  enfant?: EnfantData;
  medical?: MedicalData;
  activite?: ActiviteData;
};

export function PreinscriptionForm({ editionId, activites }: PreinscriptionFormProps) {
  const [etape, setEtape] = useState(1);
  const [data, setData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState<string>();
  const [prenomEnfant, setPrenomEnfant] = useState<string>("");
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as FormData;
        setData(parsed);
        if (parsed.parent) setEtape(2);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const sauvegarder = (partiel: Partial<FormData>) => {
    const nouveau = { ...data, ...partiel };
    setData(nouveau);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nouveau));
  };

  const handleActivite = async (activite: ActiviteData) => {
    sauvegarder({ activite });
    if (!data.parent || !data.enfant || !data.medical) return;

    setIsLoading(true);
    setErreurServeur(null);

    try {
      const res = await fetch("/api/inscriptions/preinscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editionId,
          activiteId: activite.activiteId,
          parent: data.parent,
          enfant: {
            ...data.enfant,
            dateNaissance: new Date(data.enfant.dateNaissance).toISOString(),
          },
          medical: data.medical,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErreurServeur(
          json.error === "Cette activité est complète."
            ? "Cette activité est complète. Veuillez en choisir une autre."
            : json.error ?? "Une erreur est survenue."
        );
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      setReference(json.participant?.id?.slice(0, 8).toUpperCase());
      setPrenomEnfant(data.enfant.prenom);
      setSuccess(true);
    } catch {
      setErreurServeur("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success && reference) {
    const tel = data.parent?.telephone ?? "";
    const whatsappMsg = encodeURIComponent(
      `Bonjour LGVI, je viens de pré-inscrire ${prenomEnfant} (Réf: ${reference}). Je souhaite finaliser le paiement.`
    );

    return (
      <div className="text-center py-8 space-y-5">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">
            Préinscription enregistrée !
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            <strong>{prenomEnfant}</strong> est préinscrit·e. Finalisez le paiement
            dès que possible pour confirmer la place.
          </p>
        </div>

        <div className="inline-block bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-6 py-4">
          <p className="text-xs text-muted-foreground mb-1">Votre référence</p>
          <p className="font-mono font-bold text-2xl text-[#0f172a]">{reference}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Conservez cette référence pour finaliser le paiement
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={`/payer?tel=${encodeURIComponent(tel)}`}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Finaliser le paiement maintenant →
          </a>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#25d366] text-white rounded-xl font-semibold hover:bg-[#20b858] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Contacter LGVI sur WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const ETAPES = ["Parent", "Enfant", "Médical", "Activité"];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          {ETAPES.map((label, i) => {
            const num = i + 1;
            const actif = num === etape;
            const fait = num < etape;
            return (
              <div key={num} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    fait
                      ? "bg-primary text-white"
                      : actif
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {fait ? "✓" : num}
                </div>
                <span className={`text-[10px] ${actif ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1 bg-muted rounded-full mt-1">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((etape - 1) / (ETAPES.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {erreurServeur && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {erreurServeur}
        </div>
      )}

      {etape === 1 && (
        <StepParent defaultValues={data.parent} onNext={(p) => { sauvegarder({ parent: p }); setEtape(2); }} />
      )}
      {etape === 2 && (
        <StepEnfant
          defaultValues={data.enfant}
          onNext={(e) => { sauvegarder({ enfant: e }); setEtape(3); }}
          onBack={() => setEtape(1)}
        />
      )}
      {etape === 3 && (
        <StepMedical
          defaultValues={data.medical}
          onNext={(m) => { sauvegarder({ medical: m }); setEtape(4); }}
          onBack={() => setEtape(2)}
        />
      )}
      {etape === 4 && (
        <StepActivites
          activites={activites}
          defaultActiviteId={data.activite?.activiteId}
          onNext={handleActivite}
          onBack={() => setEtape(3)}
          isLoading={isLoading}
          submitLabel="Confirmer la préinscription"
        />
      )}
    </div>
  );
}
