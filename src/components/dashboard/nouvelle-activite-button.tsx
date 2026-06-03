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

const Schema = z.object({
  nom: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  type: z.enum(["PRINCIPALE", "COMPLEMENTAIRE"]),
  capacite: z.number().min(1),
  salle: z.string().optional(),
  horaires: z.string().optional(),
});

type Data = z.infer<typeof Schema>;

export function NouvelleActiviteButton({ editionId }: { editionId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Data>({
    resolver: zodResolver(Schema),
    defaultValues: { type: "PRINCIPALE", capacite: 20 },
  });

  const onSubmit = async (data: Data) => {
    const res = await fetch("/api/activites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, editionId }),
    });
    if (res.ok) { reset(); setOuvert(false); router.refresh(); }
  };

  return (
    <>
      <Button onClick={() => setOuvert(true)}>
        <Plus className="w-4 h-4" /> Nouvelle activité
      </Button>

      {ouvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">Nouvelle activité</h2>
              <button onClick={() => setOuvert(false)} className="p-1.5 rounded-lg hover:bg-muted">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Nom *</Label>
                <Input placeholder="Peinture" {...register("nom")} />
                {errors.nom && <p className="text-xs text-destructive">{errors.nom.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input placeholder="Description de l'activité..." {...register("description")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Type *</Label>
                  <select {...register("type")} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="PRINCIPALE">Principale</option>
                    <option value="COMPLEMENTAIRE">Complémentaire</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Capacité *</Label>
                  <Input type="number" {...register("capacite", { valueAsNumber: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Salle</Label>
                  <Input placeholder="Salle A" {...register("salle")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Horaires</Label>
                  <Input placeholder="8h - 10h" {...register("horaires")} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOuvert(false)} className="flex-1" disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
