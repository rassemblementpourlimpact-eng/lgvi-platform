"use client";

import { useState, useEffect } from "react";
import { Stepper } from "./stepper";
import { StepParent, type ParentData } from "./step-parent";
import { StepEnfant, type EnfantData } from "./step-enfant";
import { StepMedical, type MedicalData } from "./step-medical";
import { StepActivites, type ActiviteData } from "./step-activites";
import { StepPaiement } from "./step-paiement";

interface Activite {
  id: string;
  nom: string;
  description: string | null;
  capacite: number;
  inscrits: number;
}

interface InscriptionFormProps {
  editionId: string;
  montantInscription: number;
  activites: Activite[];
}

const STORAGE_KEY = "lgvi_inscription_draft";

type FormData = {
  parent?: ParentData;
  enfant?: EnfantData;
  medical?: MedicalData;
  activite?: ActiviteData;
};

export function InscriptionForm({
  editionId,
  montantInscription,
  activites,
}: InscriptionFormProps) {
  const [etape, setEtape] = useState(1);
  const [data, setData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState<string>();
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);

  // Restaurer le brouillon au chargement — persistance localStorage
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as FormData;
        setData(parsed);
        // Correction V1.1 §2.2 : si parent déjà saisi, passer à l'étape 2
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

  const handleParent = (parent: ParentData) => {
    sauvegarder({ parent });
    setEtape(2);
  };

  const handleEnfant = (enfant: EnfantData) => {
    sauvegarder({ enfant });
    setEtape(3);
  };

  const handleMedical = (medical: MedicalData) => {
    sauvegarder({ medical });
    setEtape(4);
  };

  const handleActivite = (activite: ActiviteData) => {
    sauvegarder({ activite });
    setEtape(5);
  };

  const handlePaiement = async (modePaiement: string) => {
    if (!data.parent || !data.enfant || !data.medical || !data.activite) return;

    setIsLoading(true);
    setErreurServeur(null);

    try {
      const res = await fetch("/api/inscriptions/valider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editionId,
          activiteId: data.activite.activiteId,
          parent: data.parent,
          enfant: {
            ...data.enfant,
            dateNaissance: new Date(data.enfant.dateNaissance).toISOString(),
          },
          medical: data.medical,
          modePaiement,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErreurServeur(
          json.error === "Cette activité est complète."
            ? "Cette activité vient d'être complète. Veuillez choisir une autre."
            : json.error ?? "Une erreur est survenue."
        );
        if (json.error === "Cette activité est complète.") setEtape(4);
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      setReference(json.participant?.id?.slice(0, 8).toUpperCase());
      setSuccess(true);
    } catch {
      setErreurServeur("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!success && <Stepper etapeActuelle={etape} />}

      {erreurServeur && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {erreurServeur}
        </div>
      )}

      {etape === 1 && (
        <StepParent defaultValues={data.parent} onNext={handleParent} />
      )}
      {etape === 2 && (
        <StepEnfant
          defaultValues={data.enfant}
          onNext={handleEnfant}
          onBack={() => setEtape(1)}
        />
      )}
      {etape === 3 && (
        <StepMedical
          defaultValues={data.medical}
          onNext={handleMedical}
          onBack={() => setEtape(2)}
        />
      )}
      {etape === 4 && (
        <StepActivites
          activites={activites}
          defaultActiviteId={data.activite?.activiteId}
          onNext={handleActivite}
          onBack={() => setEtape(3)}
        />
      )}
      {etape === 5 && (
        <StepPaiement
          montant={montantInscription}
          prenomEnfant={data.enfant?.prenom ?? ""}
          onSubmit={handlePaiement}
          onBack={() => setEtape(4)}
          isLoading={isLoading}
          success={success}
          reference={reference}
        />
      )}
    </div>
  );
}
