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
  titre: z.string().min(1),
  activite: z.string().optional(),
  date: z.string().optional(),
});
type Data = z.infer<typeof Schema>;

export function NouvelAlbumButton({ editionId }: { editionId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Data>({ resolver: zodResolver(Schema) });

  const onSubmit = async (data: Data) => {
    const res = await fetch("/api/galerie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, editionId }),
    });
    if (res.ok) { reset(); setOuvert(false); router.refresh(); }
  };

  return (
    <>
      <Button onClick={() => setOuvert(true)} size="sm"><Plus className="w-4 h-4" /> Nouvel album</Button>
      {ouvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">Nouvel album</h2>
              <button onClick={() => setOuvert(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5"><Label>Titre *</Label><Input placeholder="Journée Peinture" {...register("titre")} /></div>
              <div className="space-y-1.5"><Label>Activité</Label><Input placeholder="Peinture, Théâtre..." {...register("activite")} /></div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" {...register("date")} /></div>
              <p className="text-xs text-muted-foreground">
                Après la création, uploadez les photos depuis Cloudinary et ajoutez leurs IDs à l&apos;album.
              </p>
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
