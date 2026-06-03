"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

export const ParentSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  telephone: z.string().min(8, "Numéro invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  adresse: z.string().optional(),
});

export type ParentData = z.infer<typeof ParentSchema>;

interface StepParentProps {
  defaultValues?: Partial<ParentData>;
  onNext: (data: ParentData) => void;
}

export function StepParent({ defaultValues, onNext }: StepParentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentData>({
    resolver: zodResolver(ParentSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">
          Informations du parent
        </h2>
        <p className="text-sm text-muted-foreground">
          Ces informations sont sauvegardées automatiquement.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="prenom">Prénom *</Label>
          <Input id="prenom" placeholder="Marie" {...register("prenom")} />
          {errors.prenom && (
            <p className="text-xs text-destructive">{errors.prenom.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nom">Nom *</Label>
          <Input id="nom" placeholder="KOFFI" {...register("nom")} />
          {errors.nom && (
            <p className="text-xs text-destructive">{errors.nom.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="telephone">Téléphone principal *</Label>
        <Input
          id="telephone"
          type="tel"
          placeholder="97 00 00 00"
          {...register("telephone")}
        />
        {errors.telephone && (
          <p className="text-xs text-destructive">{errors.telephone.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email (facultatif)</Label>
        <Input
          id="email"
          type="email"
          placeholder="marie@exemple.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="adresse">Adresse (facultatif)</Label>
        <Input
          id="adresse"
          placeholder="Quartier, Ville"
          {...register("adresse")}
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        Continuer
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
