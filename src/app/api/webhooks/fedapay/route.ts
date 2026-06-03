import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const eventId = payload?.id?.toString() ?? crypto.randomUUID();

  await prisma.webhookEvent.create({
    data: {
      provider: "fedapay",
      eventId,
      payload,
      statut: "recu",
    },
  });

  try {
    await traiterWebhookFedaPay(payload);
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { statut: "traite" },
    });
  } catch {
    await prisma.webhookEvent.update({
      where: { eventId },
      data: {
        statut: "erreur",
        tentatives: { increment: 1 },
      },
    });
    return NextResponse.json({ error: "Traitement échoué" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function traiterWebhookFedaPay(payload: Record<string, unknown>) {
  const { name, entity } = payload as {
    name: string;
    entity: { custom_metadata?: { inscriptionId?: string }; status?: string };
  };

  if (name !== "transaction.approved") return;

  const inscriptionId = entity?.custom_metadata?.inscriptionId;
  if (!inscriptionId) throw new Error("inscriptionId manquant");

  await prisma.paiement.updateMany({
    where: {
      inscriptionId,
      statut: "en_attente",
    },
    data: {
      statut: "paye",
      datePaiement: new Date(),
    },
  });
}
