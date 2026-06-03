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
  description: z.string().min(1),
  montant: z.number().positive(),
  categorie: z.enum(["FONCTIONNEMENT", "COMMUNICATION", "RESTAURATION", "MATERIEL", "LOGISTIQUE", "ACTIVITES", "AUTRE"]),
  date: z.string().min(1),
});

type Data = z.infer<typeof Schema>;

export function AjouterDepenseButton({ editionId }: { editionId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Data>({
    resolver: zodResolver(Schema),
    defaultValues: { categorie: "FONCTIONNEMENT", date: new Date().toISOString().split("T")[0] },
  });

  const onSubmit = async (data: Data) => {
    const res = await fetch("/api/depenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, editionId }),
    });
    if (res.ok) { reset(); setOuvert(false); router.refresh(); }
  };

  return (
    <>
      <Button onClick={() => setOuvert(true)} size="sm"><Plus className="w-4 h-4" /> Ajouter une dépense</Button>
      {ouvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">Nouvelle dépense</h2>
              <button onClick={() => setOuvert(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5"><Label>Description *</Label><Input placeholder="Achat de matériel..." {...register("description")} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Montant (FCFA) *</Label>
                  <Input type="number" {...register("montant", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Date *</Label>
                  <Input type="date" {...register("date")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Catégorie *</Label>
                <select {...register("categorie")} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {["FONCTIONNEMENT", "COMMUNICATION", "RESTAURATION", "MATERIEL", "LOGISTIQUE", "ACTIVITES", "AUTRE"].map((c) => (
                    <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOuvert(false)} className="flex-1" disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
