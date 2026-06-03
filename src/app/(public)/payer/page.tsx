"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Phone, Search, CreditCard, Smartphone, Banknote,
  CheckCircle2, ArrowLeft, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMontant } from "@/lib/utils";

type Inscription = {
  paiementId: string;
  participantId: string;
  reference: string;
  prenom: string;
  nom: string;
  activite: string;
  edition: string;
  montant: number;
  montantPaye: number;
  statut: string;
};

type Parent = { id: string; prenom: string; nom: string };

type ModePaiement = "fedapay" | "mobile_money" | "especes";

const MODES = [
  {
    id: "especes" as ModePaiement,
    label: "Espèces à l'accueil",
    description: "Réglez en cash lors de votre arrivée",
    icone: Banknote,
  },
  {
    id: "mobile_money" as ModePaiement,
    label: "Mobile Money",
    description: "MTN MoMo, Moov Money ou autre",
    icone: Smartphone,
  },
  {
    id: "fedapay" as ModePaiement,
    label: "Carte bancaire / FedaPay",
    description: "Paiement sécurisé en ligne",
    icone: CreditCard,
    badge: "En ligne",
  },
];

const INSTRUCTIONS: Record<ModePaiement, string> = {
  especes:
    "Votre intention de paiement a été enregistrée. Apportez le montant exact en espèces lors de l'accueil de votre enfant le premier jour. La place est réservée sous 48h.",
  mobile_money:
    `Envoyez le montant au numéro LGVI via Mobile Money, puis contactez-nous sur WhatsApp avec votre référence pour confirmation. La place sera confirmée dès réception.`,
  fedapay:
    "Notre équipe va vous contacter pour vous envoyer un lien de paiement sécurisé FedaPay. Vous pouvez aussi nous contacter directement sur WhatsApp.",
};

function PayerContent() {
  const searchParams = useSearchParams();
  const telInitial = searchParams.get("tel") ?? "";

  const [telephone, setTelephone] = useState(telInitial);
  const [etape, setEtape] = useState<"recherche" | "liste" | "mode" | "succes">(
    telInitial ? "recherche" : "recherche"
  );
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [parent, setParent] = useState<Parent | null>(null);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [selected, setSelected] = useState<Inscription | null>(null);
  const [mode, setMode] = useState<ModePaiement>("especes");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (telInitial) {
      handleRecherche(telInitial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecherche = async (tel = telephone) => {
    const cleaned = tel.replace(/\s/g, "");
    if (cleaned.length < 8) {
      setErreur("Entrez un numéro de téléphone valide (8 chiffres minimum).");
      return;
    }
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch(`/api/paiements/mes-inscriptions?tel=${encodeURIComponent(cleaned)}`);
      const json = await res.json();
      if (!res.ok) { setErreur(json.error ?? "Erreur serveur"); return; }

      if (!json.parent || json.inscriptions.length === 0) {
        setErreur("Aucune préinscription en attente trouvée pour ce numéro.");
        return;
      }
      setParent(json.parent);
      setInscriptions(json.inscriptions);
      setEtape("liste");
    } catch {
      setErreur("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinaliser = async () => {
    if (!selected) return;
    setSubmitting(true);
    setErreur(null);
    try {
      const res = await fetch(`/api/paiements/${selected.paiementId}/finaliser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modePaiement: mode, telephone }),
      });
      const json = await res.json();
      if (!res.ok) { setErreur(json.error ?? "Erreur serveur"); return; }
      setEtape("succes");
    } catch {
      setErreur("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappBase = `https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}`;

  return (
    <main className="min-h-screen bg-muted py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3">
            <span className="text-white font-black text-base">LG</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary">Finaliser mon paiement</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Retrouvez votre préinscription et choisissez comment payer.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-5">

          {/* Étape 1 — Recherche */}
          {etape === "recherche" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-secondary mb-1">Trouvez votre inscription</h2>
                <p className="text-sm text-muted-foreground">
                  Entrez le numéro de téléphone utilisé lors de la préinscription.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRecherche()}
                    placeholder="Ex : 97 00 00 00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                {erreur && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{erreur}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleRecherche()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Recherche..." : "Rechercher"}
              </button>
            </div>
          )}

          {/* Étape 2 — Liste des inscriptions */}
          {etape === "liste" && parent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setEtape("recherche")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-secondary">
                    Bonjour, {parent.prenom} !
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {inscriptions.length} inscription{inscriptions.length > 1 ? "s" : ""} en attente de paiement.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {inscriptions.map((ins) => {
                  const restant = ins.montant - ins.montantPaye;
                  return (
                    <button
                      key={ins.paiementId}
                      onClick={() => { setSelected(ins); setEtape("mode"); }}
                      className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground">
                          {ins.prenom} {ins.nom}
                        </p>
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                          Réf. {ins.reference}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ins.activite} · {ins.edition}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">Reste à payer</span>
                        <span className="font-bold text-primary">{formatMontant(restant)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Étape 3 — Choix du mode */}
          {etape === "mode" && selected && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setEtape("liste")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-secondary">Mode de paiement</h2>
                  <p className="text-sm text-muted-foreground">
                    Pour {selected.prenom} · {formatMontant(selected.montant - selected.montantPaye)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                      mode === m.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-white"
                    )}
                  >
                    <m.icone className={cn("w-5 h-5 shrink-0", mode === m.id ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{m.label}</p>
                        {m.badge && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {erreur && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{erreur}</p>
                </div>
              )}

              <button
                onClick={handleFinaliser}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? "Enregistrement..." : "Confirmer ce mode de paiement"}
              </button>
            </div>
          )}

          {/* Étape 4 — Succès */}
          {etape === "succes" && selected && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0f172a] mb-2">Choix enregistré !</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {INSTRUCTIONS[mode]}
                </p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-6 py-4">
                <p className="text-xs text-muted-foreground">Référence</p>
                <p className="font-mono font-bold text-xl text-[#0f172a]">{selected.reference}</p>
              </div>
              <a
                href={`${whatsappBase}?text=${encodeURIComponent(`Bonjour LGVI, je souhaite finaliser le paiement pour ${selected.prenom} ${selected.nom} (Réf: ${selected.reference}). Mode choisi: ${mode}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#25d366] text-white rounded-xl font-semibold hover:bg-[#20b858] transition-colors"
              >
                Contacter LGVI sur WhatsApp
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Pas encore inscrit ?{" "}
          <a href="/preinscription" className="text-primary font-medium hover:underline">
            Faire une préinscription →
          </a>
        </p>
      </div>
    </main>
  );
}

export default function PayerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PayerContent />
    </Suspense>
  );
}
