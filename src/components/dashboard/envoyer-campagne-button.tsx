"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

export function EnvoyerCampagneButton({ campagneId }: { campagneId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const envoyer = async () => {
    setLoading(true);
    await fetch("/api/emails/campagne", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campagneId }),
    });
    setLoading(false);
    setConfirm(false);
    router.refresh();
  };

  if (confirm) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setConfirm(false)} disabled={loading}>Annuler</Button>
        <Button size="sm" onClick={envoyer} disabled={loading}>
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Send className="w-3 h-3" /> Confirmer</>}
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={() => setConfirm(true)}>
      <Send className="w-3 h-3" /> Envoyer
    </Button>
  );
}
