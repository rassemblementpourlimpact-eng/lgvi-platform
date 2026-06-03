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
  nom: z.string().min(1),
  prenom: z.string().min(1),
  telephone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  specialite: z.string().optional(),
  categorie: z.enum(["DIRECTION", "COORDINATION", "FORMATEUR", "ANIMATEUR", "MEDIA", "BENEVOLE"]),
});

type Data = z.infer<typeof Schema>;

export function NouveauFormateurButton() {
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Data>({
    resolver: zodResolver(Schema),
    defaultValues: { categorie: "FORMATEUR" },
  });

  const onSubmit = async (data: Data) => {
    const res = await fetch("/api/formateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { reset(); setOuvert(false); router.refresh(); }
  };

  return (
    <>
      <Button onClick={() => setOuvert(true)}><Plus className="w-4 h-4" /> Ajouter un membre</Button>
      {ouvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">Nouveau membre</h2>
              <button onClick={() => setOuvert(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Prénom *</Label><Input {...register("prenom")} /></div>
                <div className="space-y-1.5"><Label>Nom *</Label><Input {...register("nom")} /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Catégorie *</Label>
                <select {...register("categorie")} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="DIRECTION">Direction</option>
                  <option value="COORDINATION">Coordination</option>
                  <option value="FORMATEUR">Formateur</option>
                  <option value="ANIMATEUR">Animateur</option>
                  <option value="MEDIA">Médias</option>
                  <option value="BENEVOLE">Bénévole</option>
                </select>
              </div>
              <div className="space-y-1.5"><Label>Spécialité</Label><Input placeholder="Danse, Peinture..." {...register("specialite")} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Téléphone</Label><Input type="tel" {...register("telephone")} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" {...register("email")} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOuvert(false)} className="flex-1" disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
