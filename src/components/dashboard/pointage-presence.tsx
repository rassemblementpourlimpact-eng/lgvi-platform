"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, LogOut, Loader2 } from "lucide-react";

type Statut = "PRESENT" | "ABSENT" | "RETARD" | "DEPART_ANTICIPE";

interface Participant {
  id: string;
  prenom: string;
  nom: string;
  statutActuel?: Statut;
}

interface PointagePresenceProps {
  participants: Participant[];
  editionId: string;
  date: string;
}

const STATUTS: { value: Statut; label: string; icon: React.ComponentType<{ className?: string }>; classes: string }[] = [
  { value: "PRESENT", label: "Présent", icon: CheckCircle, classes: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" },
  { value: "ABSENT", label: "Absent", icon: XCircle, classes: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" },
  { value: "RETARD", label: "Retard", icon: Clock, classes: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200" },
  { value: "DEPART_ANTICIPE", label: "Départ anticipé", icon: LogOut, classes: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200" },
];

export function PointagePresence({ participants, editionId, date }: PointagePresenceProps) {
  const [statuts, setStatuts] = useState<Record<string, Statut>>(
    Object.fromEntries(
      participants
        .filter((p) => p.statutActuel)
        .map((p) => [p.id, p.statutActuel!])
    )
  );
  const [enCours, setEnCours] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pointer = (participantId: string, statut: Statut) => {
    setEnCours(participantId);
    startTransition(async () => {
      await fetch("/api/presences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, editionId, date, statut }),
      });
      setStatuts((prev) => ({ ...prev, [participantId]: statut }));
      setEnCours(null);
    });
  };

  const toutMarquer = (statut: Statut) => {
    participants.forEach((p) => pointer(p.id, statut));
  };

  const presents = Object.values(statuts).filter((s) => s === "PRESENT").length;
  const absents = Object.values(statuts).filter((s) => s === "ABSENT").length;

  return (
    <div className="space-y-4">
      {/* Résumé rapide */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{presents}</p>
          <p className="text-xs text-muted-foreground">Présents</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{absents}</p>
          <p className="text-xs text-muted-foreground">Absents</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-muted-foreground">
            {participants.length - presents - absents}
          </p>
          <p className="text-xs text-muted-foreground">Non pointés</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => toutMarquer("PRESENT")}
            className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            Tous présents
          </button>
          <button
            onClick={() => toutMarquer("ABSENT")}
            className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Tous absents
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {participants.map((p) => {
          const statutActuel = statuts[p.id];
          const loading = enCours === p.id && isPending;

          return (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 bg-white rounded-xl border border-border"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {p.prenom[0]}{p.nom[0]}
                </span>
              </div>
              <p className="font-medium text-foreground flex-1 text-sm">
                {p.prenom} {p.nom}
              </p>

              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex gap-1.5">
                  {STATUTS.map((s) => {
                    const isActif = statutActuel === s.value;
                    return (
                      <button
                        key={s.value}
                        title={s.label}
                        onClick={() => pointer(p.id, s.value)}
                        className={cn(
                          "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                          isActif
                            ? s.classes + " ring-2 ring-offset-1 ring-current"
                            : "border-border bg-muted hover:bg-muted/80"
                        )}
                      >
                        <s.icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
