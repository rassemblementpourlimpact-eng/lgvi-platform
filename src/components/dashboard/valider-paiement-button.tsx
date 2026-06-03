"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

export function ValiderPaiementButton({ paiementId }: { paiementId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const valider = async () => {
    setLoading(true);
    await fetch(`/api/paiements/${paiementId}/valider`, { method: "POST" });
    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={valider}
      disabled={loading}
      className="text-xs h-7"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <>
          <CheckCircle className="w-3 h-3" />
          Valider
        </>
      )}
    </Button>
  );
}
