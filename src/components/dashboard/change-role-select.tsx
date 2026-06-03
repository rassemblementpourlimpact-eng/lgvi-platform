"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

const ROLES = [
  { value: "LECTURE_SEULE", label: "Lecture seule" },
  { value: "ACCUEIL", label: "Accueil" },
  { value: "FORMATEUR", label: "Formateur" },
  { value: "COORDINATEUR", label: "Coordinateur" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "COMPTABILITE", label: "Comptabilité" },
  { value: "DIRECTION", label: "Direction" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export function ChangeRoleSelect({ userId, roleActuel }: { userId: string; roleActuel: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      await fetch("/api/utilisateurs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: e.target.value }),
      });
      router.refresh();
    });
  };

  return (
    <select
      defaultValue={roleActuel}
      onChange={onChange}
      disabled={isPending}
      className="h-8 px-2 text-xs rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white disabled:opacity-50"
    >
      {ROLES.map((r) => (
        <option key={r.value} value={r.value}>{r.label}</option>
      ))}
    </select>
  );
}
