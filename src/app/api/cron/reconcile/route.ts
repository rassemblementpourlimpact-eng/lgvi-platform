import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron : toutes les 15 minutes — configurer dans vercel.json
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const cinqMinutesAvant = new Date(Date.now() - 5 * 60 * 1000);

  const paiementsEnAttente = await prisma.paiement.findMany({
    where: {
      statut: "en_attente",
      createdAt: { lt: cinqMinutesAvant },
      provider: { in: ["fedapay", "kikapay"] },
    },
    take: 50,
  });

  let reconcilies = 0;

  for (const paiement of paiementsEnAttente) {
    if (!paiement.referenceExterne) continue;

    const estPaye = await verifierPaiementFedaPay(paiement.referenceExterne);

    if (estPaye) {
      await prisma.paiement.update({
        where: { id: paiement.id },
        data: { statut: "paye", datePaiement: new Date() },
      });
      reconcilies++;
    }
  }

  return NextResponse.json({ reconcilies, total: paiementsEnAttente.length });
}

async function verifierPaiementFedaPay(reference: string): Promise<boolean> {
  const res = await fetch(
    `https://api.fedapay.com/v1/transactions/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      },
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data?.v_transaction?.status === "approved";
}
