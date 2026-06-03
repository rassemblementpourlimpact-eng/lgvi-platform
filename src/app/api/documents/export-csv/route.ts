import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAgeAtEditionStart } from "@/lib/age";
import { decryptIfExists } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const editionId = searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId requis" }, { status: 400 });

  const edition = await prisma.edition.findUnique({ where: { id: editionId } });
  if (!edition) return NextResponse.json({ error: "Édition introuvable" }, { status: 404 });

  const participants = await prisma.participant.findMany({
    where: { editionId },
    include: {
      parent: true,
      paiements: { orderBy: { createdAt: "desc" }, take: 1 },
      activites: { include: { activite: { select: { nom: true } } } },
    },
    orderBy: [{ nom: "asc" }, { prenom: "asc" }],
  });

  const entetes = [
    "Prénom", "Nom", "Sexe", "Âge", "Date naissance", "École", "Classe",
    "Activité", "Statut paiement", "Montant dû", "Montant payé",
    "Parent prénom", "Parent nom", "Téléphone", "Email", "Adresse",
    "Contact urgence", "Allergies", "Traitements", "Restrictions",
    "Date inscription",
  ];

  const lignes = participants.map((p) => {
    const age = getAgeAtEditionStart(p.dateNaissance, edition.dateDebut);
    const paiement = p.paiements[0];
    const activite = p.activites[0]?.activite?.nom ?? "";
    return [
      p.prenom,
      p.nom,
      p.sexe === "M" ? "Garçon" : "Fille",
      age,
      p.dateNaissance.toLocaleDateString("fr-BJ"),
      p.ecole ?? "",
      p.classe ?? "",
      activite,
      paiement?.statut ?? "en_attente",
      paiement?.montant ?? 0,
      paiement?.montantPaye ?? 0,
      p.parent.prenom,
      p.parent.nom,
      p.parent.telephonePrincipal,
      p.parent.email ?? "",
      p.parent.adresse ?? "",
      decryptIfExists(p.contactUrgence) ?? "",
      decryptIfExists(p.allergies) ?? "",
      decryptIfExists(p.traitements) ?? "",
      decryptIfExists(p.restrictionsAlimentaires) ?? "",
      p.createdAt.toLocaleDateString("fr-BJ"),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });

  const csv = [entetes.map((h) => `"${h}"`).join(","), ...lignes].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lgvi-participants-${edition.annee}.csv"`,
    },
  });
}
