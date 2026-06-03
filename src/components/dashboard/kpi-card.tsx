import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  titre: string;
  valeur: string | number;
  sous_titre?: string;
  tendance?: { valeur: number; label: string };
  icon: React.ComponentType<{ className?: string }>;
  couleur?: "orange" | "blue" | "green" | "yellow";
}

const couleurs = {
  orange: {
    bg: "bg-orange-50",
    icon: "bg-[#f97316] text-white",
    valeur: "text-[#f97316]",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-[#1e3a5f] text-white",
    valeur: "text-[#1e3a5f]",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-[#22c55e] text-white",
    valeur: "text-[#22c55e]",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "bg-[#f59e0b] text-white",
    valeur: "text-[#f59e0b]",
  },
};

export function KpiCard({
  titre,
  valeur,
  sous_titre,
  tendance,
  icon: Icon,
  couleur = "orange",
}: KpiCardProps) {
  const c = couleurs[couleur];
  const hausse = tendance && tendance.valeur >= 0;

  return (
    <div className={cn("rounded-xl p-5 border border-[#e2e8f0] bg-white", c.bg)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {tendance && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              hausse
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            )}
          >
            {hausse ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(tendance.valeur)}% {tendance.label}
          </span>
        )}
      </div>
      <p className={cn("text-2xl font-bold", c.valeur)}>{valeur}</p>
      <p className="text-sm font-medium text-[#0f172a] mt-0.5">{titre}</p>
      {sous_titre && (
        <p className="text-xs text-[#64748b] mt-1">{sous_titre}</p>
      )}
    </div>
  );
}
