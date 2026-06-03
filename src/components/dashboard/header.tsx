"use client";

import { Bell, Search } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  editionNom?: string;
}

export function DashboardHeader({ title, editionNom }: HeaderProps) {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-[#0f172a]">{title}</h1>
        {editionNom && (
          <Badge variant="secondary" className="text-xs">
            {editionNom}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#94a3b8] hover:bg-[#f1f5f9] transition-colors w-48">
          <Search className="w-3.5 h-3.5" />
          <span>Rechercher...</span>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8fafc] transition-colors">
          <Bell className="w-4 h-4 text-[#64748b]" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#f97316] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  );
}
