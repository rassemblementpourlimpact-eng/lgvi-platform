import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const paiement = await prisma.paiement.findUnique({ where: { id } });
  if (!paiement) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  const updated = await prisma.paiement.update({
    where: { id },
    data: {
      statut: "paye",
      montantPaye: paiement.montant,
      datePaiement: new Date(),
    },
  });

  await prisma.journalAction.create({
    data: {
      userId: session.user.id,
      action: "PAIEMENT_VALIDE",
      entite: "Paiement",
      entiteId: id,
      details: { montant: paiement.montant, participantId: paiement.participantId },
    },
  });

  return NextResponse.json(updated);
}
