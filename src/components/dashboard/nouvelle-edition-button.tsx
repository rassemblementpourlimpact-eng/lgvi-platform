"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";

const EditionSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  annee: z.number().min(2020),
  dateOuverture: z.string().min(1, "Date requise"),
  dateFermeture: z.string().min(1, "Date requise"),
  dateDebut: z.string().min(1, "Date requise"),
  dateFin: z.string().min(1, "Date requise"),
  capaciteMaximale: z.number().min(1, "Capacité requise"),
  description: z.string().optional(),
});

type EditionData = z.infer<typeof EditionSchema>;

export function NouvellEditionButton() {
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditionData>({
    resolver: zodResolver(EditionSchema),
    defaultValues: {
      annee: new Date().getFullYear(),
      capaciteMaximale: 100,
    },
  });

  const onSubmit = async (data: EditionData) => {
    const res = await fetch("/api/editions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        dateOuverture: new Date(data.dateOuverture).toISOString(),
        dateFermeture: new Date(data.dateFermeture).toISOString(),
        dateDebut: new Date(data.dateDebut).toISOString(),
        dateFin: new Date(data.dateFin).toISOString(),
      }),
    });

    if (res.ok) {
      reset();
      setOuvert(false);
      router.refresh();
    }
  };

  return (
    <>
      <Button onClick={() => setOuvert(true)}>
        <Plus className="w-4 h-4" />
        Nouvelle édition
      </Button>

      {ouvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                Nouvelle édition
              </h2>
              <button
                onClick={() => setOuvert(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nom">Nom de l&apos;édition *</Label>
                <Input
                  id="nom"
                  placeholder="LGVI 2026"
                  {...register("nom")}
                />
                {errors.nom && (
                  <p className="text-xs text-destructive">{errors.nom.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="annee">Année *</Label>
                  <Input
                    id="annee"
                    type="number"
                    {...register("annee", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="capaciteMaximale">Capacité max *</Label>
                  <Input
                    id="capaciteMaximale"
                    type="number"
                    {...register("capaciteMaximale", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Ouverture inscriptions *</Label>
                  <Input type="date" {...register("dateOuverture")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Fermeture inscriptions *</Label>
                  <Input type="date" {...register("dateFermeture")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Début du programme *</Label>
                  <Input type="date" {...register("dateDebut")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Fin du programme *</Label>
                  <Input type="date" {...register("dateFin")} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description (facultatif)</Label>
                <Input
                  id="description"
                  placeholder="Notes sur cette édition..."
                  {...register("description")}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOuvert(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Créer l'édition"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
