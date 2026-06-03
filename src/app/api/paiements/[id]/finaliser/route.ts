import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const FinaliserSchema = z.object({
  modePaiement: z.enum(["fedapay", "mobile_money", "especes"]),
  telephone: z.string().min(8),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = FinaliserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { modePaiement, telephone } = parsed.data;
  const tel = telephone.replace(/\s/g, "");

  const paiement = await prisma.paiement.findUnique({
    where: { id },
    include: { parent: true, participant: { select: { prenom: true, nom: true } } },
  });

  if (!paiement) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  const telParent = paiement.parent.telephonePrincipal.replace(/\s/g, "");
  if (!telParent.includes(tel) && !tel.includes(telParent)) {
    return NextResponse.json({ error: "Numéro de téléphone non reconnu" }, { status: 403 });
  }

  if (!["en_attente", "partiel"].includes(paiement.statut)) {
    return NextResponse.json({ error: "Ce paiement est déjà finalisé" }, { status: 409 });
  }

  await prisma.paiement.update({
    where: { id },
    data: {
      provider: modePaiement as "fedapay" | "mobile_money" | "especes",
      modePaiement,
    },
  });

  return NextResponse.json({
    ok: true,
    modePaiement,
    participant: `${paiement.participant.prenom} ${paiement.participant.nom}`,
    montant: paiement.montant,
  });
}
