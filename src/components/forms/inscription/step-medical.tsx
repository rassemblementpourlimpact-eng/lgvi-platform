"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";

export const MedicalSchema = z.object({
  allergies: z.string().optional(),
  traitements: z.string().optional(),
  restrictionsAlimentaires: z.string().optional(),
  observations: z.string().optional(),
  contactUrgence: z.string().min(1, "Contact d'urgence requis"),
});

export type MedicalData = z.infer<typeof MedicalSchema>;

interface StepMedicalProps {
  defaultValues?: Partial<MedicalData>;
  onNext: (data: MedicalData) => void;
  onBack: () => void;
}

export function StepMedical({ defaultValues, onNext, onBack }: StepMedicalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalData>({
    resolver: zodResolver(MedicalSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">
          Informations médicales
        </h2>
        <p className="text-sm text-muted-foreground">
          Ces données sont chiffrées et confidentielles.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Ces informations sont essentielles pour la sécurité de votre enfant.
          Elles ne seront accessibles qu&apos;à l&apos;équipe médicale et à la direction.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="allergies">Allergies connues</Label>
        <Input
          id="allergies"
          placeholder="Ex : abeilles, arachides..."
          {...register("allergies")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="traitements">Traitements médicaux en cours</Label>
        <Input
          id="traitements"
          placeholder="Ex : antihistaminiques, insuline..."
          {...register("traitements")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="restrictionsAlimentaires">
          Restrictions alimentaires
        </Label>
        <Input
          id="restrictionsAlimentaires"
          placeholder="Ex : végétarien, sans porc..."
          {...register("restrictionsAlimentaires")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="observations">Observations particulières</Label>
        <Input
          id="observations"
          placeholder="Toute information utile pour l'encadrement..."
          {...register("observations")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactUrgence">Contact d&apos;urgence *</Label>
        <Input
          id="contactUrgence"
          type="tel"
          placeholder="Nom + téléphone (ex: Papa Jean — 97 00 00 00)"
          {...register("contactUrgence")}
        />
        {errors.contactUrgence && (
          <p className="text-xs text-destructive">
            {errors.contactUrgence.message}
          </p>
        )}
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
