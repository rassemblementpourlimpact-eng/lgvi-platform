import { LoginForm } from "@/components/forms/login-form";

export const metadata = { title: "Connexion — LGVI" };

export default function ConnexionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1e3a5f] to-[#0f2640] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-black text-xl">LG</span>
          </div>
          <h1 className="text-2xl font-bold text-white">LGVI Platform</h1>
          <p className="text-white/50 text-sm mt-1">Espace administrateur</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-6">
            Connexion
          </h2>
          <LoginForm />
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Les Grandes Vacances de l&apos;Impact — Cotonou, Bénin
        </p>
      </div>
    </main>
  );
}
