import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tel = searchParams.get("tel")?.replace(/\s/g, "") ?? "";

  if (tel.length < 8) {
    return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
  }

  const parent = await prisma.parent.findFirst({
    where: {
      OR: [
        { telephonePrincipal: { contains: tel } },
        { telephonePrincipal: tel },
      ],
    },
  });

  if (!parent) {
    return NextResponse.json({ parent: null, inscriptions: [] });
  }

  const paiements = await prisma.paiement.findMany({
    where: {
      parentId: parent.id,
      statut: { in: ["en_attente", "partiel"] },
    },
    include: {
      participant: {
        include: {
          activites: {
            include: { activite: { select: { nom: true } } },
            take: 1,
          },
          edition: { select: { nom: true, dateDebut: true, dateFin: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    parent: { id: parent.id, prenom: parent.prenom, nom: parent.nom },
    inscriptions: paiements.map((p) => ({
      paiementId: p.id,
      participantId: p.participantId,
      reference: p.participantId.slice(0, 8).toUpperCase(),
      prenom: p.participant.prenom,
      nom: p.participant.nom,
      activite: p.participant.activites[0]?.activite?.nom ?? "—",
      edition: p.participant.edition.nom,
      montant: p.montant,
      montantPaye: p.montantPaye,
      statut: p.statut,
    })),
  });
}
