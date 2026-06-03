import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const GroupeSchema = z.object({
  nom: z.string().min(1),
  capacite: z.number().int().min(1),
  editionId: z.string().uuid(),
  formateurId: z.string().uuid().optional(),
});

const AffectationSchema = z.object({
  participantId: z.string().uuid(),
  groupeId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  if (body.participantId) {
    const parsed = AffectationSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const aff = await prisma.participantGroupe.upsert({
      where: { participantId_groupeId: { participantId: parsed.data.participantId, groupeId: parsed.data.groupeId } },
      update: {},
      create: { participantId: parsed.data.participantId, groupeId: parsed.data.groupeId },
    });
    return NextResponse.json(aff, { status: 201 });
  }

  const parsed = GroupeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const groupe = await prisma.groupe.create({ data: parsed.data });
  return NextResponse.json(groupe, { status: 201 });
}
