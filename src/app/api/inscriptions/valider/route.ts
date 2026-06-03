import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { sendConfirmationInscription } from "@/lib/email";
import { z } from "zod";

const InscriptionSchema = z.object({
  editionId: z.string().uuid(),
  activiteId: z.string().uuid(),
  modePaiement: z.enum(["fedapay", "mobile_money", "especes"]),
  parent: z.object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    telephone: z.string().min(8),
    email: z.string().email().optional().or(z.literal("")),
    adresse: z.string().optional(),
  }),
  enfant: z.object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    sexe: z.enum(["M", "F"]),
    dateNaissance: z.string().datetime(),
    ecole: z.string().optional(),
    classe: z.string().optional(),
  }),
  medical: z.object({
    allergies: z.string().optional(),
    traitements: z.string().optional(),
    restrictionsAlimentaires: z.string().optional(),
    observations: z.string().optional(),
    contactUrgence: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = InscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { editionId, activiteId, parent, enfant, medical, modePaiement } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const activite = await tx.activite.findUnique({ where: { id: activiteId } });
      if (!activite) throw new Error("ACTIVITE_INTROUVABLE");

      const inscrits = await tx.participantActivite.count({
        where: { activiteId, editionId },
      });
      if (inscrits >= activite.capacite) throw new Error("ACTIVITE_PLEINE");

      const edition = await tx.edition.findUnique({
        where: { id: editionId },
        include: { budgetPrevisionnel: true },
      });
      if (!edition) throw new Error("EDITION_INTROUVABLE");

      const montant = edition.budgetPrevisionnel?.prixInscription ?? 0;

      let parentRecord = await tx.parent.findFirst({
        where: {
          OR: [
            ...(parent.email ? [{ email: parent.email }] : []),
            { telephonePrincipal: parent.telephone },
          ],
        },
      });

      if (!parentRecord) {
        parentRecord = await tx.parent.create({
          data: {
            nom: parent.nom,
            prenom: parent.prenom,
            telephonePrincipal: parent.telephone,
            email: parent.email || null,
            adresse: parent.adresse,
          },
        });
      }

      const participant = await tx.participant.create({
        data: {
          nom: enfant.nom,
          prenom: enfant.prenom,
          sexe: enfant.sexe,
          dateNaissance: new Date(enfant.dateNaissance),
          ecole: enfant.ecole,
          classe: enfant.classe,
          editionId,
          parentId: parentRecord.id,
          allergies: medical.allergies ? encrypt(medical.allergies) : null,
          traitements: medical.traitements ? encrypt(medical.traitements) : null,
          restrictionsAlimentaires: medical.restrictionsAlimentaires
            ? encrypt(medical.restrictionsAlimentaires)
            : null,
          observations: medical.observations ? encrypt(medical.observations) : null,
          contactUrgence: medical.contactUrgence ? encrypt(medical.contactUrgence) : null,
        },
      });

      await tx.participantActivite.create({
        data: { participantId: participant.id, activiteId, editionId },
      });

      await tx.paiement.create({
        data: {
          participantId: participant.id,
          parentId: parentRecord.id,
          editionId,
          inscriptionId: participant.id,
          montant,
          montantPaye: 0,
          statut: "en_attente",
          provider: modePaiement as "fedapay" | "mobile_money" | "especes",
          modePaiement,
        },
      });

      return { participant, parent: parentRecord, activite };
    });

    if (result.parent.email) {
      sendConfirmationInscription({
        to: result.parent.email,
        prenomParent: result.parent.prenom,
        prenomEnfant: result.participant.prenom,
        reference: result.participant.id.slice(0, 8).toUpperCase(),
        activite: result.activite.nom,
      }).catch((err) => console.error("[inscription/valider] email:", err));
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "ACTIVITE_PLEINE") {
      return NextResponse.json(
        { error: "Cette activité est complète." },
        { status: 409 }
      );
    }
    console.error("[inscription/valider]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
