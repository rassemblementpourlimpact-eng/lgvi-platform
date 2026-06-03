"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["SUPER_ADMIN", "DIRECTION", "COMPTABILITE", "COMMUNICATION", "ACCUEIL", "FORMATEUR", "COORDINATEUR", "LECTURE_SEULE"]),
});
type Data = z.infer<typeof Schema>;

export function NouvelUtilisateurButton() {
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Data>({
    resolver: zodResolver(Schema),
    defaultValues: { role: "LECTURE_SEULE" },
  });

  const onSubmit = async (data: Data) => {
    const res = await fetch("/api/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { reset(); setOuvert(false); router.refresh(); }
  };

  return (
    <>
      <Button onClick={() => setOuvert(true)}><Plus className="w-4 h-4" /> Nouvel utilisateur</Button>
      {ouvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">Nouvel utilisateur</h2>
              <button onClick={() => setOuvert(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5"><Label>Nom complet *</Label><Input {...register("name")} /></div>
              <div className="space-y-1.5"><Label>Email *</Label><Input type="email" {...register("email")} /></div>
              <div className="space-y-1.5">
                <Label>Mot de passe *</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Rôle *</Label>
                <select {...register("role")} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="LECTURE_SEULE">Lecture seule</option>
                  <option value="ACCUEIL">Accueil & Inscriptions</option>
                  <option value="FORMATEUR">Formateur</option>
                  <option value="COORDINATEUR">Coordinateur</option>
                  <option value="COMMUNICATION">Communication</option>
                  <option value="COMPTABILITE">Comptabilité</option>
                  <option value="DIRECTION">Direction</option>
                  <option value="SUPER_ADMIN">Super Administrateur</option>
                </select>
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
