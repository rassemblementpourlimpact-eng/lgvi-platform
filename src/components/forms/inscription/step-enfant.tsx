"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const EnfantSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  sexe: z.enum(["M", "F"], { required_error: "Sexe requis" }),
  dateNaissance: z.string().min(1, "Date de naissance requise"),
  ecole: z.string().optional(),
  classe: z.string().optional(),
});

export type EnfantData = z.infer<typeof EnfantSchema>;

interface StepEnfantProps {
  defaultValues?: Partial<EnfantData>;
  onNext: (data: EnfantData) => void;
  onBack: () => void;
}

export function StepEnfant({ defaultValues, onNext, onBack }: StepEnfantProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EnfantData>({
    resolver: zodResolver(EnfantSchema),
    defaultValues,
  });

  const sexeActuel = watch("sexe");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">
          Informations de l&apos;enfant
        </h2>
        <p className="text-sm text-muted-foreground">
          Renseignez les informations de l&apos;enfant à inscrire.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="e-prenom">Prénom *</Label>
          <Input id="e-prenom" placeholder="Koffi" {...register("prenom")} />
          {errors.prenom && (
            <p className="text-xs text-destructive">{errors.prenom.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e-nom">Nom *</Label>
          <Input id="e-nom" placeholder="HOUETO" {...register("nom")} />
          {errors.nom && (
            <p className="text-xs text-destructive">{errors.nom.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Sexe *</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["M", "F"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setValue("sexe", s)}
              className={`py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                sexeActuel === s
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-[#e2e8f0] text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s === "M" ? "👦 Garçon" : "👧 Fille"}
            </button>
          ))}
        </div>
        {errors.sexe && (
          <p className="text-xs text-destructive">{errors.sexe.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dateNaissance">Date de naissance *</Label>
        <Input
          id="dateNaissance"
          type="date"
          {...register("dateNaissance")}
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.dateNaissance && (
          <p className="text-xs text-destructive">
            {errors.dateNaissance.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="ecole">École (facultatif)</Label>
          <Input id="ecole" placeholder="La Ronde" {...register("ecole")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="classe">Classe (facultatif)</Label>
          <Input id="classe" placeholder="CE2" {...register("classe")} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button type="submit" className="flex-1" size="lg">
          Continuer
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
