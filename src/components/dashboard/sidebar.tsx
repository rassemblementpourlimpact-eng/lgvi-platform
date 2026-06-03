"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  ClipboardCheck,
  Star,
  UsersRound,
  GraduationCap,
  CreditCard,
  BarChart3,
  Mail,
  Image,
  Handshake,
  TrendingUp,
  LineChart,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Principal",
    items: [
      { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      { label: "Éditions", href: "/editions", icon: Calendar },
    ],
  },
  {
    title: "Participants",
    items: [
      { label: "Participants", href: "/participants", icon: Users },
      { label: "Parents", href: "/parents", icon: UserCheck },
      { label: "Présences", href: "/presences", icon: ClipboardCheck },
      { label: "Activités", href: "/activites-gestion", icon: Star },
      { label: "Groupes", href: "/groupes", icon: UsersRound },
    ],
  },
  {
    title: "Organisation",
    items: [
      { label: "Formateurs", href: "/formateurs", icon: GraduationCap },
      { label: "Paiements", href: "/paiements", icon: CreditCard },
      { label: "Comptabilité", href: "/comptabilite", icon: BarChart3 },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Communication", href: "/communication", icon: Mail },
      { label: "Galerie", href: "/galerie-gestion", icon: Image },
      { label: "Partenaires", href: "/partenaires", icon: Handshake },
    ],
  },
  {
    title: "Analytique",
    items: [
      { label: "KPI & Analytics", href: "/kpi", icon: LineChart },
      { label: "SEO & Marketing", href: "/seo", icon: TrendingUp },
      { label: "Documents", href: "/documents", icon: FileText },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Paramètres", href: "/parametres", icon: Settings },
      { label: "Utilisateurs", href: "/utilisateurs", icon: ShieldCheck },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/connexion");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1e3a5f] flex flex-col z-50 shadow-xl">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f97316] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">LG</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">LGVI</p>
            <p className="text-white/50 text-xs leading-tight">Platform V2</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1.5 px-2">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
                        isActive
                          ? "bg-[#f97316] text-white font-medium"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isActive ? "text-white" : "text-white/50 group-hover:text-white"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-3 h-3 text-white/70" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
